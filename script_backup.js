class MusicPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = true; // Start playing
        this.progress = 0;
        this.heartCount = 2; // Start with 2 hearts filled
        this.currentBackground = 1;
        
        // DOM Elements
        this.albumArt = document.getElementById('albumArt');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.querySelector('.progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.hearts = document.querySelectorAll('.hearts i');
        this.vinylDisc = document.querySelector('.vinyl-disc');
        this.vinylLabel = document.querySelector('.vinyl-label');
        this.albumArtContainer = document.querySelector('.album-art');
        this.backgrounds = document.querySelectorAll('.background-overlay');
        
        this.songs = [
            {
                title: "Espresso",
                artist: "Sabrina Carpenter",
                albumArt: "images/espresso.jpg",
                duration: 199,
                mood: "energetic",
                theme: "brown",
                labelText: "espresso"
            },
            {
                title: "Please Please Please",
                artist: "Sabrina Carpenter",
                albumArt: "images/please.jpg",
                duration: 178,
                mood: "emotional",
                theme: "blue",
                labelText: "please"
            },
            {
                title: "The Real Slim Shady",
                artist: "Eminem",
                albumArt: "images/slimshady.jpg",
                duration: 284,
                mood: "intense",
                theme: "blue",
                labelText: "slim"
            }
        ];

        this.initializeEventListeners();
        this.loadSong(this.currentSongIndex);
        
        // Start playing automatically
        this.startProgressSimulation();
        this.vinylDisc.classList.add('playing');
        
        // Add hover effect for vinyl reveal
        this.albumArtContainer.addEventListener('mouseenter', () => {
            this.albumArtContainer.classList.add('open');
            if (this.isPlaying) {
                this.vinylDisc.style.animationDuration = '1.8s';
            }
        });
        
        this.albumArtContainer.addEventListener('mouseleave', () => {
            this.albumArtContainer.classList.remove('open');
            if (this.isPlaying) {
                this.vinylDisc.style.animationDuration = '4s';
            }
        });
    }

    initializeEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            const progressBar = e.currentTarget;
            const clickPosition = e.offsetX;
            const progressBarWidth = progressBar.offsetWidth;
            this.progress = (clickPosition / progressBarWidth) * 100;
            this.updateProgress();
        });

        this.hearts.forEach((heart, index) => {
            heart.addEventListener('click', () => this.toggleHeart(index));
        });
        
        document.querySelector('.menu-btn').addEventListener('click', () => {
            alert('"Is it that sweet? I guess so..." 🎵');
        });
    }

    loadSong(index) {
        const song = this.songs[index];
        this.albumArt.src = song.albumArt;
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.totalTimeEl.textContent = this.formatTime(song.duration);
        this.progress = 0;
        this.updateProgress();
        
        // Update vinyl label
        this.vinylLabel.textContent = song.labelText;
        
        // Set theme
        if (song.theme === "blue") {
            document.body.classList.add('blue-theme');
        } else {
            document.body.classList.remove('blue-theme');
        }
        
        // Update background with smooth transition
        this.backgrounds.forEach(bg => {
            bg.style.opacity = "0";
            bg.style.transition = "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
        });
        const nextBg = (index % this.backgrounds.length) + 1;
        setTimeout(() => {
            document.querySelector(`.background-${nextBg}`).style.opacity = index === 0 ? "0.3" : "0.2";
        }, 50);
        
        // Reset vinyl animation
        if (this.isPlaying) {
            this.vinylDisc.classList.add('playing');
            this.albumArtContainer.classList.remove('open');
        } else {
            this.vinylDisc.classList.remove('playing');
        }
        
        // Add theme transition effect
        document.body.classList.add('changing');
        setTimeout(() => {
            document.body.classList.remove('changing');
        }, 500);
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.startProgressSimulation();
            this.vinylDisc.classList.add('playing');
        } else {
            this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.stopProgressSimulation();
            this.vinylDisc.classList.remove('playing');
        }
    }

    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.startProgressSimulation();
        }
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(this.currentSongIndex);
        if (this.isPlaying) {
            this.startProgressSimulation();
        }
    }

    startProgressSimulation() {
        this.stopProgressSimulation();
        const duration = this.songs[this.currentSongIndex].duration;
        const increment = 100 / (duration * 10);
        
        this.progressInterval = setInterval(() => {
            this.progress += increment;
            if (this.progress >= 100) {
                this.progress = 0;
                this.nextSong();
            }
            this.updateProgress();
        }, 100);
    }

    stopProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    updateProgress() {
        this.progressBar.style.width = `${this.progress}%`;
        const duration = this.songs[this.currentSongIndex].duration;
        const currentTime = (duration * this.progress) / 100;
        this.currentTimeEl.textContent = this.formatTime(Math.floor(currentTime));
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    toggleHeart(index) {
        const heart = this.hearts[index];
        const isActive = heart.classList.contains('fas');
        
        if (isActive) {
            heart.classList.remove('fas');
            heart.classList.add('far');
            this.heartCount--;
        } else {
            if (this.heartCount < index + 1) {
                for (let i = 0; i <= index; i++) {
                    this.hearts[i].classList.remove('far');
                    this.hearts[i].classList.add('fas');
                }
                this.heartCount = index + 1;
            } else {
                for (let i = index + 1; i < this.hearts.length; i++) {
                    this.hearts[i].classList.remove('fas');
                    this.hearts[i].classList.add('far');
                }
                this.heartCount = index + 1;
            }
        }
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
}); 