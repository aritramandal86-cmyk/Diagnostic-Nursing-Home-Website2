import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  Activity,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const AppointmentModal: React.FC = () => {
  const {
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    clinicInfo,
    doctors,
    services,
    selectedDoctorForBooking,
    selectedTestForBooking,
    setSelectedDoctorForBooking,
    setSelectedTestForBooking,
    bookAppointment,
  } = useClinic();

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [bookingType, setBookingType] = useState<'doctor' | 'service'>('doctor');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM - 1:00 PM)');
  const [message, setMessage] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedAppointment, setSubmittedAppointment] = useState<{
    id: string;
    waUrl: string;
    doctorName?: string;
    serviceName?: string;
  } | null>(null);

  // Sync initial doctor/service selection when modal opens
  useEffect(() => {
    if (isAppointmentModalOpen) {
      if (selectedDoctorForBooking) {
        setBookingType('doctor');
        setSelectedDoctorId(selectedDoctorForBooking);
      } else if (selectedTestForBooking) {
        setBookingType('service');
        setSelectedServiceId(selectedTestForBooking);
      } else if (doctors.length > 0 && !selectedDoctorId) {
        setSelectedDoctorId(doctors[0].id);
      }

      // Default to today's date if empty
      if (!preferredDate) {
        const today = new Date().toISOString().split('T')[0];
        setPreferredDate(today);
      }
      setValidationError(null);
      setSubmittedAppointment(null);
    }
  }, [isAppointmentModalOpen, selectedDoctorForBooking, selectedTestForBooking, doctors]);

  if (!isAppointmentModalOpen) return null;

  const whatsappNum = clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp;
  const primaryPhone = clinicInfo.phones[0] || '8159895030';

  const handleClose = () => {
    setIsAppointmentModalOpen(false);
    setSelectedDoctorForBooking(null);
    setSelectedTestForBooking(null);
    setValidationError(null);
    setSubmittedAppointment(null);
  };

  const validatePhone = (num: string) => {
    const clean = num.replace(/\D/g, '');
    return clean.length >= 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!patientName.trim()) {
      setValidationError('Please enter patient name.');
      return;
    }

    if (!patientPhone.trim() || !validatePhone(patientPhone)) {
      setValidationError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!preferredDate) {
      setValidationError('Please select a preferred appointment date.');
      return;
    }

    const docObj = doctors.find((d) => d.id === selectedDoctorId);
    const srvObj = services.find((s) => s.id === selectedServiceId);

    const doctorName = bookingType === 'doctor' && docObj ? `${docObj.nameEn || docObj.name} (${docObj.departmentEn || docObj.department})` : undefined;
    const serviceName = bookingType === 'service' && srvObj ? `${srvObj.nameEn || srvObj.name}` : undefined;

    // 1. Save appointment to database / ClinicContext
    const newApt = bookAppointment({
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim() || undefined,
      doctorId: bookingType === 'doctor' ? selectedDoctorId : undefined,
      doctorName: doctorName,
      serviceId: bookingType === 'service' ? selectedServiceId : undefined,
      serviceName: serviceName,
      appointmentDate: preferredDate,
      appointmentTime: preferredTime,
      notes: message.trim() || undefined,
    });

    // 2. Format prefilled WhatsApp message per requirement
    const waTextLines = [
      'Hello, I would like to book an appointment at Chunilal Diagnostic Centre & Nursing Home.',
      '',
      `Patient Name: ${patientName.trim()}`,
      `Phone: ${patientPhone.trim()}`,
      doctorName ? `Doctor: ${doctorName}` : '',
      serviceName ? `Service: ${serviceName}` : '',
      `Preferred Date: ${preferredDate}`,
      `Preferred Time: ${preferredTime}`,
      message.trim() ? `Message: ${message.trim()}` : '',
      '',
      'Please confirm my appointment.',
    ].filter((line) => line !== '');

    const waText = waTextLines.join('\n');
    const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(waText)}`;

    setSubmittedAppointment({
      id: newApt.id,
      waUrl,
      doctorName,
      serviceName,
    });

    // Automatically open WhatsApp in new tab
    window.open(waUrl, '_blank');
  };

  const handleInstantWhatsApp = () => {
    const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
      'Hello, I would like to quickly book an appointment at Chunilal Diagnostic Centre & Nursing Home.'
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full text-slate-800 shadow-2xl relative border border-slate-200 my-auto overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0B2545] to-[#133E6D] text-white p-5 sm:p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Book an Appointment</h3>
              <p className="text-xs text-sky-200 mt-0.5">
                {clinicInfo.nameBn} &bull; {clinicInfo.subtitleBn}
              </p>
            </div>
          </div>

          {/* Quick hotline notice */}
          <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Instant Confirmation via WhatsApp & SMS</span>
            </div>
            <a
              href={`tel:${primaryPhone}`}
              className="font-bold text-amber-300 hover:text-white inline-flex items-center space-x-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call: {primaryPhone}</span>
            </a>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {submittedAppointment ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0B2545]">Appointment Saved Successfully!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Your appointment booking has been registered in our system and sent to WhatsApp.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-800">{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-bold text-slate-800">{patientPhone}</span>
                </div>
                {submittedAppointment.doctorName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-bold text-slate-800">{submittedAppointment.doctorName}</span>
                  </div>
                )}
                {submittedAppointment.serviceName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold text-slate-800">{submittedAppointment.serviceName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-slate-800">
                    {preferredDate} &bull; {preferredTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={submittedAppointment.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5a] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all transform active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Continue on WhatsApp</span>
                </a>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher: Doctor Consultation vs Diagnostic Test */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBookingType('doctor')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    bookingType === 'doctor'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('service')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    bookingType === 'service'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Diagnostic Test</span>
                </button>
              </div>

              {/* Patient Name & Phone in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Ramesh Ghosh"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Doctor or Service Selection */}
              {bookingType === 'doctor' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Doctor <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.nameEn || doc.name} — {doc.departmentEn || doc.department} ({doc.scheduleEn || doc.schedule})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Diagnostic Service <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="">-- Choose Test --</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.nameEn || srv.name} {srv.price ? `(₹${srv.price})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Preferred Date & Preferred Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                      <option value="Emergency (Anytime)">Emergency (Anytime)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Patient Email & Message */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="e.g. name@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Symptoms or Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Fever, routine checkup, previous report"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Book via WhatsApp</span>
                </button>

                <a
                  href={`tel:${primaryPhone}`}
                  className="w-full sm:w-auto bg-[#0B2545] hover:bg-[#133E6D] text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md flex items-center justify-center space-x-2 transition-colors shrink-0"
                >
                  <PhoneCall className="w-4 h-4 text-sky-400" />
                  <span>Call to Book</span>
                </a>
              </div>

              {/* Quick direct WhatsApp link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleInstantWhatsApp}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline inline-flex items-center space-x-1"
                >
                  <span>Skip form? Chat directly on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
