import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const insuranceTypes = [
  { id: 1, name: "Comprensive" },
  { id: 2, name: "Total Loss only" },
];

const BulkUploadFormIns = () => {
  const [file, setFile] = useState(null);
  const [insuranceTypeId, setInsuranceTypeId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first!", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("insurance_type_id", insuranceTypeId);

      const response = await axios.post(
        "http://localhost:8081/api/bulk-upload-insurance-premiums",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const stats = response.data?.data?.stats || {};
      const message = response.data?.data?.message || "Upload completed";

      toast.success(
        `${message} \nInserted: ${stats.inserted}\nUpdated: ${stats.updated}\nDuplicates Skipped: ${stats.skippedDuplicates}\nTotal Processed: ${stats.totalProcessed}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error.response?.data?.message || "Upload failed",
        {
          position: "top-right",
          autoClose: 1500,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl shadow-lg bg-white w-full max-w-md mx-auto space-y-4">
      <ToastContainer />
      <h2 className="text-xl font-bold text-gray-800">Bulk Upload Premiums</h2>

      <button
        onClick={() => window.open("/Premium Calculator V1 - EV - Rate.csv", "_blank")}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
      >
        📥 Download Sample CSV
      </button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Insurance Type
        </label>
        <select
          value={insuranceTypeId}
          onChange={(e) => setInsuranceTypeId(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-xl bg-white text-gray-700"
        >
          {insuranceTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

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

export default BulkUploadFormIns;
