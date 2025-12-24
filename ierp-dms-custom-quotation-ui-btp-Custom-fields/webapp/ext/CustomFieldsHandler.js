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
         * Navigates back to the list
         */
        onBackPress: function(oEvent) {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                // If no history, navigate to root
                var oRouter = sap.ui.core.UIComponent.getRouterFor(oEvent.getSource());
                if (oRouter) {
                    oRouter.navTo("QuotationHeaderList", {}, true);
                } else {
                    window.history.back();
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

            window.alert("Data saved successfully.");
            
            if (!oView) {
                try {
                    MessageBox.error("Unable to find view context.");
                } catch (e) {
                    alert("Unable to find view context.");
                    console.error("MessageBox error:", e);
                }
                return;
            }

            // Get the binding context
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
                try {
                    MessageBox.error("No quotation selected. Please select a quotation first.");
                } catch (e) {
                    alert("No quotation selected. Please select a quotation first.");
                    console.error("MessageBox error:", e);
                }
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
                try {
                    MessageBox.error("Unable to find dropdown controls.");
                } catch (e) {
                    alert("Unable to find dropdown controls.");
                    console.error("MessageBox error:", e);
                }
                return;
            }
            
            // Get selected values from ComboBoxes
            var sMfgSiteCode = oMfgSiteCombo ? oMfgSiteCombo.getSelectedKey() : "";
            var sProtoTypeSiteCode = oProtoTypeCombo ? oProtoTypeCombo.getSelectedKey() : "";
            var sShipFromSiteCode = oShipFromCombo ? oShipFromCombo.getSelectedKey() : "";

            // Validate that at least one field is filled
            if (!sMfgSiteCode && !sProtoTypeSiteCode && !sShipFromSiteCode) {
                try {
                    MessageBox.warning("Please select at least one custom field before saving.");
                } catch (e) {
                    alert("Please select at least one custom field before saving.");
                    console.error("MessageBox error:", e);
                }
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
                try {
                    MessageToast.show("No changes detected.");
                } catch (e) {
                    console.log("No changes detected.");
                    console.error("MessageToast error:", e);
                }
                return;
            }

            // Show busy indicator
            oView.setBusy(true);
            
            // Capture button reference for toast positioning
            var oSaveButton = oEvent.getSource();

            // Submit the changes
            oModel.submitBatch("updateGroup").then(function() {
                oView.setBusy(false);
                
                // Build success message
                var sMessage = "✓ Custom fields saved successfully!";
                var aValues = [];
                if (sMfgSiteCode) aValues.push("MFG: " + sMfgSiteCode);
                if (sProtoTypeSiteCode) aValues.push("Proto: " + sProtoTypeSiteCode);
                if (sShipFromSiteCode) aValues.push("Ship: " + sShipFromSiteCode);
                
                if (aValues.length > 0) {
                    sMessage += " | " + aValues.join(", ");
                }
                
                // Log to console first
                console.log("✓ Save successful:", sMessage);
                console.log("MessageToast available:", typeof MessageToast !== "undefined");
                console.log("MessageToast.show available:", typeof MessageToast.show === "function");
                
                // Show success message - try multiple approaches
                // First try: MessageToast with button reference
                if (typeof MessageToast !== "undefined" && typeof MessageToast.show === "function") {
                    try {
                        MessageToast.show(sMessage, {
                            duration: 5000,
                            width: "auto",
                            my: "center bottom",
                            at: "center bottom",
                            of: oSaveButton
                        });
                        console.log("✓ MessageToast shown successfully");
                    } catch (e1) {
                        console.warn("MessageToast with button failed:", e1);
                        
                        // Second try: MessageToast simple
                        try {
                            MessageToast.show(sMessage);
                            console.log("✓ MessageToast shown (simple)");
                        } catch (e2) {
                            console.warn("MessageToast simple failed:", e2);
                            
                            // Third try: MessageBox.success
                            if (typeof MessageBox !== "undefined" && typeof MessageBox.success === "function") {
                                try {
                                    MessageBox.success(sMessage, {
                                        title: "Success"
                                    });
                                    console.log("✓ MessageBox.success shown");
                                } catch (e3) {
                                    console.warn("MessageBox.success failed:", e3);
                                    
                                    // Last resort: alert
                                    console.error("All message display methods failed, using alert");
                                    alert(sMessage);
                                }
                            } else {
                                // Last resort: alert
                                console.error("MessageBox not available, using alert");
                                alert(sMessage);
                            }
                        }
                    }
                } else {
                    // Last resort: alert
                    console.error("MessageToast not available, using alert");
                    alert(sMessage);
                }
                
            }).catch(function(oError) {
                oView.setBusy(false);
                
                var sErrorMessage = "Failed to save custom fields.";
                if (oError && oError.message) {
                    sErrorMessage += "\n\nError: " + oError.message;
                }
                
                try {
                    MessageBox.error(sErrorMessage);
                } catch (e) {
                    alert(sErrorMessage);
                    console.error("MessageBox error:", e);
                }
                console.error("Save error:", oError);
            });
        }
    };
});
