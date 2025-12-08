import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "./pages/Navigation";
import { getCurrentUser } from "./redux/auth/authThunks";
import { selectIsAuthenticated } from "./redux/auth/authSelectors";
import "./shared/styles/style.css";

function App() {
  const isToken = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isToken) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isToken]);

  return (
    <>
      <Navigation />
    </>
  );
}

export default App;
