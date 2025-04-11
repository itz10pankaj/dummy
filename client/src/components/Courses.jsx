import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../redux/slices/courseSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { encryptID, decryptID } from "../services/UrlEncode";
import AddCourseModal from "../modals/addCourseModal";
import { getCourses } from "../services/apiServices";
const Courses = ({ initialCourses }) => {
    const dispatch = useDispatch();
    const [courses, setLocalCourses] = useState(initialCourses || []); 
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate(); 
    const selectedCourse = searchParams.get("course");
    const user = useSelector((state) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //age initailCourse jo ssr mai hai usse data nhi mile to ye api call hogi 
    useEffect(() => {
        if (!initialCourses || initialCourses.length === 0) {
            const fetchCourses = async () => {
                const courses = await getCourses(user);
                setLocalCourses(courses);
                dispatch(setCourses(courses));
            };

            fetchCourses();
        }
    }, [dispatch, initialCourses]);

    // ye useEffect sirf client side par chalega jab page load hoga tab
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleCourseSelect = async (courseId) => {
        const encryptedCourseId = encryptID(courseId);
        setSearchParams({ course: encryptedCourseId });

        navigate(`/home?course=${encryptedCourseId}`);
    };

    const selectedCourseDecrypted = selectedCourse ? decryptID(selectedCourse) : null;
    return (
        <div className="w-full flex gap-4">
            <ul className="flex gap-4 overflow-x-auto whitespace-nowrap">
                {courses
                    .filter((course) => course && course.id) 
                    .map((course,idx) => {
                    return (
                        <li
                            key={course.id || `temp-${idx}`}
                            onClick={() => handleCourseSelect(course.id)}
                            className={`cursor-pointer px-4 py-2 rounded-lg transition text-gray-700
                            ${selectedCourseDecrypted === String(course?.id)
                                    ? "bg-blue-500 text-white font-semibold"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }
                        `}
                        >
                            {course?.name || "Untitled"}
                        </li>
                    );
                })}
            </ul>
            {isHydrated && user?.role == "admin" && (
                <button onClick={() => setIsModalOpen(true)} className="upload">
                    Upload Course
                </button>
            )}
            {isModalOpen && <AddCourseModal closeModal={() => setIsModalOpen(false)} updateCourses={setLocalCourses} />}
        </div>
    );
};

export default Courses;