// Avatar collections for different roles
const avatars = {
  developer: [
    '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🔬', '👩‍🔬', '🧑‍🔬',
    '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨‍💼', '👩‍💼', '🧑‍💼',
    '🤓', '😎', '🧠', '⚡', '🚀', '💡'
  ],
  lead: [
    '👑', '🎯', '⭐', '🏆', '💎', '🔥',
    '👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨‍💼', '👩‍💼', '🧑‍💼',
    '🦸‍♂️', '🦸‍♀️', '🦸', '🧙‍♂️', '🧙‍♀️', '🧙'
  ]
};

// DOM elements
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const generateTeamBtn = document.getElementById('generateTeam');
const calculateBtn = document.getElementById('calculateCapacity');
const exportCsvBtn = document.getElementById('exportCsv');
const openFullAppBtn = document.getElementById('openFullApp');
const teamSection = document.getElementById('teamSection');
const teamMembers = document.getElementById('teamMembers');
const resultsSection = document.getElementById('resultsSection');
const capacityResults = document.getElementById('capacityResults');

// State
let currentTeam = [];
let currentResults = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSavedData();
  setupEventListeners();
});

// Theme management
function initTheme() {
  chrome.storage.sync.get(['theme'], (result) => {
    const isDark = result.theme === 'dark' ||
      (!result.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.body.classList.add('dark');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  });
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');

  sunIcon.style.display = isDark ? 'none' : 'block';
  moonIcon.style.display = isDark ? 'block' : 'none';

  chrome.storage.sync.set({ theme: isDark ? 'dark' : 'light' });
}

// Event listeners
function setupEventListeners() {
  themeToggle.addEventListener('click', toggleTheme);
  generateTeamBtn.addEventListener('click', generateTeam);
  calculateBtn.addEventListener('click', calculateCapacity);
  exportCsvBtn.addEventListener('click', exportToCsv);
  openFullAppBtn.addEventListener('click', openFullApp);
}

// Load saved data
function loadSavedData() {
  chrome.storage.sync.get(['sprintConfig', 'teamMembers'], (result) => {
    if (result.sprintConfig) {
      const config = result.sprintConfig;
      document.getElementById('sprintDays').value = config.sprintDays || 10;
      document.getElementById('holidays').value = config.holidays || 0;
      document.getElementById('developers').value = config.developers || 4;
      document.getElementById('leads').value = config.leads || 1;
    }

    if (result.teamMembers) {
      currentTeam = result.teamMembers;
      displayTeam();
    }
  });
}

// Save data
function saveData() {
  const sprintConfig = {
    sprintDays: parseInt(document.getElementById('sprintDays').value),
    holidays: parseInt(document.getElementById('holidays').value),
    developers: parseInt(document.getElementById('developers').value),
    leads: parseInt(document.getElementById('leads').value)
  };

  chrome.storage.sync.set({
    sprintConfig,
    teamMembers: currentTeam
  });
}

// Generate team
function generateTeam() {
  const numDevs = parseInt(document.getElementById('developers').value) || 0;
  const numLeads = parseInt(document.getElementById('leads').value) || 0;
  const totalMembers = numDevs + numLeads;

  if (totalMembers === 0) {
    showNotification('Please specify at least one team member', 'error');
    return;
  }

  currentTeam = [];

  // Generate developers
  for (let i = 1; i <= numDevs; i++) {
    const avatar = avatars.developer[Math.floor(Math.random() * avatars.developer.length)];
    currentTeam.push({
      id: `dev-${i}`,
      name: `Developer ${i}`,
      role: 'Developer',
      avatar: avatar,
      vacation: 0,
      points: 8
    });
  }

  // Generate leads
  for (let i = 1; i <= numLeads; i++) {
    const avatar = avatars.lead[Math.floor(Math.random() * avatars.lead.length)];
    currentTeam.push({
      id: `lead-${i}`,
      name: `Tech Lead ${i}`,
      role: 'Lead/Manager',
      avatar: avatar,
      vacation: 0,
      points: 6
    });
  }

  displayTeam();
  saveData();

  teamSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
}

// Display team
function displayTeam() {
  teamMembers.innerHTML = '';

  currentTeam.forEach((member, index) => {
    const memberCard = document.createElement('div');
    memberCard.className = 'member-card';
    memberCard.innerHTML = `
      <div class="member-header">
        <div class="member-avatar avatar-selector" data-member-id="${member.id}">
          ${member.avatar}
        </div>
        <div class="member-info">
          <input type="text" class="member-name" value="${member.name}" 
                 data-member-id="${member.id}" placeholder="Member name">
          <div class="member-role">${member.role}</div>
        </div>
      </div>
      <div class="member-inputs">
        <input type="number" class="member-input member-vacation" 
               value="${member.vacation}" min="0" max="20" 
               data-member-id="${member.id}" placeholder="Vacation">
        <input type="number" class="member-input member-points" 
               value="${member.points}" min="0" max="50" 
               data-member-id="${member.id}" placeholder="Points">
        <div class="member-availability" data-member-id="${member.id}">100%</div>
      </div>
    `;

    teamMembers.appendChild(memberCard);
  });

  setupMemberEventListeners();
  updateAvailability();
}

// Setup member event listeners
function setupMemberEventListeners() {
  // Name inputs
  document.querySelectorAll('.member-name').forEach(input => {
    input.addEventListener('input', (e) => {
      const memberId = e.target.dataset.memberId;
      const member = currentTeam.find(m => m.id === memberId);
      if (member) {
        member.name = e.target.value;
        saveData();
      }
    });
  });

  // Vacation inputs
  document.querySelectorAll('.member-vacation').forEach(input => {
    input.addEventListener('input', (e) => {
      const memberId = e.target.dataset.memberId;
      const member = currentTeam.find(m => m.id === memberId);
      if (member) {
        member.vacation = parseInt(e.target.value) || 0;
        updateAvailability();
        saveData();
      }
    });
  });

  // Points inputs
  document.querySelectorAll('.member-points').forEach(input => {
    input.addEventListener('input', (e) => {
      const memberId = e.target.dataset.memberId;
      const member = currentTeam.find(m => m.id === memberId);
      if (member) {
        member.points = parseInt(e.target.value) || 0;
        saveData();
      }
    });
  });

  // Avatar selectors
  document.querySelectorAll('.avatar-selector').forEach(avatar => {
    avatar.addEventListener('click', (e) => {
      const memberId = e.target.dataset.memberId;
      const member = currentTeam.find(m => m.id === memberId);
      if (member) {
        showAvatarPicker(member, e.target);
      }
    });
  });
}

// Show avatar picker
function showAvatarPicker(member, avatarElement) {
  // Remove existing picker
  const existingPicker = document.querySelector('.avatar-grid');
  if (existingPicker) {
    existingPicker.remove();
  }

  const roleAvatars = avatars[member.role === 'Developer' ? 'developer' : 'lead'];

  const picker = document.createElement('div');
  picker.className = 'avatar-grid';
  picker.innerHTML = roleAvatars.map(avatar =>
    `<div class="avatar-option ${avatar === member.avatar ? 'selected' : ''}" 
          data-avatar="${avatar}">${avatar}</div>`
  ).join('');

  avatarElement.parentElement.appendChild(picker);

  // Handle avatar selection
  picker.querySelectorAll('.avatar-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const newAvatar = e.target.dataset.avatar;
      member.avatar = newAvatar;
      avatarElement.textContent = newAvatar;
      picker.remove();
      saveData();
    });
  });

  // Close picker when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closePicker() {
      picker.remove();
      document.removeEventListener('click', closePicker);
    });
  }, 100);
}

// Update availability percentages
function updateAvailability() {
  const sprintDays = parseInt(document.getElementById('sprintDays').value) || 10;
  const holidays = parseInt(document.getElementById('holidays').value) || 0;

  currentTeam.forEach(member => {
    const effectiveDays = Math.max(0, sprintDays - holidays - member.vacation);
    const availability = Math.round((effectiveDays / sprintDays) * 100);

    const availabilityElement = document.querySelector(`[data-member-id="${member.id}"].member-availability`);
    if (availabilityElement) {
      availabilityElement.textContent = `${availability}%`;
      availabilityElement.style.color = availability >= 80 ? '#059669' :
        availability >= 60 ? '#d97706' : '#dc2626';
    }
  });
}

// Calculate capacity
function calculateCapacity() {
  const sprintDays = parseInt(document.getElementById('sprintDays').value) || 10;
  const holidays = parseInt(document.getElementById('holidays').value) || 0;

  if (currentTeam.length === 0) {
    showNotification('Please generate team members first', 'error');
    return;
  }

  let totalCapacity = 0;
  const memberResults = [];

  currentTeam.forEach(member => {
    const effectiveDays = Math.max(0, sprintDays - holidays - member.vacation);
    const capacity = +(member.points * (effectiveDays / sprintDays)).toFixed(1);
    const availability = Math.round((effectiveDays / sprintDays) * 100);

    totalCapacity += capacity;
    memberResults.push({
      ...member,
      capacity,
      availability,
      effectiveDays
    });
  });

  currentResults = {
    totalCapacity: totalCapacity.toFixed(1),
    memberResults,
    sprintDays,
    holidays
  };

  displayResults();
  resultsSection.classList.remove('hidden');
}

// Display results
function displayResults() {
  if (!currentResults) return;

  const { totalCapacity, memberResults } = currentResults;

  const teamAvailability = memberResults.length > 0 ? 
    Math.round(memberResults.reduce((sum, m) => sum + m.availability, 0) / memberResults.length) : 0;

  capacityResults.innerHTML = `
    <div class="capacity-summary">
      <div class="capacity-value">${totalCapacity} SP</div>
      <div class="capacity-label">Total Sprint Capacity (${teamAvailability}% avg availability)</div>
    </div>
    
    <div class="team-breakdown">
      ${memberResults.map(member => {
        const availabilityClass = member.availability >= 80 ? 'availability-high' : 
                                 member.availability >= 60 ? 'availability-medium' : 'availability-low';
        return `
          <div class="member-result">
            <div class="member-result-info">
              <div class="member-result-avatar">${member.avatar}</div>
              <div class="member-result-name">${member.name}</div>
            </div>
            <div class="member-result-details">
              <div class="member-result-capacity">${member.capacity} SP</div>
              <div class="member-result-availability ${availabilityClass}">${member.availability}%</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Export to CSV
function exportToCsv() {
  if (!currentResults) {
    showNotification('Please calculate capacity first', 'error');
    return;
  }

  const { memberResults, totalCapacity, sprintDays, holidays } = currentResults;

  const headers = ['Avatar', 'Member', 'Role', 'Vacation', 'Effective Days', 'Points', 'Availability %', 'Capacity (SP)'];
  const rows = memberResults.map(m => [
    m.avatar, m.name, m.role, m.vacation, m.effectiveDays, m.points, m.availability, m.capacity
  ]);

  const summaryRows = [
    ['', '', '', '', '', '', '', ''],
    ['SUMMARY', '', '', '', '', '', '', ''],
    ['Total Capacity (SP)', '', '', '', '', '', '', totalCapacity],
    ['Sprint Days', '', '', '', '', '', sprintDays, ''],
    ['Team Holidays', '', '', '', '', '', holidays, '']
  ];

  const csv = [headers, ...rows, ...summaryRows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Create download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: url,
    filename: `sprint-capacity-${new Date().toISOString().split('T')[0]}.csv`
  }, () => {
    URL.revokeObjectURL(url);
    showNotification('CSV exported successfully!', 'success');
  });
}

// Open full app
function openFullApp() {
  chrome.tabs.create({
    url: 'https://scrum-team-capacity-calculator.vercel.app/'
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    ${type === 'error' ? 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' :
      type === 'success' ? 'background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0;' :
        'background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;'}
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Add CSS for slide animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);