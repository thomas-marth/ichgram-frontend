import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../../redux/auth/authSelectors";

const PublicRoute = () => {
  const isToken = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (isToken && !user) return <p>Loading...</p>;
  if (user) return <Navigate to="/" />;

  return <Outlet />;
};

export default PublicRoute;
