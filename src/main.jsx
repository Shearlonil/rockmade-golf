import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./Styles/GlobalStyles.js";
import { AuthProvider } from './app-context/auth-user-context';
import Footer from "./Components/Footer.jsx";
import NavBar from "./Components/Navbar/NavBar.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <GlobalStyle />
            <AuthProvider>
				<NavBar />
                <App />
                <Footer />
            </AuthProvider>
          </BrowserRouter>
    </StrictMode>
);