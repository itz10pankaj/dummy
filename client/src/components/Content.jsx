import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContents } from "../redux/slices/contentSlice";
import { setImages } from "../redux/slices/imageSlice";
import { useSearchParams } from "react-router-dom";
import { decryptID } from "../services/UrlEncode";
import ImageUploadModal from "../modals/imageUploadModal";
import AddContentModal from "../modals/addcontentModal";
import EditContentModal from "../modals/EditContentModal";
import { getContents ,getImages} from "../services/apiServices";
const Content = ({ initialContents, initialImages }) => {
    const dispatch = useDispatch();
    const [contents, setLocalContents] = useState(initialContents || []);
    const [images, setLocalImages] = useState(initialImages || []);
    const [searchParams] = useSearchParams();
    const menuId = searchParams.get("menu");
    const decryptedMenuId = decryptID(menuId)
    const storedContents = useSelector((state) => state.contents?.[decryptedMenuId]);
    const storedImages = useSelector((state) => state.images?.[decryptedMenuId]);
    const user = useSelector((state) => state.auth.user);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
    const [currentContent, setCurrentContent] = useState(null); // State for the content to be edited
    const fetchContents = async () => {
        if (!menuId) return;
        const contents = await getContents(menuId);
        setLocalContents(contents);
        dispatch(setContents({ [decryptedMenuId]: contents }));
        
    };


    const fetchImages = async () => {
        if (!menuId) return;
        const images = await getImages(menuId);
        setLocalImages(images);
        dispatch(setImages({ [decryptedMenuId]: images }));
    };

    useEffect(() => {
        if (!menuId) {
            // Agar koi menu selected nahi hai, toh content aur images clear kar do
            setLocalContents([]);
            setLocalImages([]);
            return;
        }

        // Check if data already exists in Redux before making an API call
        if (storedContents) {
            setLocalContents(storedContents);
        } else {
            fetchContents();
        }

        if (storedImages) {
            setLocalImages(storedImages);
        } else {
            fetchImages();
        }
    }, [menuId, storedContents, storedImages, dispatch, searchParams,initialContents]);

        // ye useEffect sirf client side par chalega jab page load hoga tab
        const [isHydrated, setIsHydrated] = useState(false);
    
        useEffect(() => {
            setIsHydrated(true);
        }, []);


    const handleEditClick = (content) => {
        setCurrentContent(content); // Set the content to be edited
        setIsEditModalOpen(true); // Open the edit modal
    };
    return (
        <div className="p-6 bg-white shadow-lg h-screen flex flex-col overflow-y-auto scrollbar-hide"
        >
            <div className="flex flex-row items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Content</h2>
                {isHydrated && user?.role === "admin" && (
                    <div className="ml-auto flex gap-4">
                        <button
                            onClick={() => setIsImageModalOpen(true)}
                            className="upload ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Upload Image
                        </button>
                        <button
                            onClick={() => setIsContentModalOpen(true)}
                            className="upload ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Add Content
                        </button>
                    </div>
                )}


            </div>

            {/* Render Contents */}
            <div>
                {contents.length > 0 ? (
                    <ul className="space-y-2">
                        {contents.map((content) => (
                            <li key={content.id} className="bg-white p-3  flex rounded-lg shadow-sm border">
                                <div className="content-container" dangerouslySetInnerHTML={{ __html: content.text }} />
                                {isHydrated && user?.role === "admin" && (
                                    <button
                                        onClick={() => handleEditClick(content)}
                                        className="upload h-10 ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>

                                )}
                            </li>
                            // {content.text}
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No content available. Please select a menu item.</p>
                )}
            </div>

            {isImageModalOpen && <ImageUploadModal closeModal={() => setIsImageModalOpen(false)} />}
            {isContentModalOpen && <AddContentModal closeModal={() => setIsContentModalOpen(false)} />}
            {isEditModalOpen && (
                <EditContentModal
                    content={currentContent}
                    menuId={menuId}
                    closeModal={() => setIsEditModalOpen(false)}
                    updateContents={setLocalContents}
                />
            )}
            {/* Render Images */}

        </div>
    );
};

export default Content;
