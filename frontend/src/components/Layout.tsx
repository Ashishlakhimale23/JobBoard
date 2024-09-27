import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { CreateApplication } from "./CreateApplication";
import { Home } from "../pages/LandingPage";

export function Layout(){
    return (
      <>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route element={<PrivateRoute/>}>

          <Route path="/createpost" element={<CreateApplication/>}/>
          </Route>
        </Routes>
      </>
    );
}