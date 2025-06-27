import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

import axios from "axios";

async function enableMocking() {
  // axios.defaults.headers.common["Authorization"] = "Bearer test_user";
  // return;
  // if (process.env.NODE_ENV !== "development") {
  //   return;
  // }
  // const { worker } = await import("./mocks/browser");
  // // `worker.start()` returns a Promise that resolves
  // // once the Service Worker is up and ready to intercept requests.
  // return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});
