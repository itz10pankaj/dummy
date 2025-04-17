import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptID } from "../services/UrlEncode";
import { useDispatch } from "react-redux";
import { setItems } from "../redux/slices/itemsSlice";
import { getCategories,addItemApi } from "../services/apiServices";
const AddItemModal = ({ closeModal,updateItems,items }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setselectedCategory] = useState("");
    const [itemName, setitemName] = useState("");
    const dispatch = useDispatch();
    
    // const latitude=user?.latitude
    // const longitude=user?.longitude
  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories=await getCategories(true);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
        useEffect(() => {
            document.body.classList.add("overflow-hidden");
            return () => {
                document.body.classList.remove("overflow-hidden");
            };
        }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const latitude=position.coords.latitude
    const longitude=position.coords.longitude
    if (!selectedCategory) {
      toast.error("Please select a course.", { position: "top-right", autoClose: 2000 });
      return;
    }

    if (!itemName.trim()) {
      toast.error("Please enter a valid menu name.", { position: "top-right", autoClose: 2000 });
      return;
    }

    try {
      const encryptedCourseId = encryptID(selectedCategory);
      const response = await addItemApi(encryptedCourseId, {
        name: itemName,
        latitude:latitude,
        longitude:longitude
      });
      // console.log(response);
      toast.success("Item added successfully!", { position: "top-right", autoClose: 2000 });

      // Update menu list
      updateItems((prevItems) => [...prevItems, response]);
      dispatch(setItems({ categoryId:selectedCategory , items: [...items, response] }))
      // Reset input fields
      setitemName("");
      setselectedCategory("");

      // Close modal after success
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error("Error adding menu:", error);
      toast.error("Failed to add menu. Try again later.", { position: "top-right", autoClose: 2000 });
    }
  };



  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
    <ToastContainer />

    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Add Item</h2>

      {/* Course Selection */}
      <label className="block text-gray-700 font-semibold mb-1">Select Category:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        value={selectedCategory}
        onChange={(e) => setselectedCategory(e.target.value)}
      >
        <option value="">-- Select Category --</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Input for Menu Name */}
      <label className="block text-gray-700 font-semibold mb-1">Item Name:</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-4"
        value={itemName}
        onChange={(e) => setitemName(e.target.value)}
        placeholder="Enter item name"
        required
      />

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Item
        </button>
      </div>
    </div>
  </div>
);
};

export default AddItemModal;