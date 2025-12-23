# SAP Fiori Elements - Quotation Management UI

SAP Fiori Elements application for managing supplier quotations with custom fields functionality.

## Overview

This is a SAP UI5 Fiori Elements application built using the List Report and Object Page templates. It provides a user interface for managing quotation headers with custom site code fields.

## Features

- **List Report**: Display all quotation headers in a responsive table
- **Object Page**: Detailed view of individual quotations
- **Custom Fields Section**: 
  - Manufacturing Site Code dropdown
  - Prototype Site Code dropdown
  - Ship From Site Code dropdown
  - Save functionality with OData V4 batch processing

## Prerequisites

### Local Development
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Backend Service**: Running on `http://localhost:8080`

### SAP Business Application Studio (BAS)
- SAP Business Application Studio subscription
- Dev Space with "SAP Fiori" extensions enabled

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amolpwani/sap-ui.git
cd sap-ui/ierp-dms-custom-quotation-ui-btp-Custom-fields
```

### 2. Install Dependencies

```bash
npm install
```

## Running the Application

### Local Development

1. **Ensure Backend is Running**
   - Backend must be running on `http://localhost:8080`
   - See backend README for setup instructions

2. **Start the UI5 Development Server**

```bash
npm start
```

Or with specific port:

```bash
npx @ui5/cli serve --port 3000 --config ui5-local.yaml
```

3. **Access the Application**
   - Open browser: `http://localhost:3000/index.html`

### SAP Business Application Studio (BAS)

1. **Open the Project in BAS**
   - Create a Dev Space with "SAP Fiori" extensions
   - Clone the repository in BAS terminal
   - Open the project folder

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Backend Connection**
   - Update `ui5-local.yaml` if backend is not on localhost
   - For BAS, update the backend URL to your deployed service

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ignoreCertErrors: false
        backend:
          - path: /catalog
            url: https://your-backend-url.cfapps.sap.hana.ondemand.com
```

4. **Start the Application**

```bash
npm start
```

5. **Preview**
   - BAS will provide a preview URL
   - Click the preview link to open the application

## Project Structure

```
ierp-dms-custom-quotation-ui-btp-Custom-fields/
├── webapp/
│   ├── annotations/
│   │   └── annotation.xml          # Frontend OData annotations
│   ├── ext/
│   │   ├── fragment/
│   │   │   └── CustomFields.fragment.xml  # Custom fields UI
│   │   └── CustomFieldsHandler.js  # Custom fields logic
│   ├── i18n/
│   │   └── i18n.properties         # Internationalization texts
│   ├── localService/
│   │   └── metadata.xml            # Local OData metadata
│   ├── test/                       # Test files
│   ├── Component.js                # UI5 Component
│   ├── index.html                  # Application entry point
│   └── manifest.json               # Application descriptor
├── ui5.yaml                        # UI5 tooling configuration
├── ui5-local.yaml                  # Local development configuration
├── ui5-deploy.yaml                 # Deployment configuration
├── package.json                    # Node.js dependencies
└── README.md
```

## Configuration Files

### manifest.json
- Application descriptor defining routing, data sources, and Fiori Elements configuration
- Key settings:
  - `contextPath: "/QuotationHeader"` - Entity set path
  - `initialLoad: true` - Auto-load data on startup
  - Custom sections configuration for Object Page

### ui5-local.yaml
- Local development server configuration
- Proxy settings to forward `/catalog/` requests to backend
- Default backend URL: `http://localhost:8080`

### Component.js
- UI5 component initialization
- Metadata loading and model setup

## Key Features Implementation

### Custom Fields Section

The custom fields are implemented using:
1. **Fragment**: `webapp/ext/fragment/CustomFields.fragment.xml`
   - Defines 3 dropdown fields using `sap.fe.macros.Field`
   - Bound to OData properties: `MfgSiteCode`, `ProtoTypeSiteCode`, `ShipFromSiteCode`

2. **Handler**: `webapp/ext/CustomFieldsHandler.js`
   - `onSaveCustomFields()` function handles save button click
   - Uses OData V4 Model batch processing
   - Validates input and provides user feedback

### OData V4 Integration

- Model configured in `manifest.json` with:
  - `autoExpandSelect: true` - Automatic $expand and $select
  - `earlyRequests: true` - Optimize initial load
  - `operationMode: "Server"` - Server-side operations

## Troubleshooting

### Blank UI / No Data

1. **Check Backend Connection**
   ```bash
   # Test backend metadata
   curl http://localhost:8080/catalog/$metadata
   ```

2. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for network errors or JavaScript errors

3. **Verify manifest.json**
   - Ensure `initialLoad: true` is set
   - Check `contextPath` matches backend entity set

### Port Already in Use

```bash
# Use different port
npx @ui5/cli serve --port 3001 --config ui5-local.yaml
```

### Component-preload.js 404 Error

This is normal in development mode. The application loads individual files instead of preload bundles.

## Building for Production

```bash
# Build optimized application
npm run build

# Output will be in dist/ folder
```

## Deployment

### Deploy to SAP BTP Cloud Foundry

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy using cf CLI**
   ```bash
   cf push
   ```

### Deploy to SAP BTP HTML5 Application Repository

Use the Fiori tools deployment wizard in BAS or VS Code.

## Environment Variables

No environment variables required for frontend. Backend URL is configured in `ui5-local.yaml`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **SAP UI5**: v1.76+
- **SAP Fiori Elements**: List Report & Object Page templates
- **OData V4**: Data protocol
- **UI5 Tooling**: Build and development tools

## Related Repositories

- **Backend**: [https://github.com/amolpwani/sap-backend](https://github.com/amolpwani/sap-backend)

## License

Proprietary - Ford Motor Company

## Support

For issues or questions, please contact the development team.
