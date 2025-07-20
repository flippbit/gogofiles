import React from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./pages/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found. Failed to render the application.");
}

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <HashRouter basename="/">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);
