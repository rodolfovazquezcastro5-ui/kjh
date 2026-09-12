
/* ============================================================
   TETO MUSIC EXPERIENCE
   SCRIPT.JS
   OPTIMIZED AUDIO ENGINE + LRC + VISUALIZER
   ============================================================ */

"use strict";


/* ============================================================
   CONFIGURACIÓN
   ============================================================ */

const CONFIG = {

    audioFile: "musicateto.mp3",
    lyricsFile: "musicateto.lrc",
    artworkFile: "teto2.png",
    backgroundFile: "teto1.png",

    /* Audio */
    fftSize: 1024,
    smoothing: 0.82,

    bassRange: [0.00, 0.12],
    midRange: [0.12, 0.48],
    trebleRange: [0.48, 0.88],

    energyAttack: 0.20,
    energyRelease: 0.055,

    beatThreshold: 0.60,
    beatCooldown: 7,

    /* Rendimiento */
    maxDpr: 1.35,

    visualizerFPS: 30,
    reactiveFPS: 45,
    backgroundFPS: 30,

    /* Visualizador */
    visualizerPoints: 56,

    /* Audio analysis */
    analysisStep: 3,

    /* Letras */
    lyricWordDelay: 100,
    lyricWordDuration: 280,

    /* Movimiento de letras */
    lyricScrollDuration: 520,
    lyricScrollEasing: "ease"
};


/* ============================================================
   DOM
   ============================================================ */

const DOM = {

    app:
        document.getElementById("app"),

    backgroundScene:
        document.getElementById("backgroundScene"),

    backgroundImage:
        document.querySelector(".background-image"),

    particleLayer:
        document.getElementById("particleLayer"),

    audioVisualizer:
        document.getElementById("audioVisualizer"),

    visualizerCanvas:
        document.getElementById("visualizerCanvas"),

    visualizerGlow:
        document.getElementById("visualizerGlow"),

    audioPulse:
        document.getElementById("audioPulse"),

    statusIndicator:
        document.getElementById("statusIndicator"),

    statusText:
        document.getElementById("statusText"),

    musicPlayer:
        document.getElementById("musicPlayer"),

    musicAudio:
        document.getElementById("musicAudio"),

    songTitle:
        document.getElementById("songTitle"),

    songSubtitle:
        document.getElementById("songSubtitle"),

    songDescription:
        document.getElementById("songDescription"),

    audioFormat:
        document.getElementById("audioFormat"),

    audioStatus:
        document.getElementById("audioStatus"),

    lyricsStatus:
        document.getElementById("lyricsStatus"),

    miniBars:
        document.getElementById("miniBars"),

    playerEqualizer:
        document.getElementById("playerEqualizer"),

    playerAura:
        document.getElementById("playerAura"),

    artworkStage:
        document.getElementById("artworkStage"),

    artworkAura:
        document.getElementById("artworkAura"),

    artworkFrame:
        document.getElementById("artworkFrame"),

    artworkReflection:
        document.getElementById("artworkReflection"),

    tetoArtwork:
        document.getElementById("tetoArtwork"),

    playerSongTitle:
        document.getElementById("playerSongTitle"),

    playerArtist:
        document.getElementById("playerArtist"),

    energyValue:
        document.getElementById("energyValue"),

    currentTime:
        document.getElementById("currentTime"),

    remainingTime:
        document.getElementById("remainingTime"),

    progressContainer:
        document.getElementById("progressContainer"),

    progressBuffered:
        document.getElementById("progressBuffered"),

    progressFill:
        document.getElementById("progressFill"),

    progressGlow:
        document.getElementById("progressGlow"),

    progressHandle:
        document.getElementById("progressHandle"),

    playButton:
        document.getElementById("playButton"),

    playIcon:
        document.getElementById("playIcon"),

    previousButton:
        document.getElementById("previousButton"),

    nextButton:
        document.getElementById("nextButton"),

    shuffleButton:
        document.getElementById("shuffleButton"),

    repeatButton:
        document.getElementById("repeatButton"),

    volumeButton:
        document.getElementById("volumeButton"),

    volumeIcon:
        document.getElementById("volumeIcon"),

    volumeContainer:
        document.getElementById("volumeContainer"),

    volumeFill:
        document.getElementById("volumeFill"),

    volumeHandle:
        document.getElementById("volumeHandle"),

    lyricsButton:
        document.getElementById("lyricsButton"),

    lyricsPanel:
        document.getElementById("lyricsPanel"),

    /* Letras dentro del reproductor */
    inlineLyrics:
        document.getElementById("inlineLyrics"),

    inlineLyricsViewport:
        document.getElementById("inlineLyricsViewport"),

    inlineLyricsContent:
        document.getElementById("inlineLyricsContent"),

    lyricsCloseButton:
        document.getElementById("lyricsCloseButton"),

    lyricsViewport:
        document.getElementById("lyricsViewport"),

    lyricsContent:
        document.getElementById("lyricsContent"),

    lyricsEmpty:
        document.getElementById("lyricsEmpty"),

    lyricsProgressFill:
        document.getElementById("lyricsProgressFill"),

    visualizerButton:
        document.getElementById("visualizerButton"),

    screenFlash:
        document.getElementById("screenFlash"),

    beatFlash:
        document.getElementById("beatFlash"),

    bassWave:
        document.getElementById("bassWave"),

    soundStatusText:
        document.getElementById("soundStatusText"),

    liveRegion:
        document.getElementById("liveRegion")
};


/* ============================================================
   ESTADO
   ============================================================ */

const STATE = {

    playing: false,

    volume: 0.85,

    muted: false,

    shuffle: false,

    repeat: false,

    visualizer: true,

    lyricsOpen: false,

    audioReady: false,

    audioContextReady: false,

    analyserReady: false,

    userInteracted: false,

    seeking: false,

    volumeDragging: false,

    currentLyric: -1,

    lyrics: [],

    lyricElements: [],

    metadata: {},

    energy: 0,

    bass: 0,

    mid: 0,

    treble: 0,

    beat: 0,

    bassPulse: 0,

    beatTimer: 0,

    previousEnergy: 0,

    previousBass: 0,

    frame: 0,

    lastTimestamp: 0,

    lastAnalysisTime: 0,

    lastVisualizerTime: 0,

    lastReactiveTime: 0,

    lastBackgroundTime: 0,

    lastProgressTime: 0,

    lastMiniBarTime: 0,

    lastEnergyTextTime: 0,

    particles: [],

    raf: null,

    canvasWidth: 0,

    canvasHeight: 0,

    canvasDpr: 1,

    lyricScrollAnimation: null
};


/* ============================================================
   AUDIO ENGINE
   ============================================================ */

let audioContext = null;

let analyser = null;

let sourceNode = null;

let gainNode = null;

let frequencyData = null;

let audioEngineFailed = false;


/* ============================================================
   CANVAS
   ============================================================ */

let canvasContext = null;


/* ============================================================
   ANIMACIONES DE LETRAS
   ============================================================ */

let lyricRevealTimers = [];


/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

function initialize() {

    setupFiles();

    setupAudio();

    setupControls();

    setupProgress();

    setupVolume();

    setupLyricsControls();

    setupKeyboard();

    setupParticles();

    setupCanvas();

    setupAudioEvents();

    loadLyrics();

    updateVolumeUI();

    updatePlaybackUI(false);

    updateStatus(
        "READY",
        "ready"
    );

    startAnimation();

    console.log(
        "TETO Music Experience optimizada iniciada."
    );
}


/* ============================================================
   ARCHIVOS
   ============================================================ */

function setupFiles() {

    if (DOM.musicAudio) {

        DOM.musicAudio.removeAttribute(
            "crossorigin"
        );

        DOM.musicAudio.src =
            CONFIG.audioFile;

        DOM.musicAudio.preload =
            "metadata";

        DOM.musicAudio.volume =
            STATE.volume;
    }


    if (DOM.tetoArtwork) {

        DOM.tetoArtwork.src =
            CONFIG.artworkFile;
    }


    if (DOM.backgroundImage) {

        DOM.backgroundImage.style.backgroundImage =
            `url("${CONFIG.backgroundFile}")`;
    }
}


/* ============================================================
   AUDIO BASE
   ============================================================ */

function setupAudio() {

    if (!DOM.musicAudio) {

        console.error(
            "No existe #musicAudio"
        );

        return;
    }


    DOM.musicAudio.volume =
        STATE.volume;


    DOM.musicAudio.addEventListener(
        "loadedmetadata",
        handleMetadata
    );
}


/* ============================================================
   CREACIÓN DEL AUDIO ENGINE
   ============================================================ */

function createAudioEngine() {

    if (audioContext) {

        return true;
    }


    if (audioEngineFailed) {

        return false;
    }


    try {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContextClass) {

            console.warn(
                "AudioContext no disponible."
            );

            audioEngineFailed =
                true;

            return false;
        }


        audioContext =
            new AudioContextClass();


        sourceNode =
            audioContext.createMediaElementSource(
                DOM.musicAudio
            );


        analyser =
            audioContext.createAnalyser();


        gainNode =
            audioContext.createGain();


        analyser.fftSize =
            CONFIG.fftSize;


        analyser.smoothingTimeConstant =
            CONFIG.smoothing;


        analyser.minDecibels =
            -90;


        analyser.maxDecibels =
            -10;


        gainNode.gain.value =
            STATE.muted
                ? 0
                : STATE.volume;


        sourceNode.connect(
            analyser
        );


        analyser.connect(
            gainNode
        );


        gainNode.connect(
            audioContext.destination
        );


        frequencyData =
            new Uint8Array(
                analyser.frequencyBinCount
            );


        STATE.audioContextReady =
            true;


        STATE.analyserReady =
            true;


        updateStatus(
            "AUDIO ENGINE READY",
            "ready"
        );


        if (DOM.soundStatusText) {

            DOM.soundStatusText.textContent =
                "AUDIO ENGINE READY";
        }


        return true;

    } catch (error) {

        console.warn(
            "Audio visualizer engine no disponible:",
            error
        );

        audioEngineFailed =
            true;

        analyser =
            null;

        sourceNode =
            null;

        gainNode =
            null;

        frequencyData =
            null;

        return false;
    }
}


/* ============================================================
   RESUME AUDIO CONTEXT
   ============================================================ */

async function resumeAudio() {

    const engine =
        createAudioEngine();


    if (
        engine &&
        audioContext &&
        audioContext.state === "suspended"
    ) {

        try {

            await audioContext.resume();

        } catch (error) {

            console.warn(
                "No se pudo reanudar AudioContext:",
                error
            );
        }
    }
}


/* ============================================================
   REPRODUCCIÓN
   ============================================================ */

async function playAudio() {

    if (!DOM.musicAudio) {

        return;
    }


    STATE.userInteracted =
        true;


    await resumeAudio();


    try {

        await DOM.musicAudio.play();

        STATE.playing =
            true;


        updatePlaybackUI(
            true
        );


        updateStatus(
            "PLAYING",
            "playing"
        );


        if (DOM.soundStatusText) {

            DOM.soundStatusText.textContent =
                "SOUND ENGINE ACTIVE";
        }


        if (
            "mediaSession" in navigator
        ) {

            try {

                navigator.mediaSession.playbackState =
                    "playing";

            } catch (_) {}
        }

    } catch (error) {

        console.error(
            "No se pudo reproducir:",
            error
        );


        updateStatus(
            "PLAYBACK ERROR",
            "error"
        );
    }
}


/* ============================================================
   PAUSA
   ============================================================ */

function pauseAudio() {

    if (!DOM.musicAudio) {

        return;
    }


    DOM.musicAudio.pause();


    STATE.playing =
        false;


    updatePlaybackUI(
        false
    );


    updateStatus(
        "PAUSED",
        "paused"
    );


    if (DOM.soundStatusText) {

        DOM.soundStatusText.textContent =
            "SOUND ENGINE PAUSED";
    }


    if (
        "mediaSession" in navigator
    ) {

        try {

            navigator.mediaSession.playbackState =
                "paused";

        } catch (_) {}
    }
}


/* ============================================================
   TOGGLE PLAY
   ============================================================ */

async function togglePlay() {

    if (!DOM.musicAudio) {

        return;
    }


    if (
        DOM.musicAudio.paused
    ) {

        await playAudio();

    } else {

        pauseAudio();
    }
}


/* ============================================================
   EVENTOS DEL AUDIO
   ============================================================ */

function setupAudioEvents() {

    if (!DOM.musicAudio) {

        return;
    }


    DOM.musicAudio.addEventListener(
        "play",
        () => {

            STATE.playing =
                true;

            updatePlaybackUI(
                true
            );
        }
    );


    DOM.musicAudio.addEventListener(
        "pause",
        () => {

            STATE.playing =
                false;

            updatePlaybackUI(
                false
            );
        }
    );


    DOM.musicAudio.addEventListener(
        "timeupdate",
        updateProgress
    );


    DOM.musicAudio.addEventListener(
        "progress",
        updateBuffered
    );


    DOM.musicAudio.addEventListener(
        "ended",
        handleEnded
    );


    DOM.musicAudio.addEventListener(
        "waiting",
        () => {

            updateStatus(
                "BUFFERING",
                "loading"
            );
        }
    );


    DOM.musicAudio.addEventListener(
        "canplay",
        () => {

            STATE.audioReady =
                true;

            if (!STATE.playing) {

                updateStatus(
                    "READY",
                    "ready"
                );
            }
        }
    );


    DOM.musicAudio.addEventListener(
        "error",
        () => {

            updateStatus(
                "AUDIO FILE ERROR",
                "error"
            );


            console.error(
                "No se pudo cargar:",
                CONFIG.audioFile
            );
        }
    );
}


/* ============================================================
   METADATA
   ============================================================ */

function handleMetadata() {

    STATE.audioReady =
        true;


    if (DOM.audioFormat) {

        DOM.audioFormat.textContent =
            "MP3 / AUDIO";
    }


    updateProgress();


    updateStatus(
        "READY",
        "ready"
    );
}


/* ============================================================
   FIN DE CANCIÓN
   ============================================================ */

function handleEnded() {

    STATE.playing =
        false;


    clearLyricRevealTimers();


    if (STATE.repeat) {

        DOM.musicAudio.currentTime =
            0;

        STATE.currentLyric =
            -1;

        resetLyricsVisualState();

        playAudio();

        return;
    }


    STATE.currentLyric =
        -1;


    resetLyricsVisualState();


    updatePlaybackUI(
        false
    );


    updateStatus(
        "FINISHED",
        "ready"
    );
}


/* ============================================================
   UI DE REPRODUCCIÓN
   ============================================================ */

function updatePlaybackUI(
    isPlaying
) {

    STATE.playing =
        isPlaying;


    if (DOM.playButton) {

        DOM.playButton.setAttribute(
            "aria-pressed",
            String(isPlaying)
        );


        DOM.playButton.setAttribute(
            "aria-label",
            isPlaying
                ? "Pausar"
                : "Reproducir"
        );
    }


    if (DOM.audioStatus) {

        DOM.audioStatus.textContent =
            isPlaying
                ? "PLAYING"
                : "PAUSED";
    }


    if (DOM.musicPlayer) {

        DOM.musicPlayer.classList.toggle(
            "is-playing",
            isPlaying
        );
    }


    if (DOM.playerEqualizer) {

        DOM.playerEqualizer.classList.toggle(
            "is-active",
            isPlaying
        );
    }
}


/* ============================================================
   STATUS
   ============================================================ */

function updateStatus(
    text,
    type
) {

    if (DOM.statusText) {

        DOM.statusText.textContent =
            text;
    }


    if (DOM.statusIndicator) {

        DOM.statusIndicator.dataset.status =
            type || "ready";
    }
}


/* ============================================================
   CONTROLES
   ============================================================ */

function setupControls() {

    DOM.playButton?.addEventListener(
        "click",
        togglePlay
    );


    DOM.previousButton?.addEventListener(
        "click",
        restartTrack
    );


    DOM.nextButton?.addEventListener(
        "click",
        restartTrack
    );


    DOM.shuffleButton?.addEventListener(
        "click",
        toggleShuffle
    );


    DOM.repeatButton?.addEventListener(
        "click",
        toggleRepeat
    );


    DOM.visualizerButton?.addEventListener(
        "click",
        toggleVisualizer
    );


    DOM.volumeButton?.addEventListener(
        "click",
        toggleMute
    );
}


/* ============================================================
   REINICIAR
   ============================================================ */

function restartTrack() {

    if (!DOM.musicAudio) {

        return;
    }


    DOM.musicAudio.currentTime =
        0;


    STATE.currentLyric =
        -1;


    resetLyricsVisualState();


    clearLyricRevealTimers();


    resetInlineLyricsScroll();


    if (!STATE.playing) {

        playAudio();
    }
}


/* ============================================================
   SHUFFLE
   ============================================================ */

function toggleShuffle() {

    STATE.shuffle =
        !STATE.shuffle;


    DOM.shuffleButton?.setAttribute(
        "aria-pressed",
        String(STATE.shuffle)
    );


    DOM.shuffleButton?.classList.toggle(
        "active",
        STATE.shuffle
    );
}


/* ============================================================
   REPEAT
   ============================================================ */

function toggleRepeat() {

    STATE.repeat =
        !STATE.repeat;


    DOM.repeatButton?.setAttribute(
        "aria-pressed",
        String(STATE.repeat)
    );


    DOM.repeatButton?.classList.toggle(
        "active",
        STATE.repeat
    );


    if (DOM.musicAudio) {

        DOM.musicAudio.loop =
            STATE.repeat;
    }
}


/* ============================================================
   VISUALIZER TOGGLE
   ============================================================ */

function toggleVisualizer() {

    STATE.visualizer =
        !STATE.visualizer;


    DOM.visualizerButton?.setAttribute(
        "aria-pressed",
        String(STATE.visualizer)
    );


    DOM.visualizerButton?.classList.toggle(
        "active",
        STATE.visualizer
    );


    DOM.audioVisualizer?.classList.toggle(
        "is-hidden",
        !STATE.visualizer
    );
}


/* ============================================================
   PROGRESO
   ============================================================ */

function setupProgress() {

    if (!DOM.progressContainer) {

        return;
    }


    DOM.progressContainer.addEventListener(
        "pointerdown",
        handleProgressPointer
    );


    DOM.progressContainer.addEventListener(
        "pointermove",
        event => {

            if (!STATE.seeking) {

                return;
            }


            seekFromPointer(
                event
            );
        }
    );


    window.addEventListener(
        "pointerup",
        () => {

            STATE.seeking =
                false;
        }
    );
}


/* ============================================================
   CLICK PROGRESO
   ============================================================ */

function handleProgressPointer(
    event
) {

    if (!DOM.musicAudio) {

        return;
    }


    STATE.seeking =
        true;


    seekFromPointer(
        event
    );
}


/* ============================================================
   SEEK
   ============================================================ */

function seekFromPointer(
    event
) {

    if (
        !DOM.progressContainer ||
        !DOM.musicAudio
    ) {

        return;
    }


    const rect =
        DOM.progressContainer.getBoundingClientRect();


    if (!rect.width) {

        return;
    }


    let ratio =
        (
            event.clientX -
            rect.left
        ) /
        rect.width;


    ratio =
        Math.max(
            0,
            Math.min(
                1,
                ratio
            )
        );


    const duration =
        DOM.musicAudio.duration;


    if (
        Number.isFinite(duration) &&
        duration > 0
    ) {

        DOM.musicAudio.currentTime =
            duration * ratio;


        forceLyricsRefresh();
    }
}


/* ============================================================
   SEEK FORZADO DE LETRAS
   ============================================================ */

function forceLyricsRefresh() {

    clearLyricRevealTimers();

    STATE.currentLyric =
        -1;

    resetLyricsVisualState();

    updateLyrics();
}


/* ============================================================
   UPDATE PROGRESO
   ============================================================ */

function updateProgress() {

    if (!DOM.musicAudio) {

        return;
    }


    const duration =
        DOM.musicAudio.duration;


    const current =
        DOM.musicAudio.currentTime;


    if (
        !Number.isFinite(duration) ||
        duration <= 0
    ) {

        return;
    }


    const percentage =
        (
            current /
            duration
        ) * 100;


    if (DOM.progressFill) {

        DOM.progressFill.style.width =
            `${percentage}%`;
    }


    if (DOM.progressGlow) {

        DOM.progressGlow.style.left =
            `${percentage}%`;
    }


    if (DOM.progressHandle) {

        DOM.progressHandle.style.left =
            `${percentage}%`;
    }


    if (DOM.currentTime) {

        DOM.currentTime.textContent =
            formatTime(
                current
            );
    }


    if (DOM.remainingTime) {

        DOM.remainingTime.textContent =
            "-" +
            formatTime(
                Math.max(
                    0,
                    duration - current
                )
            );
    }


    updateLyricsProgress();
}


/* ============================================================
   BUFFER
   ============================================================ */

function updateBuffered() {

    if (
        !DOM.musicAudio ||
        !DOM.progressBuffered
    ) {

        return;
    }


    const duration =
        DOM.musicAudio.duration;


    if (
        !Number.isFinite(duration) ||
        duration <= 0
    ) {

        return;
    }


    if (
        DOM.musicAudio.buffered.length === 0
    ) {

        return;
    }


    try {

        const end =
            DOM.musicAudio.buffered.end(
                DOM.musicAudio.buffered.length - 1
            );


        const percentage =
            (
                end /
                duration
            ) * 100;


        DOM.progressBuffered.style.width =
            `${percentage}%`;

    } catch (_) {}
}


/* ============================================================
   TIEMPO
   ============================================================ */

function formatTime(
    seconds
) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "00:00";
    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes).padStart(
            2,
            "0"
        ) +
        ":" +
        String(secs).padStart(
            2,
            "0"
        )
    );
}


/* ============================================================
   VOLUMEN
   ============================================================ */

function setupVolume() {

    if (!DOM.volumeContainer) {

        return;
    }


    DOM.volumeContainer.addEventListener(
        "pointerdown",
        event => {

            STATE.volumeDragging =
                true;

            setVolumeFromPointer(
                event
            );
        }
    );


    DOM.volumeContainer.addEventListener(
        "pointermove",
        event => {

            if (
                !STATE.volumeDragging
            ) {

                return;
            }


            setVolumeFromPointer(
                event
            );
        }
    );


    window.addEventListener(
        "pointerup",
        () => {

            STATE.volumeDragging =
                false;
        }
    );
}


/* ============================================================
   VOLUMEN POINTER
   ============================================================ */

function setVolumeFromPointer(
    event
) {

    if (!DOM.volumeContainer) {

        return;
    }


    const rect =
        DOM.volumeContainer.getBoundingClientRect();


    if (!rect.width) {

        return;
    }


    let ratio =
        (
            event.clientX -
            rect.left
        ) /
        rect.width;


    ratio =
        Math.max(
            0,
            Math.min(
                1,
                ratio
            )
        );


    STATE.volume =
        ratio;


    STATE.muted =
        ratio === 0;


    applyVolume();

    updateVolumeUI();
}


/* ============================================================
   APLICAR VOLUMEN
   ============================================================ */

function applyVolume() {

    const value =
        STATE.muted
            ? 0
            : STATE.volume;


    if (DOM.musicAudio) {

        if (gainNode) {

            DOM.musicAudio.volume =
                1;

            gainNode.gain.value =
                value;

        } else {

            DOM.musicAudio.volume =
                value;
        }
    }
}


/* ============================================================
   MUTE
   ============================================================ */

function toggleMute() {

    if (!DOM.musicAudio) {

        return;
    }


    STATE.muted =
        !STATE.muted;


    applyVolume();

    updateVolumeUI();
}


/* ============================================================
   UI VOLUMEN
   ============================================================ */

function updateVolumeUI() {

    const value =
        STATE.muted
            ? 0
            : STATE.volume;


    const percentage =
        value * 100;


    if (DOM.volumeFill) {

        DOM.volumeFill.style.width =
            `${percentage}%`;
    }


    if (DOM.volumeHandle) {

        DOM.volumeHandle.style.left =
            `${percentage}%`;
    }


    if (DOM.volumeButton) {

        DOM.volumeButton.classList.toggle(
            "muted",
            value === 0
        );
    }
}


/* ============================================================
   LETRAS LRC
   ============================================================ */

async function loadLyrics() {

    console.log(
        "================================="
    );

    console.log(
        "LRC: INICIANDO CARGA"
    );

    console.log(
        "LRC: archivo:",
        CONFIG.lyricsFile
    );

    console.log(
        "LRC: panel:",
        DOM.lyricsContent
    );

    console.log(
        "LRC: inline:",
        DOM.inlineLyricsContent
    );

    console.log(
        "================================="
    );


    if (
        !DOM.lyricsContent &&
        !DOM.inlineLyricsContent
    ) {

        console.error(
            "LRC: no existe ningún contenedor de letras."
        );

        if (DOM.lyricsStatus) {

            DOM.lyricsStatus.textContent =
                "NO CONTAINER";
        }

        return;
    }


    try {

        const response =
            await fetch(
                CONFIG.lyricsFile +
                "?v=" +
                Date.now(),
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        console.log(
            "LRC: HTTP",
            response.status,
            response.statusText
        );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }


        const text =
            await response.text();


        console.log(
            "LRC: texto recibido:",
            text
        );


        if (!text.trim()) {

            throw new Error(
                "El archivo LRC está vacío."
            );
        }


        parseLyrics(
            text
        );

    } catch (error) {

        console.error(
            "LRC: ERROR AL CARGAR:",
            error
        );


        clearLyricRevealTimers();


        STATE.lyrics = [];

        STATE.lyricElements = [];

        STATE.currentLyric = -1;


        if (DOM.lyricsStatus) {

            DOM.lyricsStatus.textContent =
                "NO LRC";
        }


        if (DOM.lyricsEmpty) {

            DOM.lyricsEmpty.hidden =
                false;
        }


        if (DOM.lyricsContent) {

            DOM.lyricsContent.innerHTML =
                "";
        }


        if (DOM.inlineLyricsContent) {

            DOM.inlineLyricsContent.innerHTML = `
                <div class="inline-lyric-line lyric-placeholder">
                    ♪ No se pudieron cargar las letras
                </div>
            `;
        }
    }
}


/* ============================================================
   PARSEAR LRC
   ============================================================ */

function parseLyrics(
    text
) {

    const result = [];

    const metadata = {};


    const cleanText =
        String(text || "")
            .replace(
                /^\uFEFF/,
                ""
            );


    const lines =
        cleanText.split(
            /\r?\n/
        );


    console.log(
        "LRC: líneas del archivo:",
        lines.length
    );


    for (
        const rawLine of lines
    ) {

        const line =
            rawLine.trim();


        if (!line) {

            continue;
        }


        /* ----------------------------------------------------
           TIMESTAMPS
        ---------------------------------------------------- */

        const timestamps = [
            ...line.matchAll(
                /\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]/g
            )
        ];


        /* ----------------------------------------------------
           METADATA
        ---------------------------------------------------- */

        if (!timestamps.length) {

            const meta =
                line.match(
                    /^\[([a-zA-Z]+):([^\]]*)\]$/
                );


            if (meta) {

                metadata[
                    meta[1].toLowerCase()
                ] =
                    meta[2].trim();
            }


            continue;
        }


        /* ----------------------------------------------------
           TEXTO DE LA LÍNEA
        ---------------------------------------------------- */

        const lyricText =
            line
                .replace(
                    /\[\d{1,3}:\d{2}(?:[.:]\d{1,3})?\]/g,
                    ""
                )
                .trim();


        const finalText =
            lyricText ||
            "♪";


        /* ----------------------------------------------------
           CREAR UNA ENTRADA POR TIMESTAMP
        ---------------------------------------------------- */

        for (
            const match of timestamps
        ) {

            const minutes =
                Number(
                    match[1]
                );


            const seconds =
                Number(
                    match[2]
                );


            const fractionText =
                match[3] ||
                "0";


            let milliseconds =
                0;


            if (
                fractionText.length === 1
            ) {

                milliseconds =
                    Number(
                        fractionText
                    ) * 100;

            } else if (
                fractionText.length === 2
            ) {

                milliseconds =
                    Number(
                        fractionText
                    ) * 10;

            } else {

                milliseconds =
                    Number(
                        fractionText.slice(
                            0,
                            3
                        )
                    );
            }


            const time =
                (
                    minutes * 60
                ) +
                seconds +
                (
                    milliseconds / 1000
                );


            if (
                Number.isFinite(
                    time
                )
            ) {

                result.push({

                    time:
                        time,

                    text:
                        finalText
                });
            }
        }
    }


    /* ----------------------------------------------------
       ORDENAR CRONOLÓGICAMENTE
    ---------------------------------------------------- */

    result.sort(
        (
            a,
            b
        ) =>
            a.time -
            b.time
    );


    /* ----------------------------------------------------
       GUARDAR
    ---------------------------------------------------- */

    STATE.lyrics =
        result;

    STATE.metadata =
        metadata;

    STATE.currentLyric =
        -1;


    clearLyricRevealTimers();


    console.log(
        "LRC: TOTAL:",
        result.length
    );


    console.table(
        result
    );


    /* ----------------------------------------------------
       RENDERIZAR
    ---------------------------------------------------- */

    renderLyrics();


    if (DOM.lyricsStatus) {

        DOM.lyricsStatus.textContent =
            result.length
                ? `${result.length} LINES`
                : "NO LINES";
    }
}


/* ============================================================
   CREAR PALABRAS
   ============================================================ */

function appendLyricWords(
    element,
    text
) {

    if (!element) {

        return;
    }


    const cleanText =
        String(
            text || ""
        ).trim();


    if (!cleanText) {

        return;
    }


    const words =
        cleanText.split(
            /\s+/
        );


    words.forEach(
        (
            word,
            index
        ) => {

            const span =
                document.createElement(
                    "span"
                );


            span.className =
                "lyric-word word-hidden";


            span.textContent =
                word;


            element.appendChild(
                span
            );


            if (
                index <
                words.length - 1
            ) {

                element.appendChild(
                    document.createTextNode(
                        " "
                    )
                );
            }
        }
    );
}


/* ============================================================
   RENDERIZAR LETRAS
   ============================================================ */

function renderLyrics() {

    clearLyricRevealTimers();


    STATE.lyricElements =
        [];


    /* ========================================================
       SIN LETRAS
    ======================================================== */

    if (!STATE.lyrics.length) {

        if (DOM.lyricsContent) {

            DOM.lyricsContent.innerHTML =
                "";
        }


        if (DOM.inlineLyricsContent) {

            DOM.inlineLyricsContent.innerHTML = `
                <div class="inline-lyric-line lyric-placeholder">
                    ♪
                </div>
            `;
        }


        if (DOM.lyricsEmpty) {

            DOM.lyricsEmpty.hidden =
                false;
        }


        return;
    }


    /* ========================================================
       OCULTAR ESTADO VACÍO
    ======================================================== */

    if (DOM.lyricsEmpty) {

        DOM.lyricsEmpty.hidden =
            true;
    }


    /* ========================================================
       LIMPIAR CONTENEDORES
    ======================================================== */

    if (DOM.lyricsContent) {

        DOM.lyricsContent.innerHTML =
            "";
    }


    if (DOM.inlineLyricsContent) {

        DOM.inlineLyricsContent.innerHTML =
            "";
    }


    const panelFragment =
        document.createDocumentFragment();


    const inlineFragment =
        document.createDocumentFragment();


    /* ========================================================
       CREAR LÍNEAS
    ======================================================== */

    STATE.lyrics.forEach(
        (
            line,
            index
        ) => {

            /* ================================================
               PANEL
            ================================================= */

            const panelElement =
                document.createElement(
                    "div"
                );


            panelElement.className =
                "lyric-line future";


            panelElement.dataset.index =
                String(
                    index
                );


            panelElement.dataset.time =
                String(
                    line.time
                );


            appendLyricWords(
                panelElement,
                line.text
            );


            panelElement.setAttribute(
                "role",
                "button"
            );


            panelElement.tabIndex =
                0;


            panelElement.addEventListener(
                "click",
                () => {

                    seekToLyric(
                        line.time
                    );
                }
            );


            panelElement.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();


                        seekToLyric(
                            line.time
                        );
                    }
                }
            );


            panelFragment.appendChild(
                panelElement
            );


            STATE.lyricElements.push(
                panelElement
            );


            /* ================================================
               INLINE
            ================================================= */

            if (DOM.inlineLyricsContent) {

                const inlineElement =
                    document.createElement(
                        "div"
                    );


                inlineElement.className =
                    "inline-lyric-line future";


                inlineElement.dataset.index =
                    String(
                        index
                    );


                inlineElement.dataset.time =
                    String(
                        line.time
                    );


                appendLyricWords(
                    inlineElement,
                    line.text
                );


                inlineElement.addEventListener(
                    "click",
                    () => {

                        seekToLyric(
                            line.time
                        );
                    }
                );


                inlineFragment.appendChild(
                    inlineElement
                );
            }
        }
    );


    /* ========================================================
       INSERTAR
    ======================================================== */

    if (DOM.lyricsContent) {

        DOM.lyricsContent.appendChild(
            panelFragment
        );
    }


    if (DOM.inlineLyricsContent) {

        DOM.inlineLyricsContent.appendChild(
            inlineFragment
        );
    }


    /*
       IMPORTANTE:
       Crear espacio superior e inferior dinámico.
       Esto permite que incluso la primera y última línea
       puedan llegar físicamente al centro del viewport.
    */

    requestAnimationFrame(
        () => {

            updateInlineLyricsPadding();

        }
    );


    console.log(
        "LRC: PANEL:",
        STATE.lyricElements.length
    );


    console.log(
        "LRC: INLINE:",
        DOM.inlineLyricsContent
            ? DOM.inlineLyricsContent.children.length
            : 0
    );
}


/* ============================================================
   ESPACIO PARA CENTRAR PRIMERA Y ÚLTIMA LÍNEA
   ============================================================ */

function updateInlineLyricsPadding() {

    if (
        !DOM.inlineLyricsViewport ||
        !DOM.inlineLyricsContent
    ) {

        return;
    }


    const viewportHeight =
        DOM.inlineLyricsViewport.clientHeight;


    if (
        viewportHeight <= 0
    ) {

        return;
    }


    const firstLine =
        DOM.inlineLyricsContent.querySelector(
            ".inline-lyric-line"
        );


    const lastLine =
        DOM.inlineLyricsContent.querySelector(
            ".inline-lyric-line:last-child"
        );


    if (
        !firstLine ||
        !lastLine
    ) {

        return;
    }


    const firstHeight =
        firstLine.getBoundingClientRect().height;


    const lastHeight =
        lastLine.getBoundingClientRect().height;


    const topPadding =
        Math.max(
            0,
            (
                viewportHeight -
                firstHeight
            ) / 2
        );


    const bottomPadding =
        Math.max(
            0,
            (
                viewportHeight -
                lastHeight
            ) / 2
        );


    DOM.inlineLyricsContent.style.paddingTop =
        `${Math.round(topPadding)}px`;


    DOM.inlineLyricsContent.style.paddingBottom =
        `${Math.round(bottomPadding)}px`;
}


/* ============================================================
   CENTRAR LÍNEA INLINE
   ============================================================ */

function centerInlineLyric(
    element,
    smooth = true
) {

    if (
        !DOM.inlineLyricsViewport ||
        !DOM.inlineLyricsContent ||
        !element
    ) {

        return;
    }


    updateInlineLyricsPadding();


    const viewport =
        DOM.inlineLyricsViewport;


    const viewportRect =
        viewport.getBoundingClientRect();


    const elementRect =
        element.getBoundingClientRect();


    const currentScroll =
        viewport.scrollTop;


    /*
       Distancia real de la línea respecto al contenido.
    */

    const elementTop =
        (
            elementRect.top -
            viewportRect.top
        ) +
        currentScroll;


    const targetScroll =
        elementTop -
        (
            viewport.clientHeight -
            elementRect.height
        ) / 2;


    const maxScroll =
        Math.max(
            0,
            viewport.scrollHeight -
            viewport.clientHeight
        );


    const finalScroll =
        Math.max(
            0,
            Math.min(
                maxScroll,
                targetScroll
            )
        );


    if (!smooth) {

        viewport.scrollTop =
            finalScroll;

        return;
    }


    animateLyricScroll(
        viewport,
        finalScroll
    );
}


/* ============================================================
   ANIMACIÓN SUAVE DEL SCROLL
   ============================================================ */

function animateLyricScroll(
    viewport,
    target
) {

    if (
        !viewport
    ) {

        return;
    }


    if (
        STATE.lyricScrollAnimation
    ) {

        cancelAnimationFrame(
            STATE.lyricScrollAnimation
        );

        STATE.lyricScrollAnimation =
            null;
    }


    const start =
        viewport.scrollTop;


    const distance =
        target -
        start;


    if (
        Math.abs(distance) < 1
    ) {

        viewport.scrollTop =
            target;

        return;
    }


    const duration =
        CONFIG.lyricScrollDuration;


    const startTime =
        performance.now();


    const ease =
        t => {

            /*
               Cubic ease-in-out
            */

            return t < 0.5
                ? 4 * t * t * t
                : 1 -
                    Math.pow(
                        -2 * t + 2,
                        3
                    ) / 2;
        };


    const step =
        now => {

            const elapsed =
                now -
                startTime;


            const progress =
                Math.min(
                    1,
                    elapsed /
                    duration
                );


            const eased =
                ease(
                    progress
                );


            viewport.scrollTop =
                start +
                distance *
                eased;


            if (
                progress < 1
            ) {

                STATE.lyricScrollAnimation =
                    requestAnimationFrame(
                        step
                    );

            } else {

                STATE.lyricScrollAnimation =
                    null;

                viewport.scrollTop =
                    target;
            }
        };


    STATE.lyricScrollAnimation =
        requestAnimationFrame(
            step
        );
}


/* ============================================================
   RESET SCROLL INLINE
   ============================================================ */

function resetInlineLyricsScroll() {

    if (
        !DOM.inlineLyricsViewport
    ) {

        return;
    }


    if (
        STATE.lyricScrollAnimation
    ) {

        cancelAnimationFrame(
            STATE.lyricScrollAnimation
        );

        STATE.lyricScrollAnimation =
            null;
    }


    DOM.inlineLyricsViewport.scrollTop =
        0;
}


/* ============================================================
   SALTAR A UNA LETRA
   ============================================================ */

function seekToLyric(
    time
) {

    if (!DOM.musicAudio) {

        return;
    }


    DOM.musicAudio.currentTime =
        Math.max(
            0,
            Number(time) || 0
        );


    forceLyricsRefresh();
}


/* ============================================================
   RESET VISUAL
   ============================================================ */

function resetLyricsVisualState() {

    STATE.lyricElements.forEach(
        element => {

            element.classList.remove(
                "active",
                "past",
                "future"
            );


            element.classList.add(
                "future"
            );
        }
    );


    if (DOM.inlineLyricsContent) {

        DOM.inlineLyricsContent
            .querySelectorAll(
                ".inline-lyric-line"
            )
            .forEach(
                element => {

                    element.classList.remove(
                        "active",
                        "past",
                        "future"
                    );


                    element.classList.add(
                        "future"
                    );
                }
            );
    }
}


/* ============================================================
   LIMPIAR TIMERS DE LETRAS
   ============================================================ */

function clearLyricRevealTimers() {

    lyricRevealTimers.forEach(
        timer => {

            clearTimeout(
                timer
            );
        }
    );


    lyricRevealTimers =
        [];
}


/* ============================================================
   ENCONTRAR LETRA ACTUAL
   ============================================================ */

function findLyricIndex(
    time
) {

    let low =
        0;


    let high =
        STATE.lyrics.length -
        1;


    let result =
        -1;


    while (
        low <= high
    ) {

        const middle =
            Math.floor(
                (
                    low +
                    high
                ) / 2
            );


        if (
            STATE.lyrics[middle].time <=
            time
        ) {

            result =
                middle;


            low =
                middle +
                1;

        } else {

            high =
                middle -
                1;
        }
    }


    return result;
}


/* ============================================================
   ACTUALIZAR LETRA
   ============================================================ */

function updateLyrics() {

    if (
        !DOM.musicAudio ||
        !STATE.lyrics.length
    ) {

        return;
    }


    const currentTime =
        DOM.musicAudio.currentTime;


    const index =
        findLyricIndex(
            currentTime
        );


    /* ========================================================
       NO CAMBIÓ DE LÍNEA
    ======================================================== */

    if (
        index ===
        STATE.currentLyric
    ) {

        return;
    }


    STATE.currentLyric =
        index;


    /* ========================================================
       OBTENER ELEMENTOS INLINE
    ======================================================== */

    let inlineElements =
        [];


    if (
        DOM.inlineLyricsContent
    ) {

        inlineElements =
            DOM.inlineLyricsContent
                .querySelectorAll(
                    ".inline-lyric-line"
                );
    }


    /* ========================================================
       ACTUALIZAR PANEL
    ======================================================== */

    STATE.lyricElements.forEach(
        (
            element,
            i
        ) => {

            element.classList.remove(
                "active",
                "past",
                "future"
            );


            if (
                i < index
            ) {

                element.classList.add(
                    "past"
                );

            } else if (
                i === index
            ) {

                element.classList.add(
                    "active"
                );

            } else {

                element.classList.add(
                    "future"
                );
            }
        }
    );


    /* ========================================================
       ACTUALIZAR INLINE
    ======================================================== */

    inlineElements.forEach(
        (
            element,
            i
        ) => {

            element.classList.remove(
                "active",
                "past",
                "future"
            );


            if (
                i < index
            ) {

                element.classList.add(
                    "past"
                );

            } else if (
                i === index
            ) {

                element.classList.add(
                    "active"
                );

            } else {

                element.classList.add(
                    "future"
                );
            }
        }
    );


    /* ========================================================
       REVELAR PALABRAS
    ======================================================== */

    if (
        index >= 0
    ) {

        revealLyricWords(
            STATE.lyricElements[index],
            inlineElements[index]
        );

    } else {

        clearLyricRevealTimers();
    }


    /* ========================================================
       CENTRAR INLINE
    ======================================================== */

    if (
        index >= 0 &&
        inlineElements[index]
    ) {

        centerInlineLyric(
            inlineElements[index],
            true
        );
    }


    /* ========================================================
       CENTRAR PANEL
    ======================================================== */

    if (
        index >= 0 &&
        STATE.lyricsOpen &&
        STATE.lyricElements[index]
    ) {

        STATE.lyricElements[index]
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
    }


    /* ========================================================
       DEBUG
    ======================================================== */

    console.log(
        "LRC: línea activa:",
        index,
        STATE.lyrics[index]
            ? STATE.lyrics[index].text
            : "ninguna"
    );
}


/* ============================================================
   REVELAR LETRA PALABRA POR PALABRA
   ============================================================ */

function revealLyricWords(
    panelElement,
    inlineElement
) {

    clearLyricRevealTimers();


    const elements = [
        panelElement,
        inlineElement
    ].filter(
        Boolean
    );


    if (
        !elements.length
    ) {

        return;
    }


    /* ========================================================
       OCULTAR PALABRAS
    ======================================================== */

    const allWords =
        [];


    elements.forEach(
        element => {

            const words =
                element.querySelectorAll(
                    ".lyric-word"
                );


            allWords.push(
                words
            );


            words.forEach(
                word => {

                    word.classList.remove(
                        "word-visible"
                    );


                    word.classList.add(
                        "word-hidden"
                    );
                }
            );
        }
    );


    /* ========================================================
       CALCULAR NÚMERO DE PALABRAS
    ======================================================== */

    const wordCount =
        allWords.length
            ? Math.max(
                ...allWords.map(
                    words =>
                        words.length
                )
            )
            : 0;


    /* ========================================================
       REVELAR UNA POR UNA
    ======================================================== */

    for (
        let i = 0;
        i < wordCount;
        i++
    ) {

        const timer =
            setTimeout(
                () => {

                    allWords.forEach(
                        words => {

                            if (
                                words[i]
                            ) {

                                words[i]
                                    .classList
                                    .remove(
                                        "word-hidden"
                                    );


                                words[i]
                                    .classList
                                    .add(
                                        "word-visible"
                                    );
                            }
                        }
                    );

                },
                i *
                CONFIG.lyricWordDelay
            );


        lyricRevealTimers.push(
            timer
        );
    }
}


/* ============================================================
   PROGRESO DE LETRAS
   ============================================================ */

function updateLyricsProgress() {

    if (
        !DOM.musicAudio ||
        !DOM.lyricsProgressFill
    ) {

        return;
    }


    const duration =
        DOM.musicAudio.duration;


    if (
        !Number.isFinite(duration) ||
        duration <= 0
    ) {

        return;
    }


    const percentage =
        (
            DOM.musicAudio.currentTime /
            duration
        ) * 100;


    DOM.lyricsProgressFill.style.width =
        `${percentage}%`;
}


/* ============================================================
   CONTROLES DE LETRAS
   ============================================================ */

function setupLyricsControls() {

    DOM.lyricsButton?.addEventListener(
        "click",
        toggleLyrics
    );


    DOM.lyricsCloseButton?.addEventListener(
        "click",
        closeLyrics
    );
}


/* ============================================================
   ABRIR LETRAS
   ============================================================ */

function openLyrics() {

    STATE.lyricsOpen =
        true;


    DOM.lyricsPanel?.classList.add(
        "is-open"
    );


    DOM.lyricsPanel?.setAttribute(
        "aria-hidden",
        "false"
    );


    DOM.lyricsButton?.setAttribute(
        "aria-pressed",
        "true"
    );


    DOM.lyricsButton?.classList.add(
        "active"
    );


    requestAnimationFrame(
        () => {

            updateInlineLyricsPadding();

            updateLyrics();
        }
    );
}


/* ============================================================
   CERRAR LETRAS
   ============================================================ */

function closeLyrics() {

    STATE.lyricsOpen =
        false;


    DOM.lyricsPanel?.classList.remove(
        "is-open"
    );


    DOM.lyricsPanel?.setAttribute(
        "aria-hidden",
        "true"
    );


    DOM.lyricsButton?.setAttribute(
        "aria-pressed",
        "false"
    );


    DOM.lyricsButton?.classList.remove(
        "active"
    );
}


/* ============================================================
   TOGGLE LETRAS
   ============================================================ */

function toggleLyrics() {

    if (
        STATE.lyricsOpen
    ) {

        closeLyrics();

    } else {

        openLyrics();
    }
}


/* ============================================================
   CANVAS SETUP
   ============================================================ */

function setupCanvas() {

    if (
        !DOM.visualizerCanvas
    ) {

        return;
    }


    canvasContext =
        DOM.visualizerCanvas.getContext(
            "2d",
            {
                alpha: true,
                desynchronized: true
            }
        );


    if (
        !canvasContext
    ) {

        return;
    }


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        () => {

            requestAnimationFrame(
                updateInlineLyricsPadding
            );
        },
        {
            passive: true
        }
    );
}


/* ============================================================
   RESIZE CANVAS
   ============================================================ */

function resizeCanvas() {

    if (
        !DOM.visualizerCanvas ||
        !canvasContext
    ) {

        return;
    }


    const rect =
        DOM.visualizerCanvas
            .getBoundingClientRect();


    const width =
        Math.max(
            1,
            Math.round(
                rect.width
            )
        );


    const height =
        Math.max(
            1,
            Math.round(
                rect.height
            )
        );


    const dpr =
        Math.min(
            window.devicePixelRatio ||
            1,
            CONFIG.maxDpr
        );


    STATE.canvasWidth =
        width;


    STATE.canvasHeight =
        height;


    STATE.canvasDpr =
        dpr;


    DOM.visualizerCanvas.width =
        Math.max(
            1,
            Math.round(
                width *
                dpr
            )
        );


    DOM.visualizerCanvas.height =
        Math.max(
            1,
            Math.round(
                height *
                dpr
            )
        );


    canvasContext.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


/* ============================================================
   VISUALIZER
   ============================================================ */

function drawVisualizer() {

    if (
        !STATE.visualizer ||
        !canvasContext
    ) {

        return;
    }


    const width =
        STATE.canvasWidth;


    const height =
        STATE.canvasHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;
    }


    canvasContext.clearRect(
        0,
        0,
        width,
        height
    );


    const energy =
        STATE.energy;


    const bass =
        STATE.bass;


    const centerY =
        height *
        0.5;


    const points =
        CONFIG.visualizerPoints;


    const maxHeight =
        height *
        (
            0.035 +
            energy *
            0.40
        );


    const time =
        STATE.frame;


    canvasContext.beginPath();


    for (
        let i = 0;
        i < points;
        i++
    ) {

        const ratio =
            i /
            (
                points -
                1
            );


        const x =
            ratio *
            width;


        let amplitude =
            Math.sin(
                i *
                0.36 +
                time *
                0.035
            );


        amplitude *=
            0.40 +
            bass *
            0.80;


        amplitude +=
            Math.sin(
                i *
                0.19 -
                time *
                0.020
            ) *
            0.24;


        const y =
            centerY +
            amplitude *
            maxHeight;


        if (
            i === 0
        ) {

            canvasContext.moveTo(
                x,
                y
            );

        } else {

            canvasContext.lineTo(
                x,
                y
            );
        }
    }


    canvasContext.lineWidth =
        1.25 +
        energy *
        1.75;


    canvasContext.strokeStyle =
        `rgba(180,130,255,${0.12 + energy * 0.40})`;


    canvasContext.stroke();
}


/* ============================================================
   AUDIO ANALYSIS
   ============================================================ */

function analyzeAudio() {

    if (
        !analyser ||
        !frequencyData ||
        !STATE.playing
    ) {

        smoothIdleAudio();

        return;
    }


    analyser.getByteFrequencyData(
        frequencyData
    );


    const length =
        frequencyData.length;


    const bassEnd =
        Math.max(
            1,
            Math.floor(
                length *
                CONFIG.bassRange[1]
            )
        );


    const midStart =
        bassEnd;


    const midEnd =
        Math.max(
            midStart +
            1,
            Math.floor(
                length *
                CONFIG.midRange[1]
            )
        );


    const trebleStart =
        midEnd;


    const trebleEnd =
        Math.max(
            trebleStart +
            1,
            Math.floor(
                length *
                CONFIG.trebleRange[1]
            )
        );


    let bassTotal =
        0;


    let midTotal =
        0;


    let trebleTotal =
        0;


    let count =
        0;


    for (
        let i = 0;
        i < bassEnd;
        i += CONFIG.analysisStep
    ) {

        bassTotal +=
            frequencyData[i];

        count++;
    }


    const bass =
        count
            ? bassTotal /
              count /
              255
            : 0;


    count =
        0;


    for (
        let i = midStart;
        i < midEnd;
        i += CONFIG.analysisStep
    ) {

        midTotal +=
            frequencyData[i];

        count++;
    }


    const mid =
        count
            ? midTotal /
              count /
              255
            : 0;


    count =
        0;


    for (
        let i = trebleStart;
        i < trebleEnd;
        i += CONFIG.analysisStep
    ) {

        trebleTotal +=
            frequencyData[i];

        count++;
    }


    const treble =
        count
            ? trebleTotal /
              count /
              255
            : 0;


    const total =
        (
            bass *
            0.50 +
            mid *
            0.32 +
            treble *
            0.18
        );


    const targetEnergy =
        Math.min(
            1,
            total *
            1.55
        );


    const attack =
        targetEnergy >
        STATE.energy
            ? CONFIG.energyAttack
            : CONFIG.energyRelease;


    STATE.energy +=
        (
            targetEnergy -
            STATE.energy
        ) *
        attack;


    STATE.bass +=
        (
            bass -
            STATE.bass
        ) *
        0.24;


    STATE.mid +=
        (
            mid -
            STATE.mid
        ) *
        0.18;


    STATE.treble +=
        (
            treble -
            STATE.treble
        ) *
        0.18;


    detectBeat();
}


/* ============================================================
   AUDIO IDLE
   ============================================================ */

function smoothIdleAudio() {

    STATE.energy *=
        0.90;


    STATE.bass *=
        0.88;


    STATE.mid *=
        0.88;


    STATE.treble *=
        0.88;


    STATE.beat *=
        0.80;


    STATE.bassPulse *=
        0.86;
}


/* ============================================================
   BEAT DETECTION
   ============================================================ */

function detectBeat() {

    const energyRise =
        STATE.energy -
        STATE.previousEnergy;


    const bassRise =
        STATE.bass -
        STATE.previousBass;


    const trigger =
        STATE.energy >
        CONFIG.beatThreshold &&
        energyRise >
        0.018 &&
        bassRise >
        0.008;


    if (
        trigger &&
        STATE.beatTimer <= 0
    ) {

        STATE.beat =
            1;


        STATE.bassPulse =
            1;


        STATE.beatTimer =
            CONFIG.beatCooldown;


        triggerBeat();
    }


    STATE.previousEnergy =
        STATE.energy;


    STATE.previousBass =
        STATE.bass;


    if (
        STATE.beatTimer > 0
    ) {

        STATE.beatTimer--;
    }


    STATE.beat *=
        0.82;


    STATE.bassPulse *=
        0.90;
}


/* ============================================================
   REACCIÓN VISUAL
   ============================================================ */

function updateReactiveInterface() {

    const root =
        document.documentElement;


    root.style.setProperty(
        "--audio-energy",
        STATE.energy.toFixed(3)
    );


    root.style.setProperty(
        "--audio-bass",
        STATE.bass.toFixed(3)
    );


    root.style.setProperty(
        "--audio-mid",
        STATE.mid.toFixed(3)
    );


    root.style.setProperty(
        "--audio-treble",
        STATE.treble.toFixed(3)
    );


    root.style.setProperty(
        "--audio-beat",
        STATE.beat.toFixed(3)
    );


    root.style.setProperty(
        "--audio-pulse",
        STATE.bassPulse.toFixed(3)
    );


    updateArtworkReaction();

    updatePlayerAura();

    updateBackgroundReaction();
}


/* ============================================================
   ENERGY TEXT
   ============================================================ */

function updateEnergyText() {

    if (!DOM.energyValue) {

        return;
    }


    const value =
        Math.round(
            STATE.energy *
            100
        );


    DOM.energyValue.textContent =
        String(
            value
        ).padStart(
            2,
            "0"
        ) +
        "%";
}


/* ============================================================
   ARTWORK REACTION
   ============================================================ */

function updateArtworkReaction() {

    if (!DOM.artworkFrame) {

        return;
    }


    const energy =
        STATE.energy;


    const bass =
        STATE.bass;


    const beat =
        STATE.beat;


    const scale =
        1 +
        energy *
        0.022 +
        beat *
        0.022;


    const rotation =
        Math.sin(
            STATE.frame *
            0.012
        ) *
        (
            0.18 +
            energy *
            0.65
        );


    const y =
        Math.sin(
            STATE.frame *
            0.016
        ) *
        (
            0.7 +
            energy *
            2.8
        );


    DOM.artworkFrame.style.transform =
        `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)}) rotate(${rotation.toFixed(3)}deg)`;


    if (DOM.artworkAura) {

        DOM.artworkAura.style.opacity =
            (
                0.22 +
                energy *
                0.50 +
                beat *
                0.22
            ).toFixed(3);
    }


    if (DOM.artworkReflection) {

        DOM.artworkReflection.style.opacity =
            (
                0.07 +
                energy *
                0.20
            ).toFixed(3);
    }


    if (DOM.artworkStage) {

        DOM.artworkStage.style.setProperty(
            "--art-energy",
            energy.toFixed(3)
        );


        DOM.artworkStage.style.setProperty(
            "--art-bass",
            bass.toFixed(3)
        );
    }
}


/* ============================================================
   PLAYER AURA
   ============================================================ */

function updatePlayerAura() {

    if (!DOM.playerAura) {

        return;
    }


    const scale =
        0.92 +
        STATE.energy *
        0.22 +
        STATE.beat *
        0.10;


    DOM.playerAura.style.transform =
        `scale(${scale.toFixed(3)})`;


    DOM.playerAura.style.opacity =
        (
            0.16 +
            STATE.energy *
            0.34
        ).toFixed(3);
}


/* ============================================================
   MINI BARS
   ============================================================ */

function updateMiniBars() {

    if (!DOM.miniBars) {

        return;
    }


    const bars =
        DOM.miniBars.children;


    const energy =
        STATE.energy;


    const frame =
        STATE.frame;


    for (
        let i = 0;
        i < bars.length;
        i++
    ) {

        const wave =
            (
                Math.sin(
                    frame *
                    0.10 +
                    i *
                    0.55
                ) +
                1
            ) *
            0.5;


        const height =
            10 +
            wave *
            (
                10 +
                energy *
                27
            );


        bars[i].style.height =
            `${height.toFixed(1)}px`;
    }
}


/* ============================================================
   BACKGROUND REACTION
   ============================================================ */

function updateBackgroundReaction() {

    if (!DOM.backgroundImage) {

        return;
    }


    const frame =
        STATE.frame;


    const energy =
        STATE.energy;


    const bass =
        STATE.bass;


    const x =
        Math.sin(
            frame *
            0.00075
        ) *
        (
            0.35 +
            energy *
            1.6
        );


    const y =
        Math.cos(
            frame *
            0.00090
        ) *
        (
            0.35 +
            bass *
            1.6
        );


    const scale =
        1.022 +
        energy *
        0.020;


    DOM.backgroundImage.style.transform =
        `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
}


/* ============================================================
   BEAT EFFECT
   ============================================================ */

function triggerBeat() {

    if (DOM.musicPlayer) {

        DOM.musicPlayer.classList.remove(
            "beat"
        );


        void DOM.musicPlayer.offsetWidth;


        DOM.musicPlayer.classList.add(
            "beat"
        );
    }


    if (DOM.beatFlash) {

        DOM.beatFlash.style.opacity =
            (
                0.06 +
                STATE.beat *
                0.12
            ).toFixed(3);
    }


    if (DOM.bassWave) {

        DOM.bassWave.classList.remove(
            "pulse"
        );


        void DOM.bassWave.offsetWidth;


        DOM.bassWave.classList.add(
            "pulse"
        );
    }
}


/* ============================================================
   PARTICULAS
   ============================================================ */

function setupParticles() {

    if (!DOM.particleLayer) {

        return;
    }


    const particles =
        DOM.particleLayer.querySelectorAll(
            ".particle"
        );


    particles.forEach(
        (
            particle,
            index
        ) => {

            particle.dataset.index =
                index;


            particle.style.setProperty(
                "--particle-delay",
                `${index * -0.37}s`
            );


            particle.style.setProperty(
                "--particle-x",
                `${(index * 47) % 100}%`
            );


            particle.style.setProperty(
                "--particle-y",
                `${(index * 31) % 100}%`
            );
        }
    );
}


/* ============================================================
   ANIMACIÓN PRINCIPAL OPTIMIZADA
   ============================================================ */

function startAnimation() {

    if (STATE.raf) {

        cancelAnimationFrame(
            STATE.raf
        );
    }


    STATE.lastTimestamp =
        performance.now();


    const loop =
        timestamp => {

            STATE.raf =
                requestAnimationFrame(
                    loop
                );


            STATE.frame++;


            const delta =
                timestamp -
                STATE.lastTimestamp;


            STATE.lastTimestamp =
                timestamp;


            if (
                delta > 250
            ) {

                return;
            }


            /* ================================================
               AUDIO
            ================================================= */

            if (
                timestamp -
                STATE.lastAnalysisTime >=
                1000 /
                45
            ) {

                STATE.lastAnalysisTime =
                    timestamp;


                analyzeAudio();
            }


            /* ================================================
               REACCIÓN PRINCIPAL
            ================================================= */

            if (
                timestamp -
                STATE.lastReactiveTime >=
                1000 /
                CONFIG.reactiveFPS
            ) {

                STATE.lastReactiveTime =
                    timestamp;


                updateReactiveInterface();
            }


            /* ================================================
               TEXTO DE ENERGÍA
            ================================================= */

            if (
                timestamp -
                STATE.lastEnergyTextTime >=
                100
            ) {

                STATE.lastEnergyTextTime =
                    timestamp;


                updateEnergyText();
            }


            /* ================================================
               MINI BARS
            ================================================= */

            if (
                timestamp -
                STATE.lastMiniBarTime >=
                1000 /
                30
            ) {

                STATE.lastMiniBarTime =
                    timestamp;


                updateMiniBars();
            }


            /* ================================================
               VISUALIZER
            ================================================= */

            if (
                STATE.visualizer &&
                timestamp -
                STATE.lastVisualizerTime >=
                1000 /
                CONFIG.visualizerFPS
            ) {

                STATE.lastVisualizerTime =
                    timestamp;


                drawVisualizer();
            }


            /* ================================================
               LETRAS
            ================================================= */

            if (
                STATE.playing &&
                STATE.lyrics.length
            ) {

                updateLyrics();
            }
        };


    STATE.raf =
        requestAnimationFrame(
            loop
        );
}


/* ============================================================
   TECLADO
   ============================================================ */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            const tag =
                document.activeElement?.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA"
            ) {

                return;
            }


            switch (
                event.code
            ) {

                case "Space":

                    event.preventDefault();

                    togglePlay();

                    break;


                case "ArrowRight":

                    if (DOM.musicAudio) {

                        DOM.musicAudio.currentTime =
                            Math.min(
                                DOM.musicAudio.duration || 0,
                                DOM.musicAudio.currentTime + 5
                            );

                        forceLyricsRefresh();
                    }

                    break;


                case "ArrowLeft":

                    if (DOM.musicAudio) {

                        DOM.musicAudio.currentTime =
                            Math.max(
                                0,
                                DOM.musicAudio.currentTime - 5
                            );

                        forceLyricsRefresh();
                    }

                    break;


                case "ArrowUp":

                    event.preventDefault();

                    changeVolume(
                        0.05
                    );

                    break;


                case "ArrowDown":

                    event.preventDefault();

                    changeVolume(
                        -0.05
                    );

                    break;


                case "KeyM":

                    toggleMute();

                    break;


                case "KeyL":

                    toggleLyrics();

                    break;
            }
        }
    );
}


/* ============================================================
   CHANGE VOLUME
   ============================================================ */

function changeVolume(
    amount
) {

    STATE.volume =
        Math.max(
            0,
            Math.min(
                1,
                STATE.volume +
                amount
            )
        );


    STATE.muted =
        STATE.volume === 0;


    applyVolume();

    updateVolumeUI();
}


/* ============================================================
   MEDIA SESSION
   ============================================================ */

function setupMediaSession() {

    if (
        !("mediaSession" in navigator)
    ) {

        return;
    }


    try {

        navigator.mediaSession.metadata =
            new MediaMetadata({

                title:
                    "TETO",

                artist:
                    "MUSICATETO",

                album:
                    "TETO MUSIC EXPERIENCE",

                artwork: [
                    {
                        src:
                            "teto2.png",

                        sizes:
                            "512x512",

                        type:
                            "image/png"
                    }
                ]
            });


        navigator.mediaSession.setActionHandler(
            "play",
            playAudio
        );


        navigator.mediaSession.setActionHandler(
            "pause",
            pauseAudio
        );


        navigator.mediaSession.setActionHandler(
            "seekbackward",
            () => {

                if (DOM.musicAudio) {

                    DOM.musicAudio.currentTime =
                        Math.max(
                            0,
                            DOM.musicAudio.currentTime -
                            10
                        );

                    forceLyricsRefresh();
                }
            }
        );


        navigator.mediaSession.setActionHandler(
            "seekforward",
            () => {

                if (DOM.musicAudio) {

                    DOM.musicAudio.currentTime =
                        Math.min(
                            DOM.musicAudio.duration || 0,
                            DOM.musicAudio.currentTime +
                            10
                        );

                    forceLyricsRefresh();
                }
            }
        );

    } catch (error) {

        console.warn(
            "Media Session no disponible:",
            error
        );
    }
}


/* ============================================================
   MENÚ DEL PLAYER
   ============================================================ */

const playerMenuButton =
    document.getElementById(
        "playerMenuButton"
    );


playerMenuButton?.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        DOM.musicPlayer?.classList.toggle(
            "menu-active"
        );
    }
);


/* ============================================================
   CLICK FUERA DEL MENÚ
   ============================================================ */

document.addEventListener(
    "click",
    event => {

        if (
            !DOM.musicPlayer ||
            !playerMenuButton
        ) {

            return;
        }


        if (
            !DOM.musicPlayer.contains(
                event.target
            )
        ) {

            DOM.musicPlayer.classList.remove(
                "menu-active"
            );
        }
    }
);


/* ============================================================
   TOUCH / SWIPE
   ============================================================ */

let touchStartX =
    0;


let touchStartY =
    0;


DOM.musicPlayer?.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.touches[0];


        if (!touch) {

            return;
        }


        touchStartX =
            touch.clientX;


        touchStartY =
            touch.clientY;

    },
    {
        passive: true
    }
);


DOM.musicPlayer?.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];


        if (!touch) {

            return;
        }


        const dx =
            touch.clientX -
            touchStartX;


        const dy =
            touch.clientY -
            touchStartY;


        if (
            Math.abs(dx) < 60
        ) {

            return;
        }


        if (
            Math.abs(dx) <
            Math.abs(dy)
        ) {

            return;
        }


        if (!DOM.musicAudio) {

            return;
        }


        if (
            dx < 0
        ) {

            DOM.musicAudio.currentTime =
                Math.min(
                    DOM.musicAudio.duration || 0,
                    DOM.musicAudio.currentTime +
                    10
                );

        } else {

            DOM.musicAudio.currentTime =
                Math.max(
                    0,
                    DOM.musicAudio.currentTime -
                    10
                );
        }


        forceLyricsRefresh();

    },
    {
        passive: true
    }
);


/* ============================================================
   VISIBILIDAD
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {

            DOM.musicPlayer?.classList.add(
                "page-hidden"
            );

        } else {

            DOM.musicPlayer?.classList.remove(
                "page-hidden"
            );
        }
    }
);


/* ============================================================
   REDUCED MOTION
   ============================================================ */

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


if (
    reducedMotion.matches
) {

    document.documentElement.classList.add(
        "reduced-motion"
    );
}


reducedMotion.addEventListener?.(
    "change",
    event => {

        document.documentElement.classList.toggle(
            "reduced-motion",
            event.matches
        );
    }
);


/* ============================================================
   INICIO
   ============================================================ */

function boot() {

    initialize();

    setupMediaSession();
}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        boot,
        {
            once: true
        }
    );

} else {

    boot();
}


/* ============================================================
   API GLOBAL
   ============================================================ */

window.TetoPlayer = {

    play() {

        return playAudio();
    },


    pause() {

        pauseAudio();
    },


    toggle() {

        return togglePlay();
    },


    seek(
        seconds
    ) {

        if (!DOM.musicAudio) {

            return;
        }


        const duration =
            Number.isFinite(
                DOM.musicAudio.duration
            )
                ? DOM.musicAudio.duration
                : 0;


        DOM.musicAudio.currentTime =
            Math.max(
                0,
                Math.min(
                    duration,
                    seconds
                )
            );


        forceLyricsRefresh();
    },


    volume(
        value
    ) {

        const number =
            Number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
        ) {

            return;
        }


        STATE.volume =
            Math.max(
                0,
                Math.min(
                    1,
                    number
                )
            );


        STATE.muted =
            STATE.volume === 0;


        applyVolume();

        updateVolumeUI();
    },


    getState() {

        return {

            playing:
                STATE.playing,

            volume:
                STATE.volume,

            energy:
                STATE.energy,

            bass:
                STATE.bass,

            mid:
                STATE.mid,

            treble:
                STATE.treble,

            lyric:
                STATE.currentLyric
        };
    }
};
