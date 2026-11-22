'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DraggableCodeWindow from './DraggableCodeWindow';
import ProjectGallery from './ProjectGallery';
import Reveal from './Reveal';
import CardStack from './CardStack';
import { useTranslation } from './i18n'; // Import du hook de traduction
import { 
  Download, Mail, Code2, Database, BrainCircuit, 
  ShoppingCart, LineChart, MapPin, Terminal, 
  Send, Briefcase, Cpu, GraduationCap, ShieldCheck, 
  Wifi, Trophy, UserCheck, Bot, Sparkles, BookOpen, Camera, Github, CheckCircle2, Globe2, Rocket, User, FileText, Phone, MessageCircle, Menu, X, Check
} from 'lucide-react';

// --- DONNÉES (Identiques) ---
const techIcons = [
  { name: "React", img: "/React_Logo_SVG.svg" },
  { name: "Angular", img: "/angular.png" },
  { name: "Spring Boot", img: "/Spring_Boot.svg" },
  { name: "Python", img: "/Python-logo-notext.svg.webp" },
  { name: "Agent IA", img: "/Agent_IA.png" },
  { name: "Machine Learning", img: "/Machine-Learning.png" },
  { name: "Deep Learning", img: "/Deep_Learning.png" }
];

const skillsData = [
  { category: "Backend & DevOps", items: ["Java", "Spring Boot", "REST", "Docker", "CI/CD"] },
  { category: "Frontend & Mobile", items: ["ReactJS", "Angular", "Flutter", "Dart"] },
  { category: "Intelligence Artificielle", items: ["Python", "IA Générative", "RAG", "LLMs"] },
  { category: "Sécurité & Données", items: ["PostgreSQL", "Redis", "Cryptographie", "JWT"] }
];

const projectsData = [
  { title: "Plateforme de Gestion de Stocks (M2)", year: "2026", desc: "Mémoire de Master : Plateforme scalable et sécurisée par cryptologie (AES-256, JWT, Reconnaissance faciale) avec assistance IA générative (RAG).", techs: ["Spring Boot 3.2", "React 18", "PostgreSQL", "Qdrant", "Ollama"], icon: <GraduationCap className="w-8 h-8 text-green-400" />, images: ["scan_faciale.png", "reponse_citations.png", "liste_produits.png", "dashboard_partie1.png", "dashboard_partie2.png", "connexion.png"] },
  { title: "E-Commerce Platform", year: "2024-2025", desc: "Plateforme e-commerce complète. API REST Spring Boot 3 (Java 21), SPA React 18, Spring Security JWT, Redis cache.", techs: ["Java 21", "Spring Boot 3", "React", "Redux", "Tailwind"], icon: <ShoppingCart className="w-8 h-8 text-green-400" />, images: ["e-commerce-accueil.png", "e-commerce-1.png", "e-commerce-3.png", "e-commerce-8.png"] },
  { title: "Liaison Tours", year: "2024-2025", desc: "Application web complète pour agence de tourisme (Diego Suarez). Site vitrine React, back-office sécurisé, API Spring Boot + PostgreSQL.", techs: ["React", "Spring Boot 4", "JWT", "PostgreSQL 16"], icon: <MapPin className="w-8 h-8 text-green-400" />, images: ["liaison-2.png", "liaison-7.png", "liaison-8.png"] },
  { title: "Générateur & Oscilloscope", year: "2024-2025", desc: "Instrument DIY piloté par microcontrôleur (C/C++). Logiciel Python pour l'acquisition série, tracé temps réel et calcul de métriques (FFT).", techs: ["C/C++", "Python", "PySerial", "Matplotlib"], icon: <LineChart className="w-8 h-8 text-green-400" />, images: ["SimulationdusystèmesousProteus.png", "Atelier-Arduino-câblage.png", "Instrument-DIY.png"] },
  { title: "Porte Garage ANPR", year: "2024-2025", desc: "Contrôle d'accès automatisé par reconnaissance de plaques (OpenCV) et pilotage d'un servomoteur via Arduino.", techs: ["Python", "OpenCV", "PySerial", "C/C++"], icon: <Wifi className="w-8 h-8 text-green-400" />, images: ["branchement-servomoteur-arduino-mega-breadboard.png", "maison-carton.png", "Mauvaise-capture.png", "Système-intelligent-détection-plaques.png"] },
  { title: "Messagerie RSA", year: "2024", desc: "Application client-serveur Java (Sockets TCP multithreads, JavaFX) avec cryptographie asymétrique RSA.", techs: ["Java", "JavaFX", "Sockets TCP", "RSA"], icon: <ShieldCheck className="w-8 h-8 text-green-400" />, images: ["LoginAdmin.PNG", "Connexion.PNG", "EspaceAdmin.PNG", "loginClient.PNG", "espaceClient.PNG"] }
];

const timelineData = [
  { year: "Nov 2026", title: "Communicant au 2e Colloque International INTERREG", inst: "ENS Antananarivo / École Doctorale PE2DI", desc: "Présentation orale : 'Plateforme de gestion de stocks scalable et sécurisée avec IA générative (RAG)'. Co-auteur : RAKOTOMALALA Hery Frédéric.", icon: <BrainCircuit className="w-5 h-5" /> },
  { year: "2024-2026", title: "Master 2 en Management et Sécurité Informatique", inst: "ENSET Antsiranana", desc: "Spécialisation en sécurité des SI. Mémoire : Plateforme de gestion de stocks avec IA et cryptographie.", icon: <GraduationCap className="w-5 h-5" /> },
  { year: "Mars 2026", title: "Enseignant Stagiaire en Mathématiques", inst: "Lycée Technique et Professionnel PK4 (LTP PK4)", desc: "Enseignement des suites numériques (3ème A MAA). Conception pédagogique et évaluations.", icon: <BookOpen className="w-5 h-5" /> },
  { year: "Mars 2026", title: "Stagiaire en Administration Scolaire", inst: "LTPC-PK3", desc: "Immersion dans la direction d'un établissement : gestion des ressources et management scolaire.", icon: <UserCheck className="w-5 h-5" /> },
  { year: "Août 2025", title: "Participant Hackathon RedShalk", inst: "InChargé Madagascar", desc: "Participation active au Hackathon de Diego Suarez.", icon: <Trophy className="w-5 h-5" /> },
  { year: "2022-2023", title: "Enseignant Stagiaire en Mathématiques & Informatique", inst: "Collège AVOTRA Morafeno (Antsiranana)", desc: "Enseignement des Puissances de 10 au niveau 4ème et initiation à l'informatique. Conception de supports pédagogiques et évaluation des élèves.", icon: <BookOpen className="w-5 h-5" /> },
  { year: "2022-2023", title: "Licence en Informatique", inst: "ENSET Antsiranana", desc: "Fondamentaux du génie logiciel, des réseaux et des bases de données.", icon: <Terminal className="w-5 h-5" /> }
];

const galleryData = [
  { title: "Soutenance", images: [{ src: "soutenance.jpeg", alt: "Soutenance" }, { src: "soutenance_1.jpeg", alt: "Soutenance" }, { src: "soutenance_2.jpeg", alt: "Soutenance" }, { src: "soutenance_3.jpeg", alt: "Soutenance" }, { src: "soutenance_4.jpeg", alt: "Soutenance" }] },
  { title: "Hackathon RedShalk", images: [{ src: "Hackaton.jpeg", alt: "Hackathon" }, { src: "Hackaton_1.jpeg", alt: "Hackathon" }, { src: "Hackaton_2.jpeg", alt: "Hackathon" }, { src: "Hackaton_3.jpeg", alt: "Hackathon" }, { src: "Hackaton_4.jpeg", alt: "Hackathon" }] },
  { title: "Colloque & Événements", images: [{ src: "Colloque.jpg", alt: "Colloque INTERREG" }, { src: "Colloque.jpeg", alt: "Colloque INTERREG" }, { src: "fete.jpeg", alt: "Célébration" }, { src: "Reussite.jpeg", alt: "Réussite" }] },
  { title: "Sorties", images: [{ src: "sortie.jpeg", alt: "Sortie" }, { src: "sortie_1.jpeg", alt: "Sortie" }] }
];

const pricingData = [
  { title: "Site Vitrine", desc: "Site web moderne et responsive pour présenter votre activité.", features: ["Design sur mesure", "Adapté au mobile", "Formulaire de contact", "Optimisation SEO de base"], icon: <Globe2 className="w-6 h-6 text-green-400" />, priceUSD: 350, priceEUR: 320, priceMGA: 1600000 },
  { title: "Application Web & API", desc: "Développement full-stack avec backend robuste et base de données.", features: ["Frontend React/Angular", "Backend Spring Boot", "Base de données SQL/Redis", "Authentification JWT"], icon: <Database className="w-6 h-6 text-green-400" />, priceUSD: 800, priceEUR: 750, priceMGA: 3700000 },
  { title: "IA & RAG sur Mesure", desc: "Intégration d'agents intelligents et de bases vectorielles.", features: ["Pipeline RAG local", "Intégration LLM (Ollama/LangChain)", "Traitement de documents", "Interface conversationnelle"], icon: <BrainCircuit className="w-6 h-6 text-green-400" />, priceUSD: 1200, priceEUR: 1100, priceMGA: 5500000 }
];

export default function Portfolio() {
  const { t, lang, setLang } = useTranslation(); // Utilisation du hook de traduction
  
  // États du formulaire (avec les nouveaux champs)
  const [form, setForm] = useState({ name: '', email: '', message: '', type: '', budget: '', deadline: '' });
  const [activeSection, setActiveSection] = useState('hero');
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Liens de navigation basés sur les traductions
  const navLinks = [
    { name: t.nav.hero, href: '#hero' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.skills, href: '#skills' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.pricing, href: '#pricing' },
    { name: t.nav.timeline, href: '#timeline' },
    { name: t.nav.gallery, href: '#gallery' },
    { name: t.nav.contact, href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navLinks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message envoyé (Simulation) !");
    setForm({ name: '', email: '', message: '', type: '', budget: '', deadline: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* NAVBAR CHIC */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              <Image src="/MadaPro_logo.jpg" alt="Logo" fill className="object-cover" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tighter">MadaPro</span>
          </div>
          
          <div className="hidden lg:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`relative pb-1 transition-all duration-300 ${
                  activeSection === link.href.substring(1) 
                    ? 'text-green-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* SÉLECTEUR DE LANGUE DESKTOP */}
            <div className="hidden md:flex bg-[#141414] border border-white/10 rounded-lg p-1 shadow-inner">
              {(['fr', 'en', 'mg'] as const).map((l) => (
                <button 
                  key={l} 
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all duration-300 ${lang === l ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsCvModalOpen(true)} 
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" /> CV
            </button>

            <button 
              className="lg:hidden p-2 text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl flex flex-col p-6 gap-4 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium py-2 border-b border-white/5 flex justify-between items-center ${
                  activeSection === link.href.substring(1) ? 'text-green-400' : 'text-gray-300'
                }`}
              >
                {link.name}
                {activeSection === link.href.substring(1) && <Check className="w-5 h-5 text-green-500" />}
              </a>
            ))}
            <div className="flex bg-[#141414] border border-white/10 rounded-lg p-1 mt-2">
              {(['fr', 'en', 'mg'] as const).map((l) => (
                <button key={l} onClick={() => { setLang(l); setIsMobileMenuOpen(false); }} className={`flex-1 py-2 text-sm font-bold uppercase rounded-md transition-all ${lang === l ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => { setIsMobileMenuOpen(false); setIsCvModalOpen(true); }} className="mt-2 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white font-medium rounded-lg w-full">
              <Download className="w-5 h-5" /> {t.cvModal.title}
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-green-400 mb-6 uppercase backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {t.hero.badge}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                {t.hero.title1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
                  {t.hero.title2}
                </span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                {t.hero.desc}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a href="#projects" className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] transform hover:-translate-y-1">
                  <Terminal className="w-5 h-5" /> {t.hero.btnProjects}
                </a>
                <a href="#contact" className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-medium rounded-lg transition-all transform hover:-translate-y-1">
                  <Mail className="w-5 h-5" /> {t.hero.btnContact}
                </a>
              </div>
            </Reveal>

            <div className="relative h-[500px] flex items-center justify-center">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[100px]"></div>
              
              {/* Icônes flottantes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute top-[10%] left-[10%] animate-[float_4s_ease-in-out_infinite]">
                  <div className="w-16 h-16 bg-[#141414]/80 border border-white/10 rounded-2xl p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"><Image src="/React_Logo_SVG.svg" alt="React" width={40} height={40} className="object-contain" /></div>
                </div>
                <div className="absolute top-[5%] right-[15%] animate-[float_5s_ease-in-out_infinite_0.5s]">
                  <div className="w-16 h-16 bg-[#141414]/80 border border-white/10 rounded-2xl p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"><Image src="/angular.png" alt="Angular" width={40} height={40} className="object-contain" /></div>
                </div>
                <div className="absolute bottom-[20%] left-[5%] animate-[float_6s_ease-in-out_infinite_1s]">
                  <div className="w-16 h-16 bg-[#141414]/80 border border-white/10 rounded-2xl p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"><Image src="/Spring_Boot.svg" alt="Spring Boot" width={40} height={40} className="object-contain" /></div>
                </div>
                <div className="absolute bottom-[15%] right-[10%] animate-[float_4.5s_ease-in-out_infinite_1.5s]">
                  <div className="w-16 h-16 bg-[#141414]/80 border border-white/10 rounded-2xl p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"><Image src="/Python-logo-notext.svg.webp" alt="Python" width={40} height={40} className="object-contain" /></div>
                </div>
              </div>

              <Reveal delay={200} className="relative z-10">
                <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-green-500/30 relative shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                  <Image src="/Delmas.png" alt="Delmas" fill className="object-cover object-center" priority />
                </div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full text-center">
                  <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest relative overflow-hidden">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-600 animate-shimmer bg-[length:200%_auto] drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                      RABEMANANJARA Clariot El Delmas
                    </span>
                  </h2>
                </div>
              </Reveal>
              <DraggableCodeWindow />
            </div>
          </div>

          <Reveal delay={400}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-32">
              {techIcons.map((tech, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 bg-[#141414] border border-white/5 rounded-2xl hover:border-green-500/50 hover:bg-[#1a1a1a] hover:-translate-y-2 transition-all duration-300 group shadow-xl">
                  <div className="relative w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Image src={tech.img} alt={tech.name} fill className="object-contain drop-shadow-lg" />
                  </div>
                  <span className="text-xs font-semibold text-gray-300 group-hover:text-white text-center transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* À PROPOS */}
      <section id="about" className="py-24 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-green-400 mb-6 uppercase">
                <User className="w-4 h-4" /> {t.about.tag}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t.about.title} <span className="text-green-400">{t.about.titleHighlight}</span>.
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                {t.about.p1}
              </p>
              <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                {t.about.p2}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Rigueur</div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Autonomie</div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Adaptabilité</div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-green-500/30 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="text-xs text-gray-500 ml-auto font-mono">about_me.ts</span>
                </div>
                <div className="font-mono text-sm md:text-base leading-relaxed">
                  <p className="text-pink-400">const <span className="text-blue-300">profil</span> = {'{'}</p>
                  <p className="pl-6 text-gray-400">nom: <span className="text-orange-300">'RABEMANANJARA Clariot El Delmas'</span>,</p>
                  <p className="pl-6 text-gray-400">role: <span className="text-orange-300">'Développeur Full Stack & Ingénieur IA'</span>,</p>
                  <p className="pl-6 text-gray-400">localisation: <span className="text-orange-300">'Antananarivo, Madagascar'</span>,</p>
                  <p className="pl-6 text-gray-400">hobbies: [<span className="text-orange-300">'Football'</span>, <span className="text-orange-300">'Jeux vidéo'</span>, <span className="text-orange-300">'Coder'</span>],</p>
                  <p className="pl-6 text-gray-400">langues: [<span className="text-orange-300">'Malagasy'</span>, <span className="text-orange-300">'Français'</span>, <span className="text-orange-300">'Anglais'</span>],</p>
                  <p className="pl-6 text-gray-400">disponible: <span className="text-green-400">true</span></p>
                  <p className="text-pink-400">{'}'};</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COMPÉTENCES */}
      <section id="skills" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-12">
              <Bot className="w-8 h-8 text-green-500" />
              <h2 className="text-3xl font-bold text-white">Compétences Techniques</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillsData.map((skill, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="p-8 rounded-3xl bg-[#141414] border border-white/5 hover:border-green-500/40 transition-all duration-300 group h-full hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <h3 className="text-xl font-bold text-white mb-6 group-hover:text-green-400 transition-colors flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-green-500" /> {skill.category}
                  </h3>
                  <ul className="space-y-3">
                    {skill.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJETS PHARES */}
      <section id="projects" className="py-24 bg-[#0f0f0f] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-12">
              <Terminal className="w-8 h-8 text-green-500" />
              <h2 className="text-3xl font-bold text-white">Projets Phares</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projectsData.map((project, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className="flex flex-col p-8 rounded-3xl bg-[#141414] border border-white/5 hover:border-green-500/30 transition-all duration-300 group h-full hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-green-500/10 rounded-2xl group-hover:scale-110 group-hover:bg-green-500/20 transition-all">{project.icon}</div>
                    <span className="text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">{project.year}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">{project.desc}</p>
                  
                  <ProjectGallery images={project.images} title={project.title} />

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.techs.map((tech, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1.5 bg-[#0a0a0a] text-gray-300 rounded-lg border border-white/5">{tech}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS / BUDGETS */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-green-400 mb-6 uppercase">
                <Rocket className="w-4 h-4" /> Prêt à collaborer
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tarifs & Services</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Des solutions adaptées à vos besoins, basées sur les standards internationaux et optimisées pour le marché malgache.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingData.map((plan, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className="relative p-8 rounded-3xl bg-[#141414] border border-white/10 hover:border-green-500/50 transition-all duration-500 group flex flex-col h-full shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] hover:-translate-y-2">
                  <div className="mb-8">
                    <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{plan.title}</h3>
                    <p className="text-sm text-gray-400">{plan.desc}</p>
                  </div>

                  <div className="mb-8 flex-grow">
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">${plan.priceUSD}</span>
                        <span className="text-sm font-medium text-gray-500">USD</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-medium bg-[#0a0a0a] p-2 rounded-lg border border-white/5 w-fit">
                        <span>≈ {plan.priceEUR} € EUR</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>≈ {plan.priceMGA.toLocaleString('fr-FR')} Ar</span>
                      </div>
                    </div>
                    <a href="#contact" className="w-full py-3.5 bg-white/5 hover:bg-green-500 text-white hover:text-black font-bold rounded-xl text-center block transition-all duration-300">
                      Demander un devis
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="py-24 bg-[#0f0f0f] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-16">
              <Briefcase className="w-8 h-8 text-green-500" />
              <h2 className="text-3xl font-bold text-white">Parcours & Expériences</h2>
            </div>
          </Reveal>
          
          <div className="relative border-l-2 border-white/10 ml-3 md:ml-0 space-y-12">
            {timelineData.map((item, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="relative pl-10 md:pl-14">
                  <div className="absolute left-[-21px] top-1 w-10 h-10 bg-[#141414] border-2 border-green-500/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] z-10">
                    <div className="text-green-400">{item.icon}</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-3 mb-3">
                    <span className="text-sm font-bold font-mono text-green-400 bg-green-500/10 px-3 py-1 rounded-lg w-fit border border-green-500/20">{item.year}</span>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-500" /> {item.inst}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed bg-[#141414] p-4 rounded-xl border border-white/5">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE / MOMENTS */}
      <section id="gallery" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-8 h-8 text-green-500" />
              <h2 className="text-3xl font-bold text-white">Galerie & Moments</h2>
            </div>
            <p className="text-gray-400 mb-16 max-w-2xl text-lg">
              Retour en images sur mes expériences académiques et professionnelles. Survolez les cartes pour les découvrir, et cliquez pour voir toutes les photos.
            </p>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            {galleryData.map((category, index) => (
              <Reveal key={index} delay={index * 150}>
                <CardStack title={category.title} images={category.images || []} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT & FORMULAIRE CHIC */}
      <section id="contact" className="py-24 bg-[#0f0f0f] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-12">
              <Mail className="w-8 h-8 text-green-500" />
              <h2 className="text-3xl font-bold text-white">{t.contact.title}</h2>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Infos Contact (2 cols) */}
            <Reveal delay={100} className="lg:col-span-2">
              <div className="space-y-8">
                <p className="text-gray-400 text-lg leading-relaxed">{t.contact.desc}</p>
                <div className="space-y-4">
                  <a href="mailto:rabemananjaradelmas@gmail.com" className="flex items-center gap-4 p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-green-500/40 hover:bg-[#1a1a1a] transition-all group">
                    <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform"><Mail className="w-6 h-6 text-green-400" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Email</p>
                      <p className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">rabemananjaradelmas@gmail.com</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#141414] border border-white/5">
                    <div className="p-3 bg-white/5 rounded-xl"><MapPin className="w-6 h-6 text-gray-400" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Localisation</p>
                      <p className="text-sm font-bold text-white">Diego Suarez / Antananarivo, Madagascar</p>
                    </div>
                  </div>
                  
                  <a href="https://github.com/Sigma-Fatal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl bg-[#141414] border border-white/5 hover:border-green-500/40 hover:bg-[#1a1a1a] transition-all group">
                    <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform"><Github className="w-6 h-6 text-green-400" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">GitHub</p>
                      <p className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">github.com/Sigma-Fatal</p>
                    </div>
                  </a>
                </div>
              </div>
            </Reveal>
            
            {/* Formulaire (3 cols) - Style Capture */}
            <Reveal delay={200} className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5 p-8 md:p-10 rounded-3xl bg-[#141414] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Nom & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.name}</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-white transition-all placeholder-gray-600" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.email}</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-white transition-all placeholder-gray-600" placeholder="jean@entreprise.com" />
                  </div>
                </div>

                {/* Type de projet (Boutons) */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">{t.contact.projectType}</label>
                  <div className="flex flex-wrap gap-2">
                    {t.contact.options.type.map((opt: string) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setForm({ ...form, type: opt })}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                          form.type === opt 
                            ? 'bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                            : 'bg-transparent text-gray-300 border-white/10 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget & Délai (Select) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.budget}</label>
                    <select 
                      value={form.budget} 
                      onChange={(e) => setForm({...form, budget: e.target.value})}
                      className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:border-green-500/50 text-white appearance-none cursor-pointer"
                    >
                      <option value="" disabled>À définir</option>
                      {t.contact.options.budget.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-[#141414]">{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.deadline}</label>
                    <select 
                      value={form.deadline} 
                      onChange={(e) => setForm({...form, deadline: e.target.value})}
                      className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:border-green-500/50 text-white appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Flexible</option>
                      {t.contact.options.deadline.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-[#141414]">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">{t.contact.message}</label>
                  <textarea rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-white resize-none transition-all placeholder-gray-600" placeholder="Décrivez votre projet..." />
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:-translate-y-1">
                  <Send className="w-5 h-5" /> {t.contact.btnSend}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5 text-center text-sm text-gray-500 bg-[#0a0a0a]">
        <p className="mb-2">© {new Date().getFullYear()} MadaPro - Rabemananjara Clariot El Delmas.</p>
        <p className="flex items-center justify-center gap-2">
          Conçu avec <span className="text-red-500 animate-pulse">❤</span> et beaucoup de <Code2 className="w-4 h-4 text-green-500" />
        </p>
      </footer>

      {/* MODALE CV : Demande de contact */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setIsCvModalOpen(false)}>
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#141414] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsCvModalOpen(false)} className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <FileText className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t.cvModal.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{t.cvModal.desc}</p>
            </div>

            <div className="space-y-3">
              <a href="mailto:rabemananjaradelmas@gmail.com?subject=Demande de CV" className="flex items-center gap-4 w-full p-4 bg-[#0a0a0a] border border-white/5 hover:border-green-500/50 hover:bg-[#1a1a1a] rounded-xl transition-all group">
                <Mail className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white">{t.cvModal.btnEmail}</span>
              </a>
              <a href="https://wa.me/261323574527?text=Bonjour,%20je%20souhaite%20recevoir%20votre%20CV." target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full p-4 bg-[#0a0a0a] border border-white/5 hover:border-green-500/50 hover:bg-[#1a1a1a] rounded-xl transition-all group">
                <MessageCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white">{t.cvModal.btnWa}</span>
              </a>
              <a href="tel:+261323574527" className="flex items-center gap-4 w-full p-4 bg-[#0a0a0a] border border-white/5 hover:border-green-500/50 hover:bg-[#1a1a1a] rounded-xl transition-all group">
                <Phone className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white">{t.cvModal.btnPhone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}