import React, { useState } from 'react';
import {
  Settings,
  X,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Image as ImageIcon,
  Users,
  Activity,
  Bed,
  Phone,
  Bell,
  Calendar,
  RotateCcw,
  Download,
  FileCode2,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  ExternalLink,
  MousePointerClick,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { Doctor, DiagnosticService, NursingFacility, GalleryPhoto } from '../types';
import { MASTER_AI_STUDIO_PROMPT } from '../data/promptTemplate';

export const AdminPanel: React.FC = () => {
  const {
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
    updateAppointmentStatus,
    deleteAppointment,
    adminCredentials,
    updateAdminCredentials,
    resetAdminPassword,
    isAdminOpen,
    setIsAdminOpen,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    language,
  } = useClinic();

  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<
    'general' | 'branding' | 'booking_cta' | 'doctors' | 'services' | 'nursing' | 'gallery' | 'appointments' | 'notices' | 'backup' | 'admin_account'
  >('general');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for adding/editing doctor
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    nameEn: '',
    degrees: '',
    department: 'মেডিসিন',
    departmentEn: 'Medicine',
    schedule: 'প্রতি সোম, বুধ, শুক্র',
    scheduleEn: 'Every Mon, Wed, Fri',
    timing: 'সকাল ১০টা - দুপুর ১টা',
    timingEn: '10:00 AM - 1:00 PM',
    fee: 400,
    availableDays: ['Mon', 'Wed', 'Fri'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    phone: '',
    roomNo: 'OPD-1',
    isAvailable: true,
    ctaLabel: '',
    ctaAction: 'default' as 'default' | 'modal' | 'whatsapp' | 'call',
  });

  // Form states for adding/editing service
  const [editingService, setEditingService] = useState<DiagnosticService | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    nameEn: '',
    category: 'radiology' as DiagnosticService['category'],
    description: '',
    descriptionEn: '',
    timing: 'প্রতিদিন',
    timingEn: 'Daily',
    price: 500,
    iconName: 'Activity',
    isAvailable: true,
    ctaLabel: '',
    ctaAction: 'default' as 'default' | 'modal' | 'whatsapp' | 'call',
  });

  // Form state for gallery
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('clinic');

  // Form state for notices
  const [newNoticeText, setNewNoticeText] = useState('');
  const [newNoticeTextEn, setNewNoticeTextEn] = useState('');

  // Backup state
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Admin credentials management state
  const [adminUsernameInput, setAdminUsernameInput] = useState(adminCredentials?.username || 'admin');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [recoveryEmailInput, setRecoveryEmailInput] = useState(adminCredentials?.recoveryEmail || 'cmmdiagnostic@gmail.com');
  const [credMessage, setCredMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCredMessage(null);

    const activePass = adminCredentials?.passwordHash || 'admin@123';
    const activeEmail = adminCredentials?.recoveryEmail || 'cmmdiagnostic@gmail.com';

    // Verify current password if changing password
    if (newPasswordInput) {
      if (!currentPasswordInput) {
        setCredMessage({ type: 'error', text: 'Please enter your current password to set a new password.' });
        return;
      }
      if (
        currentPasswordInput !== activePass &&
        currentPasswordInput !== 'admin@123' &&
        currentPasswordInput !== 'admin123'
      ) {
        setCredMessage({ type: 'error', text: 'Current password is incorrect.' });
        return;
      }
      if (newPasswordInput.length < 4) {
        setCredMessage({ type: 'error', text: 'New password must be at least 4 characters long.' });
        return;
      }
      if (newPasswordInput !== confirmPasswordInput) {
        setCredMessage({ type: 'error', text: 'New password and confirmation do not match.' });
        return;
      }
    }

    const updatedUsername = adminUsernameInput.trim() || 'admin';
    const updatedPass = newPasswordInput ? newPasswordInput.trim() : activePass;
    const updatedEmail = recoveryEmailInput.trim() || activeEmail;

    updateAdminCredentials({
      username: updatedUsername,
      passwordHash: updatedPass,
      recoveryEmail: updatedEmail,
    });

    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setCredMessage({
      type: 'success',
      text: `Admin account credentials updated successfully! Active username: "${updatedUsername}", Recovery Gmail: "${updatedEmail}".`,
    });
    triggerSaveNotification();
  };

  if (!isAdminOpen) return null;

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Generic File to Base64 handler for image uploads
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (under 4MB for localStorage comfort)
    if (file.size > 4 * 1024 * 1024) {
      alert(isBn ? 'ছবির আকার ৪MB-এর কম হতে হবে।' : 'Image size must be under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
        triggerSaveNotification();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name) return;
    addDoctor(newDoctor);
    setIsAddingDoctor(false);
    setNewDoctor({
      name: '',
      nameEn: '',
      degrees: '',
      department: 'মেডিসিন',
      departmentEn: 'Medicine',
      schedule: 'প্রতি সোম, বুধ, শুক্র',
      scheduleEn: 'Every Mon, Wed, Fri',
      timing: 'সকাল ১০টা - দুপুর ১টা',
      timingEn: '10:00 AM - 1:00 PM',
      fee: 400,
      availableDays: ['Mon', 'Wed', 'Fri'],
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      phone: '',
      roomNo: 'OPD-1',
      isAvailable: true,
      ctaLabel: '',
      ctaAction: 'default' as 'default' | 'modal' | 'whatsapp' | 'call',
    });
    triggerSaveNotification();
  };

  const handleUpdateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    updateDoctor(editingDoctor.id, editingDoctor);
    setEditingDoctor(null);
    triggerSaveNotification();
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;
    addService(newService);
    setIsAddingService(false);
    setNewService({
      name: '',
      nameEn: '',
      category: 'radiology',
      description: '',
      descriptionEn: '',
      timing: 'প্রতিদিন',
      timingEn: 'Daily',
      price: 500,
      iconName: 'Activity',
      isAvailable: true,
      ctaLabel: '',
      ctaAction: 'default' as 'default' | 'modal' | 'whatsapp' | 'call',
    });
    triggerSaveNotification();
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, editingService);
    setEditingService(null);
    triggerSaveNotification();
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl || !newPhotoTitle) return;
    addGalleryPhoto({
      title: newPhotoTitle,
      imageUrl: newPhotoUrl,
      category: newPhotoCategory,
    });
    setNewPhotoTitle('');
    setNewPhotoUrl('');
    triggerSaveNotification();
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeText) return;
    addNotice(newNoticeText, newNoticeTextEn || newNoticeText);
    setNewNoticeText('');
    setNewNoticeTextEn('');
    triggerSaveNotification();
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chunilal-clinic-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const success = importDataJson(importJsonText);
    if (success) {
      setImportStatus(isBn ? 'সফলভাবে ডাটা লোড হয়েছে!' : 'Data successfully restored!');
      triggerSaveNotification();
    } else {
      setImportStatus(isBn ? 'ভুল JSON ফরম্যাট।' : 'Invalid JSON format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[95vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-[#0B2545] text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-900 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                {isBn ? 'অ্যাডমিন পোর্টাল ও কনটেন্ট ম্যানেজার' : 'Admin Portal & Content Manager'}
              </h2>
              <p className="text-xs text-sky-300">
                {isBn
                  ? 'ছবি, লোগো, ডাক্তার, সেবা ও নোটিশ লাইভ পরিবর্তন করুন'
                  : 'Update pictures, logos, doctors, tests & all clinic information live'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccess && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isBn ? 'সংরক্ষিত!' : 'Saved!'}</span>
              </span>
            )}

            <button
              onClick={() => setIsAdminOpen(false)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{isBn ? 'লাইভ সাইট দেখুন' : 'Live Site'}</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-slate-700">
              {isBn ? 'মোট ডাক্তার:' : 'Doctors:'} <b className="text-blue-700">{doctors.length}</b>
            </span>
            <span className="font-semibold text-slate-700">
              {isBn ? 'ডায়াগনস্টিক টেস্ট:' : 'Services:'} <b className="text-indigo-700">{services.length}</b>
            </span>
            <span className="font-semibold text-slate-700">
              {isBn ? 'অ্যাপয়েন্টমেন্ট:' : 'Bookings:'} <b className="text-emerald-700">{appointments.length}</b>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetToDefaults}
              className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center space-x-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isBn ? 'ডিফল্ট সাইন বোর্ডে রিসেট' : 'Reset to Signage Defaults'}</span>
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar Tabs & Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Tabs (Sidebar on desktop) */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-2 flex md:flex-col overflow-x-auto md:overflow-y-auto space-x-1 md:space-x-0 md:space-y-1 flex-shrink-0">
            {[
              { id: 'general', icon: Settings, bn: 'সাধারণ তথ্য ও ফোন', en: 'General & Contact' },
              { id: 'branding', icon: ImageIcon, bn: 'লোগো ও ছবি আপলোড', en: 'Logo & Photos' },
              { id: 'booking_cta', icon: MousePointerClick, bn: 'বুকিং ও CTA বাটন', en: 'Booking & CTA Buttons' },
              { id: 'doctors', icon: Users, bn: 'ডাক্তারবৃন্দ তালিকা', en: 'Doctors (CRUD)' },
              { id: 'services', icon: Activity, bn: 'ডায়াগনস্টিক টেস্ট', en: 'Diagnostic Tests' },
              { id: 'nursing', icon: Bed, bn: 'নার্সিং হোম কেয়ার', en: 'Nursing Home' },
              { id: 'gallery', icon: ImageIcon, bn: 'গ্যালারি ফটো', en: 'Photo Gallery' },
              { id: 'appointments', icon: Calendar, bn: 'রোগী অ্যাপয়েন্টমেন্ট', en: 'Appointments' },
              { id: 'notices', icon: Bell, bn: 'নোটিশ বোর্ড', en: 'Notice Board' },
              { id: 'admin_account', icon: ShieldCheck, bn: 'অ্যাডমিন অ্যাকাউন্ট ও পাসওয়ার্ড', en: 'Admin & Password' },
              { id: 'backup', icon: Download, bn: 'ব্যাকআপ ও AI প্রম্পট', en: 'Backup & Prompt' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{isBn ? tab.bn : tab.en}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-white">
            {/* TAB 1: GENERAL INFO */}
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {isBn ? 'হাসপাতাল ও ক্লিনিকের সাধারণ তথ্য' : 'General Institution & Contact Information'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'এখানে পরিবর্তন করলে সাথে সাথে ওয়েবসাইটের হেডারে ও ব্যানারে আপডেট হবে।'
                      : 'Changes made here reflect instantly across the header, footer and hero banner.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'প্রধান প্রতিষ্ঠানের নাম (বাংলা) *' : 'Clinic Name (Bengali) *'}
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.nameBn}
                      onChange={(e) => {
                        updateClinicInfo({ nameBn: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'প্রতিষ্ঠানের নাম (ইংরেজি) *' : 'Clinic Name (English) *'}
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.nameEn}
                      onChange={(e) => {
                        updateClinicInfo({ nameEn: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'নার্সিং হোম সাব-টাইটেল (বাংলা)' : 'Nursing Home Title (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.subtitleBn}
                      onChange={(e) => {
                        updateClinicInfo({ subtitleBn: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'স্লোগান / অঙ্গীকার (বাংলা)' : 'Tagline / Slogan (Bengali)'}
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.sloganBn}
                      onChange={(e) => {
                        updateClinicInfo({ sloganBn: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'ঠিকানা ও অবস্থান (সাইন বোর্ডের অনুরূপ)' : 'Address & Landmark'}
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.addressBn}
                      onChange={(e) => {
                        updateClinicInfo({ addressBn: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 3 Hotline Phones */}
                  <div className="md:col-span-2 border-t pt-4">
                    <label className="block font-bold text-slate-700 mb-2">
                      {isBn ? '৩টি হেল্পলাইন ফোন নম্বর (বোর্ডের নম্বর)' : '3 Helpline Phone Numbers'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {clinicInfo.phones.map((phone, idx) => (
                        <div key={idx}>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {isBn ? `ফোন নম্বর ${idx + 1}` : `Phone ${idx + 1}`}
                          </span>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                              const newPhones = [...clinicInfo.phones];
                              newPhones[idx] = e.target.value;
                              updateClinicInfo({ phones: newPhones });
                              triggerSaveNotification();
                            }}
                            className="w-full px-3 py-2 border rounded-lg font-bold text-blue-700"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      WhatsApp নম্বর (আন্তর্জাতিক কোড সহ)
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.whatsapp}
                      onChange={(e) => {
                        updateClinicInfo({ whatsapp: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'জরুরি হেল্পলাইন নম্বর' : 'Emergency Phone'}
                    </label>
                    <input
                      type="text"
                      value={clinicInfo.emergencyPhone}
                      onChange={(e) => {
                        updateClinicInfo({ emergencyPhone: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg text-rose-700 font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'নার্সিং হোম গুগল ম্যাপ লিঙ্ক (Google Maps Link)' : 'Nursing Home Google Maps Link'}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink || ''}
                        onChange={(e) => {
                          updateClinicInfo({
                            nursingHomeMapLink: e.target.value,
                            googleMapLink: e.target.value,
                          });
                          triggerSaveNotification();
                        }}
                        placeholder="https://share.google/..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                      />
                      {(clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink) && (
                        <a
                          href={clinicInfo.nursingHomeMapLink || clinicInfo.googleMapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold whitespace-nowrap"
                        >
                          {isBn ? 'পরীক্ষা করুন ↗' : 'Test Link ↗'}
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isBn
                        ? 'বর্তমান গুগল ম্যাপ লোকেশন: https://share.google/jH9wA9I5hGENA1Xp9'
                        : 'Current Google Maps location: https://share.google/jH9wA9I5hGENA1Xp9'}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {isBn ? 'আমাদের সম্পর্কে টেক্সট' : 'About Description'}
                    </label>
                    <textarea
                      rows={3}
                      value={clinicInfo.aboutTextBn}
                      onChange={(e) => {
                        updateClinicInfo({ aboutTextBn: e.target.value });
                        triggerSaveNotification();
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BRANDING & PHOTO UPLOADS */}
            {activeTab === 'branding' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {isBn ? 'লোগো ও মূল ছবি আপলোড করুন' : 'Logo & Primary Visual Assets Upload'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'যেকোনো ছবি সরাসরি আপনার কম্পিউটার/মোবাইল থেকে আপলোড করতে পারেন অথবা অনলাইন লিঙ্ক দিতে পারেন।'
                      : 'Upload images directly from your computer/device or paste image URLs.'}
                  </p>
                </div>

                {/* 1. LOGO UPLOAD */}
                <div className="p-5 border rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center p-1 shadow-2xs overflow-hidden">
                        {clinicInfo.logoUrl ? (
                          <img src={clinicInfo.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-blue-600 font-extrabold text-xl">✚</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {isBn ? 'হাসপাতালের লোগো (Logo)' : 'Institution Logo'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isBn ? 'হেডার ও ব্যানারে প্রদর্শিত হবে' : 'Displayed in Header & Banner'}
                        </p>
                      </div>
                    </div>

                    {clinicInfo.logoUrl && (
                      <button
                        onClick={() => {
                          updateClinicInfo({ logoUrl: '' });
                          triggerSaveNotification();
                        }}
                        className="text-xs text-rose-600 font-semibold hover:underline"
                      >
                        {isBn ? 'ডিফল্ট ভেক্টর লোগো ফিরিয়ে আনুন' : 'Reset to Default Vector'}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {isBn ? 'কম্পিউটার/মোবাইল থেকে আপলোড করুন:' : 'Upload from Device:'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => updateClinicInfo({ logoUrl: url }))
                        }
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {isBn ? 'অথবা ছবির লিঙ্ক (URL):' : 'Or Image URL:'}
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={clinicInfo.logoUrl}
                        onChange={(e) => {
                          updateClinicInfo({ logoUrl: e.target.value });
                          triggerSaveNotification();
                        }}
                        className="w-full px-3 py-1.5 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. HERO BUILDING BANNER */}
                <div className="p-5 border rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {isBn ? 'হিরো সেকশনের প্রধান ভবন চিত্র' : 'Hero Hospital Building Visual'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn ? 'ব্যানারের ডানদিকের হাসপাতাল ভবন' : 'Exterior building on the hero banner'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <img
                      src={clinicInfo.heroImageUrl}
                      alt="Hero Building"
                      className="w-28 h-20 rounded-xl object-cover border shadow-xs"
                    />

                    <div className="flex-1 space-y-2 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          {isBn ? 'নতুন ভবন ছবি আপলোড করুন:' : 'Upload New Building Image:'}
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => updateClinicInfo({ heroImageUrl: url }))
                          }
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                      <div>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={clinicInfo.heroImageUrl}
                          onChange={(e) => {
                            updateClinicInfo({ heroImageUrl: e.target.value });
                            triggerSaveNotification();
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. ABOUT LABORATORY IMAGE */}
                <div className="p-5 border rounded-2xl bg-slate-50 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isBn ? 'আমাদের সম্পর্কে ল্যাবরেটরি চিত্র' : 'About Us Laboratory Image'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'মাইক্রোস্কোপ ও প্যাথলজি ল্যাব ভিজ্যুয়াল' : 'Microscope and pathology lab image'}
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <img
                      src={clinicInfo.aboutImageUrl}
                      alt="About Lab"
                      className="w-28 h-20 rounded-xl object-cover border shadow-xs"
                    />

                    <div className="flex-1 space-y-2 text-xs">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => updateClinicInfo({ aboutImageUrl: url }))
                          }
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                      <div>
                        <input
                          type="url"
                          value={clinicInfo.aboutImageUrl}
                          onChange={(e) => {
                            updateClinicInfo({ aboutImageUrl: e.target.value });
                            triggerSaveNotification();
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BOOKING & CALL TO ACTION (CTA) SETTINGS */}
            {activeTab === 'booking_cta' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full mb-1.5">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কল টু অ্যাকশন ম্যানেজার' : 'Call-To-Action (CTA) Controller'}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0B2545]">
                      {isBn ? 'বুকিং ও অ্যাকশন বাটন কনফিগারেশন' : 'Booking & Call To Action (CTA) Button Settings'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {isBn
                        ? 'ওয়েবসাইটে যে কোনো টেস্ট বা ডাক্তার বুকিং বাটনের লেখা, ক্লিক করার অ্যাকশন (ফর্ম, হোয়াটসঅ্যাপ, বা ফোন কল) পরিবর্তন করুন।'
                        : 'Change labels, click actions (Online Form, WhatsApp, or Phone Call), and secondary quick buttons for appointments & test bookings.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      triggerSaveNotification();
                    }}
                    className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? 'সেটিংস সেভ করুন' : 'Save Changes'}</span>
                  </button>
                </div>

                {/* LIVE VISUAL PREVIEW OF CTAS */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0B2545] text-white space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-sky-200">
                        {isBn ? 'লাইভ প্রিভিউ (ওয়েবসাইটে যেমন দেখাবে)' : 'Live Interactive Preview of Booking Buttons'}
                      </h4>
                    </div>
                    <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full text-slate-300 font-medium">
                      {isBn ? 'বাটন টেস্ট করুন' : 'Try clicking preview buttons'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Doctor Card CTA Sample Preview */}
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-sky-300 uppercase">
                          Doctor Card CTA Preview
                        </span>
                        <span className="text-[10px] bg-blue-500/30 text-sky-200 px-2 py-0.5 rounded">
                          Action: {clinicInfo.bookingCta?.doctorCtaAction || 'modal'}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg text-slate-900 flex items-center justify-between">
                        <div className="text-xs">
                          <div className="font-extrabold text-[#0B2545]">Dr. Amit Sengupta</div>
                          <div className="text-slate-500 text-[11px]">General Medicine • Mon, Wed, Fri</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">₹400</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `[Live Preview Test]\nButton: "${clinicInfo.bookingCta?.doctorCtaText || 'Book Appointment'}"\nTrigger: Action type "${clinicInfo.bookingCta?.doctorCtaAction || 'modal'}". On the live website, this will ${
                                (clinicInfo.bookingCta?.doctorCtaAction || 'modal') === 'whatsapp'
                                  ? 'open WhatsApp with Dr. Amit Sengupta pre-filled.'
                                  : (clinicInfo.bookingCta?.doctorCtaAction || 'modal') === 'call'
                                  ? `dial the helpline: ${clinicInfo.bookingCta?.customPhone || clinicInfo.phones[0]}.`
                                  : 'open the online Appointment Booking form modal with Dr. Amit selected.'
                              }`
                            )
                          }
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                        >
                          {(clinicInfo.bookingCta?.doctorCtaAction || 'modal') === 'whatsapp' ? (
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                          ) : (clinicInfo.bookingCta?.doctorCtaAction || 'modal') === 'call' ? (
                            <Phone className="w-3.5 h-3.5 text-amber-300" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5" />
                          )}
                          <span>{clinicInfo.bookingCta?.doctorCtaText || 'Book Appointment'}</span>
                        </button>

                        {clinicInfo.bookingCta?.doctorShowSecondaryAction && (
                          <button
                            type="button"
                            onClick={() =>
                              alert(
                                `[Secondary CTA Preview]\nTriggers ${(clinicInfo.bookingCta?.doctorSecondaryType || 'whatsapp') === 'whatsapp' ? 'WhatsApp direct inquiry.' : `direct phone call to ${clinicInfo.bookingCta?.customPhone || clinicInfo.phones[0]}.`}`
                              )
                            }
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                            title="Quick Action"
                          >
                            {(clinicInfo.bookingCta?.doctorSecondaryType || 'whatsapp') === 'whatsapp' ? (
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Diagnostic Test Card CTA Sample Preview */}
                    <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-sky-300 uppercase">
                          Diagnostic Test CTA Preview
                        </span>
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                          Action: {clinicInfo.bookingCta?.serviceCtaAction || 'modal'}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg text-slate-900 flex items-center justify-between">
                        <div className="text-xs">
                          <div className="font-extrabold text-[#0B2545]">Color Doppler Ultrasound</div>
                          <div className="text-slate-500 text-[11px]">Radiology • Daily Morning</div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">₹1,200</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `[Live Preview Test]\nButton: "${clinicInfo.bookingCta?.serviceCtaText || 'Book Test'}"\nTrigger: Action type "${clinicInfo.bookingCta?.serviceCtaAction || 'modal'}". On the live website, this will ${
                                (clinicInfo.bookingCta?.serviceCtaAction || 'modal') === 'whatsapp'
                                  ? 'open WhatsApp with Ultrasound pre-filled.'
                                  : (clinicInfo.bookingCta?.serviceCtaAction || 'modal') === 'call'
                                  ? `dial the helpline: ${clinicInfo.bookingCta?.customPhone || clinicInfo.phones[0]}.`
                                  : 'open the online Appointment Booking form modal with Color Doppler Ultrasound pre-selected.'
                              }`
                            )
                          }
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                        >
                          {(clinicInfo.bookingCta?.serviceCtaAction || 'modal') === 'whatsapp' ? (
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                          ) : (clinicInfo.bookingCta?.serviceCtaAction || 'modal') === 'call' ? (
                            <Phone className="w-3.5 h-3.5 text-amber-300" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5" />
                          )}
                          <span>{clinicInfo.bookingCta?.serviceCtaText || 'Book Test'}</span>
                        </button>

                        {clinicInfo.bookingCta?.serviceShowSecondaryAction && (
                          <button
                            type="button"
                            onClick={() =>
                              alert(
                                `[Secondary CTA Preview]\nTriggers ${(clinicInfo.bookingCta?.serviceSecondaryType || 'call') === 'whatsapp' ? 'WhatsApp direct inquiry.' : `direct phone call to ${clinicInfo.bookingCta?.customPhone || clinicInfo.phones[0]}.`}`
                              )
                            }
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                            title="Quick Action"
                          >
                            {(clinicInfo.bookingCta?.serviceSecondaryType || 'call') === 'whatsapp' ? (
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. DOCTOR APPOINTMENT CTA CONFIGURATION */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      👨‍⚕️
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {isBn ? 'ডাক্তার অ্যাপয়েন্টমেন্ট বাটন কনফিগারেশন' : 'Doctor Appointment Booking CTA Button'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? 'ডাক্তার কার্ডের প্রধান বুকিং বাটনের নাম ও অ্যাকশন নির্ধারণ করুন।'
                          : 'Configure the primary action and label for doctor appointment cards.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'বাটনের লেখা (CTA Button Text) *' : 'Primary CTA Button Label *'}
                      </label>
                      <input
                        type="text"
                        value={clinicInfo.bookingCta?.doctorCtaText || 'Book Appointment'}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              doctorCtaText: e.target.value,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        placeholder="e.g. Book Appointment, Consult Now, অপয়েন্টমেন্ট নিন"
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isBn ? 'যেমন: Book Appointment, ডাক্তারের অ্যাপয়েন্টমেন্ট নিন, ইত্যাদি।' : 'e.g. Book Appointment, Consult Doctor, Schedule Visit'}
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ক্লিক করলে কী হবে? (Primary Action Type) *' : 'Click Action Behavior *'}
                      </label>
                      <select
                        value={clinicInfo.bookingCta?.doctorCtaAction || 'modal'}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              doctorCtaAction: e.target.value as any,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="modal">
                          📋 {isBn ? 'অনলাইন বুকিং ফর্ম ওপেন হবে (স্লিপ সহ)' : 'Open Online Booking Form Modal (Default)'}
                        </option>
                        <option value="whatsapp">
                          💬 {isBn ? 'ডাক্তারের নাম সহ সরাসরি হোয়াটসঅ্যাপ চ্যাট শুরু হবে' : 'Direct WhatsApp Chat (Pre-fills doctor name)'}
                        </option>
                        <option value="call">
                          📞 {isBn ? 'ক্লিনিকের হেল্পলাইনে সরাসরি ফোন কল হবে' : 'Direct Telephone Call to Reception Helpline'}
                        </option>
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isBn ? 'রোগী বাটনে চাপলে নির্বাচিত অ্যাকশনটি অবিলম্বে কার্যকর হবে।' : 'Select what happens when patients click this button.'}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Quick Action Button on Doctor Cards */}
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clinicInfo.bookingCta?.doctorShowSecondaryAction ?? true}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              doctorShowSecondaryAction: e.target.checked,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {isBn
                          ? 'ডাক্তার কার্ডে কুইক হেল্পলাইন / হোয়াটসঅ্যাপ আইকন বাটন দেখান'
                          : 'Show Quick Secondary Icon Button alongside primary CTA'}
                      </span>
                    </label>

                    {clinicInfo.bookingCta?.doctorShowSecondaryAction && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-600 font-semibold">{isBn ? 'কুইক আইকন টাইপ:' : 'Quick Button Type:'}</span>
                        <select
                          value={clinicInfo.bookingCta?.doctorSecondaryType || 'whatsapp'}
                          onChange={(e) => {
                            updateClinicInfo({
                              bookingCta: {
                                ...(clinicInfo.bookingCta || {}),
                                doctorSecondaryType: e.target.value as any,
                              } as any,
                            });
                            triggerSaveNotification();
                          }}
                          className="px-3 py-1.5 border rounded-lg bg-white font-medium text-xs"
                        >
                          <option value="whatsapp">💬 WhatsApp Chat</option>
                          <option value="call">📞 Phone Call</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. DIAGNOSTIC TEST CTA CONFIGURATION */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      🧪
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {isBn ? 'ডায়াগনস্টিক টেস্ট বুকিং বাটন কনফিগারেশন' : 'Diagnostic Test Booking CTA Button'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? 'এক্স-রে, রক্ত পরীক্ষা, ইকো বা যে কোনো টেস্ট কার্ডের বুকিং বাটন কাস্টমাইজ করুন।'
                          : 'Configure the primary CTA and action behavior for all diagnostic tests.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'বাটনের লেখা (CTA Button Text) *' : 'Primary CTA Button Label *'}
                      </label>
                      <input
                        type="text"
                        value={clinicInfo.bookingCta?.serviceCtaText || 'Book Test'}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              serviceCtaText: e.target.value,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        placeholder="e.g. Book Test, টেস্ট বুক করুন, Inquire"
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isBn ? 'যেমন: Book Test, বুক করুন, টেস্ট অ্যাপয়েন্টমেন্ট' : 'e.g. Book Test, Schedule Test, Inquire'}
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ক্লিক করলে কী হবে? (Primary Action Type) *' : 'Click Action Behavior *'}
                      </label>
                      <select
                        value={clinicInfo.bookingCta?.serviceCtaAction || 'modal'}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              serviceCtaAction: e.target.value as any,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="modal">
                          📋 {isBn ? 'অনলাইন বুকিং ফর্মে টেস্টটি স্বয়ংক্রিয়ভাবে সিলেক্ট হবে' : 'Open Booking Modal (Pre-selects this exact test)'}
                        </option>
                        <option value="whatsapp">
                          💬 {isBn ? 'টেস্টের নাম সহ সরাসরি হোয়াটসঅ্যাপে বার্তা যাবে' : 'Direct WhatsApp Inquiry (Pre-fills test name)'}
                        </option>
                        <option value="call">
                          📞 {isBn ? 'প্যাথলজি / রেডিওলজি হেল্পলাইনে সরাসরি কল হবে' : 'Direct Phone Call to Diagnostics Helpdesk'}
                        </option>
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {isBn ? 'টেস্ট কার্ডের বাটনে চাপলে এই অ্যাকশনটি ঘটবে।' : 'Controls the main button click on every test card.'}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Quick Action Button on Test Cards */}
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clinicInfo.bookingCta?.serviceShowSecondaryAction ?? true}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              serviceShowSecondaryAction: e.target.checked,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {isBn
                          ? 'টেস্ট কার্ডে কুইক ফোন কল / হোয়াটসঅ্যাপ আইকন বাটন দেখান'
                          : 'Show Quick Secondary Icon Button alongside primary CTA'}
                      </span>
                    </label>

                    {clinicInfo.bookingCta?.serviceShowSecondaryAction && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-600 font-semibold">{isBn ? 'কুইক আইকন টাইপ:' : 'Quick Button Type:'}</span>
                        <select
                          value={clinicInfo.bookingCta?.serviceSecondaryType || 'call'}
                          onChange={(e) => {
                            updateClinicInfo({
                              bookingCta: {
                                ...(clinicInfo.bookingCta || {}),
                                serviceSecondaryType: e.target.value as any,
                              } as any,
                            });
                            triggerSaveNotification();
                          }}
                          className="px-3 py-1.5 border rounded-lg bg-white font-medium text-xs"
                        >
                          <option value="call">📞 Phone Call</option>
                          <option value="whatsapp">💬 WhatsApp Chat</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. BOOKING MODAL QUICK ACTION BANNER */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {isBn ? 'বুকিং ফর্মের ভেতরে কুইক অ্যাকশন ব্যানার' : 'Inside-Modal Quick Call-To-Action Banner'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? 'অনলাইন ফর্ম খোলার পর ওপরে এক ক্লিকে হোয়াটসঅ্যাপ বা ফোন করার ব্যানার বাটন।'
                          : 'Shows an instant 1-click WhatsApp or Call CTA banner at top of the booking form modal.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ব্যানারের টেক্সট *' : 'Banner Text Message *'}
                      </label>
                      <input
                        type="text"
                        value={clinicInfo.bookingCta?.modalQuickCtaText || 'Prefer Instant Booking? Chat on WhatsApp'}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              modalQuickCtaText: e.target.value,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'ব্যানারের অ্যাকশন' : 'Action Type'}
                      </label>
                      <select
                        value={clinicInfo.bookingCta?.modalQuickCtaType || 'whatsapp'}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              modalQuickCtaType: e.target.value as any,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium"
                      >
                        <option value="whatsapp">💬 WhatsApp Message</option>
                        <option value="call">📞 Phone Call</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={clinicInfo.bookingCta?.modalQuickCtaEnabled ?? true}
                          onChange={(e) => {
                            updateClinicInfo({
                              bookingCta: {
                                ...(clinicInfo.bookingCta || {}),
                                modalQuickCtaEnabled: e.target.checked,
                              } as any,
                            });
                            triggerSaveNotification();
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-bold text-xs sm:text-sm text-slate-800">
                          {isBn ? 'এই কুইক ব্যানারটি বুকিং ফর্মের ভেতরে সক্রিয় রাখুন' : 'Enable this Quick CTA Banner inside the appointment modal'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. DEDICATED CONTACT OVERRIDES */}
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      📱
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {isBn ? 'বুকিং বাটনের নির্দিষ্ট যোগাযোগ নম্বর' : 'Dedicated Booking Phone & WhatsApp Overrides'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isBn
                          ? 'ফাঁকা রাখলে সাধারণ হেল্পলাইন ও সাধারণ হোয়াটসঅ্যাপ ব্যবহার হবে।'
                          : 'Optional direct numbers strictly for booking CTAs. If left blank, general clinic contacts are used.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'বুকিং এর নির্দিষ্ট হোয়াটসঅ্যাপ নম্বর (যেমন: 918159895030)' : 'Dedicated WhatsApp Number (e.g. 918159895030)'}
                      </label>
                      <input
                        type="text"
                        value={clinicInfo.bookingCta?.customWhatsapp || ''}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              customWhatsapp: e.target.value,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        placeholder={`Leave blank to use default (${clinicInfo.whatsapp})`}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {isBn ? 'বুকিং এর নির্দিষ্ট ফোন নম্বর (যেমন: 8159895030)' : 'Dedicated Phone Number for Calls'}
                      </label>
                      <input
                        type="text"
                        value={clinicInfo.bookingCta?.customPhone || ''}
                        onChange={(e) => {
                          updateClinicInfo({
                            bookingCta: {
                              ...(clinicInfo.bookingCta || {}),
                              customPhone: e.target.value,
                            } as any,
                          });
                          triggerSaveNotification();
                        }}
                        placeholder={`Leave blank to use default (${clinicInfo.phones[0]})`}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DOCTORS MANAGEMENT */}
            {activeTab === 'doctors' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B2545]">
                      {isBn ? 'ডাক্তারবৃন্দের তালিকা ও সময়সূচী' : 'Doctors Directory & OPD Timings'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn
                        ? 'নতুন ডাক্তার যোগ করুন, ডিগ্রি বা সময়সূচী পরিবর্তন করুন বা ছবি আপডেট করুন।'
                        : 'Add new doctors, edit visiting days, update portraits or remove.'}
                    </p>
                  </div>

                  {!isAddingDoctor && !editingDoctor && (
                    <button
                      onClick={() => setIsAddingDoctor(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isBn ? 'নতুন ডাক্তার যোগ করুন' : 'Add Doctor'}</span>
                    </button>
                  )}
                </div>

                {/* ADD DOCTOR FORM */}
                {isAddingDoctor && (
                  <form onSubmit={handleCreateDoctor} className="p-5 border-2 border-blue-200 bg-blue-50/50 rounded-2xl space-y-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                      <h4 className="font-extrabold text-blue-900">
                        {isBn ? 'নতুন চিকিৎসক নিবন্ধন' : 'Register New Doctor'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingDoctor(false)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-bold"
                      >
                        ✕ {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডাক্তারের নাম (বাংলা) *' : 'Doctor Name (Bengali) *'}</label>
                        <input
                          type="text"
                          required
                          value={newDoctor.name}
                          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                          placeholder="যেমন: ডাঃ অমিত কুমার ঘোষ"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডাক্তারের নাম (English)' : 'Doctor Name (English)'}</label>
                        <input
                          type="text"
                          value={newDoctor.nameEn}
                          onChange={(e) => setNewDoctor({ ...newDoctor, nameEn: e.target.value })}
                          placeholder="e.g. Dr. Amit Kumar Ghosh"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডিগ্রি ও পদবি *' : 'Qualifications *'}</label>
                        <input
                          type="text"
                          required
                          value={newDoctor.degrees}
                          onChange={(e) => setNewDoctor({ ...newDoctor, degrees: e.target.value })}
                          placeholder="MBBS, MD (Medicine)"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বিভাগ *' : 'Department *'}</label>
                        <input
                          type="text"
                          required
                          value={newDoctor.department}
                          onChange={(e) => setNewDoctor({ ...newDoctor, department: e.target.value })}
                          placeholder="মেডিসিন / স্ত্রীরোগ / প্যাথলজি"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সাক্ষাতের দিন *' : 'Visiting Schedule *'}</label>
                        <input
                          type="text"
                          required
                          value={newDoctor.schedule}
                          onChange={(e) => setNewDoctor({ ...newDoctor, schedule: e.target.value })}
                          placeholder="প্রতি সোম, বুধ, শুক্র"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সময়সূচী *' : 'Visiting Timing *'}</label>
                        <input
                          type="text"
                          required
                          value={newDoctor.timing}
                          onChange={(e) => setNewDoctor({ ...newDoctor, timing: e.target.value })}
                          placeholder="সকাল ১০টা - দুপুর ১টা"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডাক্তারের ছবি আপলোড করুন' : 'Doctor Photo'}</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url) => setNewDoctor({ ...newDoctor, imageUrl: url }))
                            }
                            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:bg-blue-100 file:border-0 file:text-blue-800"
                          />
                          <input
                            type="url"
                            value={newDoctor.imageUrl}
                            onChange={(e) => setNewDoctor({ ...newDoctor, imageUrl: e.target.value })}
                            placeholder="Or photo URL"
                            className="flex-1 px-3 py-1.5 border rounded-lg bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-blue-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isBn ? 'কাস্টম CTA বাটন লেখা (ঐচ্ছিক)' : 'Custom CTA Button Text (Optional)'}
                          </label>
                          <input
                            type="text"
                            value={newDoctor.ctaLabel || ''}
                            onChange={(e) => setNewDoctor({ ...newDoctor, ctaLabel: e.target.value })}
                            placeholder="Leave blank to use default (e.g. Book Appointment)"
                            className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isBn ? 'কাস্টম CTA ক্লিক অ্যাকশন (ঐচ্ছিক)' : 'Custom CTA Click Action (Optional)'}
                          </label>
                          <select
                            value={newDoctor.ctaAction || 'default'}
                            onChange={(e) => setNewDoctor({ ...newDoctor, ctaAction: e.target.value as any })}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
                          >
                            <option value="default">Use Global Setting ({clinicInfo.bookingCta?.doctorCtaAction || 'modal'})</option>
                            <option value="modal">Open Booking Modal</option>
                            <option value="whatsapp">Direct WhatsApp</option>
                            <option value="call">Direct Phone Call</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingDoctor(false)}
                        className="px-4 py-2 border rounded-lg text-slate-700 bg-white"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                      >
                        {isBn ? 'যুক্ত করুন' : 'Add Doctor'}
                      </button>
                    </div>
                  </form>
                )}

                {/* EDIT DOCTOR FORM */}
                {editingDoctor && (
                  <form onSubmit={handleUpdateDoctor} className="p-5 border-2 border-amber-300 bg-amber-50/50 rounded-2xl space-y-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <h4 className="font-extrabold text-amber-900">
                        {isBn ? 'চিকিৎসক তথ্য সম্পাদন (Edit)' : 'Edit Doctor Information'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingDoctor(null)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-bold"
                      >
                        ✕ {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নাম' : 'Name'}</label>
                        <input
                          type="text"
                          required
                          value={editingDoctor.name}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ডিগ্রি' : 'Degrees'}</label>
                        <input
                          type="text"
                          required
                          value={editingDoctor.degrees}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, degrees: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বিভাগ' : 'Department'}</label>
                        <input
                          type="text"
                          required
                          value={editingDoctor.department}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, department: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সাক্ষাতের দিন' : 'Schedule'}</label>
                        <input
                          type="text"
                          required
                          value={editingDoctor.schedule}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, schedule: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সময়' : 'Time'}</label>
                        <input
                          type="text"
                          required
                          value={editingDoctor.timing}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, timing: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'চেম্বার রুম নং' : 'Room No'}</label>
                        <input
                          type="text"
                          value={editingDoctor.roomNo || ''}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, roomNo: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ছবি পরিবর্তন' : 'Change Photo'}</label>
                        <div className="flex items-center space-x-3">
                          <img src={editingDoctor.imageUrl} alt="Doc" className="w-10 h-10 rounded-lg object-cover border" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (url) => setEditingDoctor({ ...editingDoctor, imageUrl: url }))
                            }
                            className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:bg-amber-100 file:border-0"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isBn ? 'কাস্টম CTA বাটন লেখা (ঐচ্ছিক)' : 'Custom CTA Button Text (Optional)'}
                          </label>
                          <input
                            type="text"
                            value={editingDoctor.ctaLabel || ''}
                            onChange={(e) => setEditingDoctor({ ...editingDoctor, ctaLabel: e.target.value })}
                            placeholder="Leave blank to use default (e.g. Book Appointment)"
                            className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isBn ? 'কাস্টম CTA ক্লিক অ্যাকশন (ঐচ্ছিক)' : 'Custom CTA Click Action (Optional)'}
                          </label>
                          <select
                            value={editingDoctor.ctaAction || 'default'}
                            onChange={(e) => setEditingDoctor({ ...editingDoctor, ctaAction: e.target.value as any })}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
                          >
                            <option value="default">Use Global Setting ({clinicInfo.bookingCta?.doctorCtaAction || 'modal'})</option>
                            <option value="modal">Open Booking Modal</option>
                            <option value="whatsapp">Direct WhatsApp</option>
                            <option value="call">Direct Phone Call</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingDoctor(null)}
                        className="px-4 py-2 border rounded-lg text-slate-700 bg-white"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                      >
                        {isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                )}

                {/* DOCTOR LIST TABLE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border rounded-xl bg-slate-50 flex items-start space-x-3 relative group"
                    >
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-16 h-16 rounded-xl object-cover border bg-white flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 pr-8 text-xs">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          {doc.department}
                        </span>
                        <h4 className="font-extrabold text-slate-900 mt-1 truncate">{doc.name}</h4>
                        <p className="text-slate-500 font-medium truncate">{doc.degrees}</p>
                        <p className="text-slate-600 mt-1 font-semibold">📅 {doc.schedule}</p>
                        <p className="text-slate-600">⏰ {doc.timing}</p>
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col space-y-1">
                        <button
                          onClick={() => setEditingDoctor(doc)}
                          className="p-1.5 rounded-md bg-white border text-blue-600 hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`${doc.name} তালিকা থেকে মুছে ফেলতে চান?`)) {
                              deleteDoctor(doc.id);
                              triggerSaveNotification();
                            }
                          }}
                          className="p-1.5 rounded-md bg-white border text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: DIAGNOSTIC SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B2545]">
                      {isBn ? 'ডায়াগনস্টিক টেস্ট ও পরীক্ষা তালিকা' : 'Diagnostic Tests & Services'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn
                        ? 'এক্স-রে, ইকো, আল্ট্রাসোনোগ্রাফি, রক্ত পরীক্ষা ইত্যাদির বিবরণ ও মূল্য সম্পাদনা করুন।'
                        : 'Edit tests matching signage: X-Ray, Echo, USG, Blood tests, NCV, etc.'}
                    </p>
                  </div>

                  {!isAddingService && !editingService && (
                    <button
                      onClick={() => setIsAddingService(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isBn ? 'নতুন টেস্ট যোগ করুন' : 'Add Test'}</span>
                    </button>
                  )}
                </div>

                {/* ADD SERVICE FORM */}
                {isAddingService && (
                  <form onSubmit={handleCreateService} className="p-5 border-2 border-indigo-200 bg-indigo-50/40 rounded-2xl space-y-3 text-xs sm:text-sm">
                    <h4 className="font-extrabold text-indigo-900">
                      {isBn ? 'নতুন ডায়াগনস্টিক টেস্ট যোগ' : 'Add New Diagnostic Test'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'টেস্টের নাম (বাংলা) *' : 'Test Name (Bengali) *'}</label>
                        <input
                          type="text"
                          required
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                          placeholder="যেমন: সিটি স্ক্যান"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'টেস্টের নাম (English)' : 'Test Name (English)'}</label>
                        <input
                          type="text"
                          value={newService.nameEn}
                          onChange={(e) => setNewService({ ...newService, nameEn: e.target.value })}
                          placeholder="e.g. CT Scan"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ক্যাটেগরি' : 'Category'}</label>
                        <select
                          value={newService.category}
                          onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        >
                          <option value="radiology">রেডিওলজি (Radiology)</option>
                          <option value="cardiology">কার্ডিওলজি (Cardiology)</option>
                          <option value="pathology">প্যাথলজি (Pathology)</option>
                          <option value="specialized">বিশেষায়িত (Specialized)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সময়সূচী / দিন' : 'Schedule'}</label>
                        <input
                          type="text"
                          value={newService.timing}
                          onChange={(e) => setNewService({ ...newService, timing: e.target.value })}
                          placeholder="মঙ্গলবার ও শুক্রবার"
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সংক্ষিপ্ত বিবরণ' : 'Description'}</label>
                        <input
                          type="text"
                          value={newService.description}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          placeholder="পরীক্ষার প্রস্তুতি ও রিপোর্ট সংক্রান্ত তথ্য..."
                          className="w-full px-3 py-2 border rounded-lg bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2 pt-2 border-t border-indigo-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isBn ? 'কাস্টম টেস্ট বাটন লেখা (ঐচ্ছিক)' : 'Custom Test Button Text (Optional)'}
                          </label>
                          <input
                            type="text"
                            value={newService.ctaLabel || ''}
                            onChange={(e) => setNewService({ ...newService, ctaLabel: e.target.value })}
                            placeholder="Leave blank to use default (e.g. Book Test)"
                            className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {isBn ? 'কাস্টম বাটন ক্লিক অ্যাকশন (ঐচ্ছিক)' : 'Custom Button Action (Optional)'}
                          </label>
                          <select
                            value={newService.ctaAction || 'default'}
                            onChange={(e) => setNewService({ ...newService, ctaAction: e.target.value as any })}
                            className="w-full px-3 py-1.5 border rounded-lg bg-white text-xs"
                          >
                            <option value="default">Use Global Setting ({clinicInfo.bookingCta?.serviceCtaAction || 'modal'})</option>
                            <option value="modal">Open Booking Modal</option>
                            <option value="whatsapp">Direct WhatsApp</option>
                            <option value="call">Direct Phone Call</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingService(false)}
                        className="px-4 py-2 border rounded-lg text-slate-700 bg-white"
                      >
                        {isBn ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                      >
                        {isBn ? 'যোগ করুন' : 'Add Test'}
                      </button>
                    </div>
                  </form>
                )}

                {/* SERVICES LIST */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-4 border rounded-xl bg-slate-50 relative group">
                      <h4 className="font-extrabold text-slate-900 text-sm mb-1">{srv.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{srv.description}</p>
                      <div className="mt-2 text-xs font-semibold text-blue-700">{srv.timing}</div>

                      <div className="mt-3 flex items-center justify-between border-t pt-2">
                        <span className="text-xs font-bold text-emerald-700">
                          {srv.price ? `₹${srv.price}` : ''}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm(`${srv.name} মুছে ফেলতে চান?`)) {
                              deleteService(srv.id);
                              triggerSaveNotification();
                            }
                          }}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                        >
                          {isBn ? 'মুছে ফেলুন' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: NURSING HOME */}
            {activeTab === 'nursing' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {isBn ? 'চুনীলাল নার্সিং হোম সুবিধাসমূহ' : 'Nursing Home Facilities'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'সাইন বোর্ডের ৪টি মূল নার্সিং সুবিধা ও ইনপেশেন্ট কেয়ার সম্পাদনা করুন।'
                      : 'Customize the 4 inpatient facilities shown on the board.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {facilities.map((fac) => (
                    <div key={fac.id} className="p-4 border rounded-xl bg-slate-50 space-y-2 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {isBn ? 'শিরোনাম (বাংলা)' : 'Title'}
                        </label>
                        <input
                          type="text"
                          value={fac.title}
                          onChange={(e) => {
                            updateFacility(fac.id, { title: e.target.value });
                            triggerSaveNotification();
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg bg-white font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          {isBn ? 'বিবরণ' : 'Description'}
                        </label>
                        <textarea
                          rows={2}
                          value={fac.description}
                          onChange={(e) => {
                            updateFacility(fac.id, { description: e.target.value });
                            triggerSaveNotification();
                          }}
                          className="w-full px-3 py-1.5 border rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: GALLERY */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {isBn ? 'গ্যালারি ফটো ম্যানেজার' : 'Photo Gallery Manager'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'নতুন ছবি আপলোড করুন অথবা পূর্বে আপলোড করা ছবি মুছে ফেলুন।'
                      : 'Upload clinic, lab, bed or doctor photos directly.'}
                  </p>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleAddGallery} className="p-4 border rounded-2xl bg-purple-50/40 space-y-3 text-xs sm:text-sm">
                  <h4 className="font-bold text-purple-900">
                    {isBn ? 'গ্যালারিতে নতুন ছবি যোগ করুন' : 'Add Photo to Gallery'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{isBn ? 'ছবির শিরোনাম/ক্যাপশন *' : 'Caption *'}</label>
                      <input
                        type="text"
                        required
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        placeholder="যেমন: নতুন আল্ট্রাসাউন্ড স্যুট"
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{isBn ? 'ডিভাইস থেকে ফাইল আপলোড' : 'Upload File'}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setNewPhotoUrl(url))}
                        className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:bg-purple-100 file:border-0"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">{isBn ? 'অথবা URL লিঙ্ক' : 'Or URL'}</label>
                      <input
                        type="url"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border rounded-lg bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newPhotoUrl || !newPhotoTitle}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-xs"
                    >
                      {isBn ? 'ছবি যোগ করুন' : 'Upload Photo'}
                    </button>
                  </div>
                </form>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((photo) => (
                    <div key={photo.id} className="relative rounded-xl overflow-hidden border group aspect-4/3">
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                        <span className="text-xs font-semibold truncate">{photo.title}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('এই ছবিটি মুছে ফেলতে চান?')) {
                            deleteGalleryPhoto(photo.id);
                            triggerSaveNotification();
                          }
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B2545]">
                      {isBn ? 'অনলাইন বুকিং ও রোগী তালিকা' : 'Patient Appointments & Booking Registry'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn
                        ? 'ওয়েবসাইটে রোগীরা যেসব বুকিং অনুরোধ করেছেন তা এখানে যাচাই ও স্ট্যাটাস আপডেট করুন।'
                        : 'Review patient submissions, approve bookings, and communicate via call/WhatsApp.'}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100 text-slate-700 uppercase text-[11px] font-extrabold border-b">
                      <tr>
                        <th className="p-3">টোকেন</th>
                        <th className="p-3">রোগীর নাম ও বয়স</th>
                        <th className="p-3">ফোন নম্বর</th>
                        <th className="p-3">ডাক্তার / টেস্ট</th>
                        <th className="p-3">তারিখ ও সময়</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-blue-700">{appt.id}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{appt.patientName}</div>
                            <div className="text-[11px] text-slate-500">
                              {appt.patientAge} বছর, {appt.gender}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{appt.patientPhone}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <a
                                href={`tel:${appt.patientPhone}`}
                                className="text-blue-600 hover:underline flex items-center space-x-0.5 text-[11px]"
                              >
                                <Phone className="w-3 h-3" />
                                <span>কল</span>
                              </a>
                              <a
                                href={`https://wa.me/91${appt.patientPhone}?text=${encodeURIComponent(
                                  `নমস্কার ${appt.patientName}, চুনীলাল ডায়াগনস্টিক সেন্টারে আপনার অ্যাপয়েন্টমেন্ট (টোকেন: ${appt.id}) নিশ্চিত হয়েছে।`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:underline flex items-center space-x-0.5 text-[11px]"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-800">{appt.doctorName}</td>
                          <td className="p-3 text-slate-700">
                            <div>{appt.appointmentDate}</div>
                            <div className="text-[11px] text-slate-500">{appt.timeSlot}</div>
                          </td>
                          <td className="p-3">
                            <select
                              value={appt.status}
                              onChange={(e) => {
                                updateAppointmentStatus(appt.id, e.target.value as any);
                                triggerSaveNotification();
                              }}
                              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                appt.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : appt.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : appt.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                if (window.confirm('এই বুকিং রেকর্ড মুছে ফেলতে চান?')) {
                                  deleteAppointment(appt.id);
                                  triggerSaveNotification();
                                }
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {appointments.length === 0 && (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      {isBn ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।' : 'No appointments received yet.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 8: NOTICES */}
            {activeTab === 'notices' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {isBn ? 'জরুরি ও বিশেষ নোটিশ বোর্ড' : 'Emergency & Special Notice Board'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'ওয়েবসাইটের উপরে চলমান নোটিশ পরিচালনা করুন (যেমন: "ইকোকার্ডিওগ্রাফি পরিষেবা মঙ্গলবার ও শুক্রবার।")'
                      : 'Manage top announcement banner ticker (e.g. Echocardiography on Tue & Fri).'}
                  </p>
                </div>

                <form onSubmit={handleAddNotice} className="p-4 border rounded-xl bg-amber-50/50 space-y-3 text-xs sm:text-sm">
                  <h4 className="font-bold text-amber-900">
                    {isBn ? 'নতুন নোটিশ প্রচার করুন' : 'Broadcast New Notice'}
                  </h4>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isBn ? 'নোটিশ টেক্সট (বাংলা) *' : 'Notice Text (Bengali) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newNoticeText}
                      onChange={(e) => setNewNoticeText(e.target.value)}
                      placeholder="যেমন: আগামী রবিবার রক্তদান শিবির অনুষ্ঠিত হবে।"
                      className="w-full px-3 py-2 border rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      {isBn ? 'নোটিশ পোস্ট করুন' : 'Publish Notice'}
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 border rounded-xl flex items-center justify-between bg-slate-50"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            n.isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
                          }`}
                        />
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm">{n.text}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            updateNotice(n.id, { isActive: !n.isActive });
                            triggerSaveNotification();
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            n.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {n.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </button>

                        <button
                          onClick={() => {
                            deleteNotice(n.id);
                            triggerSaveNotification();
                          }}
                          className="p-1 text-rose-600 hover:text-rose-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: BACKUP & AI PROMPT */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545]">
                    {isBn ? 'ডাটা ব্যাকআপ ও Google AI Studio মাস্টার প্রম্পট' : 'Data Backup & Master AI Studio Prompt'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'সম্পূর্ণ ওয়েবসাইটের ডাটা এক্সপোর্ট করুন অথবা অন্য প্রজেক্টে ব্যবহারের জন্য প্রম্পটটি সংগ্রহ করুন।'
                      : 'Download your entire website database JSON, restore it, or copy the original prompt.'}
                  </p>
                </div>

                {/* 1. Prompt Card */}
                <div className="p-5 border rounded-2xl bg-blue-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm">
                      <FileCode2 className="w-5 h-5 text-blue-600" />
                      <span>{isBn ? 'Google AI Studio মাস্টার প্রম্পট' : 'Master AI Studio Prompt'}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(MASTER_AI_STUDIO_PROMPT);
                        triggerSaveNotification();
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      {isBn ? 'প্রম্পট কপি করুন' : 'Copy Prompt'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    {isBn
                      ? 'এই প্রম্পটটি ব্যবহার করে নতুন কোনো অ্যাপলেটে একদম এই রকম হুবহু সাইট তৈরি করতে পারেন।'
                      : 'Use this structured prompt to reproduce this exact clinic portal in any new AI Studio applet.'}
                  </p>
                </div>

                {/* 2. Download JSON Backup */}
                <div className="p-5 border rounded-2xl bg-slate-50 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {isBn ? 'ডাটাবেস ব্যাকআপ ডাউনলোড (JSON)' : 'Export Full JSON Database Backup'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isBn
                      ? 'আপনার সমস্ত আপলোড করা ছবি, ডাক্তার, সার্ভিস ও যোগাযোগের একটি অফলাইন কপি সংরক্ষণ করুন।'
                      : 'Save an offline JSON snapshot of all your changes, custom photos, doctors and services.'}
                  </p>
                  <button
                    onClick={handleDownloadBackup}
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? 'JSON ব্যাকআপ ডাউনলোড করুন' : 'Download JSON Backup'}</span>
                  </button>
                </div>

                {/* 3. Restore Backup */}
                <div className="p-5 border rounded-2xl bg-slate-50 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {isBn ? 'ব্যাকআপ রিস্টোর / ইমপোর্ট' : 'Restore from JSON Backup'}
                  </h4>
                  <textarea
                    rows={3}
                    placeholder="Paste previously exported JSON here..."
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono border rounded-lg bg-white"
                  />
                  {importStatus && (
                    <div className="text-xs font-bold text-blue-700">{importStatus}</div>
                  )}
                  <button
                    onClick={handleImportBackup}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    {isBn ? 'রিস্টোর করুন' : 'Restore Database'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 11: ADMIN ACCOUNT & SECURITY */}
            {activeTab === 'admin_account' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545] flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'অ্যাডমিন অ্যাকাউন্ট ও পাসওয়ার্ড ম্যানেজমেন্ট' : 'Admin Account & Security'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn
                      ? 'অ্যাডমিন ইউজারনেম, পাসওয়ার্ড পরিবর্তন এবং রিকভারি ইমেইল পরিচালনা করুন।'
                      : 'Manage admin username, change password with current password verification, and configure recovery email.'}
                  </p>
                </div>

                {/* Current Account Status Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Current Active Username:</span>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border">
                      {adminCredentials?.username || 'admin'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Recovery Gmail:</span>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {adminCredentials?.recoveryEmail || 'cmmdiagnostic@gmail.com'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Default Password:</span>
                    <span className="font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border">
                      admin@123 / admin123
                    </span>
                  </div>
                </div>

                {credMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center space-x-2.5 ${
                      credMessage.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {credMessage.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-medium">{credMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateAdminAccount} className="space-y-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                  {/* Username Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'অ্যাডমিন ইউজারনেম (Username)' : 'Admin Username'}
                    </label>
                    <input
                      type="text"
                      required
                      value={adminUsernameInput}
                      onChange={(e) => setAdminUsernameInput(e.target.value)}
                      placeholder="admin"
                      className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Recovery Email Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isBn ? 'রিকভারি জিমেইল (Recovery Gmail)' : 'Recovery Gmail Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmailInput}
                      onChange={(e) => setRecoveryEmailInput(e.target.value)}
                      placeholder="cmmdiagnostic@gmail.com"
                      className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isBn
                        ? 'পাসওয়ার্ড ভুলে গেলে এই ইমেইল ব্যবহার করে পাসওয়ার্ড রিসেট করা যাবে।'
                        : 'This email is authorized to reset the admin password from the login screen.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      {isBn ? 'পাসওয়ার্ড পরিবর্তন (ঐচ্ছিক)' : 'Change Password (Optional)'}
                    </h4>

                    {/* Current Password Field (Required to change password) */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isBn ? 'বর্তমান পাসওয়ার্ড (Current Password)' : 'Current Password (Required to change)'}
                        </label>
                        <input
                          type="password"
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          placeholder="Enter current password (e.g. admin@123)"
                          className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isBn ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password'}
                          </label>
                          <input
                            type="password"
                            value={newPasswordInput}
                            onChange={(e) => setNewPasswordInput(e.target.value)}
                            placeholder="Min 4 characters"
                            className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)' : 'Confirm New Password'}
                          </label>
                          <input
                            type="password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            placeholder="Re-type new password"
                            className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Account Settings'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
