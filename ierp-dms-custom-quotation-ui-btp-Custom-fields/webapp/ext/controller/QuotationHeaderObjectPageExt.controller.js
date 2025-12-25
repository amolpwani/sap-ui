sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"
], function(ControllerExtension, MessageBox, MessageToast, History) {
    "use strict";

    return ControllerExtension.extend("com.ford.quotation.ui.ext.controller.QuotationHeaderObjectPageExt", {
        override: {
            /**
             * Override the Delete button handler to see the pattern
             * This is the same pattern used by Fiori Elements framework
             */
            onDelete: function() {
                var oView = this.base.getView();
                var oContext = oView.getBindingContext();
                
                if (!oContext) {
                    MessageBox.error("No object selected for deletion.");
                    return;
                }

                // Get object details for confirmation message
                var oData = oContext.getObject();
                var sObjectId = oData.QuotationId || oData.ID || "this object";
                var sObjectName = oData.SupplierName || oData.SupplierCode || "";
                
                // Build confirmation message (same format as framework)
                var sMessage = "Delete object " + sObjectId;
                if (sObjectName) {
                    sMessage += " \"" + sObjectName + "\"?";
                } else {
                    sMessage += "?";
                }

                // Use MessageBox.warning with actions (exact Delete button pattern)
                MessageBox.warning(sMessage, {
                    actions: [MessageBox.Action.DELETE, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.DELETE,
                    onClose: function(sAction) {
                        if (sAction === MessageBox.Action.DELETE) {
                            // Perform deletion
                            var oModel = oContext.getModel();
                            oModel.delete(oContext.getPath(), {
                                success: function() {
                                    MessageToast.show("Object deleted successfully.");
                                    
                                    // Navigate back to list (same pattern as framework)
                                    var oHistory = History.getInstance();
                                    var sPreviousHash = oHistory.getPreviousHash();
                                    
                                    if (sPreviousHash !== undefined) {
                                        window.history.go(-1);
                                    } else {
                                        // Navigate to list route
                                        var oRouter = this.base.getRouter();
                                        if (oRouter) {
                                            oRouter.navTo("QuotationHeaderList", {}, true);
                                        } else {
                                            window.location.href = "#/";
                                        }
                                    }
                                }.bind(this),
                                error: function(oError) {
                                    MessageBox.error("Failed to delete object: " + (oError.message || "Unknown error"));
                                }
                            });
                        }
                    }.bind(this)
                });
            }
        }
    });
});
