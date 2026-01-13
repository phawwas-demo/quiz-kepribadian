const questions = [
    {
        question: "Saat di keramaian, apa yang kamu rasakan?",
        answers: [
            { text: "Semangat dan ingin menyapa semua orang", score: 2 },
            { text: "Biasa saja, mengikuti arus", score: 1 },
            { text: "Ingin cepat pulang dan rebahan", score: 0 }
        ]
    },
    {
        question: "Temanmu tiba-tiba membatalkan janji, kamu...",
        answers: [
            { text: "Sedih karena batal seru-seruan", score: 2 },
            { text: "Cari teman lain untuk diajak pergi", score: 1 },
            { text: "Senang! Akhirnya ada waktu sendiri", score: 0 }
        ]
    },
    {
        question: "Dalam diskusi kelompok, kamu cenderung...",
        answers: [
            { text: "Memulai pembicaraan dan memimpin", score: 2 },
            { text: "Menunggu giliran bicara", score: 1 },
            { text: "Lebih banyak mendengar saja", score: 0 }
        ]
    },
    {
        question: "Bagaimana caramu menghabiskan waktu luang?",
        answers: [
            { text: "Pergi jalan-jalan ke tempat baru", score: 2 },
            { text: "Nonton film bersama teman/pacar", score: 1 },
            { text: "Main game atau baca buku sendirian", score: 0 }
        ]
    }
];

let currentQuestion = 0;
let totalScore = 0;
let userName = "";

const setupBox = document.getElementById("setup-box");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const progressBox = document.getElementById("progressBox");
const progressBar = document.getElementById("progressBar");
const charImg = document.getElementById("charImg");

function startQuiz() {
    userName = document.getElementById("usernameInput").value.trim();
    if (userName === "") return alert("Masukkan nama dulu ya!");

    setupBox.classList.add("hidden");
    quizBox.classList.remove("hidden");
    progressBox.classList.remove("hidden");
    
    charImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    document.getElementById("question").textContent = q.question;
    const answersEl = document.getElementById("answers");
    answersEl.innerHTML = "";

    progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;

    q.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.textContent = answer.text;
        btn.onclick = () => {
            totalScore += answer.score;
            currentQuestion++;
            if (currentQuestion < questions.length) showQuestion();
            else showResult();
        };
        answersEl.appendChild(btn);
    });
}

function showResult() {
    quizBox.classList.add("hidden");
    resultBox.classList.remove("hidden");
    progressBox.classList.add("hidden");

    document.getElementById("greeting").innerHTML = `Halo, <b>${userName}</b>!`;
    const title = document.getElementById("result-title");
    const desc = document.getElementById("result-desc");
    const rImg = document.getElementById("resultImg");

    if (totalScore <= 3) {
        title.innerText = "Introvert 🌙";
        desc.innerText = "Kamu adalah orang yang tenang dan reflektif. Duniamu ada di dalam pikiranmu yang kaya.";
        rImg.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&mouth=serious&eyebrows=default";
    } else if (totalScore <= 6) {
        title.innerText = "Ambivert 🔥";
        desc.innerText = "Kamu bunglon sosial yang hebat! Bisa menyesuaikan diri di tempat ramai maupun sepi.";
        rImg.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden&mouth=smile&eyebrows=default";
    } else {
        title.innerText = "Ekstrovert 🌟";
        desc.innerText = "Kamu adalah magnet energi! Orang-orang senang berada di dekatmu karena keceriaanmu.";
        rImg.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe&mouth=smile&eyebrows=raisedExcited";
    }
}

function downloadPDF() {
    const element = document.body;
    const title = document.getElementById('result-title');
    const actionButtons = document.querySelector('.action-buttons');
    const card = document.querySelector('.card');

    // 1. Simpan kondisi asli website
    const originalBG = element.style.background;
    const originalHeight = element.style.height;
    const originalWidth = element.style.width;
    const originalDisplay = element.style.display;

    // 2. PAKSA MODE PORTRAIT (A4 Ratio)
    // Kita buat body menjadi tinggi dan lebarnya pas sesuai kertas A4
    element.style.width = "794px";  // Lebar standar A4 (96 DPI)
    element.style.height = "1123px"; // Tinggi standar A4
    element.style.display = "block"; 
    element.style.background = "#ffffff"; // Abu-abu elegan kamu

    // Sembunyikan tombol
    actionButtons.style.display = 'none';

    // Perbesar card agar memenuhi kertas di PDF
    card.style.width = "70%";
    card.style.margin = "50px auto";

    // Hapus gradient text agar tidak muncul kotak hitam/abu
    title.style.background = "none";
    title.style.webkitTextFillColor = "#1a2a3a";
    title.style.color = "#1a2a3a";

    const opt = {
        margin: 0,
        filename: `Hasil_Kuis_${userName}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 2, // Biar hasil tajam (HD)
            useCORS: true,
            width: 794,
            height: 1123
        },
        jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
    };

    // 3. Eksekusi Cetak
    html2pdf().set(opt).from(element).save().then(() => {
        // 4. BALIKIN SEMUA KE NORMAL
        element.style.width = originalWidth;
        element.style.height = originalHeight;
        element.style.display = originalDisplay;
        element.style.background = originalBG;
        
        card.style.width = ""; 
        card.style.margin = "";

        actionButtons.style.display = 'flex'; 
        
        title.style.background = ""; 
        title.style.webkitTextFillColor = "";
        title.style.color = "";
    });
}