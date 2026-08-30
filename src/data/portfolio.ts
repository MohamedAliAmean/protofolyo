export const profile = {
  name: "Mohamed Diab",
  fullName: "Mohamed Ali Amen Diab",
  title: "Full Stack Developer",
  stackLine: "Laravel · Node.js · Angular",
  location: "Cairo, Egypt",
  email: "mdiab0109666@gmail.com",
  phone: "+20 109 666 1426",
  phoneHref: "tel:+201096661426",
  whatsapp: "https://wa.me/201096661426",
  linkedin: "https://linkedin.com/in/mohamed-ali-amen",
  github: "https://github.com/MohamedAliAmean",
  summary:
    "Full Stack Developer with production ownership across wedding marketplaces, CRM systems, and event platforms. Ships end-to-end features: REST APIs, auth/RBAC, bilingual Arabic/English UIs, queue/webhook workflows, and Dockerized Laravel services.",
  shortPitch:
    "I build production systems end-to-end — from REST APIs and auth to bilingual UIs and reliable deploy workflows.",
  education: [
    {
      school: "ITI — Open Source Application Development Diploma",
      detail: "9 months · Egypt",
      period: "10/2024 – 06/2025",
    },
    {
      school: "Egyptian E-Learning University (EELU)",
      detail: "B.Sc. Information Technology · GPA 2.93/4",
      period: "10/2019 – 07/2023",
    },
  ],
};

export const experience = [
  {
    company: "FarahyEGY",
    role: "Full Stack Developer",
    period: "08/2025 – Present",
    location: "Cairo",
    stack: "Angular 16 · Firebase · TypeScript",
    points: [
      "Owned production features across marketplace, admin dashboard, and supplier portal (Angular 16 + Tailwind).",
      "Built Firebase Cloud Functions, Firestore data models, Auth with Google/Facebook, and bilingual AR/EN RTL UI.",
      "Integrated SendGrid & Twilio; shipped via Firebase Hosting with production debugging.",
    ],
  },
  {
    company: "Farahy CRM",
    role: "Full Stack Developer",
    period: "08/2025 – Present",
    location: "Cairo",
    stack: "Flutter Web · Node.js/Express · MongoDB · Firebase",
    points: [
      "Built internal CRM for clients, events, suppliers, employees, and financial tracking.",
      "Implemented Firebase Auth with RBAC, permission overrides, and a Users & Permissions admin panel.",
      "Automated email flows and deployed to Firebase Hosting + Linux VPS/PM2.",
    ],
  },
  {
    company: "WeddingsOnline UAE",
    role: "Full Stack Developer",
    period: "08/2025 – Present",
    location: "UAE · Remote",
    stack: "PHP · MySQL · Smarty · WordPress",
    points: [
      "Maintain production marketplace weddingsonline.ae (public site, CMS, Supplier HQ, sales CRM).",
      "Built Service/Venue Finder with queued email lead pipeline (Postmark/Mailgun), cron, retries.",
      "Modernized legacy PHP 7.4 code and shipped production hotfixes.",
    ],
  },
  {
    company: "Dubai Wedding Summit",
    role: "Laravel Developer",
    period: "08/2025 – Present",
    location: "UAE · Remote",
    stack: "Laravel · Filament/Livewire · MySQL",
    points: [
      "Developed event-registration platform with Filament admin and Livewire UI.",
      "Designed MySQL schemas/migrations and secure REST/admin workflows for organizers.",
    ],
  },
  {
    company: "WeddingsOnline Mauritius",
    role: "Full Stack Developer",
    period: "08/2025 – Present",
    location: "Mauritius · Remote",
    stack: "PHP · MySQL · Tailwind",
    points: [
      "Built scalable PHP apps and 15+ REST APIs with ~40% faster responses on critical paths.",
      "Delivered responsive Tailwind UI for supplier and couple-facing flows.",
    ],
  },
  {
    company: "Galeloo",
    role: "Full Stack Developer · Freelance",
    period: "11/2025 – 05/2026",
    location: "Remote",
    stack: "PHP · Node.js · Socket.io",
    points: [
      "Built backend systems with real-time features via Socket.io.",
      "Designed relational schemas aligned with business workflows.",
    ],
  },
  {
    company: "Masar University",
    role: "Full Stack Developer",
    period: "12/2025 – 03/2026",
    location: "UAE · Remote",
    stack: "LMS / SIS · REST · JWT",
    points: [
      "Developed LMS/SIS modules serving 2,000+ students with 20+ REST APIs and JWT auth.",
      "Optimized MySQL (~35% faster) and implemented RBAC across 5+ roles.",
    ],
  },
  {
    company: "A&Z Lounge POS",
    role: ".NET Developer",
    period: "06/2026",
    location: "Asyut",
    stack: "C# · .NET 8 · WPF · ASP.NET Core",
    points: [
      "Built role-based restaurant POS with clean architecture, ESC/POS printing, and sales reporting.",
    ],
  },
];

export const projects = [
  {
    title: "Warehouse Inventory Reservation Engine",
    period: "07/2026",
    stack: ["Laravel", "MySQL", "Docker"],
    description:
      "Concurrent inventory engine with row-level locking to prevent overselling, idempotent reservation/shipment processing, carrier webhooks, and stock movement ledger with PHPUnit coverage.",
    href: "https://github.com/MohamedAliAmean/inventory_reservation",
  },
  {
    title: "Restaurant POS System",
    period: "06/2026",
    stack: ["C#", ".NET 8", "WPF", "ASP.NET Core"],
    description:
      "Role-based POS for restaurant/cafe/lounge: order workflow, shifts, split payments, sales reporting, and ESC/POS multi-station printing.",
  },
  {
    title: "Employee Attendance Desktop App",
    period: "08/2026",
    stack: ["Desktop", "Admin Panel"],
    description:
      "Shared-device attendance system with precise check-in/check-out timestamps and an admin panel for employee and attendance management.",
  },
  {
    title: "Employee Management System",
    period: "05/2025",
    stack: ["Laravel", "Angular", "MySQL"],
    description:
      "Auth/RBAC, normalized MySQL schema, and REST APIs for job posting and CV management.",
  },
  {
    title: "Exam System",
    period: "04/2025",
    stack: ["Node.js", "Express", "Chart.js"],
    description:
      "Role-based examination platform with teacher/student dashboards: create, update, activate exams, plus REST APIs and Chart.js performance analytics.",
    href: "https://github.com/MohamedAliAmean/Exam-System",
  },
  {
    title: "Ecommerce Angular",
    period: "05/2025",
    stack: ["Angular", "TypeScript"],
    description:
      "Frontend ecommerce application built with Angular and TypeScript, covering product browsing and cart-ready UI flows.",
    href: "https://github.com/MohamedAliAmean/Ecommerce-Angular-",
  },
  {
    title: "Full Stack Cafeteria",
    period: "03/2025",
    stack: ["PHP", "HTML5", "CSS3", "JavaScript"],
    description:
      "Full stack cafeteria web app with PHP backend and responsive HTML/CSS/JavaScript frontend for menu and ordering workflows.",
    href: "https://github.com/MohamedAliAmean/Full_Stack_Cafeteria",
  },
];

export const skillGroups = [
  {
    title: "Languages",
    items: ["PHP", "JavaScript (ES6+)", "TypeScript", "SQL", "Dart", "C#"],
  },
  {
    title: "Backend",
    items: [
      "Laravel",
      "Node.js / Express",
      "ASP.NET Core",
      "REST APIs",
      "Queues & Webhooks",
      "Clean Architecture",
    ],
  },
  {
    title: "Frontend",
    items: [
      "Angular 16",
      "Flutter Web",
      "HTML5 / CSS3",
      "Tailwind CSS",
      "Responsive UI",
      "Bilingual AR/EN & RTL",
    ],
  },
  {
    title: "Data & Cloud",
    items: [
      "MySQL",
      "MongoDB",
      "Firebase",
      "Docker",
      "Linux / VPS",
      "PM2",
    ],
  },
];

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];
