import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import NotFound from "./NotFound/NotFound";
import Reset from "./Auth/Reset/Reset";
import CookiesPolicy from "./CookiesPolicy/CookiesPolicy";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Terms from "./Terms/Terms";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/cookies" element={<CookiesPolicy />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Navigation;
