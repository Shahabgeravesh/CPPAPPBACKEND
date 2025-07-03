App Purchase Notifications Backend
+
+This repository contains a small Express server that receives
+[App Store Server Notifications](https://developer.apple.com/documentation/appstoreservernotifications)
+and forwards them to connected clients using Socket.IO. The server is
+written for Node.js 18 and relies on a few common libraries such as
+`express`, `socket.io` and `jsonwebtoken`.
+
+## Features
+
+- **Webhook endpoint** – `POST /apple-webhook` handles notifications from
+  Apple. The server attempts to decode the `Authorization` header as a JWT
+  and attaches the decoded payload to the request.
+- **Real-time updates** – notifications are emitted to all connected
+  Socket.IO clients on the `purchase_received` event.
+- **Simple JWT check** – the example only decodes the token. In a
+  production setup you would verify the signature against Apple’s public
+  key.

+## Getting started
+
+1. Install dependencies:
+
+   ```bash
+   npm install
+   ```
+
+2. (Optional) Create a `.env` file to specify the port number:
+
+   ```ini
+   PORT=3000
+   ```
+
+3. Start the server in development mode with hot reload:
+
+   ```bash
+   npm run dev
+   ```
+
+   Or start normally with:
+
+   ```bash
+   npm start
+   ```
+
+The server runs on the port specified by the `PORT` environment variable
+(or `3000` if unset). Socket.IO clients can connect to this port and will
+receive a `purchase_received` event whenever a valid webhook is posted.
+
+## Project structure
+
+- `app.js` – main server file.
+- `package.json` – project metadata and dependency list.
+
+## License
+
+[ISC](LICENSE)
 
EOF
)
