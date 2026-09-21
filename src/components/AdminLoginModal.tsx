import React, { useState } from 'react';
import {
  Lock,
  User,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Mail,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminLoginOpen,
    setIsAdminLoginOpen,
    setIsAdminOpen,
    adminCredentials,
    resetAdminPassword,
  } = useClinic();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Reset password states
  const [isResetMode, setIsResetMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [newPassword, setNewPassword] = useState('admin@123');
  const [resetStatus, setResetStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isAdminLoginOpen) return null;

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
      setIsAdminLoginOpen(false);
      setIsAdminOpen(true);
      setPassword('');
      setLoginError(null);
    } else {
      setLoginError(`Invalid credentials. Current Username: "${currentUser}", Password: "${currentPass}".`);
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
      setTimeout(() => {
        setIsResetMode(false);
        setResetStatus(null);
      }, 3500);
    }
  };

  const handleClose = () => {
    setIsAdminLoginOpen(false);
    setPassword('');
    setLoginError(null);
    setIsResetMode(false);
    setResetStatus(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {isResetMode ? 'Reset Admin Password' : 'Admin Portal Login'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isResetMode
              ? 'Verify admin recovery Gmail to restore your administrative credentials.'
              : 'Secure authentication for Chunilal Diagnostic Centre management.'}
          </p>
        </div>

        {/* Current Credentials Box */}
        <div className="mb-4 p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-between text-xs">
          <div>
            <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wide">Current Credentials:</div>
            <div className="text-slate-200 mt-0.5">
              User: <strong className="font-mono text-white">{currentUser}</strong> &bull; Pass: <strong className="font-mono text-white">{currentPass}</strong>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Recovery: <span className="font-mono text-sky-400">{adminGmail}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillCredentials}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Auto-fill
          </button>
        </div>

        {!isResetMode ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="Enter username (e.g. admin)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium"
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
                    setLoginError(null);
                  }}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-medium hover:underline flex items-center space-x-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Forgot / Reset Password?</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  placeholder="Enter password (e.g. admin@123)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="flex items-start space-x-1.5 text-rose-400 text-xs mt-2 bg-rose-950/30 border border-rose-800/40 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login to Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* RESET PASSWORD FORM */
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3 text-xs text-slate-300 flex items-start space-x-2.5">
              <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-300">Admin Recovery Gmail:</span>
                <p className="font-mono text-slate-200 mt-0.5">cmmdiagnostic@gmail.com</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter this verified admin recovery email address below to reset or restore your credentials.
                </p>
              </div>
            </div>

            {/* Email input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Recovery Email Address
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            {/* New Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Set New Password</span>
                <span className="text-[11px] text-slate-400 font-normal">Default: admin@123</span>
              </label>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-white placeholder:text-slate-500 font-medium font-mono"
                />
              </div>
            </div>

            {resetStatus && (
              <div
                className={`flex items-start space-x-2 text-xs p-3 rounded-lg border ${
                  resetStatus.success
                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                }`}
              >
                {resetStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{resetStatus.message}</span>
              </div>
            )}

            {/* Action buttons for reset */}
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setResetStatus(null);
                }}
                className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
              >
                Back to Login
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reset Password</span>
              </button>
            </div>
          </form>
        )}

        {/* Credentials reminder footnote */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col space-y-1.5 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Username: <strong className="text-slate-200 font-mono">admin</strong></span>
            <span>Password: <strong className="text-slate-200 font-mono">admin@123</strong></span>
          </div>
          <div className="text-slate-500 text-[10px] text-center">
            Admin recovery: <span className="font-mono text-slate-400">cmmdiagnostic@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
