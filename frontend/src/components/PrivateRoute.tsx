import { useRecoilValue } from "recoil";
import { authState } from "@/store/atom";
import { Navigate,Outlet } from "react-router-dom";

export function PrivateRoute() {
  const auth = useRecoilValue(authState);

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}