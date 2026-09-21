import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Send,
  Navigation,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const ContactSection: React.FC = () => {
  const { clinicInfo } = useClinic();
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSent(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', message: '' });
      setFormSent(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Reach</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Contact & Location
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Connect directly with our reception, doctors, or ambulance team via call, WhatsApp, or clinic visit.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Card matching the bottom-right corner of the image */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-extrabold text-[#0B2545]">
                {clinicInfo.nameBn}
              </h3>
              <p className="text-sm font-semibold text-blue-700 mt-0.5">
                {clinicInfo.subtitleBn}
              </p>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Address & Landmark
                </div>
                <div className="text-base font-bold text-slate-800 mt-0.5">
                  {clinicInfo.addressBn}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {clinicInfo.landmarkBn}
                </div>
                <div className="mt-2">
                  <a
                    href={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200/60 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Nursing Home on Google Maps ↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Helpline & Reception
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  {clinicInfo.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone}`}
                      className="text-base font-extrabold text-blue-700 hover:text-blue-900 tracking-wider transition-colors"
                    >
                      {phone} {idx < clinicInfo.phones.length - 1 ? '•' : ''}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Operating Hours
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">
                  {clinicInfo.openingHoursEn}
                </div>
              </div>
            </div>

            {/* 2 Main Buttons matching the original board */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                  'Hello, I want to inquire about Chunilal Diagnostic Centre & Nursing Home.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-[#1B8A44] hover:bg-[#156E36] text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Google Maps CTA */}
              <a
                href={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-[#0066CC] hover:bg-[#0052A3] text-white py-3 px-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Nursing Home Map Location</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Map Preview + Quick Inquiry Form */}
          <div className="lg:col-span-6 space-y-6">
            {/* Embedded Map Container */}
            <div className="bg-white rounded-2xl p-2 shadow-md border border-slate-200 overflow-hidden">
              <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-100">
                <iframe
                  title="Chunilal Diagnostic Map"
                  src={clinicInfo.googleMapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-1 hover:bg-white hover:text-blue-900 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Open Nursing Home on Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <h4 className="font-extrabold text-base text-[#0B2545] mb-1">
                Send Quick Inquiry
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Leave your name and contact number, our desk will get back to you promptly.
              </p>

              {formSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>
                    Thank you! Your message has been received. Our team will contact you shortly.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9830XXXXXX"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message / Test Query
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify required test, doctor department, or general query..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B2545] hover:bg-[#133E6D] text-white py-2.5 px-4 rounded-xl text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
