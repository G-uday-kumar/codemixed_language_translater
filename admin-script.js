// Admin Dashboard JavaScript

// Admin credentials (in production, this would be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// DOM elements
let currentSection = 'verification';

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
});

// Admin login function
function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
}

// Show dashboard after login
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadDashboardData();
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// Show different sections
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName + '-section').classList.add('active');

    currentSection = sectionName;
    loadSectionData(sectionName);
}

// Load dashboard data
function loadDashboardData() {
    loadSectionData('verification');
    updateStatistics();
}

// Load data for specific section
function loadSectionData(section) {
    switch(section) {
        case 'verification':
            loadPendingQueue();
            break;
        case 'verified':
            loadVerifiedDatabase();
            break;
        case 'users':
            loadUsersList();
            break;
        case 'files':
            loadFilesList();
            break;
        case 'stats':
            updateStatistics();
            break;
    }
}

// Load pending translations queue
function loadPendingQueue() {
    const queue = document.getElementById('pending-queue');
    const pendingData = JSON.parse(localStorage.getItem('pendingDatabase') || '[]');

    if (pendingData.length === 0) {
        queue.innerHTML = '<p class="no-data">No pending translations to review.</p>';
        return;
    }

    queue.innerHTML = pendingData.map(item => `
        <div class="pending-item" data-id="${item.id}">
            <h3>Translation Request</h3>
            <div class="pending-text">
                <strong>Source (${item.sourceLang}):</strong> ${item.sourceText}
            </div>
            <div class="pending-text">
                <strong>Translation (${item.targetLang}):</strong> ${item.targetText}
            </div>
            <div class="pending-meta">
                Submitted by: ${item.submittedBy} | ${new Date(item.submittedAt).toLocaleString()}
            </div>
            <div class="pending-actions">
                <button class="btn-approve" onclick="approveTranslation('${item.id}')">Approve & Reward</button>
                <button class="btn-reject" onclick="rejectTranslation('${item.id}')">Reject</button>
            </div>
        </div>
    `).join('');
}

// Approve translation
function approveTranslation(id) {
    const pendingData = JSON.parse(localStorage.getItem('pendingDatabase') || '[]');
    const itemIndex = pendingData.findIndex(item => item.id === id);

    if (itemIndex === -1) return;

    const item = pendingData[itemIndex];

    // Add to verified database
    const verifiedData = JSON.parse(localStorage.getItem('verifiedDatabase') || '{}');
    if (!verifiedData[item.sourceLang]) verifiedData[item.sourceLang] = {};
    if (!verifiedData[item.sourceLang][item.targetLang]) verifiedData[item.sourceLang][item.targetLang] = {};
    verifiedData[item.sourceLang][item.targetLang][item.sourceText] = item.targetText;

    // Also add reverse translation
    if (!verifiedData[item.targetLang]) verifiedData[item.targetLang] = {};
    if (!verifiedData[item.targetLang][item.sourceLang]) verifiedData[item.targetLang][item.sourceLang] = {};
    verifiedData[item.targetLang][item.sourceLang][item.targetText] = item.sourceText;

    // Award points to user
    const userPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');
    userPoints[item.submittedBy] = (userPoints[item.submittedBy] || 0) + 5;
    localStorage.setItem('userPoints', JSON.stringify(userPoints));

    // Remove from pending
    pendingData.splice(itemIndex, 1);

    // Save changes
    localStorage.setItem('verifiedDatabase', JSON.stringify(verifiedData));
    localStorage.setItem('pendingDatabase', JSON.stringify(pendingData));

    // Refresh UI
    loadPendingQueue();
    updateStatistics();
    showNotification('Translation approved and points awarded!', 'success');
}

// Reject translation
function rejectTranslation(id) {
    const pendingData = JSON.parse(localStorage.getItem('pendingDatabase') || '[]');
    const itemIndex = pendingData.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        pendingData.splice(itemIndex, 1);
        localStorage.setItem('pendingDatabase', JSON.stringify(pendingData));
        loadPendingQueue();
        updateStatistics();
        showNotification('Translation rejected.', 'info');
    }
}

// Load verified database
function loadVerifiedDatabase() {
    const list = document.getElementById('verified-list');
    const verifiedData = JSON.parse(localStorage.getItem('verifiedDatabase') || '{}');

    const translations = [];
    Object.keys(verifiedData).forEach(sourceLang => {
        Object.keys(verifiedData[sourceLang]).forEach(targetLang => {
            Object.keys(verifiedData[sourceLang][targetLang]).forEach(sourceText => {
                translations.push({
                    sourceLang,
                    targetLang,
                    sourceText,
                    targetText: verifiedData[sourceLang][targetLang][sourceText]
                });
            });
        });
    });

    if (translations.length === 0) {
        list.innerHTML = '<p class="no-data">No verified translations found.</p>';
        return;
    }

    list.innerHTML = translations.map((item, index) => `
        <div class="verified-item">
            <div class="verified-content">
                <div class="verified-text">${item.sourceText}</div>
                <div class="verified-translation">${item.targetText}</div>
                <div class="verified-meta">${item.sourceLang} → ${item.targetLang}</div>
            </div>
            <div class="verified-actions">
                <button class="btn-edit" onclick="editTranslation(${index})">Edit</button>
                <button class="btn-delete" onclick="deleteTranslation('${item.sourceLang}', '${item.targetLang}', '${item.sourceText}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete verified translation
function deleteTranslation(sourceLang, targetLang, sourceText) {
    const verifiedData = JSON.parse(localStorage.getItem('verifiedDatabase') || '{}');

    if (verifiedData[sourceLang] && verifiedData[sourceLang][targetLang]) {
        delete verifiedData[sourceLang][targetLang][sourceText];
        localStorage.setItem('verifiedDatabase', JSON.stringify(verifiedData));
        loadVerifiedDatabase();
        updateStatistics();
        showNotification('Translation deleted.', 'info');
    }
}

// Edit translation (placeholder - would need modal implementation)
// ✅ Edit translation: allows admin to change source & target text
function editTranslation(index) {
    // Rebuild the same translations array used in loadVerifiedDatabase()
    const verifiedData = JSON.parse(localStorage.getItem('verifiedDatabase') || '{}');

    const translations = [];
    Object.keys(verifiedData).forEach(sourceLang => {
        Object.keys(verifiedData[sourceLang]).forEach(targetLang => {
            Object.keys(verifiedData[sourceLang][targetLang]).forEach(sourceText => {
                translations.push({
                    sourceLang,
                    targetLang,
                    sourceText,
                    targetText: verifiedData[sourceLang][targetLang][sourceText]
                });
            });
        });
    });

    const item = translations[index];
    if (!item) {
        showNotification('Could not find this translation to edit.', 'error');
        return;
    }

    // Ask admin for new values
    const newSourceText = prompt('Edit source text:', item.sourceText);
    if (newSourceText === null) return; // Cancelled
    const trimmedSource = newSourceText.trim();
    if (!trimmedSource) {
        alert('Source text cannot be empty.');
        return;
    }

    const newTargetText = prompt('Edit target text:', item.targetText);
    if (newTargetText === null) return; // Cancelled
    const trimmedTarget = newTargetText.trim();
    if (!trimmedTarget) {
        alert('Target text cannot be empty.');
        return;
    }

    // Remove old forward mapping
    if (verifiedData[item.sourceLang] &&
        verifiedData[item.sourceLang][item.targetLang]) {
        delete verifiedData[item.sourceLang][item.targetLang][item.sourceText];
    }

    // Remove old reverse mapping (target → source) if it exists
    if (verifiedData[item.targetLang] &&
        verifiedData[item.targetLang][item.sourceLang]) {
        delete verifiedData[item.targetLang][item.sourceLang][item.targetText];
    }

    // Add updated forward translation
    if (!verifiedData[item.sourceLang]) verifiedData[item.sourceLang] = {};
    if (!verifiedData[item.sourceLang][item.targetLang]) {
        verifiedData[item.sourceLang][item.targetLang] = {};
    }
    verifiedData[item.sourceLang][item.targetLang][trimmedSource] = trimmedTarget;

    // Add updated reverse translation as well
    if (!verifiedData[item.targetLang]) verifiedData[item.targetLang] = {};
    if (!verifiedData[item.targetLang][item.sourceLang]) {
        verifiedData[item.targetLang][item.sourceLang] = {};
    }
    verifiedData[item.targetLang][item.sourceLang][trimmedTarget] = trimmedSource;

    // Save changes
    localStorage.setItem('verifiedDatabase', JSON.stringify(verifiedData));

    // Refresh UI and stats
    loadVerifiedDatabase();
    updateStatistics();
    showNotification('Translation updated successfully!', 'success');
}


// Load users list
function loadUsersList() {
    const list = document.getElementById('users-list');
    const userPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');

    const users = Object.keys(userPoints).map(username => ({
        username,
        points: userPoints[username]
    }));

    if (users.length === 0) {
        list.innerHTML = '<p class="no-data">No users found.</p>';
        return;
    }

    list.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <h3>${user.username}</h3>
                <div class="user-points">${user.points} points</div>
            </div>
            <div class="user-actions">
                <input type="number" class="points-input" value="${user.points}" min="0">
                <button class="btn-update-points" onclick="updateUserPoints('${user.username}', this.previousElementSibling.value)">Update</button>
            </div>
        </div>
    `).join('');
}

// Update user points
function updateUserPoints(username, newPoints) {
    const userPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');
    userPoints[username] = parseInt(newPoints) || 0;
    localStorage.setItem('userPoints', JSON.stringify(userPoints));
    loadUsersList();
    updateStatistics();
    showNotification('User points updated!', 'success');
}

// Load files list (placeholder for file translation history)
function loadFilesList() {
    const list = document.getElementById('files-list');
    // This would be populated with actual file translation history
    list.innerHTML = '<p class="no-data">File translation history will be displayed here.</p>';
}

// Update statistics
function updateStatistics() {
    const verifiedData = JSON.parse(localStorage.getItem('verifiedDatabase') || '{}');
    const pendingData = JSON.parse(localStorage.getItem('pendingDatabase') || '[]');
    const userPoints = JSON.parse(localStorage.getItem('userPoints') || '{}');

    // Count total translations
    let totalTranslations = 0;
    Object.values(verifiedData).forEach(langGroup => {
        Object.values(langGroup).forEach(translations => {
            totalTranslations += Object.keys(translations).length;
        });
    });

    // Count total points
    const totalPoints = Object.values(userPoints).reduce((sum, points) => sum + points, 0);

    // Update stats
    document.getElementById('total-translations').textContent = totalTranslations;
    document.getElementById('pending-count').textContent = pendingData.length;
    document.getElementById('active-users').textContent = Object.keys(userPoints).length;
    document.getElementById('total-points').textContent = totalPoints;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 10px 20px;
        border-radius: 6px;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// ✅ Handle Excel dataset upload (Admin)
function handleDatasetUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (!rows.length) {
            showNotification('Excel file is empty!', 'error');
            return;
        }

        const verifiedData = JSON.parse(localStorage.getItem('verifiedDatabase') || '{}');
        const tableBody = document.getElementById('datasetTableBody');
        tableBody.innerHTML = '';

        rows.forEach((row, index) => {
            const { SourceLang, TargetLang, SourceText, TargetText } = row;

            if (!SourceLang || !TargetLang || !SourceText || !TargetText) return;

            // Forward mapping
            if (!verifiedData[SourceLang]) verifiedData[SourceLang] = {};
            if (!verifiedData[SourceLang][TargetLang]) verifiedData[SourceLang][TargetLang] = {};
            verifiedData[SourceLang][TargetLang][SourceText] = TargetText;

            // Reverse mapping
            if (!verifiedData[TargetLang]) verifiedData[TargetLang] = {};
            if (!verifiedData[TargetLang][SourceLang]) verifiedData[TargetLang][SourceLang] = {};
            verifiedData[TargetLang][SourceLang][TargetText] = SourceText;

            // Display in table
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${SourceLang}</td>
                <td>${TargetLang}</td>
                <td>${SourceText}</td>
                <td>${TargetText}</td>
            `;
            tableBody.appendChild(tr);
        });

        localStorage.setItem('verifiedDatabase', JSON.stringify(verifiedData));

        loadVerifiedDatabase();
        updateStatistics();
        showNotification('Dataset uploaded and merged successfully!', 'success');
    };

    reader.readAsArrayBuffer(file);
}
