/* =====================================================================
   DATA.JS — Data Store, CRUD, i18n, Theme/Lang management
   Chris Meshack — SOC Analyst Portfolio
   ===================================================================== */

// ── Storage Keys ──────────────────────────────────────────────────────
const STORAGE_KEYS = {
    DATA: 'portfolio_data',
    THEME: 'portfolio_theme',
    LANG: 'portfolio_lang',
    AUTH: 'portfolio_auth',
};

// ── Default Admin Password Hash (SHA-256 of "admin123") ───────────────
const DEFAULT_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

// ── Translations ──────────────────────────────────────────────────────
const translations = {
    fr: {
        nav: { home: 'Accueil', about: 'À propos', skills: 'Compétences', projects: 'Projets', malware: 'Malware Analysis', certs: 'Certifications', experience: 'Parcours', contact: 'Contact' },
        hero: { greeting: 'Bonjour, je suis', cta_projects: 'Voir mes projets', cta_contact: 'Me contacter', download_cv: 'Télécharger CV' },
        about: { title: 'À propos de moi', specializations: 'Domaines de spécialisation' },
        skills: { title: 'Compétences Techniques' },
        projects: { title: 'Projets SOC', tools: 'Outils utilisés', result: 'Résultat', view: 'Voir détails' },
        malware: { title: 'Malware Analysis', type: 'Type', method: 'Méthode', tools: 'Outils', mitre: 'MITRE ATT&CK', conclusion: 'Conclusion', view_report: 'Voir rapport complet', static: 'Statique', dynamic: 'Dynamique', both: 'Statique & Dynamique' },
        certs: { title: 'Certifications', in_progress: 'En préparation', obtained: 'Obtenue', planned: 'Objectif futur' },
        experience: { title: 'Parcours & Expérience', present: 'Présent' },
        contact: { title: 'Contact', subtitle: 'Intéressé par une collaboration ou une opportunité ? N\'hésitez pas à me contacter.', name: 'Nom complet', email: 'Adresse email', subject: 'Sujet', message: 'Message', send: 'Envoyer le message', name_ph: 'Votre nom', email_ph: 'votre@email.com', subject_ph: 'Objet de votre message', message_ph: 'Votre message...', success: 'Message envoyé avec succès !', error: 'Veuillez remplir tous les champs.' },
        footer: { rights: 'Tous droits réservés.' },
        admin_link: 'Admin',
        theme: { light: 'Mode clair', dark: 'Mode sombre' },
    },
    en: {
        nav: { home: 'Home', about: 'About', skills: 'Skills', projects: 'Projects', malware: 'Malware Analysis', certs: 'Certifications', experience: 'Experience', contact: 'Contact' },
        hero: { greeting: 'Hello, I am', cta_projects: 'View my projects', cta_contact: 'Contact me', download_cv: 'Download CV' },
        about: { title: 'About Me', specializations: 'Areas of Specialization' },
        skills: { title: 'Technical Skills' },
        projects: { title: 'SOC Projects', tools: 'Tools used', result: 'Result', view: 'View details' },
        malware: { title: 'Malware Analysis', type: 'Type', method: 'Method', tools: 'Tools', mitre: 'MITRE ATT&CK', conclusion: 'Conclusion', view_report: 'View full report', static: 'Static', dynamic: 'Dynamic', both: 'Static & Dynamic' },
        certs: { title: 'Certifications', in_progress: 'In progress', obtained: 'Obtained', planned: 'Future goal' },
        experience: { title: 'Experience & Journey', present: 'Present' },
        contact: { title: 'Contact', subtitle: 'Interested in a collaboration or an opportunity? Feel free to reach out.', name: 'Full name', email: 'Email address', subject: 'Subject', message: 'Message', send: 'Send message', name_ph: 'Your name', email_ph: 'your@email.com', subject_ph: 'Subject of your message', message_ph: 'Your message...', success: 'Message sent successfully!', error: 'Please fill in all fields.' },
        footer: { rights: 'All rights reserved.' },
        admin_link: 'Admin',
        theme: { light: 'Light mode', dark: 'Dark mode' },
    }
};

// ── Default Portfolio Data ────────────────────────────────────────────
function getDefaultData() {
    return {
        profile: {
            name: 'Chris Meshack',
            title: 'SOC Analyst',
            subtitle: {
                fr: 'SOC Analyst | Cybersecurity Enthusiast | Threat Detection, Malware Analysis & Incident Response',
                en: 'SOC Analyst | Cybersecurity Enthusiast | Threat Detection, Malware Analysis & Incident Response'
            },
            bio: {
                fr: 'Analyste SOC passionné et déterminé, je consacre mon expertise à la surveillance, la détection et la réponse aux cybermenaces. Fort d\'une expérience pratique en environnement de laboratoire et de formations continues en cybersécurité, je développe mes compétences pour relever les défis de la sécurité informatique moderne.',
                en: 'Passionate and determined SOC Analyst, I dedicate my expertise to monitoring, detecting, and responding to cyber threats. With hands-on experience in lab environments and continuous cybersecurity training, I develop my skills to tackle modern information security challenges.'
            },
            bio2: {
                fr: 'Mon approche est méthodique et orientée résultats : j\'analyse les événements de sécurité, j\'identifie les indicateurs de compromission (IoC) et je mets en œuvre des stratégies de remédiation efficaces.',
                en: 'My approach is methodical and results-oriented: I analyze security events, identify indicators of compromise (IoC), and implement effective remediation strategies.'
            },
            heroBio: {
                fr: 'Passionné par la cybersécurité, je me spécialise dans la détection des menaces, l\'analyse SIEM, l\'investigation des logs, l\'analyse de malware et la réponse aux incidents.',
                en: 'Passionate about cybersecurity, I specialize in threat detection, SIEM analysis, log investigation, malware analysis, and incident response.'
            },
            photo: '',
            email: 'chris.meshack@email.com',
            linkedin: '',
            github: 'https://github.com/mezach386',
            cvUrl: '',
        },
        typedPhrases: ['SOC Analyst', 'Cybersecurity Enthusiast', 'Threat Detection', 'Malware Analysis', 'Incident Response'],
        specializations: [
            { id: 's1', icon: 'fa-satellite-dish', title: { fr: 'Threat Monitoring', en: 'Threat Monitoring' }, desc: { fr: 'Surveillance continue des environnements, analyse des alertes et corrélation des événements de sécurité.', en: 'Continuous monitoring of environments, alert analysis, and security event correlation.' } },
            { id: 's2', icon: 'fa-bug', title: { fr: 'Malware Analysis', en: 'Malware Analysis' }, desc: { fr: 'Analyse statique et dynamique des logiciels malveillants, sandboxing et investigation comportementale.', en: 'Static and dynamic malware analysis, sandboxing, and behavioral investigation.' } },
            { id: 's3', icon: 'fa-file-lines', title: { fr: 'Log Analysis', en: 'Log Analysis' }, desc: { fr: 'Investigation approfondie des journaux système, réseau et applicatifs pour détecter les anomalies.', en: 'In-depth investigation of system, network, and application logs to detect anomalies.' } },
            { id: 's4', icon: 'fa-chart-line', title: { fr: 'SIEM', en: 'SIEM' }, desc: { fr: 'Maîtrise de Splunk, Wazuh et ELK Stack pour la centralisation et la corrélation des événements.', en: 'Mastery of Splunk, Wazuh, and ELK Stack for centralized event correlation.' } },
            { id: 's5', icon: 'fa-fire-extinguisher', title: { fr: 'Incident Response', en: 'Incident Response' }, desc: { fr: 'Gestion complète des incidents : identification, confinement, éradication et récupération.', en: 'Full incident management: identification, containment, eradication, and recovery.' } },
            { id: 's6', icon: 'fa-magnifying-glass', title: { fr: 'Digital Forensics', en: 'Digital Forensics' }, desc: { fr: 'Bases solides en investigation numérique : acquisition de preuves, analyse de disques et mémoire.', en: 'Solid foundations in digital forensics: evidence acquisition, disk and memory analysis.' } },
        ],
        skills: [
            { id: 'sk1', icon: 'fa-chart-bar', name: 'SIEM Tools', level: { fr: 'Avancé', en: 'Advanced' }, progress: 85, desc: { fr: 'Splunk, Wazuh, ELK Stack — Création de dashboards, règles de corrélation et alertes personnalisées.', en: 'Splunk, Wazuh, ELK Stack — Dashboard creation, correlation rules, and custom alerts.' }, tags: ['Splunk', 'Wazuh', 'ELK', 'QRadar'] },
            { id: 'sk2', icon: 'fa-shield-virus', name: 'EDR', level: { fr: 'Intermédiaire', en: 'Intermediate' }, progress: 70, desc: { fr: 'Détection et réponse sur les endpoints, investigation des processus suspects et threat hunting.', en: 'Endpoint detection and response, suspicious process investigation, and threat hunting.' }, tags: ['CrowdStrike', 'Velociraptor', 'Sysmon'] },
            { id: 'sk3', icon: 'fa-network-wired', name: 'Network Analysis', level: { fr: 'Avancé', en: 'Advanced' }, progress: 80, desc: { fr: 'Capture et analyse du trafic réseau, détection d\'exfiltration et investigation des communications C2.', en: 'Network traffic capture and analysis, exfiltration detection, and C2 investigation.' }, tags: ['Wireshark', 'tcpdump', 'Zeek', 'Suricata'] },
            { id: 'sk4', icon: 'fa-terminal', name: 'Linux / Windows Security', level: { fr: 'Avancé', en: 'Advanced' }, progress: 80, desc: { fr: 'Hardening système, gestion des permissions, analyse des événements Windows et sécurisation Linux.', en: 'System hardening, permissions management, Windows event analysis, and Linux security.' }, tags: ['Kali Linux', 'Windows Event Logs', 'PowerShell'] },
            { id: 'sk5', icon: 'fab fa-python', name: 'Python', level: { fr: 'Basique', en: 'Basic' }, progress: 50, desc: { fr: 'Scripting pour l\'automatisation des tâches SOC, parsing de logs et création d\'outils d\'analyse.', en: 'Scripting for SOC task automation, log parsing, and analysis tool creation.' }, tags: ['Automatisation', 'Scripting', 'API'] },
            { id: 'sk6', icon: 'fa-bug', name: 'Malware Analysis', level: { fr: 'Intermédiaire', en: 'Intermediate' }, progress: 65, desc: { fr: 'Analyse statique et dynamique, sandboxing avec REMnux/FlareVM, reverse engineering de base.', en: 'Static and dynamic analysis, sandboxing with REMnux/FlareVM, basic reverse engineering.' }, tags: ['Ghidra', 'Any.Run', 'REMnux', 'PE Analysis'] },
            { id: 'sk7', icon: 'fa-diagram-project', name: 'MITRE ATT&CK', level: { fr: 'Avancé', en: 'Advanced' }, progress: 75, desc: { fr: 'Cartographie des TTP adverses, utilisation du framework pour le threat hunting et la documentation.', en: 'Adversary TTP mapping, framework usage for threat hunting and documentation.' }, tags: ['Tactics', 'Techniques', 'Procedures', 'Navigator'] },
        ],
        projects: [
            { id: 'p1', icon: 'fa-lock', tag: 'Blue Team', title: { fr: 'Détection d\'attaque Brute Force avec Splunk', en: 'Brute Force Attack Detection with Splunk' }, desc: { fr: 'Mise en place d\'un laboratoire de détection simulant des attaques par force brute sur SSH et RDP. Configuration de règles de corrélation dans Splunk pour identifier et alerter en temps réel.', en: 'Setting up a detection lab simulating brute force attacks on SSH and RDP. Configuring correlation rules in Splunk for real-time identification and alerting.' }, tools: ['Splunk', 'Kali Linux', 'Hydra', 'Windows Server'], result: { fr: 'Détection automatisée des tentatives de brute force avec alertes configurées et dashboard de monitoring en temps réel.', en: 'Automated brute force detection with configured alerts and real-time monitoring dashboard.' }, link: '' },
            { id: 'p2', icon: 'fa-server', tag: 'Infrastructure', title: { fr: 'Mise en place d\'un lab SOC avec Wazuh', en: 'SOC Lab Setup with Wazuh' }, desc: { fr: 'Conception et déploiement d\'un Security Operations Center virtuel complet utilisant Wazuh comme SIEM principal. Intégration d\'agents sur plusieurs systèmes.', en: 'Design and deployment of a complete virtual Security Operations Center using Wazuh as the primary SIEM. Agent integration across multiple systems.' }, tools: ['Wazuh', 'VirtualBox', 'Ubuntu Server', 'Windows 10'], result: { fr: 'Lab SOC fonctionnel avec détection d\'intrusion, analyse des vulnérabilités et conformité réglementaire configurée.', en: 'Functional SOC lab with intrusion detection, vulnerability analysis, and regulatory compliance configured.' }, link: '' },
            { id: 'p3', icon: 'fa-fish', tag: 'Incident Response', title: { fr: 'Analyse d\'un incident simulé — Phishing Investigation', en: 'Simulated Incident Analysis — Phishing Investigation' }, desc: { fr: 'Investigation complète d\'une campagne de phishing simulée : analyse des en-têtes d\'email, extraction des URLs malveillantes, identification des IoC.', en: 'Complete investigation of a simulated phishing campaign: email header analysis, malicious URL extraction, IoC identification.' }, tools: ['PhishTool', 'VirusTotal', 'URLScan.io', 'TheHive'], result: { fr: 'Identification complète de la chaîne d\'attaque, extraction des IoC et recommandations de remédiation documentées.', en: 'Complete attack chain identification, IoC extraction, and documented remediation recommendations.' }, link: '' },
            { id: 'p4', icon: 'fa-virus', tag: 'Malware Analysis', title: { fr: 'Analyse d\'un malware — Détection, comportement & rapport', en: 'Malware Analysis — Detection, Behavior & Report' }, desc: { fr: 'Analyse complète d\'un échantillon malveillant : examen statique (PE headers, strings, imports), analyse dynamique en sandbox, rapport technique structuré.', en: 'Complete analysis of a malicious sample: static examination (PE headers, strings, imports), dynamic sandbox analysis, structured technical report.' }, tools: ['Ghidra', 'Any.Run', 'REMnux', 'PEStudio', 'YARA'], result: { fr: 'Rapport d\'analyse complet identifiant le type de malware, son mécanisme de persistance et les règles de détection YARA créées.', en: 'Complete analysis report identifying malware type, persistence mechanism, and created YARA detection rules.' }, link: '' },
        ],
        malwareAnalyses: [
            { id: 'ma1', name: 'TrickBot Sample', type: 'Trojan / Banking Malware', method: 'both', tools: ['PEStudio', 'Ghidra', 'Any.Run', 'Wireshark', 'YARA'], mitre: ['T1059 - Command and Scripting Interpreter', 'T1055 - Process Injection', 'T1071 - Application Layer Protocol', 'T1547 - Boot or Logon Autostart Execution'], conclusion: { fr: 'Échantillon identifié comme variante de TrickBot utilisant l\'injection de processus pour la persistance et communiquant via HTTPS avec des serveurs C2. Règles YARA créées pour la détection.', en: 'Sample identified as TrickBot variant using process injection for persistence and communicating via HTTPS with C2 servers. YARA rules created for detection.' }, reportUrl: '', date: '2025-06' },
            { id: 'ma2', name: 'Ransomware Sample Analysis', type: 'Ransomware', method: 'dynamic', tools: ['Any.Run', 'REMnux', 'Process Monitor', 'Autoruns', 'FakeNet-NG'], mitre: ['T1486 - Data Encrypted for Impact', 'T1490 - Inhibit System Recovery', 'T1083 - File and Directory Discovery', 'T1012 - Query Registry'], conclusion: { fr: 'Ransomware chiffrant les fichiers avec AES-256 et supprimant les shadow copies. Exfiltration de données avant chiffrement via DNS tunneling détecté.', en: 'Ransomware encrypting files with AES-256 and deleting shadow copies. Data exfiltration before encryption via DNS tunneling detected.' }, reportUrl: '', date: '2025-08' },
        ],
        certifications: [
            { id: 'c1', name: 'CompTIA Security+', desc: { fr: 'Certification fondamentale couvrant les concepts essentiels de la cybersécurité, la gestion des risques et la réponse aux incidents.', en: 'Foundational certification covering essential cybersecurity concepts, risk management, and incident response.' }, status: 'in_progress', date: '', imageUrl: '' },
            { id: 'c2', name: 'GREM — GIAC Reverse Engineering Malware', desc: { fr: 'Certification avancée en analyse de malware, reverse engineering et investigation des logiciels malveillants.', en: 'Advanced certification in malware analysis, reverse engineering, and malware investigation.' }, status: 'planned', date: '', imageUrl: '' },
            { id: 'c3', name: 'GCFA — GIAC Certified Forensic Analyst', desc: { fr: 'Certification en investigation numérique avancée, analyse forensique de systèmes et réponse aux incidents complexes.', en: 'Certification in advanced digital forensics, system forensic analysis, and complex incident response.' }, status: 'planned', date: '', imageUrl: '' },
        ],
        experience: [
            { id: 'e1', icon: 'fa-shield-halved', title: { fr: 'SOC Analyst — Home Lab Experience', en: 'SOC Analyst — Home Lab Experience' }, date: { fr: '2024 — Présent', en: '2024 — Present' }, desc: { fr: 'Mise en place et gestion d\'un laboratoire SOC personnel complet. Surveillance des événements de sécurité, investigation des alertes, création de règles de détection personnalisées.', en: 'Setup and management of a complete personal SOC lab. Security event monitoring, alert investigation, and custom detection rule creation.' }, tags: ['Splunk', 'Wazuh', 'Sysmon', 'ELK'] },
            { id: 'e2', icon: 'fa-user-shield', title: { fr: 'Blue Team Practice', en: 'Blue Team Practice' }, date: { fr: '2024 — Présent', en: '2024 — Present' }, desc: { fr: 'Entraînement intensif aux pratiques défensives : threat hunting, analyse des comportements suspects, réponse aux incidents simulés et développement de playbooks.', en: 'Intensive defensive practice training: threat hunting, suspicious behavior analysis, simulated incident response, and playbook development.' }, tags: ['Threat Hunting', 'DFIR', 'Playbooks'] },
            { id: 'e3', icon: 'fa-bug', title: { fr: 'Malware Analysis Lab', en: 'Malware Analysis Lab' }, date: { fr: '2024 — Présent', en: '2024 — Present' }, desc: { fr: 'Laboratoire d\'analyse de malware dédié : environnement isolé pour l\'analyse statique et dynamique. Sandboxing avec REMnux et FlareVM, reverse engineering avec Ghidra.', en: 'Dedicated malware analysis lab: isolated environment for static and dynamic analysis. Sandboxing with REMnux and FlareVM, reverse engineering with Ghidra.' }, tags: ['REMnux', 'Ghidra', 'YARA', 'Sandboxing'] },
            { id: 'e4', icon: 'fa-flag', title: { fr: 'Participation CTF', en: 'CTF Participation' }, date: { fr: '2023 — Présent', en: '2023 — Present' }, desc: { fr: 'Participation régulière à des compétitions Capture The Flag : forensics, analyse réseau, cryptographie et exploitation.', en: 'Regular participation in Capture The Flag competitions: forensics, network analysis, cryptography, and exploitation.' }, tags: ['TryHackMe', 'HackTheBox', 'CyberDefenders'] },
        ],
        sections: {
            hero: { enabled: true, order: 0 },
            about: { enabled: true, order: 1 },
            skills: { enabled: true, order: 2 },
            projects: { enabled: true, order: 3 },
            malware: { enabled: true, order: 4 },
            certifications: { enabled: true, order: 5 },
            experience: { enabled: true, order: 6 },
            contact: { enabled: true, order: 7 },
        },
        passwordHash: DEFAULT_PASSWORD_HASH,
    };
}

// ── DataStore API ─────────────────────────────────────────────────────
const DataStore = {
    getData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.DATA);
            if (raw) return JSON.parse(raw);
        } catch (e) { console.error('DataStore.getData error:', e); }
        const defaults = getDefaultData();
        this.saveData(defaults);
        return defaults;
    },

    saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
        } catch (e) { console.error('DataStore.saveData error:', e); }
    },

    // ── Profile ───────────────────────────────────────────────────────
    updateProfile(updates) {
        const data = this.getData();
        Object.assign(data.profile, updates);
        this.saveData(data);
        return data;
    },

    // ── Generic CRUD for collections ──────────────────────────────────
    _addItem(collection, item) {
        const data = this.getData();
        item.id = item.id || `${collection}_${Date.now()}`;
        data[collection].push(item);
        this.saveData(data);
        return data;
    },

    _updateItem(collection, id, updates) {
        const data = this.getData();
        const idx = data[collection].findIndex(i => i.id === id);
        if (idx !== -1) Object.assign(data[collection][idx], updates);
        this.saveData(data);
        return data;
    },

    _deleteItem(collection, id) {
        const data = this.getData();
        data[collection] = data[collection].filter(i => i.id !== id);
        this.saveData(data);
        return data;
    },

    _reorderItems(collection, orderedIds) {
        const data = this.getData();
        const map = {};
        data[collection].forEach(i => map[i.id] = i);
        data[collection] = orderedIds.map(id => map[id]).filter(Boolean);
        this.saveData(data);
        return data;
    },

    // Skills
    addSkill(s) { return this._addItem('skills', s); },
    updateSkill(id, u) { return this._updateItem('skills', id, u); },
    deleteSkill(id) { return this._deleteItem('skills', id); },

    // Projects
    addProject(p) { return this._addItem('projects', p); },
    updateProject(id, u) { return this._updateItem('projects', id, u); },
    deleteProject(id) { return this._deleteItem('projects', id); },

    // Malware Analyses
    addMalwareAnalysis(m) { return this._addItem('malwareAnalyses', m); },
    updateMalwareAnalysis(id, u) { return this._updateItem('malwareAnalyses', id, u); },
    deleteMalwareAnalysis(id) { return this._deleteItem('malwareAnalyses', id); },

    // Certifications
    addCertification(c) { return this._addItem('certifications', c); },
    updateCertification(id, u) { return this._updateItem('certifications', id, u); },
    deleteCertification(id) { return this._deleteItem('certifications', id); },

    // Experience
    addExperience(e) { return this._addItem('experience', e); },
    updateExperience(id, u) { return this._updateItem('experience', id, u); },
    deleteExperience(id) { return this._deleteItem('experience', id); },

    // Specializations
    addSpecialization(s) { return this._addItem('specializations', s); },
    updateSpecialization(id, u) { return this._updateItem('specializations', id, u); },
    deleteSpecialization(id) { return this._deleteItem('specializations', id); },

    // ── Sections Management ───────────────────────────────────────────
    toggleSection(sectionId) {
        const data = this.getData();
        if (data.sections[sectionId]) {
            data.sections[sectionId].enabled = !data.sections[sectionId].enabled;
        }
        this.saveData(data);
        return data;
    },

    updateSectionOrder(sectionId, order) {
        const data = this.getData();
        if (data.sections[sectionId]) data.sections[sectionId].order = order;
        this.saveData(data);
        return data;
    },

    // ── Theme ─────────────────────────────────────────────────────────
    getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        document.documentElement.setAttribute('data-theme', theme);
    },

    // ── Language ──────────────────────────────────────────────────────
    getLang() {
        return localStorage.getItem(STORAGE_KEYS.LANG) || 'fr';
    },

    setLang(lang) {
        localStorage.setItem(STORAGE_KEYS.LANG, lang);
    },

    // ── Auth ──────────────────────────────────────────────────────────
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    async authenticate(password) {
        const hash = await this.hashPassword(password);
        const data = this.getData();
        if (hash === data.passwordHash) {
            sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
            return true;
        }
        return false;
    },

    async changePassword(newPassword) {
        const hash = await this.hashPassword(newPassword);
        const data = this.getData();
        data.passwordHash = hash;
        this.saveData(data);
    },

    isAuthenticated() {
        return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    },

    logout() {
        sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    },

    // ── Export / Import ───────────────────────────────────────────────
    exportData() {
        const data = this.getData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.saveData(data);
                    resolve(data);
                } catch (err) { reject(err); }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    // ── Reset to defaults ─────────────────────────────────────────────
    resetData() {
        const defaults = getDefaultData();
        this.saveData(defaults);
        return defaults;
    },
};

// ── i18n helper ───────────────────────────────────────────────────────
function t(key) {
    const lang = DataStore.getLang();
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) {
        if (val && val[k] !== undefined) val = val[k];
        else return key;
    }
    return val;
}

function localText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const lang = DataStore.getLang();
    return obj[lang] || obj.fr || obj.en || '';
}
