sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator"
], function(MessageToast, MessageBox, BusyIndicator) {
    'use strict';

    return {
        /**
         * Handler for Save button in Custom Fields section
         * Saves the values of MfgSiteCode, ShipFromSiteCode, and ProtoTypeSiteCode
         */
        onSaveCustomFields: function(oEvent) {
            // Get the source button and its binding context
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext();
            
            if (!oContext) {
                MessageBox.error("No data context found. Please select a quotation.");
                return;
            }

            var oModel = oContext.getModel();
            
            // Get the current values
            var oData = oContext.getObject();
            var sMfgSiteCode = oData.MfgSiteCode;
            var sShipFromSiteCode = oData.ShipFromSiteCode;
            var sProtoTypeSiteCode = oData.ProtoTypeSiteCode;

            // Validate that at least one field is filled
            if (!sMfgSiteCode && !sShipFromSiteCode && !sProtoTypeSiteCode) {
                MessageBox.warning("Please fill at least one custom field before saving.");
                return;
            }

            // Show busy indicator
            BusyIndicator.show(0);

            // Check if there are pending changes
            if (oModel.hasPendingChanges()) {
                // Submit all pending changes
                oModel.submitBatch("updateGroup").then(function() {
                    BusyIndicator.hide();
                    MessageToast.show("Custom fields saved successfully!");
                    
                    // Show success message with values
                    var sMessage = "Saved:\n";
                    if (sMfgSiteCode) sMessage += "MFG Site: " + sMfgSiteCode + "\n";
                    if (sShipFromSiteCode) sMessage += "Ship From: " + sShipFromSiteCode + "\n";
                    if (sProtoTypeSiteCode) sMessage += "Proto Type: " + sProtoTypeSiteCode;
                    
                    MessageBox.success(sMessage);
                }).catch(function(oError) {
                    BusyIndicator.hide();
                    var sErrorMessage = "Failed to save custom fields.";
                    
                    if (oError && oError.message) {
                        sErrorMessage += "\n" + oError.message;
                    }
                    
                    MessageBox.error(sErrorMessage);
                });
            } else {
                BusyIndicator.hide();
                MessageToast.show("No changes to save.");
            }
        }
    };
});
