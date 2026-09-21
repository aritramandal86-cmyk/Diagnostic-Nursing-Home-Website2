export type Language = 'bn' | 'en';

export type CtaActionType = 'modal' | 'whatsapp' | 'call';

export interface BookingCtaConfig {
  doctorCtaText: string;
  doctorCtaAction: CtaActionType;
  doctorShowSecondaryAction: boolean;
  doctorSecondaryType: 'whatsapp' | 'call';

  serviceCtaText: string;
  serviceCtaAction: CtaActionType;
  serviceShowSecondaryAction: boolean;
  serviceSecondaryType: 'whatsapp' | 'call';

  modalQuickCtaEnabled: boolean;
  modalQuickCtaText: string;
  modalQuickCtaType: 'whatsapp' | 'call';

  customWhatsapp?: string;
  customPhone?: string;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  recoveryEmail: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameEn?: string;
  degrees: string;
  department: string;
  departmentEn?: string;
  schedule: string;
  scheduleEn?: string;
  timing: string;
  timingEn?: string;
  fee?: number;
  availableDays: string[];
  imageUrl: string;
  phone?: string;
  roomNo?: string;
  isAvailable: boolean;
  ctaLabel?: string;
  ctaAction?: 'default' | CtaActionType;
}

export interface DiagnosticService {
  id: string;
  name: string;
  nameEn?: string;
  category: 'radiology' | 'pathology' | 'cardiology' | 'specialized';
  description: string;
  descriptionEn?: string;
  timing?: string;
  timingEn?: string;
  price?: number;
  iconName: string;
  isAvailable: boolean;
  ctaLabel?: string;
  ctaAction?: 'default' | CtaActionType;
}

export interface NursingFacility {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  iconName: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge?: string;
  gender?: 'male' | 'female' | 'other';
  doctorId?: string;
  doctorName?: string;
  serviceId?: string;
  serviceName?: string;
  appointmentDate: string;
  appointmentTime?: string;
  timeSlot?: string;
  serviceType?: 'doctor_consultation' | 'diagnostic_test' | 'nursing_admission';
  testName?: string;
  notes?: string;
  patientEmail?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Notice {
  id: string;
  text: string;
  textEn?: string;
  isActive: boolean;
  priority: 'normal' | 'urgent';
}

export interface ClinicInfo {
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  subtitleEn: string;
  sloganBn: string;
  sloganEn: string;
  addressBn: string;
  addressEn: string;
  landmarkBn: string;
  landmarkEn: string;
  phones: string[];
  whatsapp: string;
  email: string;
  emergencyPhone: string;
  openingHoursBn: string;
  openingHoursEn: string;
  logoUrl: string;
  heroImageUrl: string;
  aboutTextBn: string;
  aboutTextEn: string;
  aboutMissionBn: string;
  aboutMissionEn: string;
  aboutImageUrl: string;
  googleMapEmbedUrl: string;
  googleMapLink: string;
  nursingHomeMapLink?: string;
  facebookUrl: string;
  youtubeUrl: string;
  bookingCta: BookingCtaConfig;
}
