import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { UploadPage } from "../pages/UploadData";
import { PrivateRoute } from "./PrivateRoute";
import { Dashboard } from "../pages/Dashboard";

export function Layout(){
    return (
      <>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute/>}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard" element={<Dashboard/>} />
          </Route>
        </Routes>
      </>
    );
}