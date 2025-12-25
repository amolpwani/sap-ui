sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
], function(MessageToast, MessageBox, Fragment, History) {
    'use strict';

    return {
        /**
         * Handler for Back button
         * Navigates to QuotationHeaderList using Delete button action pattern
         */
        onBackPress: function(oEvent) {
            // Use Delete button pattern: Get router and navigate
            var oRouter = sap.ui.core.UIComponent.getRouterFor(oEvent.getSource());
            if (oRouter) {
                oRouter.navTo("QuotationHeaderList", {}, true);
            } else {
                // Fallback: Get component router
                var oComponent = sap.ui.core.Component.getOwnerComponentFor(oEvent.getSource());
                if (oComponent && oComponent.getRouter) {
                    oComponent.getRouter().navTo("QuotationHeaderList", {}, true);
                } else {
                    // Last resort: Navigate to root
                    window.location.href = "#/";
                }
            }
        },

        /**
         * Handler for Save button in Custom Fields section
         * Saves the values of MfgSiteCode, ShipFromSiteCode, and ProtoTypeSiteCode
         */
        onSaveCustomFields: function(oEvent) {
            // Get the button and find the view
            var oButton = oEvent.getSource();
            var oView = oButton.getParent();
            
            // Navigate up to find the actual view
            while (oView && !oView.getModel) {
                oView = oView.getParent();
            }

            
            if (!oView) {
                // Use FPM MessageBox for errors
                MessageBox.error("Unable to find view context.");
                return;
            }

            // Get the binding context
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                // Use FPM MessageBox for errors
                MessageBox.error("No quotation selected. Please select a quotation first.");
                return;
            }

            var oModel = oContext.getModel();
            
            // Get ComboBox controls from the fragment
            var oMfgSiteCombo, oProtoTypeCombo, oShipFromCombo;
            
            // Try to find ComboBox controls
            var aComboBoxes = oButton.getParent().getParent().findAggregatedObjects(true, function(oControl) {
                return oControl.isA("sap.m.ComboBox");
            });
            
            if (aComboBoxes.length >= 3) {
                oMfgSiteCombo = aComboBoxes[0];
                oProtoTypeCombo = aComboBoxes[1];
                oShipFromCombo = aComboBoxes[2];
            } else {
                // Use FPM MessageBox for errors
                MessageBox.error("Unable to find dropdown controls.");
                return;
            }
            
            // Get selected values from ComboBoxes
            var sMfgSiteCode = oMfgSiteCombo ? oMfgSiteCombo.getSelectedKey() : "";
            var sProtoTypeSiteCode = oProtoTypeCombo ? oProtoTypeCombo.getSelectedKey() : "";
            var sShipFromSiteCode = oShipFromCombo ? oShipFromCombo.getSelectedKey() : "";

            // Validate that at least one field is filled
            if (!sMfgSiteCode && !sProtoTypeSiteCode && !sShipFromSiteCode) {
                // Use FPM MessageBox for warnings
                MessageBox.warning("Please select at least one custom field before saving.");
                return;
            }

            // Update the context with new values
            var oData = oContext.getObject();
            var bHasChanges = false;
            
            if (sMfgSiteCode && sMfgSiteCode !== oData.MfgSiteCode) {
                oContext.setProperty("MfgSiteCode", sMfgSiteCode);
                bHasChanges = true;
            }
            if (sProtoTypeSiteCode && sProtoTypeSiteCode !== oData.ProtoTypeSiteCode) {
                oContext.setProperty("ProtoTypeSiteCode", sProtoTypeSiteCode);
                bHasChanges = true;
            }
            if (sShipFromSiteCode && sShipFromSiteCode !== oData.ShipFromSiteCode) {
                oContext.setProperty("ShipFromSiteCode", sShipFromSiteCode);
                bHasChanges = true;
            }

            if (!bHasChanges) {
                // Use FPM MessageToast for user feedback
                MessageToast.show("No changes detected.");
                return;
            }

            // Show busy indicator
            oView.setBusy(true);
            
            // Capture button reference for toast positioning
            var oSaveButton = oEvent.getSource();

            // Submit the changes
            oModel.submitBatch("updateGroup").then(function() {
                oView.setBusy(false);
                
                // Build success message (same format as Delete button)
                var sMessage = "Custom fields saved successfully!";
                var aValues = [];
                if (sMfgSiteCode) aValues.push("MFG: " + sMfgSiteCode);
                if (sProtoTypeSiteCode) aValues.push("Proto: " + sProtoTypeSiteCode);
                if (sShipFromSiteCode) aValues.push("Ship: " + sShipFromSiteCode);
                
                if (aValues.length > 0) {
                    sMessage += " - " + aValues.join(", ");
                }
                
                // Use exact Delete button pattern: MessageBox with onClose navigation
                // MessageBox.success automatically has OK button, use onClose like Delete button
                MessageBox.success(sMessage, {
                    title: "Success",
                    onClose: function(sAction) {
                        // Navigate to list after dialog closes (same as Delete button pattern)
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(oSaveButton);
                        if (oRouter) {
                            oRouter.navTo("QuotationHeaderList", {}, true);
                        } else {
                            // Fallback: Use History pattern like Delete button
                            var oHistory = History.getInstance();
                            var sPreviousHash = oHistory.getPreviousHash();
                            if (sPreviousHash !== undefined) {
                                window.history.go(-1);
                            } else {
                                // Navigate to list route
                                var oComponent = sap.ui.core.Component.getOwnerComponentFor(oSaveButton);
                                if (oComponent && oComponent.getRouter) {
                                    oComponent.getRouter().navTo("QuotationHeaderList", {}, true);
                                } else {
                                    window.location.href = "#/";
                                }
                            }
                        }
                    }
                });
                
                // Log to console
                console.log("✓ Save successful:", sMessage);
                
            }).catch(function(oError) {
                oView.setBusy(false);
                
                // Use FPM MessageBox for error display
                var sErrorMessage = "Failed to save custom fields.";
                if (oError && oError.message) {
                    sErrorMessage += "\n\nError: " + oError.message;
                }
                
                MessageBox.error(sErrorMessage);
                console.error("Save error:", oError);
            });
        }
    };
});
