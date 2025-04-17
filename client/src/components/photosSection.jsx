import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPhotos } from "../redux/slices/photoSlice"
import { useSearchParams } from "react-router-dom";
import { decryptID } from "../services/UrlEncode";
import PhotoUploadModal from "../modals/photoUploadModal"
import { getphotos } from "../services/apiServices";
const PhotoSection = ( {initialphotos} ) => {
    const dispatch = useDispatch();
    const [photos, setLocalPhotos] = useState(initialphotos || []);
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get("item");
    const decryptedItemId = decryptID(itemId)
    const storedPhotos = useSelector((state) => state.photos?.[decryptedItemId]);
    const user = useSelector((state) => state.auth.user);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const fetchPhotos = async () => {
        if (!itemId) return;
        const photos = await getphotos(itemId);
        setLocalPhotos(photos);
        dispatch(setPhotos({ [decryptedItemId]: photos }));
    };

    useEffect(() => {
        if (!itemId) {
            // Agar koi menu selected nahi hai, toh content aur images clear kar do
            setLocalPhotos([]);
            return;
        }

        // Check if data already exists in Redux before making an API call
        if (storedPhotos) {
            setLocalPhotos(storedPhotos);
        } else {
            fetchPhotos();
        }
    }, [itemId, storedPhotos, dispatch, searchParams, initialphotos]);

    // ye useEffect sirf client side par chalega jab page load hoga tab
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);


    return (
        <div className="p-6 bg-white shadow-lg h-screen flex flex-col overflow-y-auto scrollbar-hide"
        >
            <div className="flex flex-row items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Photos</h2>
                {isHydrated && user?.role === "admin" && (
                    <div className="ml-auto flex gap-4">
                        <button
                            onClick={() => setIsImageModalOpen(true)}
                            className="upload ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Upload Image
                        </button>

                    </div>
                )}


            </div>

            {/* Render Contents */}
            <div>
                {photos.length > 0 ? (
                    <ul className="space-y-2">
                        {photos.map((photo) => (
                            <li key={photo.id} className="bg-white p-3 flex rounded-lg shadow-sm border">
                                <img
                                    src={photo.url || `/uploads/${photo.filename}`} // update based on your API
                                    alt="Uploaded"
                                    className="w-40 h-40 object-cover rounded-md"
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No Photos available. Please upload photos</p>
                )}
            </div>

            {isImageModalOpen && <PhotoUploadModal closeModal={() => setIsImageModalOpen(false)} />}

        </div>
    );
};

export default PhotoSection;
