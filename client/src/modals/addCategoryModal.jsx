import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch,useSelector } from "react-redux";
import {addCategory} from "../redux/slices/categorySlice"
import { getCategories,addCategoryApi,addUserLogApi } from "../services/apiServices";
import { setLogs } from "../redux/slices/logsSLice";
const AddCategoryModal = ({ closeModal,updateCategories }) => {
  const dispatch = useDispatch();
  const user= useSelector((state) => state.auth.user);
  console.log(user);
  const [categories, setCategories] = useState([]);
  const [categoryName, setcategoryName] = useState([]);
  const logsFromStore=useSelector((state)=>state.logs.userId)
  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories(true);
        console.log(categories);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching courses:", error);
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
    
    if (!categoryName.trim()) {
        toast.error("Please enter a valid course name.", {
            position: "top-right",
            autoClose: 1000,
        });
        return;
    }

    try {
        const newCategory=await  addCategoryApi({ name: categoryName });
        // Success message
        toast.success("Category added successfully!", {
            position: "top-right",
            autoClose: 1000,
        });
        const log = await addUserLogApi({
          userId: user?.id,  
          action: `Added category: ${newCategory.name}`,
          status:true
        });
        updateCategories((prevCategories) => [...prevCategories, newCategory]);
        dispatch(addCategory(newCategory));
        dispatch(setLogs({ userId: [log,...logsFromStore] }));
        // Reset input field
        setcategoryName("");

        // Close the modal
        setTimeout(() => {
            closeModal();
        }, 1000);
        
    } catch (error) {
      console.error("Error adding course:", error);
      
      if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message || "Category already exists", {
              position: "top-right",
              autoClose: 1000,
          });
          setTimeout(() => {
            closeModal();
        }, 1000);
      } else {
          const log = await addUserLogApi({
            userId: user?.id,  
            action: "Category Add failed",
            status: false
          });
          dispatch(setLogs({ userId: [log, ...logsFromStore] }));
          toast.error("Failed to add category. Try again later.", {
              position: "top-right",
              autoClose: 1000,
          });
          setTimeout(() => {
            closeModal();
        }, 1000);
      }
  }
};


  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
      {/* Toast Notifications */}
      <ToastContainer />

      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Add Course</h2>

        {/* Select Course */}
        <label>Listed Course</label>
        {
          <ul className="flex gap-4 overflow-x-auto whitespace-nowrap">
            {categories.map((category) => {
              return (
                <li
                  key={category.id}
                  className={`cursor-pointer px-4 py-2 rounded-lg transition text-gray-700 border-2`}
                >
                  {category.name}
                </li>
              );
            })}
          </ul>
        }
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 font-semibold mb-1">New Course Name:</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            value={categoryName}
            onChange={(e) => setcategoryName(e.target.value)}
            placeholder="Enter course name"
            required
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
