import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { encryptID } from "../services/UrlEncode";
import { useDispatch, useSelector } from "react-redux";
import { setContents } from "../redux/slices/contentSlice";
import CKEditorComponent from "../components/CKEditorComponent";
import { getCourses,getMenus,addContentApi } from "../services/apiServices";
const AddContentModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const contents = useSelector((state) => state.contents);
  const [content, setContent] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [menuId, setMenuId] = useState("");
  const [courses, setCourses] = useState([]);
  const [menus, setMenus] = useState([]);

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses= await getCourses(true);
        setCourses(courses);
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

  // Function to fetch menus based on the selected course
  const fetchMenus = async (courseId) => {
    try {
      const encryptedCourseId = encryptID(courseId);
      const res = await getMenus(encryptedCourseId);
      setMenus(res);
      setMenuId(""); // Reset menu selection when course changes
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };



  const handleUpload = async () => {
    if (!content || !menuId) {
      toast.error("Please add Content", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const encryptedMenuId = encryptID(menuId);
      // const response = await axios.post(`http://localhost:8081/api/content/${encryptedMenuId}`, {
      //   text: content,
      // });
      const response = await addContentApi(content,encryptedMenuId);

      const newContent = response;


      // Update Redux store
      dispatch(setContents({
        [menuId]: [...(contents[menuId] || []), newContent]
      }));
      toast.success("Content Added successfully!", {
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
  const handleImageUpload = async (formData) => {
    try {
      const response = await fetch("http://localhost:8081/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Image upload failed:", error);
      return { uploaded: false, error: error.message };
    }
  };
      useEffect(() => {
          document.body.classList.add("overflow-hidden");
          return () => {
              document.body.classList.remove("overflow-hidden");
          };
      }, []);
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center">
      {/* Toast Notifications */}
      <ToastContainer />

      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/2 max-h-3/4 overflow-y-scroll scrollbar-hide">
        <h2 className="text-xl font-bold mb-4">Add Content</h2>

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
        <CKEditorComponent
          initialData={content}
          onChange={(data) => setContent(data)}
          onImageUpload={handleImageUpload}
          menuId={menuId}
        />
        <label>Preview</label>


        <div
          className="content-container p-2 border rounded bg-gray-100 mb-4 min-h-[100px]"
          dangerouslySetInnerHTML={{ __html: content }}
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
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;
