import React, { useEffect, useState } from "react";
import { uploadImage } from "../services/apiServices";

const CKEditorComponent = ({ initialData, onChange, menuId }) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [Editor, setEditor] = useState({ CKEditor: null, ClassicEditor: null,ImageResize:null, ImageToolbar:null, ImageStyle:null });

  useEffect(() => {
    const loadCKEditor = async () => {
      try {
        const { CKEditor } = await import("@ckeditor/ckeditor5-react");
        const ClassicEditor  = (await import("@ckeditor/ckeditor5-build-classic")).default;
      //   const { Image, ImageResize, ImageStyle, ImageToolbar, ImageUpload } = await import('@ckeditor/ckeditor5-image');
      //   class ClassicEditor extends ClassicEditorBase {}
      // ClassicEditor.builtinPlugins = [
        
      //   Image,
      //   ImageResize,
      //   ImageStyle,
      //   ImageToolbar,
      //   ImageUpload
      // ];

        setEditor({ CKEditor, ClassicEditor });
        setEditorLoaded(true);
      } catch (error) {
        console.error("CKEditor loading failed:", error);
      }
    };

    loadCKEditor();
  }, []);

  return (
    <div>
      {editorLoaded ? (
        <Editor.CKEditor
          editor={Editor.ClassicEditor}
          config={{
            toolbar: [
              "heading", "|",
              "bold", "italic", "underline", "|",
              "bulletedList", "numberedList", "|",
              "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|",
              "uploadImage", "mediaEmbed", "|",
              "undo", "redo"
            ],
            extraPlugins: [
              function CustomUploadAdapterPlugin(editor) {
                editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
                  return new CustomUploadAdapter(loader, menuId);
                };
              },

            ],
            image: {
              toolbar: [
                "imageTextAlternative",
                "imageStyle:full",
                "imageStyle:side",
                "resizeImage:original",
                "resizeImage:25",
                "resizeImage:50",
                "resizeImage:75",
                "resizeImage:100",

              ],
              resizeOptions: [
                {
                  name: "resizeImage:original",
                  label: "Original",
                  value: null,
                },
                {
                  name: "resizeImage:25",
                  label: "25%",
                  value: "25",
                },
                {
                  name: "resizeImage:50",
                  label: "50%",
                  value: "50",
                },
                {
                  name: "resizeImage:75",
                  label: "75%",
                  value: "75",
                },
                {
                  name: "resizeImage:100",
                  label: "100%",
                  value: "100",
                },
              ],
              resizeUnit: "%",
            },
          }}
          data={initialData || ""}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      ) : (
        <p>Loading editor...</p>
      )}
    </div>
  );
};


class CustomUploadAdapter {
  constructor(loader, menuId) {
    this.loader = loader;
    this.menuId = menuId;
  }

  async upload() {
    const file = await this.loader.file;
    return uploadImage(file, this.menuId);
  }

  abort() {
    // Handle abort if needed
  }
}

export default CKEditorComponent;