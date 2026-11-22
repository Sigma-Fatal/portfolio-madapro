'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- DICTIONNAIRE ---
export const translations = {
  fr: {
    nav: {
      hero: "Accueil", about: "À propos", skills: "Compétences", projects: "Projets",
      pricing: "Tarifs", timeline: "Expérience", gallery: "Galerie", contact: "Contact"
    },
    hero: {
      badge: "Développeur Full Stack & Ingénieur IA",
      title1: "Je transforme des idées",
      title2: "en solutions digitales",
      desc: "Spécialiste dans la conception d'architectures backend robustes, la sécurité (Cryptographie, ANPR), l'IA générative (RAG) et la pédagogie des mathématiques.",
      btnProjects: "Voir mes projets",
      btnContact: "Me contacter"
    },
    about: {
      tag: "Qui suis-je ?",
      title: "Au-delà du code, une passion pour",
      titleHighlight: "l'innovation",
      p1: "Je suis un développeur passionné et polyvalent, avec une forte appétence pour les architectures complexes et la sécurité informatique. Mon parcours atypique m'a permis d'acquérir une double compétence : une expertise technique pointue (Full Stack, IA, Embarqué) et une solide expérience pédagogique en tant qu'enseignant de mathématiques.",
      p2: "Mon objectif est de concevoir des solutions qui ne sont pas seulement fonctionnelles, mais qui résolvent de vrais problèmes métiers. J'aime relever des défis techniques, comme l'intégration d'IA locale pour garantir la souveraineté des données.",
    },
    contact: {
      title: "Me Contacter",
      desc: "Vous avez un projet en tête ou souhaitez simplement échanger ? N'hésitez pas à me contacter.",
      name: "Nom", email: "Email", message: "Message",
      projectType: "Type de projet",
      budget: "Budget estimé",
      deadline: "Délai souhaité",
      btnSend: "Envoyer le message",
      options: {
        type: ["SaaS / web", "Réservation & paiement", "App mobile", "API / backend", "Cloud & DevOps", "IA & automatisation", "Renfort d'équipe"],
        budget: ["À définir", "< 500 $", "500 $ - 1000 $", "1000 $ - 3000 $", "> 3000 $"],
        deadline: ["Flexible", "Urgent (1 mois)", "Court terme (1-3 mois)", "Long terme (3+ mois)"]
      }
    },
    cvModal: {
      title: "Demande de CV",
      desc: "Pour garantir la confidentialité de mes données, veuillez me contacter directement via l'un de ces canaux. Je vous enverrai le fichier PDF de mon CV avec plaisir.",
      btnEmail: "Envoyer un Email", btnWa: "Contacter sur WhatsApp", btnPhone: "M'appeler directement"
    }
  },
  en: {
    nav: {
      hero: "Home", about: "About", skills: "Skills", projects: "Projects",
      pricing: "Pricing", timeline: "Experience", gallery: "Gallery", contact: "Contact"
    },
    hero: {
      badge: "Full Stack Developer & AI Engineer",
      title1: "I turn ideas",
      title2: "into digital solutions",
      desc: "Specialist in designing robust backend architectures, security (Cryptography, ANPR), generative AI (RAG) and mathematics education.",
      btnProjects: "View my projects",
      btnContact: "Contact me"
    },
    about: {
      tag: "Who am I?",
      title: "Beyond code, a passion for",
      titleHighlight: "innovation",
      p1: "I am a passionate and versatile developer with a strong appetite for complex architectures and IT security. My atypical background has allowed me to acquire a dual skill set: sharp technical expertise (Full Stack, AI, Embedded) and solid teaching experience as a math teacher.",
      p2: "My goal is to design solutions that are not only functional but solve real business problems. I enjoy tackling technical challenges, such as integrating local AI to guarantee data sovereignty.",
    },
    contact: {
      title: "Contact Me",
      desc: "Do you have a project in mind or just want to chat? Feel free to contact me.",
      name: "Name", email: "Email", message: "Message",
      projectType: "Project type",
      budget: "Estimated budget",
      deadline: "Desired deadline",
      btnSend: "Send message",
      options: {
        type: ["SaaS / web", "Booking & payment", "Mobile app", "API / backend", "Cloud & DevOps", "AI & automation", "Team reinforcement"],
        budget: ["To be defined", "< $500", "$500 - $1000", "$1000 - $3000", "> $3000"],
        deadline: ["Flexible", "Urgent (1 month)", "Short term (1-3 months)", "Long term (3+ months)"]
      }
    },
    cvModal: {
      title: "Resume Request",
      desc: "To ensure the confidentiality of my data, please contact me directly via one of these channels. I will send you the PDF file of my resume with pleasure.",
      btnEmail: "Send an Email", btnWa: "Contact on WhatsApp", btnPhone: "Call me directly"
    }
  },
  mg: {
    nav: {
      hero: "Fandraisana", about: "Mombamomba", skills: "Fahaizana", projects: "Tetikasa",
      pricing: "Vidiny", timeline: "Traikefa", gallery: "Sary", contact: "Fifandraisana"
    },
    hero: {
      badge: "Mpamorona Full Stack & Injenera IA",
      title1: "Manova hevitra ho",
      title2: "vahaolana nomerika",
      desc: "Manampahaizana amin'ny famolavolana rafitra backend matanjaka, fiarovana (Cryptographie, ANPR), IA générative (RAG) ary fampianarana matematika.",
      btnProjects: "Hijery ny tetikasako",
      btnContact: "Mifandraisa amiko"
    },
    about: {
      tag: "Iza aho?",
      title: "Ankoatry ny kaody, fitiavana ny",
      titleHighlight: "famoronana vaovao",
      p1: "Mpamorona mazoto sy mahay zavatra maro aho, manana fahalianana amin'ny rafitra sarotra sy ny fiarovana ny angona. Ny lalan'ny fiainako dia nahatonga ahy hanana fahaizana roa: fahaizana ara-teknika (Full Stack, IA, Embarqué) sy traikefa amin'ny fampianarana matematika.",
      p2: "Ny tanjoko dia ny hamorona vahaolana tsy vitan'ny hoe mandeha fotsiny, fa mamaha olana tena izy. Tiako ny miatrika fanamby ara-teknika, toy ny fampidirana IA eo an-toerana mba hiantohana ny fiarovana ny angona.",
    },
    contact: {
      title: "Mifandraisa Amiko",
      desc: "Manana tetikasa sa te hiresaka fotsiny ve ianao? Aza misalasala mifandray amiko.",
      name: "Anarana", email: "Email", message: "Hafatra",
      projectType: "Karazana tetikasa",
      budget: "Tombantombana tetibola",
      deadline: "Fotoana tianao",
      btnSend: "Alefa ny hafatra",
      options: {
        type: ["SaaS / web", "Famandrihana & fandoavana", "App mobile", "API / backend", "Cloud & DevOps", "IA & automation", "Fanampiana ekipa"],
        budget: ["Tsy voafaritra", "< 500 $", "500 $ - 1000 $", "1000 $ - 3000 $", "> 3000 $"],
        deadline: ["Malalaka", "Maika (1 volana)", "Fotoana fohy (1-3 volana)", "Fotoana lava (3+ volana)"]
      }
    },
    cvModal: {
      title: "Fangatahana CV",
      desc: "Mba hiarovana ny angonako, mifandraisa amiko mivantana amin'ireto fomba ireto. Halefako aminao ny CV-ko PDF.",
      btnEmail: "Alefa Email", btnWa: "Mifandraisa amin'ny WhatsApp", btnPhone: "Antsoy mivantana aho"
    }
  }
};

type Language = 'fr' | 'en' | 'mg';
type Translations = typeof translations.fr;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('fr');

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used within I18nProvider');
  return context;
}