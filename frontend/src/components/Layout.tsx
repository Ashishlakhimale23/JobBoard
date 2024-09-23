import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { CreateApplication } from "./CreateApplication";
import { Home } from "../pages/LandingPage";

export function Layout(){
    return (
      <>
        <Routes>
          <Route path="/landing" element={<Home/>} />
          <Route path="/createpost" element={<CreateApplication/>}/>
          <Route element={<PrivateRoute/>}>
          </Route>
        </Routes>
      </>
    );
}