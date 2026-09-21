import React from 'react';
import {
  HeartHandshake,
  UserCheck,
  Sparkles,
  ShieldAlert,
  Bed,
  PhoneCall,
  Calendar,
  MessageCircle,
  MapPin,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const NursingHomeSection: React.FC = () => {
  const { facilities, clinicInfo, setIsAppointmentModalOpen } = useClinic();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return HeartHandshake;
      case 'UserCheck':
        return UserCheck;
      case 'Sparkles':
        return Sparkles;
      case 'ShieldAlert':
        return ShieldAlert;
      default:
        return Bed;
    }
  };

  return (
    <section id="nursing-home" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hospital bed photo & Inpatient highlights */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800"
                alt="Chunilal Nursing Home Care"
                className="w-full h-72 sm:h-88 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-block bg-[#104F55] text-white text-xs font-bold px-3 py-1 rounded-sm shadow-xs">
                    {clinicInfo.subtitleBn}
                  </span>
                  <a
                    href={clinicInfo.nursingHomeMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-sm backdrop-blur-xs transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-emerald-200" />
                    <span>Google Maps Location ↗</span>
                  </a>
                </div>
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  24-Hour Compassionate Inpatient Care and Medical Attention
                </h3>
              </div>
            </div>

            {/* Quick Status Tag */}
            <div className="absolute -top-3 -left-2 sm:-left-3 bg-white px-3.5 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-800">
                Cabins & Beds Available
              </span>
            </div>
          </div>

          {/* Right Column: Facilities list */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Bed className="w-3.5 h-3.5" />
                <span>Inpatient Healthcare Wing</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
                {clinicInfo.subtitleBn}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1">
                Ensuring prompt recovery with round-the-clock trained nurses, attending doctors, and clean sanitary accommodations.
              </p>
            </div>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((fac) => {
                const Icon = getIcon(fac.iconName);
                return (
                  <div
                    key={fac.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 mb-1.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {fac.titleEn || fac.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {fac.descriptionEn || fac.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action buttons with Google Maps location */}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              <a
                href={`tel:${clinicInfo.emergencyPhone}`}
                className="inline-flex items-center space-x-2 bg-[#104F55] hover:bg-[#0B3A3E] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-xs transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call for Admission</span>
              </a>

              <a
                href={`https://wa.me/${clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp}?text=${encodeURIComponent(
                  'Hello, I would like to inquire about inpatient bed booking / admission at Chunilal Nursing Home.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Book Inpatient Bed</span>
              </a>

              <a
                href={clinicInfo.nursingHomeMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#0066CC] hover:bg-[#0052A3] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Navigation className="w-4 h-4 text-emerald-300" />
                <span>Nursing Home Map Location</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
