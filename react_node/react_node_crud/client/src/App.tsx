import { Toaster, toast } from "react-hot-toast";
import CustomToast from "./utils/CustomToast";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import PropertyList from "./components/property/PropertyList";
import PropertyAdd from "./components/property/PropertyAdd";
import PageNotFound from "./components/PageNotFound";
import { Routes, Route, Navigate } from "react-router-dom";
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
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-2">
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/property/list" element={<PropertyList />} />
            <Route path="/property/add" element={<PropertyAdd />} />
            <Route path="/property/add/:id" element={<PropertyAdd />} />
            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
