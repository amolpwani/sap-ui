sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function(MessageToast, MessageBox, Fragment) {
    'use strict';

    return {
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
                MessageBox.error("Unable to find view context.");
                return;
            }

            // Get the binding context
            var oContext = oView.getBindingContext();
            
            if (!oContext) {
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
                MessageBox.error("Unable to find dropdown controls.");
                return;
            }
            
            // Get selected values from ComboBoxes
            var sMfgSiteCode = oMfgSiteCombo ? oMfgSiteCombo.getSelectedKey() : "";
            var sProtoTypeSiteCode = oProtoTypeCombo ? oProtoTypeCombo.getSelectedKey() : "";
            var sShipFromSiteCode = oShipFromCombo ? oShipFromCombo.getSelectedKey() : "";

            // Validate that at least one field is filled
            if (!sMfgSiteCode && !sProtoTypeSiteCode && !sShipFromSiteCode) {
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
                MessageToast.show("No changes detected.");
                return;
            }

            // Show busy indicator
            oView.setBusy(true);

            // Submit the changes
            oModel.submitBatch("updateGroup").then(function() {
                oView.setBusy(false);
                
                // Show success toast message
                var sMessage = "Custom fields saved successfully! ";
                if (sMfgSiteCode) sMessage += "MFG Site: " + sMfgSiteCode + " ";
                if (sProtoTypeSiteCode) sMessage += "Proto Type: " + sProtoTypeSiteCode + " ";
                if (sShipFromSiteCode) sMessage += "Ship From: " + sShipFromSiteCode;
                
                MessageToast.show(sMessage, {
                    duration: 3000,
                    width: "25em"
                });
                
                // Navigate back to list
                setTimeout(function() {
                    window.history.back();
                }, 1000);
                
            }).catch(function(oError) {
                oView.setBusy(false);
                
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
