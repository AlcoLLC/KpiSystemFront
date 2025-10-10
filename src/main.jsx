import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";

import { App as AntApp } from 'antd';
import 'antd/dist/reset.css';

import "./styles/globals.css";
import dayjs from 'dayjs';
import 'dayjs/locale/az';
dayjs.locale('az');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AntApp>
            <AppRouter />
          </AntApp>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);