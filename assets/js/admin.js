/* =====================================================================
   ADMIN.JS — Admin Dashboard Logic, CRUD, Auth
   Chris Meshack — SOC Analyst Portfolio
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAdminTheme();
    initAuth();
});

// ── Theme ─────────────────────────────────────────────────────────────
function initAdminTheme() {
    const theme = DataStore.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('adminThemeToggle');
    if (btn) {
        btn.querySelector('i').className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        btn.addEventListener('click', () => {
            const cur = DataStore.getTheme();
            const next = cur === 'light' ? 'dark' : 'light';
            DataStore.setTheme(next);
            btn.querySelector('i').className = next === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }
}

// ── Authentication ────────────────────────────────────────────────────
function initAuth() {
    if (DataStore.isAuthenticated()) {
        showAdmin();
    } else {
        showLogin();
    }

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = document.getElementById('loginPassword').value;
        const ok = await DataStore.authenticate(pw);
        if (ok) { showAdmin(); }
        else {
            const err = document.getElementById('loginError');
            err.style.display = 'block';
            setTimeout(() => err.style.display = 'none', 3000);
        }
    });
}

function showLogin() {
    document.getElementById('loginView').style.display = '';
    document.getElementById('adminView').style.display = 'none';
}

function showAdmin() {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('adminView').style.display = '';

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        DataStore.logout();
        showLogin();
    });

    // Sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('adminSidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // Sidebar nav
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const panel = link.dataset.panel;
            renderPanel(panel);
            sidebar.classList.remove('open');
        });
    });

    renderPanel('profile');
}

// ── Panel Router ──────────────────────────────────────────────────────
function renderPanel(panel) {
    const main = document.getElementById('adminMain');
    const data = DataStore.getData();

    switch (panel) {
        case 'profile': main.innerHTML = profilePanel(data); initProfileForm(); break;
        case 'skills': main.innerHTML = collectionPanel('skills', data.skills, skillFields()); initCollectionEvents('skills', skillFields()); break;
        case 'specializations': main.innerHTML = collectionPanel('specializations', data.specializations, specFields()); initCollectionEvents('specializations', specFields()); break;
        case 'projects': main.innerHTML = collectionPanel('projects', data.projects, projectFields()); initCollectionEvents('projects', projectFields()); break;
        case 'malware': main.innerHTML = collectionPanel('malwareAnalyses', data.malwareAnalyses, malwareFields()); initCollectionEvents('malwareAnalyses', malwareFields()); break;
        case 'certifications': main.innerHTML = collectionPanel('certifications', data.certifications, certFields()); initCollectionEvents('certifications', certFields()); break;
        case 'experience': main.innerHTML = collectionPanel('experience', data.experience, expFields()); initCollectionEvents('experience', expFields()); break;
        case 'sections': main.innerHTML = sectionsPanel(data); initSectionsEvents(); break;
        case 'security': main.innerHTML = securityPanel(); initSecurityForm(); break;
        case 'data': main.innerHTML = dataPanel(); initDataEvents(); break;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// PROFILE PANEL
// ═══════════════════════════════════════════════════════════════════════
function profilePanel(data) {
    const p = data.profile;
    return `
    <div class="admin-panel-header"><h2><i class="fas fa-user" style="color:var(--accent);margin-right:8px"></i> Profil</h2></div>
    <form id="profileForm" class="admin-card">
        <div class="admin-form-grid">
            <div class="form-group"><label>Nom</label><input name="name" value="${esc(p.name)}" required></div>
            <div class="form-group"><label>Titre</label><input name="title" value="${esc(p.title)}"></div>
            <div class="form-group"><label>Email</label><input name="email" type="email" value="${esc(p.email)}"></div>
            <div class="form-group"><label>GitHub URL</label><input name="github" value="${esc(p.github)}"></div>
            <div class="form-group"><label>LinkedIn URL</label><input name="linkedin" value="${esc(p.linkedin)}"></div>
            <div class="form-group"><label>CV URL</label><input name="cvUrl" value="${esc(p.cvUrl)}"></div>
            <div class="form-group"><label>Photo URL</label><input name="photo" value="${esc(p.photo)}"></div>
            <div class="form-group full-width"><label>Sous-titre (FR)</label><input name="subtitle_fr" value="${esc(p.subtitle?.fr || '')}"></div>
            <div class="form-group full-width"><label>Sous-titre (EN)</label><input name="subtitle_en" value="${esc(p.subtitle?.en || '')}"></div>
            <div class="form-group full-width"><label>Bio Hero (FR)</label><textarea name="heroBio_fr" rows="3">${esc(p.heroBio?.fr || '')}</textarea></div>
            <div class="form-group full-width"><label>Bio Hero (EN)</label><textarea name="heroBio_en" rows="3">${esc(p.heroBio?.en || '')}</textarea></div>
            <div class="form-group full-width"><label>Bio (FR)</label><textarea name="bio_fr" rows="3">${esc(p.bio?.fr || '')}</textarea></div>
            <div class="form-group full-width"><label>Bio (EN)</label><textarea name="bio_en" rows="3">${esc(p.bio?.en || '')}</textarea></div>
            <div class="form-group full-width"><label>Bio 2 (FR)</label><textarea name="bio2_fr" rows="3">${esc(p.bio2?.fr || '')}</textarea></div>
            <div class="form-group full-width"><label>Bio 2 (EN)</label><textarea name="bio2_en" rows="3">${esc(p.bio2?.en || '')}</textarea></div>
            <div class="form-group full-width"><label>Typed Phrases (une par ligne)</label><textarea name="typedPhrases" rows="3">${(data.typedPhrases || []).join('\n')}</textarea></div>
        </div>
        <div style="margin-top:16px"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Sauvegarder</button></div>
    </form>`;
}

function initProfileForm() {
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = DataStore.getData();
        data.profile.name = fd.get('name');
        data.profile.title = fd.get('title');
        data.profile.email = fd.get('email');
        data.profile.github = fd.get('github');
        data.profile.linkedin = fd.get('linkedin');
        data.profile.cvUrl = fd.get('cvUrl');
        data.profile.photo = fd.get('photo');
        data.profile.subtitle = { fr: fd.get('subtitle_fr'), en: fd.get('subtitle_en') };
        data.profile.heroBio = { fr: fd.get('heroBio_fr'), en: fd.get('heroBio_en') };
        data.profile.bio = { fr: fd.get('bio_fr'), en: fd.get('bio_en') };
        data.profile.bio2 = { fr: fd.get('bio2_fr'), en: fd.get('bio2_en') };
        data.typedPhrases = fd.get('typedPhrases').split('\n').map(s => s.trim()).filter(Boolean);
        DataStore.saveData(data);
        showNotif('Profil sauvegardé !');
    });
}

// ═══════════════════════════════════════════════════════════════════════
// GENERIC COLLECTION PANEL (Skills, Projects, Certs, etc.)
// ═══════════════════════════════════════════════════════════════════════
function collectionPanel(collection, items, fields) {
    const titles = {
        skills: 'Compétences', specializations: 'Spécialisations', projects: 'Projets SOC',
        malwareAnalyses: 'Malware Analysis', certifications: 'Certifications', experience: 'Parcours'
    };
    return `
    <div class="admin-panel-header">
        <h2><i class="fas fa-list" style="color:var(--accent);margin-right:8px"></i> ${titles[collection] || collection}</h2>
        <button class="btn btn-primary" id="addItemBtn"><i class="fas fa-plus"></i> Ajouter</button>
    </div>
    <div id="itemsList">
        ${(items || []).map((item, idx) => itemCard(collection, item, fields, idx)).join('')}
    </div>
    <div id="editModal" style="display:none"></div>`;
}

function itemCard(collection, item, fields, idx) {
    const title = item.name || localText(item.title) || `Élément ${idx + 1}`;
    return `
    <div class="admin-card" data-id="${item.id}">
        <div class="admin-card-header">
            <h3>${esc(title)}</h3>
            <div class="admin-card-actions">
                <button class="admin-btn-icon edit-item-btn" data-id="${item.id}" title="Modifier"><i class="fas fa-pen"></i></button>
                <button class="admin-btn-icon danger delete-item-btn" data-id="${item.id}" title="Supprimer"><i class="fas fa-trash"></i></button>
            </div>
        </div>
        <div style="font-size:0.84rem;color:var(--text-secondary)">
            ${fields.slice(0, 3).map(f => {
                const val = getNestedValue(item, f.key);
                if (!val) return '';
                const display = typeof val === 'object' ? (val.fr || JSON.stringify(val)) : val;
                return `<div style="margin-bottom:4px"><strong>${f.label}:</strong> ${esc(String(display)).substring(0, 100)}</div>`;
            }).join('')}
        </div>
    </div>`;
}

function initCollectionEvents(collection, fields) {
    // Add button
    document.getElementById('addItemBtn').addEventListener('click', () => showEditForm(collection, null, fields));

    // Edit / Delete buttons
    document.getElementById('itemsList').addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-item-btn');
        const deleteBtn = e.target.closest('.delete-item-btn');

        if (editBtn) {
            const id = editBtn.dataset.id;
            const data = DataStore.getData();
            const item = data[collection].find(i => i.id === id);
            if (item) showEditForm(collection, item, fields);
        }

        if (deleteBtn) {
            if (confirm('Supprimer cet élément ?')) {
                const id = deleteBtn.dataset.id;
                DataStore._deleteItem(collection, id);
                renderPanel(collection === 'malwareAnalyses' ? 'malware' : collection);
                showNotif('Élément supprimé');
            }
        }
    });
}

function showEditForm(collection, item, fields) {
    const isNew = !item;
    const modal = document.getElementById('editModal');

    modal.style.display = 'block';
    modal.innerHTML = `
    <div class="admin-card" style="border-color:var(--accent);margin-top:16px">
        <div class="admin-card-header">
            <h3>${isNew ? 'Ajouter' : 'Modifier'}</h3>
            <button class="admin-btn-icon" id="closeEditBtn"><i class="fas fa-times"></i></button>
        </div>
        <form id="editItemForm">
            <div class="admin-form-grid">
                ${fields.map(f => renderField(f, item)).join('')}
            </div>
            <div style="margin-top:16px;display:flex;gap:8px">
                <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isNew ? 'Ajouter' : 'Sauvegarder'}</button>
                <button type="button" class="btn btn-outline" id="cancelEditBtn">Annuler</button>
            </div>
        </form>
    </div>`;

    modal.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('closeEditBtn').addEventListener('click', () => modal.style.display = 'none');
    document.getElementById('cancelEditBtn').addEventListener('click', () => modal.style.display = 'none');

    document.getElementById('editItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const obj = buildObjectFromFields(fd, fields);

        if (isNew) {
            obj.id = `${collection}_${Date.now()}`;
            DataStore._addItem(collection, obj);
            showNotif('Élément ajouté !');
        } else {
            DataStore._updateItem(collection, item.id, obj);
            showNotif('Élément mis à jour !');
        }

        renderPanel(collection === 'malwareAnalyses' ? 'malware' : collection);
    });
}

// ── Field Definitions ─────────────────────────────────────────────────
function skillFields() {
    return [
        { key: 'name', label: 'Nom', type: 'text', required: true },
        { key: 'icon', label: 'Icône (ex: fa-chart-bar)', type: 'text' },
        { key: 'progress', label: 'Progression (%)', type: 'number' },
        { key: 'level.fr', label: 'Niveau (FR)', type: 'text' },
        { key: 'level.en', label: 'Niveau (EN)', type: 'text' },
        { key: 'desc.fr', label: 'Description (FR)', type: 'textarea', full: true },
        { key: 'desc.en', label: 'Description (EN)', type: 'textarea', full: true },
        { key: 'tags', label: 'Tags (virgule)', type: 'tags', full: true },
    ];
}

function specFields() {
    return [
        { key: 'icon', label: 'Icône (ex: fa-satellite-dish)', type: 'text' },
        { key: 'title.fr', label: 'Titre (FR)', type: 'text', required: true },
        { key: 'title.en', label: 'Titre (EN)', type: 'text' },
        { key: 'desc.fr', label: 'Description (FR)', type: 'textarea', full: true },
        { key: 'desc.en', label: 'Description (EN)', type: 'textarea', full: true },
    ];
}

function projectFields() {
    return [
        { key: 'icon', label: 'Icône', type: 'text' },
        { key: 'tag', label: 'Catégorie', type: 'text' },
        { key: 'title.fr', label: 'Titre (FR)', type: 'text', required: true },
        { key: 'title.en', label: 'Titre (EN)', type: 'text' },
        { key: 'desc.fr', label: 'Description (FR)', type: 'textarea', full: true },
        { key: 'desc.en', label: 'Description (EN)', type: 'textarea', full: true },
        { key: 'tools', label: 'Outils (virgule)', type: 'tags', full: true },
        { key: 'result.fr', label: 'Résultat (FR)', type: 'textarea', full: true },
        { key: 'result.en', label: 'Résultat (EN)', type: 'textarea', full: true },
        { key: 'link', label: 'Lien', type: 'text', full: true },
    ];
}

function malwareFields() {
    return [
        { key: 'name', label: 'Nom du malware', type: 'text', required: true },
        { key: 'type', label: 'Type (Trojan, Ransomware...)', type: 'text' },
        { key: 'method', label: 'Méthode', type: 'select', options: [
            { value: 'static', label: 'Statique' },
            { value: 'dynamic', label: 'Dynamique' },
            { value: 'both', label: 'Statique & Dynamique' },
        ]},
        { key: 'date', label: 'Date (YYYY-MM)', type: 'text' },
        { key: 'tools', label: 'Outils (virgule)', type: 'tags', full: true },
        { key: 'mitre', label: 'MITRE ATT&CK (une par ligne)', type: 'multiline', full: true },
        { key: 'conclusion.fr', label: 'Conclusion (FR)', type: 'textarea', full: true },
        { key: 'conclusion.en', label: 'Conclusion (EN)', type: 'textarea', full: true },
        { key: 'reportUrl', label: 'URL du rapport', type: 'text', full: true },
    ];
}

function certFields() {
    return [
        { key: 'name', label: 'Nom', type: 'text', required: true },
        { key: 'status', label: 'Statut', type: 'select', options: [
            { value: 'obtained', label: 'Obtenue' },
            { value: 'in_progress', label: 'En préparation' },
            { value: 'planned', label: 'Objectif futur' },
        ]},
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'desc.fr', label: 'Description (FR)', type: 'textarea', full: true },
        { key: 'desc.en', label: 'Description (EN)', type: 'textarea', full: true },
        { key: 'imageUrl', label: 'Image/PDF URL', type: 'text', full: true },
    ];
}

function expFields() {
    return [
        { key: 'icon', label: 'Icône', type: 'text' },
        { key: 'title.fr', label: 'Titre (FR)', type: 'text', required: true },
        { key: 'title.en', label: 'Titre (EN)', type: 'text' },
        { key: 'date.fr', label: 'Date (FR)', type: 'text' },
        { key: 'date.en', label: 'Date (EN)', type: 'text' },
        { key: 'desc.fr', label: 'Description (FR)', type: 'textarea', full: true },
        { key: 'desc.en', label: 'Description (EN)', type: 'textarea', full: true },
        { key: 'tags', label: 'Tags (virgule)', type: 'tags', full: true },
    ];
}

// ── Field Rendering ───────────────────────────────────────────────────
function renderField(field, item) {
    const val = item ? getNestedValue(item, field.key) : '';
    const fullClass = field.full ? ' full-width' : '';
    const req = field.required ? ' required' : '';

    if (field.type === 'textarea') {
        return `<div class="form-group${fullClass}"><label>${field.label}</label><textarea name="${field.key}" rows="3"${req}>${esc(val || '')}</textarea></div>`;
    }
    if (field.type === 'select') {
        const opts = (field.options || []).map(o => `<option value="${o.value}" ${val === o.value ? 'selected' : ''}>${o.label}</option>`).join('');
        return `<div class="form-group${fullClass}"><label>${field.label}</label><select name="${field.key}"${req}>${opts}</select></div>`;
    }
    if (field.type === 'tags') {
        const tagVal = Array.isArray(val) ? val.join(', ') : (val || '');
        return `<div class="form-group${fullClass}"><label>${field.label}</label><input name="${field.key}" value="${esc(tagVal)}"${req}></div>`;
    }
    if (field.type === 'multiline') {
        const mlVal = Array.isArray(val) ? val.join('\n') : (val || '');
        return `<div class="form-group${fullClass}"><label>${field.label}</label><textarea name="${field.key}" rows="4"${req}>${esc(mlVal)}</textarea></div>`;
    }
    if (field.type === 'number') {
        return `<div class="form-group${fullClass}"><label>${field.label}</label><input type="number" name="${field.key}" value="${val || 0}" min="0" max="100"${req}></div>`;
    }
    return `<div class="form-group${fullClass}"><label>${field.label}</label><input name="${field.key}" value="${esc(val || '')}"${req}></div>`;
}

function getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : '', obj);
}

function buildObjectFromFields(fd, fields) {
    const obj = {};
    fields.forEach(f => {
        let val = fd.get(f.key) || '';
        if (f.type === 'tags') val = val.split(',').map(s => s.trim()).filter(Boolean);
        else if (f.type === 'multiline') val = val.split('\n').map(s => s.trim()).filter(Boolean);
        else if (f.type === 'number') val = parseInt(val) || 0;

        // Handle nested keys like "title.fr"
        const keys = f.key.split('.');
        if (keys.length === 2) {
            if (!obj[keys[0]]) obj[keys[0]] = {};
            obj[keys[0]][keys[1]] = val;
        } else {
            obj[f.key] = val;
        }
    });
    return obj;
}

// ═══════════════════════════════════════════════════════════════════════
// SECTIONS PANEL
// ═══════════════════════════════════════════════════════════════════════
function sectionsPanel(data) {
    const labels = {
        hero: 'Hero', about: 'À propos', skills: 'Compétences', projects: 'Projets SOC',
        malware: 'Malware Analysis', certifications: 'Certifications',
        experience: 'Parcours', contact: 'Contact'
    };

    const ordered = Object.entries(data.sections).sort((a, b) => a[1].order - b[1].order);

    return `
    <div class="admin-panel-header"><h2><i class="fas fa-toggle-on" style="color:var(--accent);margin-right:8px"></i> Sections</h2></div>
    <div class="admin-card">
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:16px">Activez ou désactivez les sections affichées sur le portfolio.</p>
        ${ordered.map(([key, val]) => `
        <div class="section-toggle-row">
            <span>${labels[key] || key}</span>
            <label class="toggle-switch">
                <input type="checkbox" data-section="${key}" ${val.enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>`).join('')}
    </div>`;
}

function initSectionsEvents() {
    document.querySelectorAll('.section-toggle-row input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            DataStore.toggleSection(cb.dataset.section);
            showNotif('Section mise à jour');
        });
    });
}

// ═══════════════════════════════════════════════════════════════════════
// SECURITY PANEL
// ═══════════════════════════════════════════════════════════════════════
function securityPanel() {
    return `
    <div class="admin-panel-header"><h2><i class="fas fa-lock" style="color:var(--accent);margin-right:8px"></i> Sécurité</h2></div>
    <div class="admin-card">
        <h3 style="margin-bottom:16px">Changer le mot de passe</h3>
        <form id="securityForm" class="admin-form-grid">
            <div class="form-group"><label>Nouveau mot de passe</label><input type="password" id="newPassword" required minlength="4"></div>
            <div class="form-group"><label>Confirmer</label><input type="password" id="confirmPassword" required minlength="4"></div>
            <div class="full-width"><button type="submit" class="btn btn-primary"><i class="fas fa-key"></i> Changer le mot de passe</button></div>
        </form>
    </div>`;
}

function initSecurityForm() {
    document.getElementById('securityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const pw = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        if (pw !== confirm) { showNotif('Les mots de passe ne correspondent pas', 'error'); return; }
        if (pw.length < 4) { showNotif('Minimum 4 caractères', 'error'); return; }
        await DataStore.changePassword(pw);
        showNotif('Mot de passe changé !');
        e.target.reset();
    });
}

// ═══════════════════════════════════════════════════════════════════════
// DATA PANEL (Export / Import / Reset)
// ═══════════════════════════════════════════════════════════════════════
function dataPanel() {
    return `
    <div class="admin-panel-header"><h2><i class="fas fa-database" style="color:var(--accent);margin-right:8px"></i> Gestion des données</h2></div>
    <div class="admin-card">
        <h3 style="margin-bottom:8px">Exporter</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:12px">Téléchargez une sauvegarde complète de vos données au format JSON.</p>
        <button class="btn btn-outline" id="exportBtn"><i class="fas fa-download"></i> Exporter JSON</button>
    </div>
    <div class="admin-card">
        <h3 style="margin-bottom:8px">Importer</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:12px">Restaurez vos données depuis un fichier JSON.</p>
        <input type="file" id="importFile" accept=".json" style="margin-bottom:12px;font-size:0.85rem">
        <br><button class="btn btn-outline" id="importBtn"><i class="fas fa-upload"></i> Importer</button>
    </div>
    <div class="admin-card">
        <h3 style="margin-bottom:8px;color:var(--error)">Réinitialiser</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:12px">Remettre toutes les données aux valeurs par défaut. Cette action est irréversible.</p>
        <button class="btn btn-danger" id="resetBtn"><i class="fas fa-exclamation-triangle"></i> Réinitialiser</button>
    </div>`;
}

function initDataEvents() {
    document.getElementById('exportBtn').addEventListener('click', () => DataStore.exportData());

    document.getElementById('importBtn').addEventListener('click', async () => {
        const file = document.getElementById('importFile').files[0];
        if (!file) { showNotif('Sélectionnez un fichier', 'error'); return; }
        try {
            await DataStore.importData(file);
            showNotif('Données importées !');
            renderPanel('profile');
        } catch (e) { showNotif('Erreur d\'importation', 'error'); }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
            DataStore.resetData();
            showNotif('Données réinitialisées');
            renderPanel('profile');
        }
    });
}

// ── Notification ──────────────────────────────────────────────────────
function showNotif(msg, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}

// ── Escape ────────────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
