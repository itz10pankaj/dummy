import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './redux/store.js';
import { HelmetProvider } from "react-helmet-async";
const rootElement = document.getElementById("root");

if (rootElement) {
    console.log("Hydrating React app...");
    const initialData = window.__INITIAL_DATA__; // Access the preloaded data

    hydrateRoot(
        rootElement,
        <HelmetProvider>
            <BrowserRouter>
                <Provider store={store}>
                    <App initialData={initialData}/>
                </Provider>
            </BrowserRouter>
        </HelmetProvider>
    );
    console.log("Hydrating React app success");
} else {
    console.error("Root element not found!");
}
