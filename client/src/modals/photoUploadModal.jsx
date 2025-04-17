import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptID } from "../services/UrlEncode";
import { useDispatch, useSelector } from "react-redux";
import { setPhotos } from "../redux/slices/photoSlice";
import { getItems,getCategories,addPhotoApi } from "../services/apiServices";
const PhotoUploadModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const photos = useSelector((state) => state.photos);
  const [photoes, setPhotoes] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [itemId, setItemId] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories(true);
        setCategories(res);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch menus when a course is selected
  const fetchItems = async (categoryId) => {
    try {
      const res= await getItems(encryptID(categoryId));
      setItems(res);
      setItemId(""); // Reset menu selection when course changes
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };
  useEffect(() => {
    if (categoryId) {
        fetchItems(categoryId); 
    }
  }, [categoryId]);
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Function to fetch menus based on the selected course

  const handleImageChange = (e) => {
    setPhotoes(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!photoes.length || !itemId) {
      toast.error("Please select an image and a menu.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const encryptedItemId = encryptID(itemId)
    const formData = new FormData();
    photoes.forEach((photo)=>{
      formData.append("files", photo)
    })
    formData.append("itemId", encryptedItemId);
    try {
      const uploadedPhotos = await addPhotoApi(formData)
      dispatch(setPhotos({
        [itemId]: [
            ...(photos[itemId] || []),
            ...uploadedPhotos 
        ]
    }));
      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        closeModal();
      }, 3000);

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
      {/* Toast Notifications */}
      <ToastContainer />

      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Upload Image</h2>

        {/* Select Course */}
        <label>Select Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Menu Selection */}
        <label>Select Item</label>
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={!categoryId}
        >
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Image Input */}
        <label>Upload Photo</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 border rounded mb-4"
          multiple 
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={!itemId}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
