import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  PhoneCall,
  Activity,
  Heart,
  ShieldCheck,
  Award,
  Clock,
  MessageCircle,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Hero: React.FC = () => {
  const { clinicInfo, setIsAppointmentModalOpen } = useClinic();

  return (
    <section id="home" className="relative bg-gradient-to-b from-sky-50/70 via-white to-blue-50/40 overflow-hidden py-8 sm:py-12 lg:py-16 border-b border-slate-200">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Texts & CTAs */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            {/* Location Pill in Bengali */}
            <div className="inline-flex items-center space-x-2 bg-blue-100/90 text-blue-900 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-blue-200/80 shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-blue-700" />
              <span>{clinicInfo.addressBn}</span>
            </div>

            {/* Main Institution Title in Bengali */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] tracking-tight leading-[1.15]">
                {clinicInfo.nameBn}
              </h1>

              {/* Sub-badge for Nursing Home in Bengali */}
              <div className="mt-3 inline-block">
                <span className="bg-[#104F55] text-white text-base sm:text-xl font-bold px-4 py-1 rounded-md shadow-xs">
                  {clinicInfo.subtitleBn}
                </span>
              </div>
            </div>

            {/* Slogan & Heartbeat Line in English */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-3 text-emerald-700 font-bold text-lg sm:text-2xl">
                <span>Your Health is Our Priority & Commitment</span>
                <div className="flex items-center text-rose-500">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Pillars sub-headline in English */}
              <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                Accurate Diagnosis with Modern Tech | Renowned Specialists | Premier Patient Care
              </p>
            </div>

            {/* 3 Main Action Buttons matching reference image */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* 1. Book Appointment - Medical Blue with Calendar icon */}
              <button
                id="hero-book-appointment-btn"
                type="button"
                onClick={() => setIsAppointmentModalOpen(true)}
                className="inline-flex items-center justify-center space-x-2 bg-[#0284C7] hover:bg-[#0369A1] text-white px-5 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>

              {/* 2. Meet Our Doctors - Navy Blue with Doctors icon */}
              <a
                id="hero-doctors-btn"
                href="#doctors"
                className="inline-flex items-center justify-center space-x-2 bg-[#0B2545] hover:bg-[#133E6D] text-white px-5 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Users className="w-5 h-5 text-sky-400" />
                <span>Meet Our Doctors</span>
              </a>

              {/* 3. Call Now - Healthcare Green with Phone icon */}
              <a
                id="hero-call-now-btn"
                href={`tel:${clinicInfo.phones[0]}`}
                className="inline-flex items-center justify-center space-x-2 bg-[#1B8A44] hover:bg-[#156E36] text-white px-5 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Accurate</div>
                  <div className="text-[11px] text-slate-500">Digital Reports</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">24x7 Service</div>
                  <div className="text-[11px] text-slate-500">Emergency Care</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Specialist Team</div>
                  <div className="text-[11px] text-slate-500">All Depts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Composite Visuals */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl p-2 bg-gradient-to-br from-blue-100 via-white to-sky-100 shadow-xl border border-blue-200/70">
                <div className="grid grid-cols-12 gap-2 overflow-hidden rounded-xl">
                  {/* Hospital Exterior with banner */}
                  <div className="col-span-6 relative h-64 sm:h-80 overflow-hidden rounded-lg group">
                    <img
                      src={clinicInfo.heroImageUrl}
                      alt="Chunilal Diagnostic Building"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="bg-red-600/90 text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-1">
                        Main Center
                      </div>
                      <div className="text-xs font-bold leading-snug">
                        {clinicInfo.nameBn}
                      </div>
                      <div className="text-[10px] text-slate-200">
                        {clinicInfo.subtitleBn}
                      </div>
                    </div>
                  </div>

                  {/* Doctor & Patient Care visual */}
                  <div className="col-span-6 relative h-64 sm:h-80 overflow-hidden rounded-lg group">
                    <img
                      src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600"
                      alt="Doctor caring for patient"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="bg-emerald-600/90 text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-1">
                        Compassionate Care
                      </div>
                      <div className="text-xs font-bold leading-snug">
                        Patient-Centric Treatment
                      </div>
                      <div className="text-[10px] text-slate-200">
                        Continuous Health Monitoring
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating "Stay Healthy Always" Badge */}
                <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-xs border-2 border-sky-500 rounded-xl px-3.5 py-2 shadow-lg flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#0B2545] tracking-tight">
                      Stay Healthy Always
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>Always By Your Side</span>
                    </div>
                  </div>
                </div>

                {/* Floating Emergency Box */}
                <div className="absolute -bottom-3 -left-3 bg-[#0B2545] text-white rounded-xl px-4 py-2 shadow-lg border border-blue-700 flex items-center space-x-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <div className="text-[11px] text-slate-300 font-medium">
                      Emergency Hotline
                    </div>
                    <a
                      href={`tel:${clinicInfo.emergencyPhone}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-emerald-300 tracking-wider transition-colors"
                    >
                      {clinicInfo.emergencyPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
