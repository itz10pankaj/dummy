import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addBulkApi, addUserLogApi } from "../services/apiServices";
import { setItems } from "../redux/slices/itemsSlice";
import { setLogs } from "../redux/slices/logsSLice";
import { useDispatch, useSelector } from "react-redux";
import Papa from "papaparse";
const BulkUploadForm = ({ encryptedCategoryId, updateItems }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const items = useSelector((state) => state.items.items);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const logsFromStore = useSelector((state) => state.logs.userId)
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first!", {
        position: "top-right",
        autoClose: 1000
      });
      return;
    }
    setIsLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("latitude", position.coords.latitude);
      formData.append("longitude", position.coords.longitude);
      const blob = await addBulkApi(formData);

      if (!blob) {
        throw new Error("No CSV data received");
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "uploaded-items.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      const text = await blob.text();

      // Parse CSV
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true
      });

      const newItems = parsed.data.filter(item => item.status === "Inserted");
      updateItems((prevItems) => [...prevItems, ...newItems]);
      if (newItems.length > 0) {
        dispatch(setItems({
          categoryId: encryptedCategoryId,
          items: [...items, ...newItems]
        }));
        toast.success(`${newItems.length} items added successfully!`, {
          position: "top-right",
          autoClose: 1000
        });
        const log = await addUserLogApi({
          userId: user?.id,
          action: `Bulk Items Added`,
          status: true
        });
        dispatch(setLogs({ userId: [log, ...logsFromStore] }));
      }
      else {
        toast.error("Duplicate Items", {
          position: "top-right",
          autoClose: 1000
        });
        const log = await addUserLogApi({
          userId: user?.id,
          action: `Duplicate Items`,
          status: false
        });
        dispatch(setLogs({ userId: [log, ...logsFromStore] }));
        
      }


    } catch (error) {
      console.error("Upload failed:", error);
      const log = await addUserLogApi({
        userId: user?.id,
        action: "Bulk item addition failed",
        status: false
      });
      dispatch(setLogs({ userId: [log, ...logsFromStore] }));
      toast.error(error.response?.data?.message || "Upload failed", {
        position: "top-right",
        autoClose: 1000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="p-2 rounded-2xl shadow-lg bg-white w-full max-w-md mx-auto space-y-4">
      <ToastContainer />
      <h2 className="text-xl font-bold text-gray-800">Bulk Upload Items</h2>

      <button
        onClick={() => window.open("/sample-items.csv", "_blank")}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
      >
        📥 Download Sample CSV
      </button>

      <div>
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 border border-dashed border-gray-400"
        >
          📂 Choose CSV File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          onClick={(e) => (e.target.value = null)}
          className="hidden"
        />
        {file && (
          <p className="text-sm text-gray-600 mt-2">Selected: {file.name}</p>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-xl font-medium transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </div>

  );
};

export default BulkUploadForm;
