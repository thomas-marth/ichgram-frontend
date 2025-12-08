import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../../redux/auth/authThunks";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const processLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
      } finally {
        navigate("/login", { replace: true });
      }
    };

    processLogout();
  }, [dispatch, navigate]);

  return null;
};

export default LogoutPage;
