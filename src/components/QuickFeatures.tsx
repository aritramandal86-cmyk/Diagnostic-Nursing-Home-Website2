import React from 'react';
import {
  Stethoscope,
  Building2,
  Microscope,
  Bed,
  CalendarCheck2,
  PhoneCall,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const QuickFeatures: React.FC = () => {
  const { clinicInfo } = useClinic();

  const handleWhatsAppBooking = () => {
    const whatsappNum = clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp;
    const text = 'Hello, I would like to book an appointment at Chunilal Diagnostic Centre & Nursing Home.';
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const features = [
    {
      id: 'doc-feat',
      href: '#doctors',
      icon: Stethoscope,
      iconBg: 'bg-blue-600',
      title: 'Specialist Doctors',
      desc: 'Experienced Consultants',
      borderAccent: 'hover:border-blue-500',
    },
    {
      id: 'opd-feat',
      href: '#doctors',
      icon: Building2,
      iconBg: 'bg-emerald-600',
      title: 'OPD Services',
      desc: 'Multi-Specialty Clinic',
      borderAccent: 'hover:border-emerald-500',
    },
    {
      id: 'diag-feat',
      href: '#services',
      icon: Microscope,
      iconBg: 'bg-indigo-600',
      title: 'Diagnostic Tests',
      desc: 'Accurate & High Precision',
      borderAccent: 'hover:border-indigo-500',
    },
    {
      id: 'nurse-feat',
      href: '#nursing-home',
      icon: Bed,
      iconBg: 'bg-rose-600',
      title: 'Nursing Home',
      desc: 'Hygienic Inpatient Care',
      borderAccent: 'hover:border-rose-500',
    },
    {
      id: 'appt-feat',
      onClick: handleWhatsAppBooking,
      icon: CalendarCheck2,
      iconBg: 'bg-emerald-600',
      title: 'Appointments',
      desc: 'Book on WhatsApp',
      borderAccent: 'hover:border-emerald-500',
    },
    {
      id: 'contact-feat',
      href: '#contact',
      icon: PhoneCall,
      iconBg: 'bg-teal-600',
      title: 'Contact & Help',
      desc: '24x7 Emergency Assistance',
      borderAccent: 'hover:border-teal-500',
    },
  ];

  return (
    <section className="bg-slate-100 py-6 sm:py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            const content = (
              <div
                className={`p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group cursor-pointer h-full justify-between ${feat.borderAccent}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feat.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-200 mb-3`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-tight">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );

            if (feat.onClick) {
              return (
                <button
                  key={feat.id}
                  id={feat.id}
                  onClick={feat.onClick}
                  type="button"
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            }

            return (
              <a key={feat.id} id={feat.id} href={feat.href} className="block">
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
