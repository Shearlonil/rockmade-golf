import { createContext, useContext, useMemo, useState } from "react";

const ProfileImgContext = createContext();

/*ref:  https://blog.logrocket.com/authentication-react-router-v6/
        https://blog.logrocket.com/react-context-tutorial/
*/
export const ProfileImgProvider = ({ children }) => {
    const [ imgBlob, setImgBlob ] = useState(null);
    
    const imageBlob = () => {
        return imgBlob;
    };
    
    const setImageBlob = (blob) => {
        setImgBlob(blob);
    };

    const value = useMemo(
        () => ({
            imageBlob,
            setImageBlob
        }),
        [imgBlob]
    );

    return <ProfileImgContext.Provider value={value}>{children}</ProfileImgContext.Provider>;
}

export const useProfileImg = () => useContext(ProfileImgContext);