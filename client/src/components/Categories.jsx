import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setCategories} from "../redux/slices/categorySlice"
import { useSearchParams, useNavigate } from "react-router-dom";
import { encryptID, decryptID } from "../services/UrlEncode";
import AddCategoryModal  from "../modals/addCategoryModal";
import { getCategories } from "../services/apiServices";
const Categories = ({ initialCategories }) => {
    const dispatch = useDispatch();
    const [categories, setLocalcategories] = useState(initialCategories || []); 
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate(); 
    const selectedCategory = searchParams.get("category");
    const user = useSelector((state) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //age initailCourse jo ssr mai hai usse data nhi mile to ye api call hogi 
    useEffect(() => {
        if (!initialCategories || initialCategories.length === 0) {
            const fetchCategories = async () => {
                const categories = await getCategories(user);
                setLocalcategories(categories);
                dispatch(setCategories(categories));
            };

            fetchCategories();
        }
    }, [dispatch, initialCategories]);

    // ye useEffect sirf client side par chalega jab page load hoga tab
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleCategorySelect = async (categoryId) => {
        const encryptedCategoryId = encryptID(categoryId);
        setSearchParams({ category: encryptedCategoryId });

        navigate(`/details?category=${encryptedCategoryId}`);
    };

    const selectedCourseDecrypted = selectedCategory ? decryptID(selectedCategory) : null;
    return (
        <div className="w-full flex gap-4">
            <ul className="flex gap-4 overflow-x-auto whitespace-nowrap">
                {categories
                    .filter((course) => course && course.id) 
                    .map((course,idx) => {
                    return (
                        <li
                            key={course.id || `temp-${idx}`}
                            onClick={() => handleCategorySelect(course.id)}
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
                    Add Category
                </button>
            )}
            {isModalOpen && <AddCategoryModal closeModal={() => setIsModalOpen(false)} updateCategories={setLocalcategories} />}
        </div>
    );
};

export default Categories;