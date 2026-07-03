"use client";

import Stepper from "../../widget/stepper";
import useResetPassword from "../../hooks/useResetPassword";
import Spinner from "../../widget/spinner";
import OtpInput from "../../widget/OTPInput";
import AuthStep from "../../widget/resetStep";
import { formatCountdown } from "../../helpers/formatCountDown";
import { Check, Clock, Eye,  EyeOff, Home, KeyRound, Lock, LogIn, Mail, Send, Shield, ShieldCheck } from "lucide-react";


export default function ResetPasswordPage() {
 
    const {
    handleGoToLogin,
    strength,
    features,
    handleResetPassword, handleResend, handleSendEmail, handleVerifyCode,
    step, setStep,
    email, setEmail,
    emailError, 
    emailLoading,

    // Step 2
    otp, setOtp,
    otpError, 
    otpLoading, 
    countdown,
    resendCooldown,

    // Step 3
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    passwordError, 
    passwordLoading

  } = useResetPassword()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-4xl min-h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-100">

        {/* ── Left panel ── */}
        <div className="relative flex-1 bg-[#0a1628] flex flex-col justify-between p-10 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)" }} />

          {/* Brand */}
          <div className="relative flex items-center gap-3 z-10">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home
                  className="text-white"
                  size={25}
                  strokeWidth={2}
                />
            </div>
            <div>
              <div className="text-white text-sm font-medium tracking-wide">KERP</div>
              <div className="text-white/40 text-[10px] tracking-widest uppercase">Système ERP</div>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <h1 className="text-white text-2xl font-medium leading-snug mb-3">
              Récupérez<br />
              votre <span className="text-blue-500">accès</span>
            </h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Réinitialisez votre mot de passe en quelques instants pour reprendre la gestion de votre entreprise.
            </p>
          </div>

          {/* Features */}
          <div className="relative z-10 flex flex-col gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-white/45 text-xs">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-[340px] bg-white flex flex-col justify-center px-8 py-10">

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <>
            <div className="flex flex-col">
              <Stepper current="email" />

              <button
                onClick={handleGoToLogin}
                className="cursor-pointer flex items-center gap-1.5 text-gray-400 hover:text-gray-500 text-xs mb-6 w-fit transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Retour à la connexion
              </button>


            <AuthStep
                asForm
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendEmail();
                }}
                icon={
                <Lock
                  className="text-blue-600"
                  size={20}
                  strokeWidth={2}
                />

                }
                title="Mot de passe oublié ?"
                description="Entrez votre adresse e-mail pour recevoir un code de vérification."
                error={emailError}
                submitButton={

                    <button
                    type="submit"
                    disabled={emailLoading|| !email}
                    className="cursor-pointer w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <Send className="h-4 w-4"/>
                    {emailLoading ? "Envoi en cours..." : "Envoyer le code"}
                    </button>
                }
                footer={
                    <p className="text-[10px] text-gray-300 text-center">
                    Accès réservé aux utilisateurs autorisés · KERP v1.0
                    </p>
                }
                >
                    
                    {emailError && (
                <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  {emailError}
                </div>
              )}

              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Adresse e-mail
              </label>
              <div className="relative mb-5">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={15}
                  strokeWidth={2}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                  placeholder="oumaima@kouka.tn"
                  className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                />
              </div>



            </AuthStep>
              </div>
            </>
          )}

          {/* ── STEP 2: OTP Code ── */}
          {step === "code" && (
            <div className="flex flex-col">
              <Stepper current="code" />

              
            <AuthStep
                asForm
                onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyCode();
                }}
                icon={
                <KeyRound
                  className="text-blue-600"
                  size={20}
                  strokeWidth={2}
                />
                }
                title="Vérification"
                description={
                    <>
                    Entrez le code à 6 chiffres envoyé à{" "}
                    <span className="font-medium text-gray-600">
                        {email}
                    </span>
                    </>
                }
                error={otpError}
                submitButton={
                    <button
                        type="submit"
                        disabled={otpLoading || otp.join("").length < 6}
                        className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition mb-3"
                    >
                        {otpLoading ? <Spinner /> : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        )}
                        {otpLoading ? "Vérification..." : "Confirmer le code"}
                    </button>
                }
                secondaryButton={
                    <button
                        onClick={() => setStep("email")}
                        className="w-full h-9 bg-white hover:bg-gray-50 text-gray-500 text-xs border border-gray-200 rounded-lg flex items-center justify-center gap-1.5 transition"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Modifier l&apos;adresse e-mail
                    </button>
                }
                >
                {otpError && (
                    <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                    {otpError}
                    </div>
                )}

                <div className="mb-4">
                    <OtpInput value={otp} onChange={setOtp} />
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                    <Clock
                      className="text-gray-600"
                      size={14}
                      strokeWidth={2.2}
                    />

                    <span className="tabular-nums font-medium">
                        {countdown > 0 ? formatCountdown(countdown) : "Expiré"}
                    </span>
                    </div>

                    {resendCooldown > 0 ? (
                    <span className="text-[11px] text-gray-400 tabular-nums">
                        Renvoyer dans {resendCooldown}s
                    </span>
                    ) : (
                    <button
                        onClick={handleResend}
                        className="text-[12px] text-blue-600 hover:underline"
                    >
                        Renvoyer le code
                    </button>
                    )}
                </div>
            </AuthStep>

              
            </div>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === "newPassword" && (
            <div className="flex flex-col">
              <Stepper current="newPassword" />
                   
                <AuthStep
                    asForm
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleResetPassword();
                    }}
                    icon={
                        <ShieldCheck
                          className="text-blue-600"
                          size={20}
                          strokeWidth={2}
                        />

                    }
                    title="Nouveau mot de passe"
                    description="Choisissez un mot de passe fort pour sécuriser votre compte."
                    error={passwordError}
                    submitButton={
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
                        >
                            {passwordLoading ? <Spinner /> : (
                           <Shield
                            className="text-white-600"
                            size={14}
                            strokeWidth={2.2}
                          />

                            )}
                            {passwordLoading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
                        </button>
                    }
                    footer={
                        <p className="text-[10px] text-gray-300 text-center">
                        Accès réservé aux utilisateurs autorisés · KERP v1.0
                        </p>
                    }
                    >
                    
                    {passwordError && (
                    <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                    {passwordError}
                    </div>
                )}

                {/* New password */}
                <div className="mb-1">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Nouveau mot de passe
                    </label>
                    <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={15}
                      strokeWidth={2}
                    />
                    <input
                        type={showNew ? "text" : "password"}
                        name={"new-password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10 pl-9 pr-9 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNew ? (
                          <EyeOff
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                            size={15}
                            strokeWidth={2}
                          />
                        ) : (
                        <Eye
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                            size={15}
                            strokeWidth={2}
                          />
                        )}
                    </button>
                    </div>
                </div>

                {/* Strength bar */}
                {newPassword.length > 0 && (
                    <div className="mb-3 mt-2">
                    <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((n) => (
                        <div
                            key={n}
                            className={[
                            "h-1 flex-1 rounded-full transition-all",
                            strength.score >= n ? strength.color : "bg-gray-200",
                            ].join(" ")}
                        />
                        ))}
                    </div>
                    {strength.label && (
                        <p className="text-[11px] text-gray-400">
                        Sécurité : <span className="font-medium text-gray-600">{strength.label}</span>
                        </p>
                    )}
                    </div>
                )}

                {/* Confirm password */}
                <div className="mb-5">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                    Confirmer le mot de passe
                    </label>
                    <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={15}
                      strokeWidth={2}
                    />
                    <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                        placeholder="••••••••"
                        className={[
                        "w-full h-10 pl-9 pr-9 text-sm border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-300 outline-none focus:ring-2 transition",
                        confirmPassword && confirmPassword !== newPassword
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : confirmPassword && confirmPassword === newPassword
                            ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/10",
                        ].join(" ")}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? (
                        <EyeOff
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                            size={15}
                            strokeWidth={2}
                          />
                        ) : (
                        <Eye
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400"
                            size={15}
                            strokeWidth={2}
                          />
                        )}
                    </button>
                    </div>
                </div>
                </AuthStep>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center">
              <Stepper current="success" />

              {/* Animated success circle */}
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5 ring-8 ring-green-50/60">
                <Check
                  className="text-emerald-600"
                  size={25}
                  strokeWidth={2}
                />

              </div>

              <h2 className="text-gray-900 text-xl font-medium mb-2">
                Mot de passe réinitialisé !
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-[220px]">
                Votre mot de passe a été mis à jour avec succès.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[220px]">
                Vous pouvez maintenant vous connecter avec vos nouveaux identifiants.
              </p>

              <button
                onClick={handleGoToLogin}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
              >
                <LogIn
                  className="text-white-600"
                  size={14}
                  strokeWidth={2.2}
                />

                Se connecter
              </button>

              <p className="text-[10px] text-gray-300 text-center mt-6">
                Accès réservé aux utilisateurs autorisés · KERP v1.0
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}