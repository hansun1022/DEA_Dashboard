// Advocate names
const advocates = [
    "Advocate 1",
    "Advocate 2",
    "Advocate 3"
];

// Map advocates to email addresses
const advocateEmails = {
    "Advocate 1": "advocate1@gmail.com",
    "Advocate 2": "advocate2@gmail.com",
    "Advocate 3": "advocate3@gmail.com"
};

// Map vendors to advocates
const vendorToAdvocate = {
    "TechVision Systems": "Advocate 1",
    "Nexus Industrial": "Advocate 1",
    "ProMax Solutions": "Advocate 1",
    "Advanced Solutions Inc.": "Advocate 1",
    "Digital Innovations Ltd.": "Advocate 1",
    "Strategic Systems Corp.": "Advocate 1",
    "GlobalTech Industries": "Advocate 2",
    "Apex Dynamics": "Advocate 2",
    "Zenith Manufacturing": "Advocate 2",
    "Supreme Automation": "Advocate 2",
    "Premium Tech Solutions": "Advocate 2",
    "Excellence Manufacturing": "Advocate 2",
    "Innovation Hub Group": "Advocate 2",
    "Quantum Operations": "Advocate 3",
    "Elite Performance Co.": "Advocate 3",
    "Innovate Logistics": "Advocate 3",
    "Future Systems Inc.": "Advocate 3",
    "Smart Operations Co.": "Advocate 3",
    "Next Generation Tech": "Advocate 3"
};

// Vendor names - randomly generated
const vendorNames = [
    "TechVision Systems",
    "Nexus Industrial",
    "ProMax Solutions",
    "Advanced Solutions Inc.",
    "Digital Innovations Ltd.",
    "Strategic Systems Corp.",
    "GlobalTech Industries",
    "Apex Dynamics",
    "Zenith Manufacturing",
    "Supreme Automation",
    "Premium Tech Solutions",
    "Excellence Manufacturing",
    "Innovation Hub Group",
    "Quantum Operations",
    "Elite Performance Co.",
    "Innovate Logistics",
    "Future Systems Inc.",
    "Smart Operations Co.",
    "Next Generation Tech"
];

// Days in January 2026
const daysInJan = 31;
let selectedDay = 1;
let selectedAdvocate = '';
let selectedVendor = '';

// Helper function to get filtered vendors based on selected advocate and vendor
function getFilteredVendors() {
    let filtered = vendorNames;
    
    // Filter by advocate first
    if (selectedAdvocate) {
        filtered = filtered.filter(vendor => vendorToAdvocate[vendor] === selectedAdvocate);
    }
    
    // Then filter by vendor if selected
    if (selectedVendor) {
        filtered = filtered.filter(vendor => vendor === selectedVendor);
    }
    
    return filtered;
}

// Data storage structure
let deaData = {};

// Generate random DEA rate between 40-100
function generateRandomDEA() {
    return Math.floor(Math.random() * 61) + 40; // 40-100%
}

// Initialize data structure with random values
function initializeData() {
    // Always generate fresh random data
    deaData = {};
    for (let day = 1; day <= daysInJan; day++) {
        deaData[day] = {};
        vendorNames.forEach(vendor => {
            deaData[day][vendor] = generateRandomDEA();
        });
    }
    saveToLocalStorage();
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('deaData', JSON.stringify(deaData));
}

// Load data from localStorage
function loadFromLocalStorage() {
    const stored = localStorage.getItem('deaData');
    if (stored) {
        deaData = JSON.parse(stored);
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('deaData', JSON.stringify(deaData));
}

// Download page as JPEG
function downloadPageAsPDF() {
    const element = document.querySelector('.dashboard-container');
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '⏳ Generating...';
    button.disabled = true;
    
    // Use html2canvas to capture the page as an image
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Convert to JPEG and download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.download = `DEA_Dashboard_Report_${new Date().toISOString().split('T')[0]}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        button.textContent = originalText;
        button.disabled = false;
    }).catch(err => {
        console.error('Error generating image:', err);
        alert('Error generating download. Please try again.');
        button.textContent = originalText;
        button.disabled = false;
    });
}

// Send page as JPEG via Gmail draft
function emailPageAsJPEG() {
    // Get advocate email
    let recipientEmail = '';
    
    if (selectedAdvocate) {
        recipientEmail = advocateEmails[selectedAdvocate] || '';
    }
    
    if (!recipientEmail) {
        alert('Please select an advocate first to send the email.');
        return;
    }
    
    const element = document.querySelector('.dashboard-container');
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '⏳ Preparing...';
    button.disabled = true;
    
    // Use html2canvas to capture the page as an image
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Convert to JPEG and get data URL
        const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        // Create Gmail compose link with subject and body
        const subject = `DEA Dashboard Report - ${selectedAdvocate} - ${new Date().toLocaleDateString()}`;
        const body = `Dear ${selectedAdvocate},\n\nPlease find the DEA Dashboard report attached below.\n\nBest regards,\nDEA Dashboard System`;
        
        // Open Gmail compose in a new window
        const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.open(gmailUrl, '_blank');
        
        // Create a temporary link to download the image for user to manually attach
        const link = document.createElement('a');
        link.href = jpegDataUrl;
        link.download = `DEA_Dashboard_Report_${new Date().toISOString().split('T')[0]}.jpg`;
        
        // Show instruction
        setTimeout(() => {
            alert(`Gmail compose window opened for ${recipientEmail}.\n\nPlease attach the downloaded JPEG file to complete the email. The file will be downloaded automatically.`);
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 500);
        
        button.textContent = originalText;
        button.disabled = false;
    }).catch(err => {
        console.error('Error generating email:', err);
        alert('Error preparing email. Please try again.');
        button.textContent = originalText;
        button.disabled = false;
    });
}

// Chatbox functions
function toggleChatbox() {
    const chatbox = document.getElementById('chatboxContainer');
    const toggle = document.getElementById('chatboxToggle');
    
    if (chatbox.style.display === 'none') {
        chatbox.style.display = 'flex';
        toggle.style.display = 'none';
        document.getElementById('chatInput').focus();
    } else {
        chatbox.style.display = 'none';
        toggle.style.display = 'flex';
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Generate response
    const response = generateChatResponse(message);
    setTimeout(() => {
        addChatMessage(response, 'bot');
    }, 500);
}

function addChatMessage(message, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender}-msg`;
    bubble.textContent = message;
    
    messageDiv.appendChild(bubble);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function generateChatResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Search for vendor
    const foundVendor = vendorNames.find(v => v.toLowerCase().includes(message) || message.includes(v.toLowerCase()));
    if (foundVendor) {
        const average = calculateAverages()[foundVendor];
        return `📊 ${foundVendor}\nAverage DEA Rate: ${average}%\nYou can view this vendor's daily trend in the Chart tab.`;
    }
    
    // Help topics
    if (message.includes('data') || message.includes('enter')) {
        return '📋 Data Tab:\n• Select a day using the day buttons\n• Enter DEA rates (0-100%) for each vendor\n• Click Save Data to store your entries';
    }
    
    if (message.includes('chart') || message.includes('view') || message.includes('trend')) {
        return '📈 Chart Tab:\n• Average bar chart shows all vendors\n• Select a vendor to see daily DEA trend\n• Table shows all daily rates with color coding\n• Green (≥80%), Orange (60-79%), Red (<60%)';
    }
    
    if (message.includes('average') || message.includes('vendor')) {
        return '🏢 Available Vendors:\n' + vendorNames.join('\n') + '\n\nType a vendor name to see its average rate!';
    }
    
    if (message.includes('help') || message.includes('how')) {
        return '💡 DEA Dashboard Help:\n• Use Data tab to enter/view DEA rates\n• Use Chart tab for analytics and trends\n• Click day buttons to switch dates\n• Select vendors from dropdown for trends\n• Type vendor name here to search!';
    }
    
    if (message.includes('date') || message.includes('january') || message.includes('jan')) {
        return '� January 2026:\nDashboard tracks DEA rates for all 31 days of January. Switch between days in the Data tab to enter or modify rates.';
    }
    
    // Default response
    return '🤔 I can help you with:\n• Vendor information (type vendor name)\n• Data tab guidance\n• Chart and trends\n• Dashboard help\n\nWhat would you like to know?';
}

// Load data from localStorage
function loadFromLocalStorage() {
    const stored = localStorage.getItem('deaData');
    if (stored) {
        deaData = JSON.parse(stored);
    }
}

// Create day selector buttons
function createDayButtons() {
    const container = document.getElementById('dayButtons');
    container.innerHTML = '';
    
    for (let day = 1; day <= daysInJan; day++) {
        const button = document.createElement('button');
        button.className = `day-button ${day === selectedDay ? 'active' : ''}`;
        button.textContent = `Jan ${day}`;
        button.onclick = () => selectDay(day);
        container.appendChild(button);
    }
}

// Select a specific day
function selectDay(day) {
    selectedDay = day;
    createDayButtons();
    loadDayData();
}

// Create vendor input fields
function createVendorInputs() {
    const container = document.getElementById('vendorInputs');
    container.innerHTML = '';

    const filteredVendors = getFilteredVendors();

    filteredVendors.forEach(vendor => {
        const card = document.createElement('div');
        card.className = 'vendor-card';
        
        const value = deaData[selectedDay][vendor] || '';
        
        card.innerHTML = `
            <h5>${vendor}</h5>
            <label class="form-label">DEA Rate (%)</label>
            <input 
                type="number" 
                class="form-control" 
                id="vendor-${vendor}"
                min="0" 
                max="100" 
                value="${value}"
                placeholder="0-100%"
            >
            <small class="text-muted d-block mt-2">Jan ${selectedDay}, 2026</small>
        `;
        
        container.appendChild(card);
    });
}

// Load data for the selected day
function loadDayData() {
    createVendorInputs();
}

// Save data for the selected day
function saveData() {
    const filteredVendors = getFilteredVendors();
    
    filteredVendors.forEach(vendor => {
        const input = document.getElementById(`vendor-${vendor}`);
        if (!input) return;
        
        const value = input.value;
        
        // Validate input
        if (value !== '') {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                alert(`Invalid value for ${vendor}. Please enter a number between 0 and 100.`);
                return;
            }
        }
        
        deaData[selectedDay][vendor] = value;
    });
    
    saveToLocalStorage();
    showAlert(`Data for Jan ${selectedDay}, 2026 saved successfully!`);
}

// Reset form
function resetForm() {
    const filteredVendors = getFilteredVendors();
    const vendorList = filteredVendors.length > 0 ? 'selected advocate\'s' : 'all';
    
    if (confirm('Are you sure you want to reset all data for Jan ' + selectedDay + ' for ' + vendorList + ' companies?')) {
        filteredVendors.forEach(vendor => {
            deaData[selectedDay][vendor] = '';
        });
        saveToLocalStorage();
        loadDayData();
        showAlert(`Data for Jan ${selectedDay} has been reset.`);
    }
}

// Show alert message
function showAlert(message) {
    const alertDiv = document.getElementById('dataAlert');
    const messageSpan = document.getElementById('alertMessage');
    messageSpan.textContent = message;
    alertDiv.style.display = 'block';
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

// Calculate average DEA rate for each vendor
function calculateAverages() {
    const averages = {};
    
    vendorNames.forEach(vendor => {
        let sum = 0;
        let count = 0;
        
        for (let day = 1; day <= daysInJan; day++) {
            const value = deaData[day][vendor];
            if (value !== '' && value !== undefined && value !== null) {
                sum += parseFloat(value);
                count++;
            }
        }
        
        averages[vendor] = count > 0 ? (sum / count).toFixed(2) : 0;
    });
    
    return averages;
}

// Get the worst performing vendor (lowest average DEA rate)
function getWorstPerformingVendor() {
    const filteredVendors = getFilteredVendors();
    
    if (filteredVendors.length === 0) {
        return null;
    }
    
    const averages = calculateAverages();
    let worstVendor = filteredVendors[0];
    let worstRate = parseFloat(averages[worstVendor]);
    
    for (let i = 1; i < filteredVendors.length; i++) {
        const vendor = filteredVendors[i];
        const rate = parseFloat(averages[vendor]);
        if (rate < worstRate) {
            worstRate = rate;
            worstVendor = vendor;
        }
    }
    
    return {
        vendor: worstVendor,
        rate: worstRate
    };
}

// Get the worst date for a specific vendor
function getWorstDateForVendor(vendor) {
    let worstDay = 1;
    let worstRate = 100;
    
    for (let day = 1; day <= daysInJan; day++) {
        const value = deaData[day][vendor];
        if (value !== '' && value !== undefined && value !== null) {
            const numValue = parseFloat(value);
            if (numValue < worstRate) {
                worstRate = numValue;
                worstDay = day;
            }
        }
    }
    
    return worstRate < 100 ? { day: worstDay, rate: worstRate } : null;
}

// Generate next steps based on DEA rate - Random actions (3-4 items)
function generateNextSteps(deaRate) {
    // Pool of possible actions
    const allActions = [
        '📋 Conduct comprehensive backlog analysis',
        '📦 Investigate out-of-stock incidents',
        '⚙️ Review operational constraints',
        '👥 Resource allocation assessment',
        '📞 Schedule urgent vendor meeting',
        '📊 Develop corrective action plan',
        '🔍 Root cause analysis deep dive',
        '📈 Performance trend analysis',
        '💼 Escalate to senior management',
        '⏰ Implement daily monitoring',
        '🎯 Define performance KPIs',
        '📱 Real-time alert system setup',
        '🔄 Process improvement review',
        '🏆 Benchmark against top performers',
        '💡 Innovation opportunity assessment',
        '🛠️ Operational efficiency audit',
        '📑 Compliance and documentation review',
        '👨‍💼 Executive steering committee meeting',
        '🔐 Risk assessment and mitigation',
        '📊 Capacity planning analysis',
        '🎓 Training and upskilling program',
        '🚀 Rapid improvement initiative',
        '🔗 Supply chain optimization review',
        '💻 System and technology assessment',
        '🌐 Cross-functional collaboration session',
        '📈 Market and competitive analysis',
        '⚡ Emergency response protocol',
        '🎯 Goal and target setting',
        '🔬 Data analytics deep dive',
        '👁️ Continuous monitoring framework'
    ];
    
    // Random number between 3 and 4
    const numActions = Math.random() < 0.5 ? 3 : 4;
    
    // Shuffle and select random actions
    const shuffled = allActions.sort(() => Math.random() - 0.5);
    const selectedActions = shuffled.slice(0, numActions);
    
    return selectedActions;
}

// Download page as PDF
function displayWorstPerformingConclusion() {
    const conclusionDiv = document.getElementById('worstPerformingConclusion');
    if (!conclusionDiv) return;
    
    const worst = getWorstPerformingVendor();
    
    if (!worst || worst.rate === 0 || worst.rate === '0') {
        conclusionDiv.innerHTML = '<p style="color: #94a3b8; margin: 0;">No data available yet. Please enter data in the Data tab first.</p>';
        return;
    }
    
    let filterInfo = '';
    if (selectedAdvocate && selectedVendor) {
        filterInfo = `For ${selectedVendor}`;
    } else if (selectedAdvocate) {
        filterInfo = `Within ${selectedAdvocate}'s portfolio`;
    } else {
        filterInfo = 'Across all companies';
    }
    
    const statusColor = worst.rate >= 70 ? '#10b981' : worst.rate >= 50 ? '#f59e0b' : '#ef4444';
    const statusEmoji = worst.rate >= 70 ? '✅' : worst.rate >= 50 ? '⚠️' : '🔴';
    
    // Get worst date for this vendor
    const worstDate = getWorstDateForVendor(worst.vendor);
    const worstDateInfo = worstDate ? `January ${worstDate.day}, 2026 (${worstDate.rate}%)` : 'N/A';
    
    // Generate next steps based on DEA rate
    const nextSteps = generateNextSteps(worst.rate);
    const stepsHTML = nextSteps.map(step => `<div style="margin-bottom: 6px;">• ${step}</div>`).join('');
    
    conclusionDiv.innerHTML = `
        <div style="padding: 16px 0;">
            <div style="margin-bottom: 14px;">
                <strong style="color: #1e3c72; font-size: 0.95rem;">Conclusion:</strong> ${statusEmoji}
                <br>
                <span style="color: #475569; font-size: 0.9rem;">The worst performing company ${filterInfo} is <strong style="color: #1e3c72;">${worst.vendor}</strong> with an average DEA rate of <strong style="color: ${statusColor};">${worst.rate}%</strong>.</span>
            </div>
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                <strong style="color: #1e3c72; font-size: 0.9rem; display: block; margin-bottom: 10px;">📋 Key Findings & Next Steps:</strong>
                <ul style="margin: 0; padding-left: 0; font-size: 0.9rem;">
                    <li style="color: #475569; margin-bottom: 12px;">
                        <strong>Worst Performance Date:</strong> ${worstDateInfo}
                    </li>
                    <li style="color: #475569;">
                        <strong>Recommended Actions:</strong>
                        <div style="padding-left: 8px; margin-top: 8px; font-size: 0.85rem; color: #64748b;">
                            ${stepsHTML}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    `;
}

// Render pie chart for average DEA by company
function renderAverageDeaPieChart() {
    const canvas = document.getElementById('averageDeaPieChart');
    if (!canvas) return;
    
    const averages = calculateAverages();
    const filteredVendors = getFilteredVendors();
    
    // Filter the averages to only show selected vendors
    const chartData = filteredVendors.map(vendor => ({
        vendor: vendor,
        rate: averages[vendor] || 0
    }));
    
    if (chartData.length === 0) {
        canvas.style.display = 'none';
        return;
    }
    
    canvas.style.display = 'block';
    
    // Define random color palette
    const colorPalette = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
        '#d946ef', '#0ea5e9', '#84cc16', '#f43f5e', '#06b6d4',
        '#a855f7', '#22c55e', '#eab308', '#06b6d4', '#ec4899'
    ];
    
    // Assign random colors to each company
    const colors = chartData.map((item, index) => {
        return colorPalette[index % colorPalette.length];
    });
    
    // Destroy existing chart if it exists
    if (window.averageDeaPieChartInstance) {
        window.averageDeaPieChartInstance.destroy();
    }
    
    // Create new pie chart
    window.averageDeaPieChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: chartData.map(item => item.vendor),
            datasets: [{
                data: chartData.map(item => item.rate),
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 12 },
                        padding: 15,
                        color: '#475569',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label}: ${data.datasets[0].data[i]}%`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    formatter: function(value, context) {
                        const vendorName = chartData[context.dataIndex].vendor;
                        // Generate abbreviation: take first letters of each word
                        const abbrev = vendorName.split(' ').map(word => word[0]).join('').toUpperCase();
                        return abbrev;
                    },
                    anchor: 'center',
                    align: 'center'
                }
            }
        }
    });
}


// Render bar chart
function renderBarChart() {
    const averages = calculateAverages();
    const filteredVendors = getFilteredVendors();
    const vendorList = filteredVendors.filter(vendor => vendor in averages);
    const averageValues = vendorList.map(vendor => parseFloat(averages[vendor]));
    
    const ctx = document.getElementById('deaChart');
    
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }
    
    // Destroy existing chart if it exists
    if (window.deaChart instanceof Chart) {
        window.deaChart.destroy();
    }
    
    // Small delay to ensure canvas is ready
    setTimeout(() => {
        window.deaChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: vendorList,
                datasets: [{
                    label: 'Average DEA Rate (%)',
                    data: averageValues,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(237, 100, 166, 0.8)',
                        'rgba(255, 154, 158, 0.8)',
                        'rgba(250, 200, 124, 0.8)',
                        'rgba(126, 208, 165, 0.8)',
                        'rgba(123, 198, 255, 0.8)',
                        'rgba(167, 126, 234, 0.8)',
                        'rgba(255, 159, 124, 0.8)',
                        'rgba(168, 210, 122, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)',
                        'rgba(237, 100, 166, 1)',
                        'rgba(255, 154, 158, 1)',
                        'rgba(250, 200, 124, 1)',
                        'rgba(126, 208, 165, 1)',
                        'rgba(123, 198, 255, 1)',
                        'rgba(167, 126, 234, 1)',
                        'rgba(255, 159, 124, 1)',
                        'rgba(168, 210, 122, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'x',
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'DEA Rate (%)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }, 100);
}

// Populate advocate selector dropdown
// Main filter function - called when advocate is selected
function filterByAdvocate() {
    const advocateSelector = document.getElementById('advocateSelector');
    selectedAdvocate = advocateSelector.value;
    selectedVendor = ''; // Reset vendor filter when advocate changes
    document.getElementById('vendorSelector').value = '';
    
    // Refresh all displays with filtered data
    createVendorInputs();  // Update Data tab
    renderBarChart();       // Update average chart
    populateVendorSelector(); // Update vendor selector
    renderVendorTrendChart(document.getElementById('vendorSelector').value); // Update trend chart
    renderDataTable();      // Update data table
    displayWorstPerformingConclusion(); // Display worst performing vendor
    renderAverageDeaPieChart(); // Update pie chart
}

// Populate advocate selector dropdown
function populateAdvocateSelector() {
    const selector = document.getElementById('advocateSelector');
    if (!selector) return;
    
    selector.innerHTML = '<option value="">-- All Advocates (Show All Companies) --</option>';
    
    advocates.forEach(advocate => {
        const option = document.createElement('option');
        option.value = advocate;
        option.textContent = advocate;
        selector.appendChild(option);
    });
}

// Populate vendor selector dropdown
function populateVendorSelector() {
    const selector = document.getElementById('vendorSelector');
    selector.innerHTML = '<option value="">-- All companies --</option>';
    
    const filteredVendors = getFilteredVendors();
    
    filteredVendors.forEach(vendor => {
        const option = document.createElement('option');
        option.value = vendor;
        option.textContent = vendor;
        selector.appendChild(option);
    });
    
    // Keep the "All companies" option selected by default
    selector.value = '';
}

// Render average trend chart for multiple vendors
function renderAverageTrendChart(vendors) {
    if (!vendors || vendors.length === 0) {
        return;
    }
    
    const days = [];
    const averageRates = [];
    
    for (let day = 1; day <= daysInJan; day++) {
        days.push(`Jan ${day}`);
        let sum = 0;
        let count = 0;
        
        vendors.forEach(vendor => {
            const value = deaData[day][vendor];
            if (value !== '' && value !== undefined && value !== null) {
                sum += parseInt(value);
                count++;
            }
        });
        
        averageRates.push(count > 0 ? Math.round(sum / count) : 0);
    }
    
    const ctx = document.getElementById('vendorTrendChart');
    
    if (!ctx) {
        console.error('Vendor trend chart canvas not found');
        return;
    }
    
    // Destroy existing chart if it exists
    if (window.vendorTrendChart instanceof Chart) {
        window.vendorTrendChart.destroy();
    }
    
    const chartTitle = selectedAdvocate ? `${selectedAdvocate} - Average Daily DEA Rate` : 'All Companies - Average Daily DEA Rate';
    
    setTimeout(() => {
        window.vendorTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: chartTitle,
                    data: averageRates,
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'DEA Rate (%)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }, 100);
}

// Render vendor trend chart
function renderVendorTrendChart(vendor) {
    const filteredVendors = getFilteredVendors();
    
    // If no vendor is selected, show average of all filtered vendors
    if (!vendor || vendor === '') {
        renderAverageTrendChart(filteredVendors);
        return;
    }
    
    const days = [];
    const rates = [];
    
    for (let day = 1; day <= daysInJan; day++) {
        days.push(`Jan ${day}`);
        const value = deaData[day][vendor];
        rates.push(value !== '' && value !== undefined && value !== null ? parseInt(value) : 0);
    }
    
    const ctx = document.getElementById('vendorTrendChart');
    
    if (!ctx) {
        console.error('Vendor trend chart canvas not found');
        return;
    }
    
    // Destroy existing chart if it exists
    if (window.vendorTrendChart instanceof Chart) {
        window.vendorTrendChart.destroy();
    }
    
    setTimeout(() => {
        window.vendorTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: `${vendor} - Daily DEA Rate`,
                    data: rates,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    title: {
                        display: false
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        offset: 8,
                        font: {
                            size: 9,
                            weight: 'bold'
                        },
                        color: 'rgba(102, 126, 234, 1)',
                        formatter: function(value) {
                            return value + '%';
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'DEA Rate (%)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 9 },
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }, 100);
}

// Filter page by selected vendor
function filterByVendor() {
    const selector = document.getElementById('vendorSelector');
    selectedVendor = selector.value;
    
    // Refresh all displays with filtered data
    createVendorInputs();  // Update Data tab
    renderBarChart();       // Update average chart
    renderVendorTrendChart(selectedVendor); // Update trend chart
    renderDataTable();      // Update data table
    displayWorstPerformingConclusion(); // Display worst performing vendor
    renderAverageDeaPieChart(); // Update pie chart
}

// Update vendor chart based on selection
function updateVendorChart() {
    const selector = document.getElementById('vendorSelector');
    const vendor = selector.value;
    if (vendor) {
        renderVendorTrendChart(vendor);
    }
}

// Render data table
function renderDataTable() {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    
    const filteredVendors = getFilteredVendors();
    
    // Check if there's any data
    let hasData = false;
    for (let day = 1; day <= daysInJan; day++) {
        for (let vendor of filteredVendors) {
            if (deaData[day][vendor] !== '' && deaData[day][vendor] !== undefined) {
                hasData = true;
                break;
            }
        }
        if (hasData) break;
    }
    
    if (!hasData) {
        tableBody.innerHTML = `<tr><td colspan="32" class="no-data-message">No data available. Please enter data in the Data tab first.</td></tr>`;
        return;
    }
    
    // Clear previous content
    tableHeader.innerHTML = '<tr><th style="min-width: 150px;">Vendor</th>';
    tableBody.innerHTML = '';
    
    // Add date headers
    for (let day = 1; day <= daysInJan; day++) {
        const th = document.createElement('th');
        th.textContent = `Jan ${day}`;
        th.style.textAlign = 'center';
        th.style.fontSize = '0.85rem';
        th.style.minWidth = '60px';
        tableHeader.appendChild(th);
    }
    tableHeader.innerHTML += '</tr>';
    
    // Add vendor rows
    filteredVendors.forEach(vendor => {
        const row = document.createElement('tr');
        
        const vendorCell = document.createElement('td');
        vendorCell.innerHTML = `<strong>${vendor}</strong>`;
        vendorCell.style.fontWeight = '600';
        row.appendChild(vendorCell);
        
        for (let day = 1; day <= daysInJan; day++) {
            const cell = document.createElement('td');
            const value = deaData[day][vendor];
            
            if (value !== '' && value !== undefined && value !== null) {
                cell.textContent = value + '%';
                cell.style.textAlign = 'center';
                
                // Color code based on value
                const numValue = parseFloat(value);
                if (numValue >= 80) {
                    cell.style.backgroundColor = 'rgba(168, 210, 122, 0.3)'; // Green
                } else if (numValue >= 60) {
                    cell.style.backgroundColor = 'rgba(250, 200, 124, 0.3)'; // Orange
                } else {
                    cell.style.backgroundColor = 'rgba(255, 154, 158, 0.3)'; // Red
                }
            } else {
                cell.textContent = '-';
                cell.style.textAlign = 'center';
                cell.style.color = '#ccc';
            }
            
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    });
}

// Update chart and table when viewing chart tab
function updateChartTab() {
    renderBarChart();
    populateVendorSelector();
    renderDataTable();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage
    loadFromLocalStorage();
    
    // Initialize data structure
    initializeData();
    
    // Create day buttons
    createDayButtons();
    
    // Load initial day data
    loadDayData();
    
    // Populate vendor selector on load
    populateVendorSelector();
    
    // Populate advocate selector on load
    populateAdvocateSelector();
    
    // Set up tab switching and render charts when tab is clicked
    const chartTab = document.getElementById('chart-tab');
    chartTab.addEventListener('shown.bs.tab', function() {
        renderBarChart();
        populateVendorSelector();
        populateAdvocateSelector();
        renderDataTable();
        displayWorstPerformingConclusion();
        renderAverageDeaPieChart();
    });
    
    // Also render initially after a delay to ensure DOM is ready
    setTimeout(() => {
        renderBarChart();
        populateVendorSelector();
        renderDataTable();
        displayWorstPerformingConclusion();
        renderAverageDeaPieChart();
    }, 1000);
});
