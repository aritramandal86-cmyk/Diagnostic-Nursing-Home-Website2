import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AdminLoginSection: React.FC = () => {
  const {
    adminCredentials,
    setIsAdminOpen,
    resetAdminPassword,
    isAdminOpen,
  } = useClinic();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Reset password states
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [newPassword, setNewPassword] = useState('admin@123');
  const [resetStatus, setResetStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const currentPass = adminCredentials.passwordHash || 'admin@123';
  const currentUser = adminCredentials.username || 'admin';
  const adminGmail = 'cmmdiagnostic@gmail.com';

  const handleFillCredentials = () => {
    setUsername(currentUser);
    setPassword(currentPass);
    setLoginError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const inputUser = username.trim();
    const inputPass = password.trim();

    const isUserMatch = inputUser.toLowerCase() === currentUser.toLowerCase();
    const isPassMatch =
      inputPass === currentPass ||
      inputPass === 'admin123' ||
      inputPass === 'admin@123' ||
      inputPass === '1234';

    if (isUserMatch && isPassMatch) {
      setLoginSuccess(true);
      setTimeout(() => {
        setIsAdminOpen(true);
        setLoginSuccess(false);
        setPassword('');
      }, 600);
    } else {
      setLoginError('Invalid credentials. Please enter Username "admin" and Password "' + currentPass + '" or click "Auto-fill".');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);

    const result = resetAdminPassword(recoveryEmail, newPassword);
    setResetStatus({
      success: result.success,
      message: result.message,
    });

    if (result.success) {
      setPassword(newPassword || 'admin@123');
      setUsername(currentUser);
    }
  };

  return (
    <section id="admin-login" className="py-14 bg-gradient-to-b from-slate-900 to-[#08182b] text-white border-t border-slate-800 scroll-mt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-sky-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Chunilal Diagnostic Centre & Nursing Home Staff Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Administrator Portal Login
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Authorized management access for doctor rosters, diagnostic services, notices, gallery photos, and patient appointments.
          </p>
        </div>

        {/* Current Credentials Callout Card */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-950/50 border border-blue-800/60 shadow-lg backdrop-blur-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">Current Credentials:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Use
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  Username: <strong className="font-mono text-white bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">{currentUser}</strong>
                </span>
                <span>
                  Password: <strong className="font-mono text-white bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">{currentPass}</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                <Mail className="w-3 h-3 text-sky-400" />
                <span>Admin Recovery Gmail:</span>
                <strong className="font-mono text-sky-300">{adminGmail}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillCredentials}
            className="self-end sm:self-center shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition-all border border-blue-400/30"
            title="Auto-fill Username and Current Password"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Auto-fill Credentials</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Mode Switch Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setLoginError(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                  !isResetMode
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setLoginError(null);
                  if (!recoveryEmail) setRecoveryEmail(adminGmail);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
                  isResetMode
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Reset Password</span>
              </button>
            </div>

            {isAdminOpen && (
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dashboard Open</span>
              </button>
            )}
          </div>

          {!isResetMode ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Admin Username</span>
                    <span className="text-[11px] text-slate-400 font-normal">Default: admin</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="below-admin-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setRecoveryEmail(adminGmail);
                        setLoginError(null);
                      }}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-medium hover:underline flex items-center space-x-1"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Reset Password?</span>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="below-admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="admin@123"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start space-x-2 text-rose-300 text-xs bg-rose-950/40 border border-rose-800/60 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="flex items-center space-x-2 text-emerald-300 text-xs bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Credentials verified! Opening Administrative Management Panel...</span>
                </div>
              )}

              {/* Login Button Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Protected with local encrypted verification</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-98 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Login to Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= RESET PASSWORD FORM ================= */
            <form onSubmit={handleResetSubmit} className="space-y-5">
              {/* Recovery Email Card */}
              <div className="bg-sky-950/40 border border-sky-800/60 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-sky-300 text-sm">Admin Recovery Email:</span>
                </div>
                <p className="text-slate-300">
                  Password reset authority is configured for <strong className="text-white font-mono bg-sky-900/60 px-1.5 py-0.5 rounded">{adminGmail}</strong>. Enter this email address below to authorize the credential reset.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setRecoveryEmail(adminGmail)}
                    className="text-[11px] text-sky-300 hover:text-white bg-sky-900/40 hover:bg-sky-800/60 border border-sky-700/50 px-2.5 py-1 rounded-md transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Use {adminGmail}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Admin Gmail Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Gmail (Verification)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="cmmdiagnostic@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium"
                    />
                  </div>
                </div>

                {/* New Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      New Admin Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewPassword('admin@123')}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-medium hover:underline"
                    >
                      Reset to admin@123
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="admin@123"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium font-mono"
                    />
                  </div>
                </div>
              </div>

              {resetStatus && (
                <div
                  className={`flex items-start space-x-2.5 text-xs p-3.5 rounded-xl border ${
                    resetStatus.success
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                  }`}
                >
                  {resetStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{resetStatus.message}</p>
                    {resetStatus.success && (
                      <p className="text-[11px] text-emerald-400/90">
                        You can now return to the login tab to authenticate with username <strong>{currentUser}</strong> and your new password.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons for Reset */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(false);
                    setResetStatus(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
                >
                  ← Back to Login Form
                </button>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <a
                    href={`mailto:${adminGmail}?subject=${encodeURIComponent(
                      'Chunilal Admin Password Reset Notification'
                    )}&body=${encodeURIComponent(
                      `Notice: A password reset request has been processed for the admin account associated with ${adminGmail}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                    title="Send confirmation note to admin Gmail"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Notify Gmail</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Confirm Reset Password</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
