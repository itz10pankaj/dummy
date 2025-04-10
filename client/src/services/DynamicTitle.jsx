import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { decryptID } from "./UrlEncode";

const MetaTitleContext = createContext();

export const MetaTitleProvider = ({ children, initialTitle = "My Website" }) => {
    const location = useLocation();
    const [title, setTitle] = useState(initialTitle);
    const [searchParams] = useSearchParams();

    const fetchMetaTitle = async (page, encryptedCourseId = null) => {
        try {
            const decryptedCourseId = encryptedCourseId ? decryptID(encryptedCourseId) : null;
            
            const endpoint = decryptedCourseId
                ? `http://localhost:8081/api/meta-title?page=/course/${decryptedCourseId}`
                : `http://localhost:8081/api/meta-title?page=${page}`;

            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch meta title: ${response.statusText}`);
            }

            const data = (await response.json()).data;
            setTitle(data.metaTitle || "Default Title | My Website");
            document.title = data.metaTitle || "Default Title | My Website";
        } catch (error) {
            console.error("Error fetching meta title:", error);
        }
    };

    useEffect(() => {
        const encryptedCourseId = searchParams.get("course");
        fetchMetaTitle(location.pathname, encryptedCourseId);
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
