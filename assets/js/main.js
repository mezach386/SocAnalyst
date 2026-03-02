/* =====================================================================
   MAIN.JS — Portfolio Renderer & Interactions
   Chris Meshack — SOC Analyst Portfolio
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLang();
    renderPortfolio();
    initNavigation();
    initScrollReveal();
    initTypedText();
});

// ── Theme ─────────────────────────────────────────────────────────────
function initTheme() {
    const theme = DataStore.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    document.getElementById('themeToggle').addEventListener('click', () => {
        const current = DataStore.getTheme();
        const next = current === 'light' ? 'dark' : 'light';
        DataStore.setTheme(next);
        updateThemeIcon(next);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ── Language ──────────────────────────────────────────────────────────
function initLang() {
    const lang = DataStore.getLang();
    document.getElementById('langToggle').textContent = lang.toUpperCase();

    document.getElementById('langToggle').addEventListener('click', () => {
        const current = DataStore.getLang();
        const next = current === 'fr' ? 'en' : 'fr';
        DataStore.setLang(next);
        document.getElementById('langToggle').textContent = next.toUpperCase();
        document.documentElement.lang = next;
        renderPortfolio();
        initScrollReveal();
        initTypedText();
    });
}

// ── Navigation ────────────────────────────────────────────────────────
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    function closeMenu() {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        menu.classList.add('active');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
        updateActiveNav();
    }, { passive: true });

    toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) closeMenu();
        else openMenu();
    });

    // Close menu on nav link click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menu.classList.contains('active')) closeMenu();
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            links.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
            });
        }
    });
}

// ── Scroll Reveal ─────────────────────────────────────────────────────
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => observer.observe(el));
}

// ── Skill Bars ────────────────────────────────────────────────────────
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.style.width = e.target.dataset.progress + '%';
        });
    }, { threshold: 0.3 });
    bars.forEach(b => observer.observe(b));
}

// ── Typed Text ────────────────────────────────────────────────────────
let typedInterval = null;
function initTypedText() {
    if (typedInterval) clearTimeout(typedInterval);
    const el = document.getElementById('typedOutput');
    if (!el) return;

    const data = DataStore.getData();
    const phrases = data.typedPhrases || ['SOC Analyst'];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        const phrase = phrases[phraseIdx];
        if (deleting) {
            el.textContent = phrase.substring(0, charIdx - 1);
            charIdx--;
        } else {
            el.textContent = phrase.substring(0, charIdx + 1);
            charIdx++;
        }

        let delay = deleting ? 35 : 70;
        if (!deleting && charIdx === phrase.length) { delay = 2000; deleting = true; }
        else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }

        typedInterval = setTimeout(tick, delay);
    }
    tick();
}

// ── Render Portfolio ──────────────────────────────────────────────────
function renderPortfolio() {
    const data = DataStore.getData();
    const content = document.getElementById('portfolioContent');
    const sections = data.sections;

    // Build ordered sections
    const ordered = Object.entries(sections)
        .filter(([, v]) => v.enabled)
        .sort((a, b) => a[1].order - b[1].order);

    let html = '';
    ordered.forEach(([key]) => {
        switch (key) {
            case 'hero': html += renderHero(data); break;
            case 'about': html += renderAbout(data); break;
            case 'skills': html += renderSkills(data); break;
            case 'projects': html += renderProjects(data); break;
            case 'malware': html += renderMalware(data); break;
            case 'certifications': html += renderCerts(data); break;
            case 'experience': html += renderExperience(data); break;
            case 'contact': html += renderContact(data); break;
        }
    });

    content.innerHTML = html;
    renderNav(ordered);
    renderFooter(data);
    initSkillBars();
    initContactForm();

    // Stagger reveals
    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`;
    });
}

// ── Nav Render ────────────────────────────────────────────────────────
function renderNav(ordered) {
    const menu = document.getElementById('navMenu');
    const navMap = {
        hero: { href: '#hero', label: t('nav.home') },
        about: { href: '#about', label: t('nav.about') },
        skills: { href: '#skills', label: t('nav.skills') },
        projects: { href: '#projects', label: t('nav.projects') },
        malware: { href: '#malware', label: t('nav.malware') },
        certifications: { href: '#certifications', label: t('nav.certs') },
        experience: { href: '#experience', label: t('nav.experience') },
        contact: { href: '#contact', label: t('nav.contact') },
    };

    menu.innerHTML = ordered.map(([key]) => {
        const n = navMap[key];
        return n ? `<li><a href="${n.href}" class="nav-link">${n.label}</a></li>` : '';
    }).join('');
}

// ── Footer ────────────────────────────────────────────────────────────
function renderFooter(data) {
    const p = data.profile;
    document.getElementById('footer').innerHTML = `
        <div class="container">
            <div class="footer-content">
                <p class="footer-name">${esc(p.name)}</p>
                <p class="footer-desc">${esc(localText(p.subtitle))}</p>
                <div class="footer-social">
                    ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
                    ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
                    ${p.email ? `<a href="mailto:${esc(p.email)}" aria-label="Email"><i class="fas fa-envelope"></i></a>` : ''}
                </div>
                <p class="footer-copy">&copy; ${new Date().getFullYear()} ${esc(p.name)}. ${t('footer.rights')}</p>
            </div>
        </div>`;
}

// ── Section Renderers ─────────────────────────────────────────────────

function renderHero(data) {
    const p = data.profile;
    const photoHtml = p.photo
        ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">`
        : `<div class="hero-photo-placeholder"><i class="fas fa-user-shield"></i><span>Photo</span></div>`;

    return `
    <section id="hero" class="section hero-section">
        <div class="container hero-container">
            <div class="hero-content">
                <p class="hero-greeting reveal">${t('hero.greeting')}</p>
                <h1 class="hero-name reveal">${esc(p.name)}</h1>
                <div class="hero-typed-wrap reveal">
                    <span class="hero-typed" id="typedOutput"></span><span class="hero-cursor"></span>
                </div>
                <p class="hero-desc reveal">${esc(localText(p.heroBio))}</p>
                <div class="hero-buttons reveal">
                    <a href="#projects" class="btn btn-primary"><i class="fas fa-shield-halved"></i> ${t('hero.cta_projects')}</a>
                    <a href="#contact" class="btn btn-outline"><i class="fas fa-envelope"></i> ${t('hero.cta_contact')}</a>
                    ${p.cvUrl ? `<a href="${esc(p.cvUrl)}" class="btn btn-outline" target="_blank"><i class="fas fa-download"></i> ${t('hero.download_cv')}</a>` : ''}
                </div>
                <div class="hero-social reveal">
                    ${p.github ? `<a href="${esc(p.github)}" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>` : ''}
                    ${p.linkedin ? `<a href="${esc(p.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>` : ''}
                    ${p.email ? `<a href="mailto:${esc(p.email)}" aria-label="Email"><i class="fas fa-envelope"></i></a>` : ''}
                </div>
            </div>
            <div class="hero-visual reveal">
                <div class="hero-photo">${photoHtml}</div>
                <div class="hero-info-card">
                    <div class="info-card-row"><i class="fas fa-briefcase"></i> <span>${esc(p.title)}</span></div>
                    <div class="info-card-row"><i class="fas fa-map-marker-alt"></i> <span>${esc(localText(p.subtitle))}</span></div>
                    ${p.email ? `<div class="info-card-row"><i class="fas fa-envelope"></i> <span>${esc(p.email)}</span></div>` : ''}
                </div>
            </div>
        </div>
    </section>`;
}

function renderAbout(data) {
    const p = data.profile;
    const specs = data.specializations || [];
    return `
    <section id="about" class="section section-alt">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-user"></i> ${t('about.title')}</div>
                <h2 class="section-title">${t('about.title')}</h2>
            </div>
            <div class="about-content">
                <p class="about-text reveal">${esc(localText(p.bio))}</p>
                <p class="about-text reveal">${esc(localText(p.bio2))}</p>
                <h3 class="spec-title reveal"><i class="fas fa-crosshairs"></i> ${t('about.specializations')}</h3>
                <div class="spec-grid">
                    ${specs.map(s => `
                    <div class="spec-card reveal">
                        <div class="spec-icon"><i class="fas ${esc(s.icon)}"></i></div>
                        <h4>${esc(localText(s.title))}</h4>
                        <p>${esc(localText(s.desc))}</p>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    </section>`;
}

function renderSkills(data) {
    return `
    <section id="skills" class="section">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-code"></i> ${t('skills.title')}</div>
                <h2 class="section-title">${t('skills.title')}</h2>
            </div>
            <div class="skills-grid">
                ${(data.skills || []).map(s => `
                <div class="skill-card reveal">
                    <div class="skill-header">
                        <div class="skill-icon"><i class="${s.icon && s.icon.startsWith('fab') ? s.icon : 'fas ' + (s.icon || 'fa-code')}"></i></div>
                        <span class="skill-name">${esc(s.name)}</span>
                        <span class="skill-level">${esc(localText(s.level))}</span>
                    </div>
                    <p class="skill-desc">${esc(localText(s.desc))}</p>
                    <div class="skill-bar"><div class="skill-progress" data-progress="${s.progress || 0}"></div></div>
                    <div class="skill-tags">${(s.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderProjects(data) {
    return `
    <section id="projects" class="section section-alt">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-folder-open"></i> ${t('projects.title')}</div>
                <h2 class="section-title">${t('projects.title')}</h2>
            </div>
            <div class="projects-grid">
                ${(data.projects || []).map(p => `
                <div class="project-card reveal">
                    <div class="project-top">
                        <div class="project-icon"><i class="fas ${esc(p.icon || 'fa-folder')}"></i></div>
                        <span class="project-tag">${esc(p.tag || '')}</span>
                    </div>
                    <h3>${esc(localText(p.title))}</h3>
                    <p class="project-desc">${esc(localText(p.desc))}</p>
                    <div class="project-meta">
                        <div class="project-meta-label"><i class="fas fa-wrench"></i> ${t('projects.tools')}</div>
                        <div class="project-tools">${(p.tools || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                    </div>
                    <div class="project-meta">
                        <div class="project-meta-label"><i class="fas fa-trophy"></i> ${t('projects.result')}</div>
                        <p class="project-result">${esc(localText(p.result))}</p>
                    </div>
                    ${p.link ? `<a href="${esc(p.link)}" class="btn btn-text btn-sm" target="_blank"><i class="fas fa-arrow-right"></i> ${t('projects.view')}</a>` : ''}
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderMalware(data) {
    const methodLabels = { static: t('malware.static'), dynamic: t('malware.dynamic'), both: t('malware.both') };
    return `
    <section id="malware" class="section">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-virus"></i> ${t('malware.title')}</div>
                <h2 class="section-title">${t('malware.title')}</h2>
            </div>
            <div class="malware-grid">
                ${(data.malwareAnalyses || []).map(m => `
                <div class="malware-card reveal">
                    <div class="malware-header">
                        <div class="malware-title-group">
                            <h3>${esc(m.name)}</h3>
                            <div class="malware-badges">
                                <span class="malware-type">${esc(m.type)}</span>
                                <span class="malware-method">${methodLabels[m.method] || m.method}</span>
                            </div>
                        </div>
                        <span class="malware-date">${esc(m.date || '')}</span>
                    </div>
                    <div class="malware-body">
                        <div class="malware-section">
                            <h4><i class="fas fa-wrench"></i> ${t('malware.tools')}</h4>
                            <div class="skill-tags">${(m.tools || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                        </div>
                        <div class="malware-section">
                            <h4><i class="fas fa-diagram-project"></i> ${t('malware.mitre')}</h4>
                            <div class="mitre-list">${(m.mitre || []).map(t => `<div class="mitre-tag">${esc(t)}</div>`).join('')}</div>
                        </div>
                        <div class="malware-conclusion">
                            <h4><i class="fas fa-file-lines"></i> ${t('malware.conclusion')}</h4>
                            <p>${esc(localText(m.conclusion))}</p>
                        </div>
                    </div>
                    ${m.reportUrl ? `<div class="malware-footer"><a href="${esc(m.reportUrl)}" class="btn btn-outline btn-sm" target="_blank"><i class="fas fa-file-pdf"></i> ${t('malware.view_report')}</a></div>` : ''}
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderCerts(data) {
    const statusLabels = { obtained: t('certs.obtained'), in_progress: t('certs.in_progress'), planned: t('certs.planned') };
    const statusIcons = { obtained: 'fa-check', in_progress: 'fa-clock', planned: 'fa-bullseye' };
    return `
    <section id="certifications" class="section section-alt">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-award"></i> ${t('certs.title')}</div>
                <h2 class="section-title">${t('certs.title')}</h2>
            </div>
            <div class="certs-grid">
                ${(data.certifications || []).map(c => `
                <div class="cert-card reveal">
                    <div class="cert-badge ${c.status}"><i class="fas fa-award"></i></div>
                    <h3>${esc(c.name)}</h3>
                    <p>${esc(localText(c.desc))}</p>
                    <span class="cert-status ${c.status}">
                        <i class="fas ${statusIcons[c.status] || 'fa-circle'}"></i> ${statusLabels[c.status] || c.status}
                    </span>
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderExperience(data) {
    return `
    <section id="experience" class="section">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-route"></i> ${t('experience.title')}</div>
                <h2 class="section-title">${t('experience.title')}</h2>
            </div>
            <div class="timeline">
                ${(data.experience || []).map(e => `
                <div class="timeline-item reveal">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${esc(localText(e.date))}</div>
                        <h3>${esc(localText(e.title))}</h3>
                        <p>${esc(localText(e.desc))}</p>
                        <div class="timeline-tags">${(e.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderContact(data) {
    const p = data.profile;
    return `
    <section id="contact" class="section section-alt">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label"><i class="fas fa-paper-plane"></i> ${t('contact.title')}</div>
                <h2 class="section-title">${t('contact.title')}</h2>
                <p class="section-subtitle">${t('contact.subtitle')}</p>
            </div>
            <div class="contact-grid">
                <div class="contact-cards">
                    ${p.email ? `<div class="contact-card reveal">
                        <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                        <div><div class="contact-label">Email</div><div class="contact-value"><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></div></div>
                    </div>` : ''}
                    ${p.linkedin ? `<div class="contact-card reveal">
                        <div class="contact-icon"><i class="fab fa-linkedin-in"></i></div>
                        <div><div class="contact-label">LinkedIn</div><div class="contact-value"><a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></div></div>
                    </div>` : ''}
                    ${p.github ? `<div class="contact-card reveal">
                        <div class="contact-icon"><i class="fab fa-github"></i></div>
                        <div><div class="contact-label">GitHub</div><div class="contact-value"><a href="${esc(p.github)}" target="_blank" rel="noopener">${esc(p.github.replace('https://github.com/', ''))}</a></div></div>
                    </div>` : ''}
                </div>
                <form class="contact-form reveal" id="contactForm">
                    <div class="form-group">
                        <label for="c_name">${t('contact.name')}</label>
                        <input type="text" id="c_name" name="name" placeholder="${t('contact.name_ph')}" required>
                    </div>
                    <div class="form-group">
                        <label for="c_email">${t('contact.email')}</label>
                        <input type="email" id="c_email" name="email" placeholder="${t('contact.email_ph')}" required>
                    </div>
                    <div class="form-group">
                        <label for="c_subject">${t('contact.subject')}</label>
                        <input type="text" id="c_subject" name="subject" placeholder="${t('contact.subject_ph')}" required>
                    </div>
                    <div class="form-group">
                        <label for="c_message">${t('contact.message')}</label>
                        <textarea id="c_message" name="message" rows="4" placeholder="${t('contact.message_ph')}" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full"><i class="fas fa-paper-plane"></i> ${t('contact.send')}</button>
                </form>
            </div>
        </div>
    </section>`;
}

// ── Contact Form ──────────────────────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        if (!fd.get('name') || !fd.get('email') || !fd.get('message')) {
            showNotification(t('contact.error'), 'error');
            return;
        }
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        setTimeout(() => {
            showNotification(t('contact.success'), 'success');
            form.reset();
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 1200);
    });
}

// ── Notification ──────────────────────────────────────────────────────
function showNotification(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3500);
}

// ── Escape HTML ───────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
