import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Menu,
  X,
  Activity,
  Lock,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Header: React.FC = () => {
  const {
    clinicInfo,
    setIsAppointmentModalOpen,
    setSelectedDoctorForBooking,
    setIsAdminLoginOpen,
  } = useClinic();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenAppointment = () => {
    setIsAppointmentModalOpen(true);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#doctors', label: 'Doctors' },
    { href: '#services', label: 'Diagnostic Services' },
    { href: '#nursing-home', label: 'Nursing Home' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' },
    { href: '#admin-login', label: 'Admin Login', isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs transition-all duration-200">
      {/* Top Utility Bar - Address in Bengali as requested */}
      <div className="bg-[#0B2545] text-white text-xs sm:text-sm py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Location Landmark in Bengali with link to Google Maps */}
          <a
            href={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-slate-200 hover:text-white transition-colors group cursor-pointer"
            title="Open Nursing Home Map Location on Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 flex-shrink-0" />
            <span className="font-medium tracking-wide group-hover:underline">
              {clinicInfo.addressBn}
            </span>
            <span className="text-[10px] font-bold bg-emerald-700/70 group-hover:bg-emerald-600 text-emerald-100 px-1.5 py-0.5 rounded-xs transition-colors">
              Location Map ↗
            </span>
          </a>

          {/* Contact Numbers and WhatsApp in English */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Clickable Phone Hotline */}
            <a
              href={`tel:${clinicInfo.phones[0]}`}
              className="flex items-center space-x-1.5 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
              title="Call for enquiry"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="tracking-wider">
                {clinicInfo.phones.slice(0, 3).join(' / ')}
              </span>
            </a>

            {/* Direct WhatsApp Action */}
            <a
              href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                'Hello, I want to enquire about services at Chunilal Diagnostic Centre & Nursing Home.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Brand Logo & Title: ONLY Name in Bengali */}
        <a href="#home" className="flex items-center space-x-3 group">
          {clinicInfo.logoUrl ? (
            <img
              src={clinicInfo.logoUrl}
              alt="Chunilal Logo"
              className="w-11 h-11 sm:w-13 sm:h-13 object-contain rounded-lg shadow-xs"
            />
          ) : (
            <div className="w-11 h-11 sm:w-13 sm:h-13 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 rounded-xl flex items-center justify-center text-white shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center justify-center">
                <span className="font-extrabold text-xl leading-none text-emerald-300">✚</span>
                <Activity className="w-4 h-4 text-white -mt-1 stroke-[2.5]" />
              </div>
            </div>
          )}

          <div>
            <div className="font-black text-[#0B2545] text-base sm:text-lg lg:text-xl tracking-tight leading-tight">
              {clinicInfo.nameBn}
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="inline-block bg-blue-100 text-blue-800 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-sm">
                {clinicInfo.subtitleBn}
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                • {clinicInfo.landmarkBn}
              </span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links (Rest in English) */}
        <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) =>
            link.isSpecial ? (
              <button
                key={link.href}
                type="button"
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 hover:text-sky-900 border border-sky-200/80 transition-colors inline-flex items-center space-x-1"
              >
                <Lock className="w-3 h-3 text-sky-600" />
                <span>{link.label}</span>
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 py-1.5 rounded-md text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <span>{link.label}</span>
              </a>
            )
          )}
        </nav>

        {/* Action Button: Book Appointment matching reference image */}
        <div className="hidden sm:flex items-center space-x-2.5">
          <button
            id="header-book-appointment-btn"
            onClick={handleOpenAppointment}
            className="inline-flex items-center space-x-2 bg-[#0284C7] hover:bg-[#0369A1] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) =>
              link.isSpecial ? (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminLoginOpen(true);
                  }}
                  className="px-3 py-2 text-sm font-semibold rounded-md flex items-center space-x-2 text-sky-700 bg-sky-50 font-bold text-left w-full"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>{link.label}</span>
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold rounded-md flex items-center space-x-2 text-slate-800 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>{link.label}</span>
                </a>
              )
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={handleOpenAppointment}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-xs"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Book on WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
