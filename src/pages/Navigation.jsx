import { Routes, Route } from "react-router-dom";

import NotFoundPage from "./NotFoundPage/NotFoundPage";

import LoginPage from "./Auth/LoginPage/LoginPage";
import SignupPage from "./Auth/SignupPage/SignupPage";
import ConfirmPage from "./Auth/ConfirmPage/ConfirmPage";
import ResetPasswordPage from "./Auth/ResetPasswordPage/ResetPasswordPage";

import PrivateLayout from "./../layouts/PrivateLayout/PrivatLayout";
import HomePage from "./HomePage/HomePage";
import ExplorePage from "./ExplorePage/ExplorePage";
import MessagesPage from "./MessagesPage/MessagesPage";
import ProfilePage from "./ProfilePage/ProfilePage";

import CookiesPolicyPage from "./CookiesPolicyPage/CookiesPolicyPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage/PrivacyPolicyPage";
import TermsPage from "./TermsPage/TermsPage";
import LearnMorePage from "./LearnMorePage/LearnMorePage";
import EditProfilePage from "./ProfilePage/EditProfilePage/EditProfilePage";

const Navigation = () => {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
      </Route>
      <Route element={<PrivateLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<ProfilePage />} />
        <Route path="/:id/edit" element={<EditProfilePage />} />
        <Route path="/direct" element={<MessagesPage />} />
        <Route path="/direct/:id" element={<MessagesPage />} />
        <Route path="/" element={<ExplorePage />} />
      </Route>
      <Route path="/cookies" element={<CookiesPolicyPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Navigation;
