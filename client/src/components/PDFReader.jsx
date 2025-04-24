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
  // const [editorLoaded, setEditorLoaded] = useState(false);
  // const [Editor, setEditor] = useState({ CKEditor: null, ClassicEditor: null, ImageResize: null, ImageToolbar: null, ImageStyle: null });


  // useEffect(() => {
  //   const loadCKEditor = async () => {
  //     try {
  //       const { CKEditor } = await import("@ckeditor/ckeditor5-react");
  //       const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;
  //       setEditor({ CKEditor, ClassicEditor });
  //       setEditorLoaded(true);
  //     } catch (error) {
  //       console.error("CKEditor loading failed:", error);
  //     }
  //   };

  //   loadCKEditor();
  // }, []);
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
      setHtmlContent(previewRef.current.innerHTML);
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
      setHtmlContent(transformImagePaths(res.data?.data?.htmlContent || ""));
      console.log(transformImagePaths(res.data?.data?.htmlContent || ""))
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
      const html2pdf = (await import("html2pdf.js")).default;
  
      const opt = {
        margin: [0.5, 0, 0.5, 0], // top, left, bottom, right
        filename: "html-content.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2,windowWidth: 1024 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
  
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF.");
    } finally {
      document.body.removeChild(element);
    }
  
    // Clear content afterward (optional)
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
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  onInput={handlePreviewChange}
                  onBlur={handlePreviewChange}
                  style={{
                    outline: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                />
                {/* 
                <Editor.CKEditor
                  editor={Editor.ClassicEditor}
                  data={htmlContent}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setHtmlContent(data);
                  }}
                  config={{
                    toolbar: [
                      'heading', '|',
                      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                      'blockQuote', 'insertTable', '|',
                      'undo', 'redo'
                    ]
                  }}
                />
                */}
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
