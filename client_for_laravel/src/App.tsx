import { Toaster, toast } from "react-hot-toast";
import CustomToast from "./utils/CustomToast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Home from "./components/Home";
import PageNotFound from "./components/PageNotFound";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";
import ProtectedRoute from "./layout/ProtectedRoute";
import PublicRoute from "./layout/PublicRoute";
toast.info = (message: string) =>
  toast(message, {
    duration: 2000,
    icon: <HiInformationCircle className="text-blue-500 w-7 h-7" />,
  });
// Success
toast.success = (message: string) =>
  toast(message, {
    duration: 2000,
    icon: <HiCheckCircle className="text-green-400 w-7 h-7" />,
    styleType: "success",
  });

// Error
toast.error = (message: string) =>
  toast(message, {
    duration: 2000,
    icon: <HiXCircle className="text-red-500 w-7 h-7" />,
    styleType: "error",
  });
function App() {
  return (
    <>
      <Toaster position="top-right" gutter={8}>
        {(t) => <CustomToast t={t} />}
      </Toaster>

      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-2">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route element={<PublicRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route
              path="about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
