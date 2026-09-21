import React from 'react';
import {
  Microscope,
  Award,
  Users2,
  CheckCircle2,
  Calendar,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AboutSection: React.FC = () => {
  const { clinicInfo, setIsAppointmentModalOpen } = useClinic();

  const keyPoints = [
    'Digital Imaging & Fully Automated Pathology Tests',
    'Senior Consultant Physicians, Surgeons & Specialists',
    'Clean & Hygienic AC / Non-AC Inpatient Cabins',
    '24x7 Oxygen Facility & Prompt Emergency Assistance',
  ];

  return (
    <section id="about" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image with badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={clinicInfo.aboutImageUrl}
                alt="Chunilal Diagnostic Laboratory"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/85 via-transparent to-transparent" />

              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Microscope className="w-4 h-4" />
                  <span>Advanced Pathology Lab</span>
                </div>
                <div className="text-sm sm:text-base font-bold">
                  Automated Computerized Accurate Diagnostic Testing
                </div>
              </div>
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-emerald-600 text-white rounded-xl p-3 sm:p-4 shadow-lg flex items-center space-x-3">
              <Award className="w-8 h-8 text-emerald-200 flex-shrink-0" />
              <div>
                <div className="text-lg sm:text-xl font-extrabold leading-tight">
                  Trusted Healthcare
                </div>
                <div className="text-[11px] text-emerald-100">
                  {clinicInfo.addressBn}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Users2 className="w-3.5 h-3.5" />
                <span>About Our Medical Center</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                About Us
              </h2>
            </div>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              {clinicInfo.aboutTextEn}
            </p>

            <div className="bg-sky-50/80 border-l-4 border-sky-600 p-4 rounded-r-lg">
              <p className="text-slate-800 font-medium text-sm sm:text-base italic">
                "{clinicInfo.aboutMissionEn}"
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {keyPoints.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={`https://wa.me/${clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp}?text=${encodeURIComponent(
                  'Hello, I would like to book a doctor consultation at Chunilal Diagnostic Centre & Nursing Home.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Book Consultation</span>
              </a>
              <a
                href="#services"
                className="inline-flex items-center space-x-1.5 text-blue-700 hover:text-blue-900 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span>View All Diagnostic Tests</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
