import React, { useEffect, useState } from 'react';
import {  useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import "../config/i18n";
import Courses from '../components/Courses';
import Menus from '../components/Menu';
import Content from '../components/Content';
import Advertisment from '../components/Advertisment';


const Home = ({ initialData }) => {

  const location = useLocation();
  const { t, i18n } = useTranslation();

  // const selectedCourse = params.get("course") || initialData?.selectedCourse || null;
// const selectedMenu = params.get("menu") || initialData?.selectedMenu || null;
  const [selectedCourse, setSelectedCourse] = useState(initialData?.selectedCourse || null);
  const [selectedMenu, setSelectedMenu] = useState(initialData?.selectedMenu || null);
  const [menus, setMenus] = useState(initialData?.menus || []);
  const [contents, setContents] = useState(initialData?.contents || []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const course = params.get("course");
    const menu = params.get("menu");
    setSelectedCourse(course);
    setSelectedMenu(menu);
    // console.log('🚀 Initial Data (Home):', initialData);
  }, [location.search, selectedCourse, selectedMenu]);

  


  // Toggle language
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200  ">
      <ToastContainer />
      {/* Courses List */}
      <div className="bg-white shadow p-4 flex space-x-4 overflow-x-auto">
          <Courses initialCourses={initialData?.courses} />       
      </div>
      <div className='flex flex-1 bg-gray-200'>
        <div className="flex flex-1  w-3/4">
          {/* Sidebar Menu */}
          {selectedCourse && (
            <div className="w-1/4 p-4">
                <Menus initialMenus={menus} />
            </div>
          )}

          {/* Main Content */}
          <div className={`p-4 ${selectedCourse ? "w-3/4" : "w-full"}`}>
            {selectedCourse ? (
                <Content initialContents={contents} initialImages={initialData?.images} />
              
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-semibold">
                  Welcome
                </h1>
                <p className="mt-2 text-gray-700">{t("text")}</p>
                <div className="mt-4 space-x-4">
                  <button
                    onClick={toggleLanguage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    {t("switch")}
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
        <div className='w-1/4'>
          <Advertisment />
        </div>
      </div>
    </div>
  );
};

export default Home;