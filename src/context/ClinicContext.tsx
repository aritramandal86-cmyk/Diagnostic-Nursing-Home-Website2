import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClinicInfo,
  Doctor,
  DiagnosticService,
  NursingFacility,
  GalleryPhoto,
  Notice,
  Appointment,
  Language,
  AdminCredentials,
} from '../types';
import {
  defaultClinicInfo,
  defaultDoctors,
  defaultServices,
  defaultNursingFacilities,
  defaultGalleryPhotos,
  defaultNotices,
  defaultAppointments,
  defaultBookingCta,
  defaultAdminCredentials,
} from '../data/defaultData';

interface ClinicContextType {
  clinicInfo: ClinicInfo;
  updateClinicInfo: (info: Partial<ClinicInfo>) => void;
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  services: DiagnosticService[];
  addService: (service: Omit<DiagnosticService, 'id'>) => void;
  updateService: (id: string, service: Partial<DiagnosticService>) => void;
  deleteService: (id: string) => void;
  facilities: NursingFacility[];
  updateFacility: (id: string, facility: Partial<NursingFacility>) => void;
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;
  notices: Notice[];
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  addNotice: (text: string, textEn?: string) => void;
  deleteNotice: (id: string) => void;
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  adminCredentials: AdminCredentials;
  updateAdminCredentials: (creds: Partial<AdminCredentials>) => void;
  resetAdminPassword: (recoveryEmailInput: string, newPassword?: string) => { success: boolean; message: string; tempPassword?: string };
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  selectedDoctorForBooking: string | null;
  setSelectedDoctorForBooking: (doctorId: string | null) => void;
  selectedTestForBooking: string | null;
  setSelectedTestForBooking: (testName: string | null) => void;
  isPromptModalOpen: boolean;
  setIsPromptModalOpen: (open: boolean) => void;
  handleDoctorBooking: (doctor: Doctor) => void;
  handleTestBooking: (service: DiagnosticService) => void;
  openWhatsAppBooking: (customText?: string) => void;
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INFO: 'chunilal_clinic_info_v2',
  DOCTORS: 'chunilal_doctors_v2',
  SERVICES: 'chunilal_services_v2',
  FACILITIES: 'chunilal_facilities_v2',
  GALLERY: 'chunilal_gallery_v2',
  NOTICES: 'chunilal_notices_v2',
  APPOINTMENTS: 'chunilal_appointments_v2',
  LANGUAGE: 'chunilal_language_v2',
  ADMIN_AUTH: 'chunilal_admin_auth_v2',
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INFO) || localStorage.getItem('chunilal_clinic_info_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCta = parsed.bookingCta || {};
        const mapLink =
          parsed.googleMapLink && !parsed.googleMapLink.includes('Dakshin+Barasat+Market')
            ? parsed.googleMapLink
            : 'https://share.google/jH9wA9I5hGENA1Xp9';
        const nhMapLink = parsed.nursingHomeMapLink || 'https://share.google/jH9wA9I5hGENA1Xp9';

        return {
          ...defaultClinicInfo,
          ...parsed,
          googleMapLink: mapLink,
          nursingHomeMapLink: nhMapLink,
          bookingCta: {
            ...defaultBookingCta,
            ...savedCta,
            doctorCtaAction: savedCta.doctorCtaAction === 'call' ? 'call' : 'whatsapp',
            serviceCtaAction: savedCta.serviceCtaAction === 'call' ? 'call' : 'whatsapp',
            doctorCtaText: savedCta.doctorCtaText && savedCta.doctorCtaText !== 'Book Appointment' ? savedCta.doctorCtaText : 'Book on WhatsApp',
            serviceCtaText: savedCta.serviceCtaText && savedCta.serviceCtaText !== 'Book Test' ? savedCta.serviceCtaText : 'Book on WhatsApp',
          },
        };
      }
      return defaultClinicInfo;
    } catch {
      return defaultClinicInfo;
    }
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS) || localStorage.getItem('chunilal_doctors_v1');
      return saved ? JSON.parse(saved) : defaultDoctors;
    } catch {
      return defaultDoctors;
    }
  });

  const [services, setServices] = useState<DiagnosticService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES) || localStorage.getItem('chunilal_services_v1');
      return saved ? JSON.parse(saved) : defaultServices;
    } catch {
      return defaultServices;
    }
  });

  const [facilities, setFacilities] = useState<NursingFacility[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FACILITIES) || localStorage.getItem('chunilal_facilities_v1');
      return saved ? JSON.parse(saved) : defaultNursingFacilities;
    } catch {
      return defaultNursingFacilities;
    }
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY) || localStorage.getItem('chunilal_gallery_v1');
      return saved ? JSON.parse(saved) : defaultGalleryPhotos;
    } catch {
      return defaultGalleryPhotos;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES) || localStorage.getItem('chunilal_notices_v1');
      return saved ? JSON.parse(saved) : defaultNotices;
    } catch {
      return defaultNotices;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || localStorage.getItem('chunilal_appointments_v1');
      return saved ? JSON.parse(saved) : defaultAppointments;
    } catch {
      return defaultAppointments;
    }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || localStorage.getItem('chunilal_language_v1');
      return (saved === 'en' || saved === 'bn') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const [adminCredentials, setAdminCredentialsState] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultAdminCredentials,
          ...parsed,
          recoveryEmail: 'cmmdiagnostic@gmail.com', // Always ensure admin recovery gmail is cmmdiagnostic@gmail.com
        };
      }
      return defaultAdminCredentials;
    } catch {
      return defaultAdminCredentials;
    }
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpenState] = useState<boolean>(false);

  const setIsAppointmentModalOpen = (open: boolean) => {
    if (open) {
      openWhatsAppBooking();
    }
    setIsAppointmentModalOpenState(false);
  };
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<string | null>(null);
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<string | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INFO, JSON.stringify(clinicInfo));
    } catch (e) {
      console.warn('Storage quota exceeded or error:', e);
    }
  }, [clinicInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [facilities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(adminCredentials));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [adminCredentials]);

  const updateAdminCredentials = (creds: Partial<AdminCredentials>) => {
    setAdminCredentialsState((prev: AdminCredentials) => ({
      ...prev,
      ...creds,
    }));
  };

  const resetAdminPassword = (recoveryEmailInput: string, newPassword?: string): { success: boolean; message: string; tempPassword?: string } => {
    const cleanInput = recoveryEmailInput.trim().toLowerCase();
    const targetEmail = (adminCredentials.recoveryEmail || 'cmmdiagnostic@gmail.com').trim().toLowerCase();

    if (cleanInput !== targetEmail && cleanInput !== 'cmmdiagnostic@gmail.com') {
      return {
        success: false,
        message: `Recovery email does not match registered admin email. Please enter cmmdiagnostic@gmail.com.`,
      };
    }

    const assignedPassword = newPassword && newPassword.trim().length >= 4 
      ? newPassword.trim() 
      : 'admin@123';

    setAdminCredentialsState((prev: AdminCredentials) => ({
      ...prev,
      username: prev.username || 'admin',
      passwordHash: assignedPassword,
      recoveryEmail: 'cmmdiagnostic@gmail.com',
    }));

    return {
      success: true,
      message: `Password has been reset successfully! Your active admin password is now: ${assignedPassword}`,
      tempPassword: assignedPassword,
    };
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.warn(e);
    }
  };

  const updateClinicInfo = (info: Partial<ClinicInfo>) => {
    setClinicInfo(prev => ({
      ...prev,
      ...info,
      bookingCta: {
        ...prev.bookingCta,
        ...(info.bookingCta || {}),
      },
    }));
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
    };
    setDoctors(prev => [newDoc, ...prev]);
  };

  const updateDoctor = (id: string, doctorData: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => (d.id === id ? { ...d, ...doctorData } : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const addService = (serviceData: Omit<DiagnosticService, 'id'>) => {
    const newService: DiagnosticService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, serviceData: Partial<DiagnosticService>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...serviceData } : s)));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateFacility = (id: string, facilityData: Partial<NursingFacility>) => {
    setFacilities(prev => prev.map(f => (f.id === id ? { ...f, ...facilityData } : f)));
  };

  const addGalleryPhoto = (photoData: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: `gal-${Date.now()}`,
    };
    setGallery(prev => [newPhoto, ...prev]);
  };

  const deleteGalleryPhoto = (id: string) => {
    setGallery(prev => prev.filter(p => p.id !== id));
  };

  const updateNotice = (id: string, noticeData: Partial<Notice>) => {
    setNotices(prev => prev.map(n => (n.id === id ? { ...n, ...noticeData } : n)));
  };

  const addNotice = (text: string, textEn?: string) => {
    const newNotice: Notice = {
      id: `not-${Date.now()}`,
      text,
      textEn: textEn || text,
      isActive: true,
      priority: 'normal',
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const bookAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const newAppt: Appointment = {
      ...data,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setAppointments(prev => [newAppt, ...prev]);
    return newAppt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Helper to open WhatsApp for direct booking
  const openWhatsAppBooking = (customText?: string) => {
    const whatsappNum = clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp;
    const text = customText || 'Hello, I want to book an appointment at Chunilal Diagnostic Centre & Polyclinic.';
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Centralized action handler for booking any doctor
  const handleDoctorBooking = (doctor: Doctor) => {
    const effectiveAction = (doctor.ctaAction && doctor.ctaAction !== 'default')
      ? doctor.ctaAction
      : (clinicInfo.bookingCta?.doctorCtaAction || 'whatsapp');

    const whatsappNum = clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp;
    const phoneNum = doctor.phone || clinicInfo.bookingCta?.customPhone || clinicInfo.phones[0];

    if (effectiveAction === 'modal') {
      setSelectedDoctorForBooking(doctor.id);
      setIsAppointmentModalOpen(true);
    } else if (effectiveAction === 'call') {
      window.location.href = `tel:${phoneNum}`;
    } else {
      const docTitle = doctor.nameEn || doctor.name;
      const dept = doctor.departmentEn || doctor.department;
      const text = `Hello, I want to book an appointment with ${docTitle} (${dept}) at Chunilal Diagnostic Centre & Polyclinic.`;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Centralized action handler for booking any diagnostic test
  const handleTestBooking = (service: DiagnosticService) => {
    const effectiveAction = (service.ctaAction && service.ctaAction !== 'default')
      ? service.ctaAction
      : (clinicInfo.bookingCta?.serviceCtaAction || 'whatsapp');

    const whatsappNum = clinicInfo.bookingCta?.customWhatsapp || clinicInfo.whatsapp;
    const phoneNum = clinicInfo.bookingCta?.customPhone || clinicInfo.phones[0];
    const testTitle = service.nameEn || service.name;

    if (effectiveAction === 'modal') {
      setSelectedTestForBooking(service.id);
      setIsAppointmentModalOpen(true);
    } else if (effectiveAction === 'call') {
      window.location.href = `tel:${phoneNum}`;
    } else {
      const text = `Hello, I would like to book or inquire about the diagnostic test: ${testTitle} at Chunilal Diagnostic Centre & Polyclinic.`;
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all data to initial defaults? This will overwrite local customizations.')) {
      setClinicInfo(defaultClinicInfo);
      setDoctors(defaultDoctors);
      setServices(defaultServices);
      setFacilities(defaultNursingFacilities);
      setGallery(defaultGalleryPhotos);
      setNotices(defaultNotices);
      setAppointments(defaultAppointments);
      localStorage.clear();
    }
  };

  const exportDataJson = (): string => {
    const payload = {
      clinicInfo,
      doctors,
      services,
      facilities,
      gallery,
      notices,
      appointments,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.clinicInfo) setClinicInfo(data.clinicInfo);
      if (data.doctors) setDoctors(data.doctors);
      if (data.services) setServices(data.services);
      if (data.facilities) setFacilities(data.facilities);
      if (data.gallery) setGallery(data.gallery);
      if (data.notices) setNotices(data.notices);
      if (data.appointments) setAppointments(data.appointments);
      return true;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        clinicInfo,
        updateClinicInfo,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        services,
        addService,
        updateService,
        deleteService,
        facilities,
        updateFacility,
        gallery,
        addGalleryPhoto,
        deleteGalleryPhoto,
        notices,
        updateNotice,
        addNotice,
        deleteNotice,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        language,
        setLanguage,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        adminCredentials,
        updateAdminCredentials,
        resetAdminPassword,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        selectedDoctorForBooking,
        setSelectedDoctorForBooking,
        selectedTestForBooking,
        setSelectedTestForBooking,
        isPromptModalOpen,
        setIsPromptModalOpen,
        handleDoctorBooking,
        handleTestBooking,
        openWhatsAppBooking,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
