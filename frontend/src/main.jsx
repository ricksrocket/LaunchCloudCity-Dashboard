import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
// registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhAYVtpR2NbfE5xdl9EZFZTQGYuP1ZhSXxQdkxjWH9ecnBXQmRbU0c=');
registerLicense('ORg4AjUWIQA/Gnt2V1hiQlRPd19dXHxLflF1VWJbdV5yflZHcC0sT3RfQF5jQH5SdkxmXXtWdXBWRw==')
ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
