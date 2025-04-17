import { Route,Routes } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import ProtectedRoute from "./services/ProtectedRoute";
import Test from "./pages/Test";
import Details from "./pages/Details";


const Router = ({initialData}) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute initialUser={initialData?.user}><Home initialData={initialData}/></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute initialUser={initialData?.user}><Contact initialUser={initialData?.user}/></ProtectedRoute>} />
      <Route path="/test" element={<Test />} />
      <Route path="/details" element={<ProtectedRoute initialUser={initialData?.user}><Details initialData={initialData} /></ProtectedRoute>} />
    </Routes>
  );
};

export default Router;
  