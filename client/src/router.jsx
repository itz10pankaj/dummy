import { Route,Routes } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import ProtectedRoute from "./services/ProtectedRoute";
import Test from "./pages/Test";
import Details from "./pages/Details";
import PDFViewer from "./components/PDFReader";
import ImageReader from "./components/ImageReader";
import Form from "./pages/Form";
const Router = ({initialData}) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute initialUser={initialData?.user}><Home initialData={initialData}/></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute initialUser={initialData?.user}><Contact initialUser={initialData?.user}/></ProtectedRoute>} />
      <Route path="/test" element={<Test />} />
      <Route path="/details" element={<ProtectedRoute initialUser={initialData?.user}><Details initialData={initialData} /></ProtectedRoute>} />
      <Route path="/pdf-handle" element={<PDFViewer />} />
      <Route path="/image-handle" element={<ImageReader />} />
      <Route path="/form" element={<Form />} />
    </Routes>
  );
};

export default Router;
  