import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  GraduationCap,
  Stethoscope,
  Search,
  MessageCircle,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const DoctorsSection: React.FC = () => {
  const {
    doctors,
    clinicInfo,
    handleDoctorBooking,
  } = useClinic();

  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = [
    { id: 'all', label: 'All Departments' },
    { id: 'মেডিসিন', label: 'General Medicine' },
    { id: 'স্ত্রীরোগ ও প্রসূতি', label: 'Gynecology & Obstetrics' },
    { id: 'প্যাথলজি', label: 'Pathology' },
    { id: 'হৃদরোগ বিশেষজ্ঞ', label: 'Cardiology' },
    { id: 'শিশুরোগ বিশেষজ্ঞ', label: 'Pediatrics' },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept =
      selectedDept === 'all' ||
      doc.department.toLowerCase().includes(selectedDept.toLowerCase()) ||
      (doc.departmentEn && doc.departmentEn.toLowerCase().includes(selectedDept.toLowerCase()));

    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.nameEn && doc.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.degrees.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesSearch;
  });

  const bookingCta = clinicInfo.bookingCta || {
    doctorCtaText: 'Book Appointment',
    doctorCtaAction: 'modal',
    doctorShowSecondaryAction: true,
    doctorSecondaryType: 'whatsapp',
  };

  const whatsappNum = bookingCta.customWhatsapp || clinicInfo.whatsapp;
  const generalPhone = bookingCta.customPhone || clinicInfo.phones[0];

  return (
    <section id="doctors" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Specialist Medical Panel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
              Our Specialist Doctors
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Consult leading specialist physicians and surgeons with flexible OPD visiting schedules.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedDept === dept.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const ctaButtonText = doctor.ctaLabel || bookingCta.doctorCtaText || 'Book Appointment';
            const effectiveAction = (doctor.ctaAction && doctor.ctaAction !== 'default')
              ? doctor.ctaAction
              : bookingCta.doctorCtaAction;

            const docPhone = doctor.phone || generalPhone;
            const docName = doctor.nameEn || doctor.name;
            const docDept = doctor.departmentEn || doctor.department;

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Doctor Header & Portrait */}
                  <div className="p-5 pb-3 flex items-start space-x-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.nameEn || doctor.name}
                        className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                      />
                      {doctor.isAvailable && (
                        <span
                          className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                          title="Available"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded-sm mb-1">
                        {doctor.departmentEn || doctor.department}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#0B2545] truncate group-hover:text-blue-700 transition-colors">
                        {doctor.nameEn || doctor.name}
                      </h3>
                      {doctor.name && doctor.nameEn && (
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {doctor.name}
                        </p>
                      )}
                      <div className="flex items-center space-x-1 text-slate-500 text-xs mt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-medium truncate">{doctor.degrees}</span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="p-5 space-y-2.5 text-xs sm:text-sm">
                    {/* Days */}
                    <div className="flex items-start space-x-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 font-medium">Visiting Days: </span>
                        <span className="font-bold text-slate-900">
                          {doctor.scheduleEn || doctor.schedule}
                        </span>
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="flex items-start space-x-2 text-slate-700">
                      <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-500 font-medium">Visiting Time: </span>
                        <span className="font-bold text-slate-900">
                          {doctor.timingEn || doctor.timing}
                        </span>
                      </div>
                    </div>

                    {doctor.roomNo && (
                      <div className="text-[11px] text-slate-500 font-medium pt-1">
                        OPD Chamber: <span className="font-bold text-slate-700">{doctor.roomNo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customizable Call To Action Buttons */}
                <div className="p-5 pt-0 flex items-center space-x-2">
                  {/* Primary CTA Button (Configured via Admin Panel) */}
                  <button
                    onClick={() => handleDoctorBooking(doctor)}
                    className="flex-1 bg-[#0066CC] hover:bg-[#0052A3] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 group-hover:bg-blue-600"
                  >
                    {effectiveAction === 'whatsapp' ? (
                      <MessageCircle className="w-4 h-4 text-emerald-300" />
                    ) : effectiveAction === 'call' ? (
                      <Phone className="w-4 h-4 text-amber-300" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    <span>{ctaButtonText}</span>
                  </button>

                  {/* Secondary Quick Action Button (Configurable via Admin Panel) */}
                  {bookingCta.doctorShowSecondaryAction && (
                    <>
                      {bookingCta.doctorSecondaryType === 'whatsapp' ? (
                        <a
                          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                            `Hello, I want to book an appointment with ${docName} (${docDept}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-colors shadow-2xs"
                          title="Instant WhatsApp Inquiry"
                        >
                          <MessageCircle className="w-4 h-4 fill-emerald-500 text-white" />
                        </a>
                      ) : (
                        <a
                          href={`tel:${docPhone}`}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 flex items-center justify-center transition-colors shadow-2xs"
                          title="Call Doctor Desk"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">
              No doctors found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
