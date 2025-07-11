import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { Loader } from "../components";
import { useAuthStore } from "../store/auth-store";
import { ROUTES } from "./constants";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.AUTH_PAGE);
    }
  }, [isAuthenticated, navigate]);
  
  return isAuthenticated ? children : <Loader />;
};
