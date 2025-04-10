import React, { useState,useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setContents } from "../redux/slices/contentSlice";
import CKEditorComponent from "../components/CKEditorComponent.jsx";
import { decryptID } from "../services/UrlEncode.js";
const EditContentModal = ({ content, menuId, closeModal, updateContents }) => {

    const dispatch = useDispatch();
    const [newContent, setNewContent] = useState(content.text); // Track new content
    const decryptedMenuId = decryptID(menuId); // Decrypt menuId for API call
    const handleSave = async () => {
        try {
            console.log("Saving content...");
            console.log("Current content ID:", content.id);
            console.log("New content:", newContent);
    
            // Update content on the server
            const response = await axios.put(
                `http://localhost:8081/api/content/${menuId}/${content.id}`,
                { text: newContent }
            );
    
            console.log("Updated content from server:", response.data);
    
            // Update local state in Content.jsx
            updateContents((prevContents) =>
                prevContents.map((c) => (c.id === content.id ? response.data : c))
            );
    
            // Update Redux store
            // dispatch(setContents({ [menuId]: response.data }));
            dispatch(setContents({ [decryptedMenuId]: response.data }));
            // console.log("Redux state should be updated now. Check Redux DevTools.");
            window.location.reload(); 
        
            closeModal();
        } catch (err) {
            console.error("Error updating content:", err);
        }
    };
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);


    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg  min-w-1/2 overflow-y-auto scrollbar-hide max-h-3/4 ">
                <h2 className="text-xl font-bold mb-4">Edit Content</h2>
                <CKEditorComponent
                    initialData={newContent}
                    menuId={menuId}
                    onChange={(data) => setNewContent(data)} 
                />
                
                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditContentModal;
