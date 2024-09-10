import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

export function Layout(){
    return (
        <>
        <Routes>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
        </>
    )
}