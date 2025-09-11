import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./styles/globals.css";
import ThemeManager from "./components/ThemeManager";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeManager>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </ThemeManager>
    </Provider>
  </React.StrictMode>
);
