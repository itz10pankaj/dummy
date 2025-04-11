import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { decryptID } from "./UrlEncode";
import { getMetaTitle } from "./apiServices";
const MetaTitleContext = createContext();

export const MetaTitleProvider = ({ children, initialTitle = "My Website" }) => {
    const location = useLocation();
    const [title, setTitle] = useState(initialTitle);
    const [searchParams] = useSearchParams();

    const fetchMetaTitle = async (page, decryptedCourseId = null) => {
        const fetchedTitle = await getMetaTitle(page, decryptedCourseId);
        setTitle(fetchedTitle || "Default Title | My Website"); 
        document.title = fetchedTitle || "Default Title | My Website";
    };

    useEffect(() => {
        const encryptedCourseId = searchParams.get("course");
        const decryptedCourseId = encryptedCourseId ? decryptID(encryptedCourseId) : null;
        fetchMetaTitle(location.pathname, decryptedCourseId);
    }, [location.pathname, searchParams]);

    return (
        <MetaTitleContext.Provider value={{ title, setTitle, fetchMetaTitle }}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
        </MetaTitleContext.Provider>
    );
};

export const useMetaTitle = () => useContext(MetaTitleContext);
