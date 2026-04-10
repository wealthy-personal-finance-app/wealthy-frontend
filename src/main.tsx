import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./app/App.tsx";
import { SignIn } from "./app/components/auth/SignIn.tsx";
import { SignUp } from "./app/components/auth/SignUp.tsx";
import { ForgotPassword } from "./app/components/auth/ForgotPassword.tsx";
import { CheckEmail } from "./app/components/auth/CheckEmail.tsx";
import { ResetPassword } from "./app/components/auth/ResetPassword.tsx";
import { PasswordResetSuccess } from "./app/components/auth/PasswordResetSuccess.tsx";
import { PlanSelection } from "./app/components/profile/PlanSelection.tsx";
import { ProfileSettings } from "./app/components/profile/ProfileSettings.tsx";
import { Toaster } from "./app/components/ui/sonner.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
      <Route path="/plans" element={<PlanSelection />} />
      <Route path="/settings" element={<App />} />
      <Route path="/profile" element={<App />} />
      <Route path="/billing" element={<App />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/ai-assistant" element={<App />} />
      <Route path="/cash-flow" element={<App />} />
      <Route path="/transactions" element={<App />} />
      <Route path="/dashboard" element={<App />} />
      <Route path="/*" element={<App />} />
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
    </Routes>
    <Toaster position="bottom-center" expand={false} richColors />
  </BrowserRouter>
);