import PrivateRoute from "./layout/PrivateRoute";
import PublicRoute from "./layout/PublicRoute";
import { Toaster } from "react-hot-toast";
import { Toast } from "./utils/toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
function App() {
  const handleShowToast = (type: "success" | "info" | "error" | "warning") => {
    const messages = {
      success: "Data saved successfully!",
      info: "New update available!",
      error: "Something went wrong!",
      warning: "Check your input!",
    };

    Toast[type](messages[type]);
  };

  return (
    <>
      <Toaster position="top-right" />

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
