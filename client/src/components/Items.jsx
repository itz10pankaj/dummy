import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../redux/slices/itemsSlice"
import { useSearchParams } from "react-router-dom";
import { encryptID, decryptID } from "../services/UrlEncode";
import { getItems } from "../services/apiServices";
import AddItemModal from "../modals/addItemModal";
import BulkUploadForm from "../modals/BulkUploadModal";
const Item = ({ initialItems }) => {
    const dispatch = useDispatch()
    const [items, setLocalItems] = useState(initialItems || [])
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryId = searchParams.get("category")
    const decryptedCategoryId = decryptID(categoryId)
    const selectedItem = searchParams.get("item")
    const selectedCategoryDecrypted = selectedItem ? decryptID(selectedItem) : null
    const storedItem = useSelector((state) => state.items?.[decryptedCategoryId])
    const user = useSelector((state) => state.auth.user)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchItems = async () => {
            if (!categoryId) return
            try {
                const itemData = await getItems(categoryId)
                setLocalItems(itemData)
                dispatch(setItems({ categoryId: decryptedCategoryId, items: itemData }))

                if (itemData.length > 0 && !selectedItem) {
                    const encryptedItemId = encryptID(itemData[0].id)
                    setSearchParams({ category: categoryId, item: encryptedItemId })
                }
            } catch (err) {
                console.error("Error fetching items:", err)
            }
        }

        if (!storedItem) {
            fetchItems()
        } else {
            setLocalItems(storedItem)
        }
    }, [categoryId, dispatch, , initialItems, selectedItem, setSearchParams, storedItem])
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);
    return (
        <div className="h-screen bg-gray-100 border-gray-300 p-4 flex-col space-y-2 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <ul className="space-y-2">
                {items.map((item) => {
                    const encryptedItemId = encryptID(item.id);
                    return (
                        <li
                            key={item.id}
                            onClick={() => setSearchParams({ category: categoryId, item: encryptedItemId })}
                            className={`cursor-pointer block px-4 py-2 rounded-lg transition ${selectedCategoryDecrypted === String(item.id) ? "bg-blue-500 text-white font-semibold" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                        >
                            {item.name}
                        </li>
                    );
                })}
            </ul>
            {isHydrated && user?.role == "admin" && (
                <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg">Add Item</button>
            )}
            {isModalOpen && (
                <AddItemModal closeModal={() => setIsModalOpen(false)} updateItems={setLocalItems} items={items} />
            )}
            {isHydrated && user?.role == "admin" && (
                <BulkUploadForm  encryptedCategoryId={categoryId} updateItems={setLocalItems}/>
            )}
        </div>
    )
}
export default Item