import React, { useState } from 'react';
import {
  Activity,
  ScanLine,
  Monitor,
  HeartPulse,
  Syringe,
  Waves,
  Droplet,
  Zap,
  Clock,
  ArrowRight,
  MessageCircle,
  Phone,
  Calendar,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const ServicesSection: React.FC = () => {
  const { services, clinicInfo, handleTestBooking, setSelectedTestForBooking, setIsAppointmentModalOpen } = useClinic();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const bookingCta = clinicInfo.bookingCta || {
    serviceCtaText: 'Book Test',
    serviceCtaAction: 'modal',
    serviceShowSecondaryAction: true,
    serviceSecondaryType: 'call',
  };

  const whatsappNum = bookingCta.customWhatsapp || clinicInfo.whatsapp;
  const generalPhone = bookingCta.customPhone || clinicInfo.phones[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ScanLine':
        return ScanLine;
      case 'Activity':
        return Activity;
      case 'Monitor':
        return Monitor;
      case 'HeartPulse':
        return HeartPulse;
      case 'Syringe':
        return Syringe;
      case 'Waves':
        return Waves;
      case 'Droplet':
        return Droplet;
      case 'Zap':
        return Zap;
      default:
        return Activity;
    }
  };

  const categories = [
    { id: 'all', label: 'All Diagnostic Services' },
    { id: 'radiology', label: 'Radiology & Imaging' },
    { id: 'cardiology', label: 'Cardiology (Heart)' },
    { id: 'pathology', label: 'Pathology Lab' },
    { id: 'specialized', label: 'Specialized Tests' },
  ];

  const filteredServices = services.filter((srv) => {
    if (activeCategory === 'all') return true;
    return srv.category === activeCategory;
  });

  return (
    <section id="services" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Modern Pathology & Radiology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
              Diagnostic Services
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Advanced computerized diagnostics delivering prompt, reliable, and high-precision test reports.
            </p>
          </div>

          {/* Quick Book CTA */}
          <a
            href={`https://wa.me/${clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp}?text=${encodeURIComponent(
              'Hello, I would like to book a diagnostic test at Chunilal Diagnostic Centre.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl font-bold text-sm group transition-colors shadow-2xs border border-emerald-200"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>{bookingCta.serviceCtaText || 'Book Test on WhatsApp'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service) => {
            const Icon = getIcon(service.iconName);
            const isEcho = service.name.includes('ইকো') || service.nameEn?.includes('Echo');

            const ctaButtonText = service.ctaLabel || bookingCta.serviceCtaText || 'Book Test';
            const effectiveAction = (service.ctaAction && service.ctaAction !== 'default')
              ? service.ctaAction
              : bookingCta.serviceCtaAction;

            const testTitle = service.nameEn || service.name;

            return (
              <div
                key={service.id}
                className={`bg-slate-50/70 hover:bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between group hover:shadow-lg ${
                  isEcho ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {isEcho && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Tue & Fri
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#0B2545] mb-1 group-hover:text-blue-700 transition-colors">
                    {service.nameEn || service.name}
                  </h3>
                  {service.name && service.nameEn && (
                    <p className="text-[11px] text-slate-400 mb-1 font-medium">
                      {service.name}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 font-normal leading-relaxed mb-3">
                    {service.descriptionEn || service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    {service.timing ? (
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{service.timingEn || service.timing}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500">Available Daily</span>
                    )}

                    <span className="text-xs font-bold text-emerald-700">
                      {service.price ? `₹${service.price}` : 'Govt/Regulated'}
                    </span>
                  </div>

                  {/* Customizable Call To Action Button for this test */}
                  <div className="flex items-center space-x-1.5 pt-1">
                    <button
                      onClick={() => handleTestBooking(service)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      {effectiveAction === 'whatsapp' ? (
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                      ) : effectiveAction === 'call' ? (
                        <Phone className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5" />
                      )}
                      <span>{ctaButtonText}</span>
                    </button>

                    {bookingCta.serviceShowSecondaryAction && (
                      <>
                        {bookingCta.serviceSecondaryType === 'whatsapp' ? (
                          <a
                            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                              `Hello, I would like to book or inquire about the diagnostic test: ${testTitle}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors shadow-2xs"
                            title="Instant WhatsApp Inquiry"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                          </a>
                        ) : (
                          <a
                            href={`tel:${generalPhone}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors shadow-2xs"
                            title="Call Diagnostics Helpdesk"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
