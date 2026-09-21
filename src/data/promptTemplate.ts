export const MASTER_AI_STUDIO_PROMPT = `
# Comprehensive Prompt for Building Chunilal Diagnostic Centre & Nursing Home in Google AI Studio

You are an expert full-stack web developer and healthcare UI/UX designer. Create a responsive, accessible, high-performance web application in Google AI Studio for "চুনীলাল ডায়াগনস্টিক সেন্টার ও পলিক্লিনিক / চুনীলাল নার্সিং হোম" (Chunilal Diagnostic Centre, Polyclinic & Nursing Home) based directly on the authentic hospital signage board and reference specifications.

---

## 1. Visual & Branding Identity (Derived from Reference Board)
- **Institution Names**:
  - Primary: "চুনীলাল ডায়াগনস্টিক সেন্টার ও পলিক্লিনিক" (Chunilal Diagnostic Centre & Polyclinic)
  - Secondary / Nursing Wing: "চুনীলাল নার্সিং হোম" (Chunilal Nursing Home)
- **Tagline / Pledge**: "আপনার সুস্বাস্থ্য আমাদের অঙ্গীকার" (with heartbeat/ECG wave visual)
- **Core Pillars**: "আধুনিক প্রযুক্তিতে নির্ভুল পরীক্ষা | অভিজ্ঞ চিকিৎসক | সর্বোত্তম সেবা"
- **Location & Landmark**: "দক্ষিণ বারাসাত বাজার (মহামায়া সিনেমা হলের নিকট)"
- **Contact Numbers**: 8159895030 / 8101802132 / 9434962692 (with direct WhatsApp click-to-chat)
- **Visual Aesthetic**:
  - Deep Medical Navy Blue (#0F3663), Royal Cyan (#0284C7), Emerald Green (#16A34A) for health/trust accents, and clean Off-White/Slate backgrounds (#F8FAFC).
  - High-legibility dual font pairing: 'Hind Siliguri' for authentic Bengali typography and 'Plus Jakarta Sans' for Latin numerals and English text.
  - Symmetrical, rounded cards (8px to 14px radius) with soft drop shadows, accessible WCAG AA contrast (4.5:1+), and responsive touch targets (minimum 44px).

---

## 2. Core Public Website Features
1. **Top Utility Bar**:
   - Location address with map pin icon.
   - Clickable multi-phone hotline.
   - WhatsApp quick chat button (opens direct chat with prefilled greeting).
   - Language switch (Bengali বাংলা / English).
2. **Main Header**:
   - Medical Cross + Stethoscope vector logo (editable).
   - Navigation links: Home, About Us, Doctors, Diagnostic Services, OPD Schedule, Nursing Home, Gallery, Contact.
   - Prominent "অ্যাপয়েন্টমেন্ট বুক করুন" (Book Appointment) CTA button.
   - Quick "অ্যাডমিন প্যানেল" (Admin Portal) access button.
3. **Hero Section (Faithfully Matching Layout)**:
   - Left column: Address badge, prominent Bengali headers, nursing home pill badge, ECG waveform separator, health pledge tagline, 3 core value propositions, and 3 CTA action buttons: [অ্যাপয়েন্টমেন্ট বুক করুন], [আমাদের ডাক্তারবৃন্দ], [কল করুন].
   - Right column: Curved medical building composite + doctor caring for patient visual with floating "সুস্থ থাকুন সবসময়" (Stay Healthy Always) trust badge.
4. **Quick Services 6-Card Horizontal Strip**:
   - 1. বিশেষজ্ঞ ডাক্তার (অভিজ্ঞ ও দক্ষ চিকিৎসক)
   - 2. OPD পরিষেবা (বিভিন্ন বিভাগের চিকিৎসা)
   - 3. ডায়াগনস্টিক পরীক্ষা (নির্ভুল ও নির্ভরযোগ্য)
   - 4. নার্সিং হোম (সুন্দর ও আরামদায়ক পরিবেশ)
   - 5. অ্যাপয়েন্টমেন্ট (অনলাইনে সহজ বুক করুন)
   - 6. যোগাযোগ (আমাদের সাথে যোগাযোগ করুন)
5. **About Us (আমাদের সম্পর্কে)**:
   - Diagnostic center and polyclinic introduction, patient-first care philosophy, laboratory microscope imagery, and clean value statistics.
6. **Our Doctors (আমাদের ডাক্তারবৃন্দ)**:
   - Dedicated cards for:
     - ডাঃ অমিত কুমার ঘোষ (MBBS, MD Medicine, Mon/Wed/Fri 10am-1pm)
     - ডাঃ সুমিতা দে (MBBS, DGO Gynecology & Obstetrics, Tue/Thu/Sat 4pm-7pm)
     - ডাঃ রাহুল চক্রবর্তী (MBBS, MD Pathology, Daily 8am-4pm)
     - Expandable directory with filters for Medicine, Gynae, Pathology, Cardiology, Ortho, Pediatrics, and 1-click booking for each doctor.
7. **Diagnostic Services Grid (ডায়াগনস্টিক সেবা)**:
   - Direct cards matching board: Digital X-Ray, ECG, Ultrasonography (USG), Echocardiography, HSG, Color Doppler, All Blood Tests, NCV Test.
   - Categorized by Radiology, Pathology, Cardiology, and Specialized.
8. **Nursing Home & Facilities (নার্সিং হোম)**:
   - 4 core highlight cards: Experienced Nursing Team, Regular Doctor Visits, Hygienic Environment, Emergency Care & 24x7 Oxygen.
9. **Notice Banner & Ticker (বিশেষ নোটিশ)**:
   - Live announcement: "ইকোকার্ডিওগ্রাফি পরিষেবা মঙ্গলবার ও শুক্রবার।"
10. **Interactive Gallery (ফটো গ্যালারি)**:
    - Clinic building, pathology lab, digital imaging suite, patient wards with modal photo viewer.
11. **Interactive Appointment Booking Modal**:
    - Patient Name, Phone, Age, Gender, Doctor Selection, Date, Preferred Time Slot, and Notes.
    - Generates instantaneous booking confirmation token slip.
12. **Contact & Location**:
    - Address details, instant click-to-call, WhatsApp direct link, embedded Google Map, and working patient inquiry form.

---

## 3. Dedicated Admin Content Management Panel (Every Detail Editable)
The application MUST include a full-featured, user-friendly Admin Dashboard allowing administrators to update any picture, text, or logo without touching code:
- **General Info & Contacts**: Edit clinic title, nursing home name, address, all phone numbers, WhatsApp, emergency hotline, and notice board text.
- **Logo & Branding Upload**: Upload custom logo via file browser (converts to base64) or paste an image URL; instantly updates everywhere.
- **Hero & Section Images**: Upload/change hero illustration, about section photo, and building graphics.
- **Doctor Manager (Full CRUD)**: Add new doctors, edit existing credentials, timings, consultation fees, upload doctor portrait photos, and toggle active status.
- **Diagnostic Services Manager (Full CRUD)**: Add, edit, or remove diagnostic tests, update preparation notes, pricing, and schedules.
- **Nursing Home Facilities Manager**: Customize room descriptions, bed availability, and hospital features.
- **Gallery Manager**: Upload new gallery photos, edit captions, and remove old images.
- **Appointment Registry**: View all submitted patient appointment requests, filter by status (Pending, Confirmed, Completed, Cancelled), and export list.
- **Persistence & Portability**: Automatically synchronize all edits to localStorage, with 1-click "Export JSON Backup", "Import JSON Backup", and "Reset to Defaults".

---

## 4. Technical & Accessibility Constraints
- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS.
- **Icons**: Lucide-react (Activity, HeartPulse, Stethoscope, Phone, Calendar, MapPin, etc.).
- **Animations**: Motion (motion/react) for smooth tab transitions and modals.
- **Accessibility**: Semantic HTML, aria-labels on buttons, WCAG AA color contrast, responsive from 320px mobile to 4K ultra-wide monitors.
`.trim();
