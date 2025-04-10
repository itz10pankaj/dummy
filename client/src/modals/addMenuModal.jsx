import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptID } from "../services/UrlEncode";
import { useDispatch } from "react-redux";
import { setMenus } from "../redux/slices/menuSlice";
const AddMenuModal = ({ closeModal,updateMenus,menus }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [menuName, setMenuName] = useState("");
    const dispatch = useDispatch();
  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/courses");
        setCourses(res.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
        useEffect(() => {
            document.body.classList.add("overflow-hidden");
            return () => {
                document.body.classList.remove("overflow-hidden");
            };
        }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course.", { position: "top-right", autoClose: 2000 });
      return;
    }

    if (!menuName.trim()) {
      toast.error("Please enter a valid menu name.", { position: "top-right", autoClose: 2000 });
      return;
    }

    try {
      const encryptedCourseId = encryptID(selectedCourse);

      // Send request to add a new menu
      const response = await axios.post(`http://localhost:8081/api/menu/${encryptedCourseId}`, {
        name: menuName,
      });

      toast.success("Menu added successfully!", { position: "top-right", autoClose: 2000 });

      // Update menu list
      updateMenus((prevMenus) => [...prevMenus, response.data.data]);
      dispatch(setMenus({ courseId: selectedCourse, menus: [...menus, response.data.data] }))
      // Reset input fields
      setMenuName("");
      setSelectedCourse("");

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
      <h2 className="text-xl font-bold mb-4">Add Menu</h2>

      {/* Course Selection */}
      <label className="block text-gray-700 font-semibold mb-1">Select Course:</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">-- Select Course --</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {/* Input for Menu Name */}
      <label className="block text-gray-700 font-semibold mb-1">Menu Name:</label>
      <input
        type="text"
        className="w-full p-2 border rounded-md mb-4"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
        placeholder="Enter menu name"
        required
      />

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Menu
        </button>
      </div>
    </div>
  </div>
);
};

export default AddMenuModal;