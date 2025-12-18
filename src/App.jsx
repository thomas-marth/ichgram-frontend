import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "./pages/Navigation";
import { getCurrentUser } from "./redux/auth/authThunks";
import { selectIsAuthenticated } from "./redux/auth/authSelectors";
import { connectSocket, disconnectSocket } from "./shared/utils/socket";

function App() {
  const isAuth = useSelector(selectIsAuthenticated);
  const token = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuth && token) {
      dispatch(getCurrentUser());
      connectSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [dispatch, isAuth, token]);

  return <Navigation />;
}

export default App;
