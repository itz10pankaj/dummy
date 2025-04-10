import ClassicEditorBase from "@ckeditor/ckeditor5-build-classic";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";

class ClassicEditor extends ClassicEditorBase {}

// Add the required plugins to the build
ClassicEditor.builtinPlugins = [
  ...ClassicEditor.builtinPlugins,
  ImageResize,
  ImageToolbar,
  ImageStyle,
];

// Export the custom editor
export default ClassicEditor;