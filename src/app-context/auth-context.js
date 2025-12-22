import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getYear } from "date-fns";

import AppConstants from "../Utils/AppConstants";
import { useToken } from "./token-context";
import { useAxiosInterceptor } from "../axios/axios-interceptors";

const AuthContext = createContext();

/*ref:  https://blog.logrocket.com/authentication-react-router-v6/
        https://blog.logrocket.com/react-context-tutorial/
*/
export const AuthProvider = ({ children }) => {
    // const [jwtToken, setJwtToken] = useLocalStorage(AppConstants.jwtStorageTitle, null);
    const { xhrAios, setAxiosToken } = useAxiosInterceptor();
    const { getJwtToken, setJwtTokenValue } = useToken();
    const accessToken = getJwtToken();
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const clientLogin = async (loginDetails) => {
        const response = await xhrAios.post('/auth/client', loginDetails);
        //  remove the token prefix from the token for jwtDecode to decode the token
        const jwt = response.headers[AppConstants.jwtStorageTitle].replace(AppConstants.TOKEN_PREFIX, "");
        setJwtTokenValue(jwt);
        /*  Update token in axios. A Bug detected on signin in, Axios won't attach bearer token to request after first login. Will only start attaching after page refresh.
            This is a make shift to circumvent the bug
        */
        setAxiosToken(jwt);
    };

    // call this function when you want to authenticate the user
    const staffLogin = async (loginDetails) => {
        const response = await xhrAios.post('/auth/staff', loginDetails);
        //  remove the token prefix from the token for jwtDecode to decode the token
        const jwt = response.headers[AppConstants.jwtStorageTitle].replace(AppConstants.TOKEN_PREFIX, "");
        setJwtTokenValue(jwt);
        /*  Update token in axios. A Bug detected on signin in, Axios won't attach bearer token to request after first login. Will only start attaching after page refresh.
            This is a make shift to circumvent the bug
        */
        setAxiosToken(jwt);
    };

    // call this function when clients want to update personal info
    const updatePersonalInfo = async (signal, data) => {
        const response = await xhrAios.put(`/users/profile/info/update`, data, {signal});
        //  remove the token prefix from the token for jwtDecode to decode the token
        const jwt = response.headers[AppConstants.jwtStorageTitle].replace(AppConstants.TOKEN_PREFIX, "");
        setJwtTokenValue(jwt);
        /*  Update token in axios. A Bug detected on signin in, Axios won't attach bearer token to request after first login. Will only start attaching after page refresh.
            This is a make shift to circumvent the bug
        */
        setAxiosToken(jwt);
    }
    
    const updateHCP = async (signal, data) => {
        const response = await xhrAios.put(`/users/profile/hcp/update`, data, {signal});
        //  remove the token prefix from the token for jwtDecode to decode the token
        const jwt = response.headers[AppConstants.jwtStorageTitle].replace(AppConstants.TOKEN_PREFIX, "");
        setJwtTokenValue(jwt);
        /*  Update token in axios. A Bug detected on signin in, Axios won't attach bearer token to request after first login. Will only start attaching after page refresh.
            This is a make shift to circumvent the bug
        */
        setAxiosToken(jwt);
    }
    
    const updateEmail = async (signal, data) => {
        const response = await xhrAios.put(`/users/profile/email/update`, data, {signal});
        //  remove the token prefix from the token for jwtDecode to decode the token
        const jwt = response.headers[AppConstants.jwtStorageTitle].replace(AppConstants.TOKEN_PREFIX, "");
        setJwtTokenValue(jwt);
        /*  Update token in axios. A Bug detected on signin in, Axios won't attach bearer token to request after first login. Will only start attaching after page refresh.
            This is a make shift to circumvent the bug
        */
        setAxiosToken(jwt);
    }

    // call this function to sign out logged in user
    const logout = async (route) => {
        await xhrAios.get("/auth/logout");
        setJwtTokenValue(null);
        if (route) {
            navigate(route, { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    };

    const getCurrentYear = () => {
        return getYear(new Date());
    };

    const value = useMemo(
        () => ({
            clientLogin,
            staffLogin,
            updatePersonalInfo,
            updateHCP,
            updateEmail,
            logout,
            getCurrentYear,
        }),
        [accessToken]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
