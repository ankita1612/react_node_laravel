import PrivateRoute from "./layout/PrivateRoute";
import PublicRoute from "./layout/PublicRoute";
import { Toaster, toast } from "react-hot-toast";
import CustomToast from "./utils/CustomToast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";

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
            <Route path="/" element={<Navigate to="/registration" />} />
            <Route element={<PublicRoute />}>
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
