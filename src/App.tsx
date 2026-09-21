import React from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { Hero } from './components/Hero';
import { QuickFeatures } from './components/QuickFeatures';
import { AboutSection } from './components/AboutSection';
import { DoctorsSection } from './components/DoctorsSection';
import { ServicesSection } from './components/ServicesSection';
import { NursingHomeSection } from './components/NursingHomeSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PromptModal } from './components/PromptModal';
import { MessageCircle, Calendar } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { clinicInfo, setIsAppointmentModalOpen } = useClinic();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Emergency & Special Notice Ticker */}
      <NoticeBanner />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* 6 Quick Features Row */}
        <QuickFeatures />

        {/* About Section */}
        <AboutSection />

        {/* Doctors Section */}
        <DoctorsSection />

        {/* Diagnostic Services Section */}
        <ServicesSection />

        {/* Nursing Home Inpatient Section */}
        <NursingHomeSection />

        {/* Gallery Section */}
        <GallerySection />

        {/* Contact & Map Section */}
        <ContactSection />
      </main>

      {/* Footer with Discreet Overlooked Admin Login Link */}
      <Footer />

      {/* Interactive Modals */}
      <AppointmentModal />
      <AdminLoginModal />
      <AdminPanel />
      <PromptModal />

      {/* Floating Action Buttons: Purely user-facing (WhatsApp & Quick Booking) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col space-y-2.5 items-end">
        {/* Floating Quick Book Appointment Button */}
        <a
          id="floating-book-btn"
          href={`https://wa.me/${clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp}?text=${encodeURIComponent(
            'Hello, I would like to book an appointment at Chunilal Diagnostic Centre & Nursing Home.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group flex items-center space-x-2"
          title="Book on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
            Book on WhatsApp
          </span>
        </a>

        {/* Floating WhatsApp Button */}
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
            'Hello, I want to inquire about Chunilal Diagnostic Centre & Nursing Home.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1ebd5a] text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center animate-bounce-slow"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <MainLayout />
    </ClinicProvider>
  );
}
