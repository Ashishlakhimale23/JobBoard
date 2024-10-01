import { Navigate, Outlet } from "react-router-dom"

export function PrivateRoute(){
    const token = localStorage.getItem("AccessToken")
    return token ? <Outlet/> :  <Navigate to='/'/>
}