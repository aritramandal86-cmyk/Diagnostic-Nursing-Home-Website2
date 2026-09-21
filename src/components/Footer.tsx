import React from 'react';
import {
  Heart,
  Facebook,
  Youtube,
  MessageCircle,
  Instagram,
  Lock,
  FileCode2,
  MapPin,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Footer: React.FC = () => {
  const { clinicInfo, setIsAdminLoginOpen, setIsPromptModalOpen } = useClinic();

  return (
    <footer className="bg-[#0B2545] text-white border-t border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-blue-900/80 pb-8">
          {/* Logo & Identity with Bengali Name and Address */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
                ✚
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight leading-snug">
                  {clinicInfo.nameBn}
                </h3>
                <span className="text-xs text-sky-400 font-semibold">
                  {clinicInfo.subtitleBn}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {clinicInfo.addressBn}
            </p>
            <div>
              <a
                href={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-sky-400 hover:text-white hover:underline transition-colors font-medium mt-1"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nursing Home Map Location (Google Maps) ↗</span>
              </a>
            </div>
          </div>

          {/* Tagline & Social icons */}
          <div className="md:col-span-6 flex flex-col md:items-end space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Your Health is Our Priority & Commitment</span>
            </div>

            {/* Social Icons matching bottom-right of image */}
            <div className="flex items-center space-x-3">
              <a
                href={clinicInfo.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-blue-600/60 hover:bg-blue-600 flex items-center justify-center transition-colors text-white"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={clinicInfo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-red-600/60 hover:bg-red-600 flex items-center justify-center transition-colors text-white"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${clinicInfo.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600/60 hover:bg-emerald-600 flex items-center justify-center transition-colors text-white"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-pink-600/60 hover:bg-pink-600 flex items-center justify-center transition-colors text-white"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Nav Links Row in English */}
        <div className="py-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-300 font-medium">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <span>•</span>
          <a href="#about" className="hover:text-white transition-colors">About Us</a>
          <span>•</span>
          <a href="#doctors" className="hover:text-white transition-colors">Doctors</a>
          <span>•</span>
          <a href="#services" className="hover:text-white transition-colors">Diagnostic Services</a>
          <span>•</span>
          <a href="#nursing-home" className="hover:text-white transition-colors">Nursing Home</a>
          <span>•</span>
          <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
          <span>•</span>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          <span>•</span>
          <button
            id="footer-admin-login-btn"
            type="button"
            onClick={() => setIsAdminLoginOpen(true)}
            className="text-sky-300 hover:text-white font-semibold flex items-center space-x-1 hover:underline transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Login</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="text-amber-400/90 hover:text-amber-300 font-semibold flex items-center space-x-1"
          >
            <FileCode2 className="w-3 h-3" />
            <span>AI Studio Prompt</span>
          </button>
        </div>

        {/* Bottom Bar: Overlooked, discreet staff login button embedded naturally */}
        <div className="pt-3 text-[11px] text-slate-400/80 border-t border-blue-950 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} {clinicInfo.nameBn}. All Rights Reserved.
          </p>

          <div className="flex items-center space-x-3 text-slate-500 text-[10px]">
            <span>Medical Diagnostics & Inpatient Care</span>
            {/* Extremely discreet, overlooked admin login button */}
            <button
              id="discreet-admin-login-btn"
              onClick={() => setIsAdminLoginOpen(true)}
              aria-label="Staff Login"
              title="Staff Access"
              className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded focus:outline-hidden"
            >
              <Lock className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
