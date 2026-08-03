

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react'
import { Step } from '../widget/stepper';
import { passwordStrength } from '../helpers/passwordStrength';
import { ResetPasswordAPI } from '../services/api';
import { appToast } from '@/shared/lib/toast';
import { getApiErrorMessage } from '@/shared/api/handle-api-error';

export default function useResetPassword() {
     const router = useRouter()
  // ── State ──
  const [step, setStep] = useState<Step>("email");

  // Step 1
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Step 2
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(10 * 60);
  const [resendCooldown, setResendCooldown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resendRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [resetToken, setResetToken]= useState<string>("")

  // Step 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Cleanup
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (resendRef.current) clearInterval(resendRef.current);
    };
  }, []);

  // ── Helpers ──
  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(10 * 60);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const startResendCooldown = () => {
    if (resendRef.current) clearInterval(resendRef.current);
    setResendCooldown(60);
    resendRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(resendRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };



  // ── Handlers ──
  const handleSendEmail = async () => {
    setEmailError("");
    if (!email.trim() || !email.includes("@")) {
      setEmailError("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    setEmailLoading(true);
    try {
      // TODO: await api.post("/auth/forgot-password", { email });
      await ResetPasswordAPI.sendResetEmail({email})
      setStep("code");
      startCountdown();
      startResendCooldown();
    } catch(error) {
      appToast.error("Erreur envoi de mail", getApiErrorMessage(error))
      setEmailError("Aucun compte associé à cette adresse.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setOtpError("");
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Veuillez saisir les 6 chiffres du code.");
      return;
    }
    setOtpLoading(true);
    try {
      // TODO: await api.post("/auth/verify-code", { email, code });
      //await new Promise((r) => setTimeout(r, 1200));
      const response = await ResetPasswordAPI.verifyCode({email, otp: code})
      setResetToken(response.resetToken)
      setStep("newPassword");
    } catch (error){
      appToast.error("Erreur de verification du code", getApiErrorMessage(error))
      setOtpError("Code incorrect ou expiré. Vérifiez et réessayez.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    // TODO: await api.post("/auth/forgot-password", { email });
    try {
      
      await ResetPasswordAPI.sendResetEmail({email})
      setOtp(Array(6).fill(""));
      startCountdown();
      startResendCooldown();
    } catch (error) {
      appToast.error("Erreur de renvoi de mail", getApiErrorMessage(error))
    }
  };

  const handleResetPassword = async () => {
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPasswordLoading(true);
    try {
      // TODO: await api.post("/auth/reset-password", { email, password: newPassword });
      //await new Promise((r) => setTimeout(r, 1200));
      await ResetPasswordAPI.resetPassword({resetToken, newPassword, confirmPassword})
      if (countdownRef.current) clearInterval(countdownRef.current);
      setStep("success");
    } catch(error) {
      appToast.error("Erreur du reset ", getApiErrorMessage(error))
      setPasswordError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/auth/login")
    //setStep("email");
    setEmail("");
    setEmailError("");
    setOtp(Array(6).fill(""));
    setOtpError("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const strength = passwordStrength(newPassword);

  const features = [
    "Code de vérification à 6 chiffres",
    "Aucune donnée modifiée sans confirmation",
    "Accès rétabli instantanément",
  ];

  // ── Shared button spinner ──

  return{
    handleGoToLogin,
    strength,
    features,
    handleResetPassword, handleResend, handleSendEmail, handleVerifyCode,
    step, setStep,
      email, setEmail,
  emailError, setEmailError,
  emailLoading, setEmailLoading,

  // Step 2
  otp, setOtp,
  otpError, setOtpError,
  otpLoading, setOtpLoading,
  countdown, setCountdown,
  resendCooldown, setResendCooldown,
  countdownRef,
   resendRef,

  // Step 3
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  showNew, setShowNew,
  showConfirm, setShowConfirm,
  passwordError, setPasswordError,
  passwordLoading, setPasswordLoading

  }

}
