import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptID } from "../services/UrlEncode";
import { useDispatch, useSelector } from "react-redux";
import { setImages } from "../redux/slices/imageSlice";
const ImageUploadModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const images = useSelector((state) => state.images);
  const [image, setImage] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [courses, setCourses] = useState([]);
  const [menus, setMenus] = useState([]);

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

  // Fetch menus when a course is selected
  useEffect(() => {
    if (courseId) {
      fetchMenus(courseId); 
    }
  }, [courseId]);
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Function to fetch menus based on the selected course
  const fetchMenus = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/menu/${encryptID(courseId)}`);
      setMenus(res.data.data);
      setMenuId(""); // Reset menu selection when course changes
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image || !menuId) {
      toast.error("Please select an image and a menu.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const encryptedMenuId = encryptID(menuId)
    const formData = new FormData();
    formData.append("image", image);
    formData.append("menuId", encryptedMenuId);

    try {
      const response = await axios.post("http://localhost:8081/api/upload", formData);
      const newImage = response.data;

      // Update Redux store
      dispatch(setImages({
        [menuId]: [...(images[menuId] || []), newImage]
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
        <label>Select Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        {/* Menu Selection */}
        <label>Select Menu</label>
        <select
          value={menuId}
          onChange={(e) => setMenuId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={!courseId}
        >
          <option value="">Select Menu</option>
          {menus.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.name}
            </option>
          ))}
        </select>

        {/* Image Input */}
        <label>Upload File</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-2 border rounded mb-4"
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
            disabled={!menuId}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
