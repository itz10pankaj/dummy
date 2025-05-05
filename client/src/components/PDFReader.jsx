//npm i html2pdf
import React, { useState, useRef } from "react";
import axios from "axios";
const PDFViewer = () => {

  const [pdfText, setPdfText] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const transformImagePaths = (html) => {
    return html.replace(/src="([^"]*)"/g, (match, path) => {
      const imageName = path.split('/').pop();
      return `src="http://localhost:8081/api/pdf/images/${imageName}"`;
    });
  };
  const replaceImageUrlsWithBase64 = async (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const imgElements = doc.querySelectorAll("img");

    const convertToBase64 = async (url) => {
      try {
        const res = await fetch(url);
        const blob = await res.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result); // Base64 string
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Image load failed:", url, err);
        return url; // fallback
      }
    };

    for (const img of imgElements) {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("data:")) {
        const base64 = await convertToBase64(src);
        img.setAttribute("src", base64);
      }
    }

    return doc.body.innerHTML;
  };

  const handlePreviewChange = () => {
    if (previewRef.current) {
      setHtmlContent(previewRef.current.innerHTML); // Update content

    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8081/api/pdf/pdf-upload", formData);
      setTemplateId(res.data?.data?.id);
      setPdfText(res.data?.data?.content || "No text extracted");
      const transformedHtml = transformImagePaths(res.data?.data?.htmlContent || "");
      setHtmlContent(transformImagePaths(res.data?.data?.htmlContent || ""));
      extractDataFromHTML(transformedHtml);
      setDownloadReady(false);
    } catch (err) {
      console.error(err);
      setPdfText("Error processing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!templateId) return;

    try {
      setLoading(true);
      await axios.put("http://localhost:8081/api/pdf/update-template", {
        templateId,
        newContent: pdfText,
        newHtmlContent: htmlContent,
      });
      alert("Content updated successfully!");
      setIsEditing(false);
      setDownloadReady(true);
    } catch (err) {
      console.error(err);
      alert("Error updating content.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!htmlContent) {
      alert("No HTML content available to generate PDF.");
      return;
    }
    const processedHtml = await replaceImageUrlsWithBase64(htmlContent);
    const element = document.createElement("div");
    element.innerHTML = processedHtml;
    element.style.width = "100%";
    element.style.boxSizing = "border-box"; 
    element.style.padding = "10px";

    const style = document.createElement("style");
    style.innerHTML = `
      * {
        box-sizing: border-box;
        max-width: 100%;
        word-wrap: break-word;
      }
         html, body { margin: 0; padding: 0; }
    .pdf-container { margin: 0 !important; padding: 0 !important; width: 100%; }
      body {
        margin: 0;
        padding: 0.5in 0.3in;
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    `;
    element.prepend(style);

    document.body.appendChild(element);

    try {
      // const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: [0.5, 0, 0.5, 0], // top, left, bottom, right
        filename: "html-content.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, windowWidth: 1024 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF.");
    } finally {
      document.body.removeChild(element);
    }

    setPdfText("");
    setHtmlContent("");
    setIsEditing(false);
    setTemplateId(null);
    setDownloadReady(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPdfText("");
    setHtmlContent("");
    setIsEditing(false);
    setTemplateId(null);
    setDownloadReady(false);
  };

  const extractDataFromHTML = (html) => {
    if (!html) {
      console.log("No HTML content provided");
      return;
    }
    console.log("Starting extraction...");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const getFieldValue = (label) => {
        const sanitizedLabel = label.replace(/\s+/g, ' ').trim();
        const labelElement = Array.from(doc.querySelectorAll('p')).find(el =>
          el.textContent.replace(/\s+/g, ' ').trim().includes(sanitizedLabel)
        );
        if (!labelElement) {
          console.log(`Label "${sanitizedLabel}" not found in the HTML`);
          return "";
        }
        if (label === "No. Invoice") {
          const invoiceElement =labelElement
          if (invoiceElement) {
            const invoiceText = invoiceElement.textContent;
            return invoiceText.split(':').pop().trim();
          }
          return "";
        }
        if (label === "Nomor Rekening") {
          const rekeningValue = Array.from(doc.querySelectorAll('p')).find(el => 
            el.getAttribute('style')?.includes('top:558px') && 
            el.getAttribute('style')?.includes('left:314px')
          );
          return rekeningValue ? rekeningValue.textContent.trim() : "";
        }
        if (label === "Batas Waktu Pembayaran") {
          const deadlineValue = Array.from(doc.querySelectorAll('p')).find(el => 
            el.getAttribute('style')?.includes('top:621px') && 
            el.getAttribute('style')?.includes('left:314px')
          );
          return deadlineValue ? deadlineValue.textContent.trim() : "";
        }
        const valueElement = labelElement.nextElementSibling;
        return valueElement ? valueElement.textContent.trim() : "";
      };
      const extractedData = {
        No_Invoice: getFieldValue("No. Invoice"),
        No_Order: getFieldValue("No. Order"),
        Nama_Asuransi: getFieldValue("Nama Asuransi"),
        Tipe_Asuransi: getFieldValue("Tipe Asuransi"),
        Nama_Produk: getFieldValue("Nama Produk"),
        Nama_Pemegang_Polis: getFieldValue("Nama Pemegang Polis"),
        Periode_Asuransi: getFieldValue("Periode Asuransi"),
        Metode_Pembayaran: getFieldValue("Metode Pembayaran"),
        Nomor_Rekening: getFieldValue("Nomor Rekening"),
        Nama_Rekening: getFieldValue("Nama Rekening"),
        Batas_Waktu_Pembayaran: getFieldValue("Batas Waktu Pembayaran"),
        Harga_Premi: getFieldValue("Harga Premi"),
        Biaya_Admin_dan_Meterai: getFieldValue("Biaya Admin dan Meterai"),
        Biaya_Transaksi: getFieldValue("Biaya Transaksi"),
        Diskon_dan_Cashback: getFieldValue("Diskon dan Cashback"),
        Total_Dibayarkan: getFieldValue("Total Dibayarkan"),
      };
  
      console.log(extractedData);
    } catch (err) {
      console.error("Error extracting data:", err);
      return null;
    }
  };
  
  return (
    <div className="mx-auto mt-10 p-6 shadow-md rounded bg-white max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">PDF Template Editor</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          className="mb-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700"
          ref={fileInputRef}
        />
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear selection
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-blue-500">Processing PDF...</p>
        </div>
      ) : pdfText ? (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="my-4">
            <h2 className="text-lg font-semibold">HTML Content</h2>
            {isEditing ? (
              <div>
                <textarea
                  className="w-full h-96 p-4 border rounded font-mono text-sm"
                  value={htmlContent}
                  onChange={(e) => {
                    setHtmlContent(e.target.value)
                    if (previewRef.current) {
                      previewRef.current.innerHTML = e.target.value;
                    }
                  }}
                />
                <div
                  ref={previewRef}
                  className="border mt-2 p-4 bg-white min-h-48 overflow-auto"
                  // contentEditable
                  onInput={handlePreviewChange}
                  onBlur={handlePreviewChange}
                  // suppressContentEditableWarning
                  style={{
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            ) : (
              <div
                className="border mt-2 p-4 bg-white max-h-96 overflow-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            )}
          </div>

          <div className="mt-4 flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveContent}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Edit Content
                </button>
                {downloadReady && (
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Download PDF
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Upload a PDF to get started</p>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
