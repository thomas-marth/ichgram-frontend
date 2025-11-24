import { Routes, Route } from "react-router-dom";

import NotFoundPage from "./NotFoundPage";

import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/SignupPage";
import ConfirmPage from "./Auth/ConfirmPage";
import ResetPasswordPage from "./Auth/ResetPasswordPage";

import HomePage from "./HomePage";
import ExplorePage from "./ExplorePage/index";
import MessagesPage from "./MessagesPage";
import ProfilePage from "./ProfilePage";

import CookiesPolicyPage from "./CookiesPolicyPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import TermsPage from "./TermsPage";
import LearnMorePage from "./LearnMorePage";
import EditProfilePage from "./ProfilePage/EditProfilePage";

const Navigation = () => {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
      </Route>
      <Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<ProfilePage />} />
        <Route path="/:id/edit" element={<EditProfilePage />} />
        <Route path="/direct" element={<MessagesPage />} />
        <Route path="/direct/:id" element={<MessagesPage />} />
        <Route path="/" element={<ExplorePage />} />
      </Route>
      <Route path="/cookies" element={<CookiesPolicyPage />} />
      <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Navigation;
