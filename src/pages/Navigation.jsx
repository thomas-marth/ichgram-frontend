import { Routes, Route } from "react-router-dom";

import NotFoundPage from "./NotFoundPage/NotFoundPage";

import LoginPage from "./Auth/LoginPage/LoginPage";
import SignupPage from "./Auth/SignupPage/SignupPage";
import ConfirmPage from "./Auth/ConfirmPage/ConfirmPage";
import ResetPasswordPage from "./Auth/ResetPasswordPage/ResetPasswordPage";
import LogoutPage from "./Auth/LogoutPage/LogoutPage";

import PrivateLayout from "./../layouts/PrivateLayout/PrivatLayout";
import HomePage from "./HomePage/HomePage";
import ExplorePage from "./ExplorePage/ExplorePage";
import MessagesPage from "./MessagesPage/MessagesPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import ProtectedRoute from "../shared/components/ProtectedRoute/ProtectedRoute";

import CookiesPolicyPage from "./CookiesPolicyPage/CookiesPolicyPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage/PrivacyPolicyPage";
import TermsPage from "./TermsPage/TermsPage";
import LearnMorePage from "./LearnMorePage/LearnMorePage";
import EditProfilePage from "./ProfilePage/EditProfilePage/EditProfilePage";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset" element={<ResetPasswordPage />} />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/learn-more" element={<LearnMorePage />} />
      <Route path="/cookies" element={<CookiesPolicyPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="profile/:id/edit" element={<EditProfilePage />} />
        <Route path="direct" element={<MessagesPage />} />
        <Route path="direct/:id" element={<MessagesPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default Navigation;
