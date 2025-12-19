// 音乐数据
const musicList = [
    {
        id: 1,
        name: "洛春赋",
        singer: "李洁",
        cover: "./img/record0.jpg",
        src: "./mp3/music0.mp3",
        mv: "./mv/video0.mp4" // 本地MV文件
    },
    {
        id: 2,
        name: "烟雨归期",
        singer: "李洁",
        cover: "./img/record1.jpg",
        src: "./mp3/music1.mp3",
        mv: "./mv/video1.mp4"
    },
    {
        id: 3,
        name: "人间白首",
        singer: "李洁",
        cover: "./img/record2.jpg",
        src: "./mp3/music2.mp3",
        mv: "./mv/video2.mp4"
    },
    {
        id: 4,
        name: "故里逢春",
        singer: "李洁",
        cover: "./img/record3.jpg",
        src: "./mp3/music3.mp3",
        mv: "./mv/video3.mp4"
    }
];

// DOM元素
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar'); // ID未变
const progressActive = document.getElementById('progressActive'); // ID未变
const timeDisplay = document.getElementById('timeDisplay'); // ID未变
const musicTitle = document.getElementById('musicTitle'); // ID未变
const musicAuthor = document.getElementById('musicAuthor'); // ID未变
const recordImg = document.getElementById('recordImg'); // ID未变
const playlistBtn = document.getElementById('playlistBtn'); // ID未变
const playlistContainer = document.getElementById('playlistContainer'); // ID未变
const playlistList = document.getElementById('playlistList'); // ID未变
const speedBtn = document.getElementById('speedBtn'); // ID未变
const mvBtn = document.getElementById('mvBtn'); // ID未变
const mvModal = document.getElementById('mvModal'); // ID未变
const mvPlayer = document.getElementById('mvPlayer'); // ID未变

// 状态变量
let currentIndex = 0;
let isPlaying = false;
let playbackSpeed = 1.0;

// 初始化播放器
function initPlayer() {
    loadMusic(currentIndex);
    renderPlaylist();
    setupEvents();
}

// 加载音乐
function loadMusic(index) {
    const music = musicList[index];
    audioPlayer.src = music.src;
    musicTitle.textContent = music.name;
    musicAuthor.textContent = `作者：${music.singer}`;
    recordImg.style.backgroundImage = `url(${music.cover})`;
    updatePlaylistActive();
}

// 播放/暂停切换
function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.textContent = "▶";
    } else {
        audioPlayer.play();
        playIcon.textContent = "❚❚";
    }
    isPlaying = !isPlaying;
}

// 上一曲
function playPrev() {
    currentIndex = (currentIndex - 1 + musicList.length) % musicList.length;
    loadMusic(currentIndex);
    if (isPlaying) audioPlayer.play();
}

// 下一曲
function playNext() {
    currentIndex = (currentIndex + 1) % musicList.length;
    loadMusic(currentIndex);
    if (isPlaying) audioPlayer.play();
}

// 更新进度条
function updateProgress() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
    progressActive.style.width = `${percent}%`;
    timeDisplay.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
}

// 格式化时间
function formatTime(time) {
    const min = Math.floor(time / 60).toString().padStart(2, '0');
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

// 渲染播放列表
function renderPlaylist() {
    playlistList.innerHTML = '';
    musicList.forEach((music, index) => {
        const li = document.createElement('li');
        // 原：playlist-item ${index === currentIndex ? 'active' : ''}
        li.className = `playlist-item ${index === currentIndex ? 'playing' : ''}`;
        li.dataset.index = index;
        li.innerHTML = `<div>${music.name}</div><div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">${music.singer}</div>`;
        li.addEventListener('click', () => {
            currentIndex = index;
            loadMusic(index);
            if (isPlaying) audioPlayer.play();
        });
        playlistList.appendChild(li);
    });
}

// 更新播放列表选中状态
function updatePlaylistActive() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('playing', index === currentIndex);
    });
}

// 切换播放速度
function toggleSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5];
    playbackSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    audioPlayer.playbackRate = playbackSpeed;
    speedBtn.textContent = `${playbackSpeed}X`;
}

// 播放MV
function playMV() {
    const currentMV = musicList[currentIndex].mv;
    mvPlayer.src = currentMV;
    mvModal.style.display = 'flex';
    mvPlayer.play();

    // 暂停音乐播放
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.textContent = "▶";
        isPlaying = false;
    }
}

// 关闭MV
function closeMV() {
    mvModal.style.display = 'none';
    mvPlayer.pause();
    mvPlayer.src = '';
}

// 绑定事件
function setupEvents() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    playlistBtn.addEventListener('click', () => playlistContainer.classList.toggle('active'));
    speedBtn.addEventListener('click', toggleSpeed);
    mvBtn.addEventListener('click', playMV);

    progressBar.addEventListener('click', (e) => {
        const pos = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        audioPlayer.currentTime = pos * audioPlayer.duration;
    });

    // 点击MV弹窗外区域关闭
    mvModal.addEventListener('click', (e) => {
        if (e.target === mvModal) {
            closeMV();
        }
    });
}

// 初始化
initPlayer();