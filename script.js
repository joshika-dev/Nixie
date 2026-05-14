console.log("Welcome to Nixie!");

// ── State ──────────────────────────────────────────────
let songIndex = 0;
let isPlaying = false;

// ── Song Library ───────────────────────────────────────
// Add / edit your own songs here — just update filepath and coverpath
let songs = [
    { songname: "Lover's Rock",          filepath: "Lovers Rock.mp3",  coverpath: "cover3.jpg" },
    { songname: "Newjeans - Attention",  filepath: "Attention.mp3",     coverpath: "cover2.jpg" },
    { songname: "Glue song",            filepath: "Glue song.mp3",          coverpath: "cover1.jpg" },
    { songname: "earrings",             filepath: "earrings.mp3",          coverpath: "cover5.jpg" },
    { songname: "Dark red",             filepath: "Dark red.mp3",          coverpath: "cover4.jpg" },
    { songname: "From the start",              filepath: "From the start.mp3",          coverpath: "cover6.jpg" },
    { songname: "Heather",            filepath: "Heather.mp3",          coverpath: "cover7.jpg" },
    { songname: "stateside",            filepath: "stateside.mp3",          coverpath: "cover8.jpg" },
];

// ── Audio element (single instance, src swapped on song change) ──
let audioElement = new Audio(songs[songIndex].filepath);

// ── DOM references ─────────────────────────────────────
const playBtn             = document.getElementById("playBtn");
const prevBtn             = document.getElementById("prevBtn");
const nextBtn             = document.getElementById("nextBtn");
const progressBar         = document.getElementById("myProgressbar");
const currentSongName     = document.getElementById("currentSongName");
const bannerCover         = document.getElementById("bannerCover");
const gifImg              = document.getElementById("gifImg");
const songItemContainer   = document.querySelector(".songItemcontainer");

// ── Build song list ────────────────────────────────────
function loadSongList() {
    // Clear everything except the heading (rebuilt each time)
    songItemContainer.innerHTML = "<h1>Best of Nixie</h1>";

    songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "songItem";
        item.dataset.index = index;

        item.innerHTML = `
            <img src="${song.coverpath}" alt="${song.songname}">
            <span class="songName">${song.songname}</span>
            <span class="songlistplay">
                <span class="timestamp">
                    <i class="far fa-play-circle"></i>
                </span>
            </span>
        `;

        item.addEventListener("click", () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playAudio();
        });

        songItemContainer.appendChild(item);
    });
}

// ── Load a song into the audio element ────────────────
function loadSong(song) {
    audioElement.src   = song.filepath;
    currentSongName.textContent = song.songname;
    bannerCover.src    = song.coverpath;
    progressBar.value  = 0;
    highlightActiveSong();
}

// ── Highlight which row is playing ────────────────────
function highlightActiveSong() {
    document.querySelectorAll(".songItem").forEach((item, i) => {
        item.classList.toggle("active", i === songIndex);
    });
}

// ── Play / Pause helpers ───────────────────────────────
function playAudio() {
    audioElement.play();
    isPlaying = true;
    playBtn.classList.replace("fa-play-circle", "fa-pause-circle");
    gifImg.style.visibility = "visible";
}

function pauseAudio() {
    audioElement.pause();
    isPlaying = false;
    playBtn.classList.replace("fa-pause-circle", "fa-play-circle");
    gifImg.style.visibility = "hidden";
}

// ── Control buttons ────────────────────────────────────
playBtn.addEventListener("click", () => {
    isPlaying ? pauseAudio() : playAudio();
});

prevBtn.addEventListener("click", () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playAudio();
});

nextBtn.addEventListener("click", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playAudio();
});

// ── Progress bar – update as song plays ───────────────
audioElement.addEventListener("timeupdate", () => {
    if (audioElement.duration) {
        progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
    }
});

// ── Progress bar – seek when user drags ───────────────
progressBar.addEventListener("input", () => {
    if (audioElement.duration) {
        audioElement.currentTime = (progressBar.value / 100) * audioElement.duration;
    }
});

// ── Auto-advance to next song when current ends ───────
audioElement.addEventListener("ended", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playAudio();
});

// ── Keyboard shortcuts ─────────────────────────────────
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        isPlaying ? pauseAudio() : playAudio();
    }
    if (e.code === "ArrowRight") nextBtn.click();
    if (e.code === "ArrowLeft")  prevBtn.click();
});

// ── Init ───────────────────────────────────────────────
loadSongList();
loadSong(songs[songIndex]);
gifImg.style.visibility = "hidden"; // hidden until play starts

