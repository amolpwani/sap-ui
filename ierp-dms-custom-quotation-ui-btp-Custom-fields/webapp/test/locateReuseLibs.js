(function () {
    const sapUiCore = document.createElement('script');
    sapUiCore.setAttribute('src', '../resources/sap-ui-core.js');
    sapUiCore.setAttribute('id', 'sap-ui-bootstrap');
    sapUiCore.setAttribute('data-sap-ui-resourceroots', '{"com.ford.quotation.ui": "../"}');
    document.head.appendChild(sapUiCore);
}());
