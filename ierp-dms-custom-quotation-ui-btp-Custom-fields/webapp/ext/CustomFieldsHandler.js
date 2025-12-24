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
            
            // Get input field values from the fragment
            var oMfgSiteInput = oView.byId("mfgSiteInput");
            var oProtoTypeInput = oView.byId("protoTypeInput");
            var oShipFromInput = oView.byId("shipFromInput");
            
            // If inputs not found by ID, try to find them in the fragment
            if (!oMfgSiteInput) {
                var aInputs = oButton.getParent().getParent().findAggregatedObjects(true, function(oControl) {
                    return oControl.isA("sap.m.Input");
                });
                
                if (aInputs.length >= 3) {
                    oMfgSiteInput = aInputs[0];
                    oProtoTypeInput = aInputs[1];
                    oShipFromInput = aInputs[2];
                }
            }
            
            // Get values from inputs
            var sMfgSiteCode = oMfgSiteInput ? oMfgSiteInput.getValue() : "";
            var sProtoTypeSiteCode = oProtoTypeInput ? oProtoTypeInput.getValue() : "";
            var sShipFromSiteCode = oShipFromInput ? oShipFromInput.getValue() : "";

            // Validate that at least one field is filled
            if (!sMfgSiteCode && !sProtoTypeSiteCode && !sShipFromSiteCode) {
                MessageBox.warning("Please fill at least one custom field before saving.");
                return;
            }

            // Update the context with new values
            var oData = oContext.getObject();
            var bHasChanges = false;
            
            if (sMfgSiteCode !== oData.MfgSiteCode) {
                oContext.setProperty("MfgSiteCode", sMfgSiteCode);
                bHasChanges = true;
            }
            if (sProtoTypeSiteCode !== oData.ProtoTypeSiteCode) {
                oContext.setProperty("ProtoTypeSiteCode", sProtoTypeSiteCode);
                bHasChanges = true;
            }
            if (sShipFromSiteCode !== oData.ShipFromSiteCode) {
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
                
                // Show success message with saved values
                var sMessage = "Custom fields saved successfully!\n\n";
                if (sMfgSiteCode) sMessage += "MFG Site: " + sMfgSiteCode + "\n";
                if (sProtoTypeSiteCode) sMessage += "Proto Type: " + sProtoTypeSiteCode + "\n";
                if (sShipFromSiteCode) sMessage += "Ship From: " + sShipFromSiteCode;
                
                MessageBox.success(sMessage);
                MessageToast.show("Data saved successfully!");
                
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
