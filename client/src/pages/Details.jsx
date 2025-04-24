import React,{useEffect,useState} from 'react'
import { useLocation } from 'react-router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import "../config/i18n";
import Categories from "../components/Categories"
import Item from '../components/Items';
import PhotoSection from '../components/photosSection';
// import Advertisment from "../components/Advertisment"
import UserLogs from '../components/userLog';
import PDFViewer from '../components/PDFReader';
const Details = ({initialData}) => {
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const [selectedCategory, setselectedCategory] = useState(initialData?.selectedCategory || null);
    const [selectedItem, setSelectedItem] = useState(initialData?.selectedItem || null);
    const [items, setItems] = useState(initialData?.items || []);
      useEffect(() => { 
        const params = new URLSearchParams(location.search);
        const category = params.get("category");
        const item= params.get("item");
        setselectedCategory(category);
        setSelectedItem(item);
      }, [location.search, selectedCategory,selectedItem]);

      const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
      };
    
  return (
    <div className="flex flex-col min-h-screen bg-gray-200  ">
      <ToastContainer />
      {/* Courses List */}
      <div className="bg-white shadow p-4 flex space-x-4 overflow-x-auto">
          <Categories initialCategories={initialData?.categories} />       
      </div>
      <div className='flex flex-1 bg-gray-200'>
        <div className="flex flex-1  w-3/4">
          {/* Sidebar Menu */}
          {selectedCategory && (
            <div className="w-1/4 p-4">
                <Item initialItems={items} />
            </div>
          )}
          <div className={`p-4 ${selectedCategory ? "w-3/4" : "w-full"}`}>
            {selectedCategory ? (
                <PhotoSection initialphotos={initialData?.photos} />
              
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
          <UserLogs />
        </div>
      </div>
    </div>
  )
}

export default Details
