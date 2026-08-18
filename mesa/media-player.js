// ========== MEDIA PLAYER ==========
const isElectron = typeof window.electronAPI !== 'undefined';

const mpBtnOpen = document.getElementById('mp-btn-open');
const mpBtnPlay = document.getElementById('mp-btn-play');
const mpBtnStop = document.getElementById('mp-btn-stop');
const mpBtnMute = document.getElementById('mp-btn-mute');
const mpBtnLoop = document.getElementById('mp-btn-loop');
const mpTimeline = document.getElementById('mp-timeline');
const mpVolumeSlider = document.getElementById('mp-volume');
const mpVolumeLabel = document.getElementById('mp-volume-label');
const mpCurrentTime = document.getElementById('mp-current-time');
const mpTotalTime = document.getElementById('mp-total-time');
const mpFileName = document.getElementById('mp-file-name');
const mpDropZone = document.getElementById('mp-drop-zone');
const mpPlaylistEl = document.getElementById('mp-playlist');
const mpLoopStartInput = document.getElementById('mp-loop-start');
const mpBtnSetLoop = document.getElementById('mp-btn-set-loop');
const mpBtnClearLoop = document.getElementById('mp-btn-clear-loop');

let mpIsPlaying = false;
let mpIsMuted = false;
let mpIsLooping = false;
let mpCurrentFile = null;
let mpPlaylist = [];
let mpIsSeeking = false;
let mpLoopStart = 0;

function mpFormatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function mpParseTime(str) {
  const parts = str.split(':');
  if (parts.length === 2) {
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }
  return parseFloat(str) || 0;
}

function mpUpdatePlayPauseIcon(playing) {
  mpIsPlaying = playing;
  mpBtnPlay.textContent = playing ? 'PAUSE' : 'PLAY';
}

function mpSetLoopStart(time) {
  mpLoopStart = Math.max(0, time);
  mpLoopStartInput.value = mpFormatTime(mpLoopStart);
  if (isElectron) window.electronAPI.sendLoopStart(mpLoopStart);
}

function mpAddToPlaylist(filePath) {
  const name = filePath.split(/[\\/]/).pop();
  mpPlaylist.push({ name, path: filePath });
  mpRenderPlaylist();
}

function mpRenderPlaylist() {
  mpPlaylistEl.innerHTML = '';
  mpPlaylist.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item.name;
    if (item.path === mpCurrentFile) li.classList.add('active');
    li.addEventListener('click', () => {
      mpCurrentFile = item.path;
      mpFileName.textContent = item.name;
      if (isElectron) window.electronAPI.sendPlay(item.path);
      mpRenderPlaylist();
    });
    mpPlaylistEl.appendChild(li);
  });
}

function mpPlayFile(filePath) {
  mpCurrentFile = filePath;
  mpFileName.textContent = filePath.split(/[\\/]/).pop();
  const exists = mpPlaylist.find((item) => item.path === filePath);
  if (!exists) mpAddToPlaylist(filePath);
  else mpRenderPlaylist();
  if (isElectron) window.electronAPI.sendPlay(filePath);
  mpUpdatePlayPauseIcon(true);
}

if (isElectron) {
  mpBtnOpen.addEventListener('click', () => window.electronAPI.sendOpenFile());

  mpBtnPlay.addEventListener('click', () => {
    if (!mpCurrentFile) return;
    if (mpIsPlaying) {
      window.electronAPI.sendPause();
      mpUpdatePlayPauseIcon(false);
    } else {
      window.electronAPI.sendPlay(mpCurrentFile);
      mpUpdatePlayPauseIcon(true);
    }
  });

  mpBtnStop.addEventListener('click', () => {
    window.electronAPI.sendStop();
    mpUpdatePlayPauseIcon(false);
    mpTimeline.value = 0;
    mpCurrentTime.textContent = '00:00';
  });

  mpBtnMute.addEventListener('click', () => {
    mpIsMuted = !mpIsMuted;
    window.electronAPI.sendMute(mpIsMuted);
    mpBtnMute.textContent = mpIsMuted ? 'MUTED' : 'SOM';
  });

  mpBtnLoop.addEventListener('click', () => {
    mpIsLooping = !mpIsLooping;
    window.electronAPI.sendLoop(mpIsLooping);
    mpBtnLoop.style.background = mpIsLooping ? '#fff' : '';
    mpBtnLoop.style.color = mpIsLooping ? '#000' : '';
  });

  mpBtnSetLoop.addEventListener('click', () => {
    const duration = parseFloat(mpTimeline.dataset.duration || 0);
    if (duration > 0) mpSetLoopStart((parseFloat(mpTimeline.value) / 100) * duration);
  });

  mpBtnClearLoop.addEventListener('click', () => mpSetLoopStart(0));

  mpLoopStartInput.addEventListener('change', () => {
    mpSetLoopStart(mpParseTime(mpLoopStartInput.value));
  });

  mpTimeline.addEventListener('input', () => { mpIsSeeking = true; });
  mpTimeline.addEventListener('change', () => {
    const time = (mpTimeline.value / 100) * parseFloat(mpTimeline.dataset.duration || 0);
    window.electronAPI.sendSeek(time);
    mpIsSeeking = false;
  });

  mpVolumeSlider.addEventListener('input', () => {
    const vol = parseFloat(mpVolumeSlider.value);
    window.electronAPI.sendVolume(vol);
    mpVolumeLabel.textContent = `${Math.round(vol * 100)}%`;
  });

  window.electronAPI.onFileSelected((filePath) => mpPlayFile(filePath));
  window.electronAPI.onTimeUpdate((data) => {
    if (!mpIsSeeking && data.duration > 0) {
      mpTimeline.value = (data.currentTime / data.duration) * 100;
      mpTimeline.dataset.duration = data.duration;
      mpCurrentTime.textContent = mpFormatTime(data.currentTime);
    }
  });
  window.electronAPI.onDuration((duration) => {
    mpTotalTime.textContent = mpFormatTime(duration);
    mpTimeline.dataset.duration = duration;
  });
  window.electronAPI.onEnded(() => {
    mpUpdatePlayPauseIcon(false);
    mpTimeline.value = 0;
    mpCurrentTime.textContent = mpFormatTime(mpLoopStart);
  });
  window.electronAPI.onPlaying(() => mpUpdatePlayPauseIcon(true));
  window.electronAPI.onPaused(() => mpUpdatePlayPauseIcon(false));
} else {
  mpBtnOpen.style.opacity = '0.3';
  mpBtnOpen.style.pointerEvents = 'none';
  mpBtnPlay.style.opacity = '0.3';
  mpBtnPlay.style.pointerEvents = 'none';
  mpBtnStop.style.opacity = '0.3';
  mpBtnStop.style.pointerEvents = 'none';
  mpFileName.textContent = 'Player disponivel apenas no modo desktop';
}

// Drag & Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  mpDropZone.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); });
});
mpDropZone.addEventListener('dragenter', () => mpDropZone.classList.add('drag-over'));
mpDropZone.addEventListener('dragover', () => mpDropZone.classList.add('drag-over'));
mpDropZone.addEventListener('dragleave', () => mpDropZone.classList.remove('drag-over'));
mpDropZone.addEventListener('drop', (e) => {
  mpDropZone.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].path) mpPlayFile(files[0].path);
});
