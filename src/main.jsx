import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "react-datetime/css/react-datetime.css";
import 'rsuite/dist/rsuite.min.css';

import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./Styles/GlobalStyles.js";
import { AuthProvider } from './app-context/auth-context';
import Footer from "./Components/Footer.jsx";
import NavBar from "./Components/NavBar.jsx";
import { TokenProvider } from "./app-context/token-context.js";
import { UserProvider } from "./app-context/user-context.js";
import { ProfileImgProvider } from "./app-context/dp-context.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <GlobalStyle />
            <TokenProvider>
                <AuthProvider>
                    <UserProvider>
                        <ProfileImgProvider>
                            <NavBar />
                            <App />
                            <Footer />
                        </ProfileImgProvider>
                    </UserProvider>
                </AuthProvider>
            </TokenProvider>
          </BrowserRouter>
    </StrictMode>
);