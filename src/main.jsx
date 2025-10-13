import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";

// --- ADDED: Ant Design localization imports ---
import { App as AntApp, ConfigProvider } from 'antd';
import az_AZ from 'antd/locale/az_AZ';
import 'antd/dist/reset.css';

import "./styles/globals.css";

// This correctly sets the locale for dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/az';
dayjs.locale('az');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          {/* --- ADDED: ConfigProvider wrapper --- */}
          <ConfigProvider locale={az_AZ}>
            <AntApp>
              <AppRouter />
            </AntApp>
          </ConfigProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);