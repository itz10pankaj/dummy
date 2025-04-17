import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMenus } from "../redux/slices/menuSlice";
import { useSearchParams } from "react-router-dom";
import { encryptID, decryptID } from "../services/UrlEncode";
import AddMenuModal from "../modals/addMenuModal";
import {getMenus} from "../services/apiServices";

const Menus = ({ initialMenus }) => {
    const dispatch = useDispatch();
    const [menus, setLocalMenus] = useState(initialMenus || []); // Use initialMenus for SSR
    const [searchParams, setSearchParams] = useSearchParams();
    const courseId = searchParams.get("course");
    const decryptedCourseId = decryptID(courseId);
    const selectedMenu = searchParams.get("menu");
    const selectedCourseDecrypted = selectedMenu ? decryptID(selectedMenu) : null;
    const storedMenu = useSelector((state) => state.menus?.[decryptedCourseId]);
    const user = useSelector((state) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        const fetchMenus = async () => {
            if (!courseId) return; // Skip if no course is selected
            try {
                const menuData = await getMenus(courseId);
                // console.log("hii",response.data.data); 
                setLocalMenus(menuData); // Update local state
                dispatch(setMenus({ courseId: decryptedCourseId, menus: menuData })); // Update Redux store

                if (menuData.length > 0 && !selectedMenu) {
                    // Automatically select the first menu if none is selected
                    const encryptedMenuId = encryptID(menuData[0].id);
                    setSearchParams({ course: courseId, menu: encryptedMenuId });
                }
            } catch (err) {
                console.error("Error fetching menus:", err);
            }
        };

        if (!storedMenu) {
            fetchMenus();
        } else {
            setLocalMenus(storedMenu);
        }
    }, [courseId, dispatch, selectedMenu, initialMenus, setSearchParams, storedMenu]);

    // ye useEffect sirf client side par chalega jab page load hoga tab
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return (
        <div className="h-screen bg-gray-100 border-gray-300 p-4 flex-col space-y-2 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <ul className="space-y-2">
                {menus.map((menu) => {
                    const encryptedMenuId = encryptID(menu.id);
                    return (
                        <li
                            key={menu.id}
                            onClick={() => setSearchParams({ course: courseId, menu: encryptedMenuId })}
                            className={`cursor-pointer block px-4 py-2 rounded-lg transition ${selectedCourseDecrypted === String(menu.id) ? "bg-blue-500 text-white font-semibold" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                        >
                            {menu.name}
                        </li>
                    );
                })}
            </ul>
            {isHydrated && user?.role == "admin" && (
                <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg">Add Menu</button>
            )}
            {isModalOpen && (
                <AddMenuModal closeModal={() => setIsModalOpen(false)} updateMenus={setLocalMenus} menus={menus}/>
            )}
        </div>
    );
};

export default Menus;
