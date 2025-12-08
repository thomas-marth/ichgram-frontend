import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectUser,
} from "../../../redux/auth/authSelectors";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (isAuthenticated && !user) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children || <Outlet />;
};

export default PrivateRoute;
