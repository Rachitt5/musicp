class MusicPlayer {
    constructor() {
        this.currentSongIndex = 0;
        this.isPlaying = true; // Start playing
        this.progress = 0;
        this.heartCount = 2; // Start with 2 hearts filled
        this.currentBackground = 1;
        this.showingPlaylist = false;
         
        // DOM Elements
        this.albumArt = document.getElementById('albumArt');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.leftBtn = document.getElementById('leftBtn');
        this.progressBar = document.querySelector('.progress');
        this.progressContainer = document.querySelector('.progress-bar');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.hearts = document.querySelectorAll('.hearts i');
        this.vinylDisc = document.querySelector('.vinyl-disc');
        this.vinylLabel = document.querySelector('.vinyl-label');
        this.albumArtContainer = document.querySelector('.album-art');
        this.backgrounds = document.querySelectorAll('.background-overlay');
        this.volumeKnob = document.getElementById('volumeKnob');
        this.vinylOpenBtn = document.getElementById('vinylOpenBtn');
        
        // Volume control
        this.currentVolume = 0.7; // Default volume 70%
        this.volumeKnob.style.transform = `rotate(${this.currentVolume * 270 - 135}deg)`;
        
        // Last heart animation time to avoid too many hearts
        this.lastHeartTime = Date.now();
        
        this.songs = [
            {
                title: "Espresso",
                artist: "Sabrina Carpenter",
                albumArt: "images/slimshady.jpg",
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
                albumArt: "images/espresso.jpg",
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
        
        // Remove any previous click handlers from album art
        this.albumArtContainer.style.cursor = 'default';
        
        // Add click effect for vinyl open button
        this.vinylOpenBtn.addEventListener('click', () => {
            this.toggleVinylOpen();
        });
        
        // Left button handler
        this.leftBtn.addEventListener('click', () => {
            this.togglePlaylist();
        });
        
        // Volume knob control
        let isDragging = false;
        let startAngle = 0;
        
        this.volumeKnob.addEventListener('mousedown', (e) => {
            isDragging = true;
            const knobRect = this.volumeKnob.getBoundingClientRect();
            const knobCenterX = knobRect.left + knobRect.width / 2;
            const knobCenterY = knobRect.top + knobRect.height / 2;
            startAngle = Math.atan2(e.clientY - knobCenterY, e.clientX - knobCenterX);
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.removeEventListener('mousemove', handleDrag);
            });
        });
        
        const handleDrag = (e) => {
            if (!isDragging) return;
            const knobRect = this.volumeKnob.getBoundingClientRect();
            const knobCenterX = knobRect.left + knobRect.width / 2;
            const knobCenterY = knobRect.top + knobRect.height / 2;
            const currentAngle = Math.atan2(e.clientY - knobCenterY, e.clientX - knobCenterX);
            const angleDiff = currentAngle - startAngle;
            startAngle = currentAngle;
            
            // Update volume (0-1)
            this.currentVolume = Math.min(1, Math.max(0, this.currentVolume + angleDiff / Math.PI / 2));
            this.volumeKnob.style.transform = `rotate(${this.currentVolume * 270 - 135}deg)`;
            
            // Visual feedback
            const brightness = 0.5 + this.currentVolume * 0.5;
            this.volumeKnob.style.filter = `brightness(${brightness})`;
            
            // Apply volume if we had actual audio
            console.log(`Volume set to ${Math.round(this.currentVolume * 100)}%`);
        };
    }

    // Add method to toggle vinyl open state
    toggleVinylOpen() {
        let isAnimating = false;
        if (isAnimating) return; // Prevent multiple clicks during animation
        
        isAnimating = true;
        this.albumArtContainer.classList.toggle('open');
        this.vinylOpenBtn.classList.toggle('open');
        
        if (this.albumArtContainer.classList.contains('open')) {
            // Always make vinyl spin when album art is open
            this.vinylDisc.classList.add('playing');
            this.vinylDisc.style.animationDuration = '2s';
        } else {
            if (!this.isPlaying) {
                this.vinylDisc.classList.remove('playing');
            } else {
                this.vinylDisc.style.animationDuration = '4s';
            }
        }
        
        // Reset animation lock after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 800);
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
            
            // Add heart at click position
            this.addHeartToProgress(clickPosition, progressBar);
        });

        this.hearts.forEach((heart) => {
            heart.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.toggleHeart(index);
            });
        });

        document.querySelector('.menu-btn').addEventListener('click', () => {
            alert('"Is it that sweet? I guess so..." 🎵');
        });
    }
    
    // Improved heart animation for progress bar
    addHeartToProgress(x, progressBar) {
        // Limit heart creation rate
        const now = Date.now();
        if (now - this.lastHeartTime < 200) return;
        this.lastHeartTime = now;
        
        // Create multiple hearts for more glitter effect
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('i');
            heart.className = 'fas fa-heart progress-heart';
            // Add slight randomness to position
            const randomX = x + (Math.random() * 20 - 10);
            heart.style.left = `${randomX}px`;
            heart.style.bottom = '0';
            // Random sizes for more dynamic effect
            const randomSize = 10 + Math.random() * 8;
            heart.style.fontSize = `${randomSize}px`;
            
            progressBar.appendChild(heart);
            
            // Remove heart after animation completes
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }
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
        } else {
            this.vinylDisc.classList.remove('playing');
        }
        
        // Close album cover when switching songs
        this.albumArtContainer.classList.remove('open');
        this.vinylOpenBtn.classList.remove('open');
        
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
            
            // Increased chance of heart animation (20% chance)
            if (Math.random() < 0.2 && this.isPlaying) {
                const progressWidth = this.progressContainer.offsetWidth;
                const heartPosition = (this.progress / 100) * progressWidth;
                this.addHeartToProgress(heartPosition, this.progressContainer);
            }
            
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
        // Reset all hearts
        this.hearts.forEach((heart, i) => {
            if (i <= index) {
                heart.classList.remove('far');
                heart.classList.add('fas');
            } else {
                heart.classList.remove('fas');
                heart.classList.add('far');
            }
        });
        
        // Store heart count
        this.heartCount = index + 1;
        
        // Show rating message
        const ratings = ["Nice!", "Great!", "Favorite!"];
        const message = ratings[index];
        
        // Create and show a floating message
        const ratingMsg = document.createElement('div');
        ratingMsg.className = 'rating-message';
        ratingMsg.textContent = message;
        ratingMsg.style.position = 'absolute';
        ratingMsg.style.left = '50%';
        ratingMsg.style.top = '50%';
        ratingMsg.style.transform = 'translate(-50%, -50%)';
        ratingMsg.style.color = '#ffffff';
        ratingMsg.style.fontSize = '1.2rem';
        ratingMsg.style.fontWeight = 'bold';
        ratingMsg.style.textShadow = '0 0 10px rgba(232, 62, 140, 0.7)';
        ratingMsg.style.zIndex = '10';
        ratingMsg.style.opacity = '0';
        ratingMsg.style.transition = 'all 0.5s ease';
        
        document.querySelector('.hearts').appendChild(ratingMsg);
        
        // Animate the message
        setTimeout(() => {
            ratingMsg.style.opacity = '1';
            ratingMsg.style.transform = 'translate(-50%, -100%)';
        }, 10);
        
        setTimeout(() => {
            ratingMsg.style.opacity = '0';
            ratingMsg.style.transform = 'translate(-50%, -150%)';
        }, 1000);
        
        setTimeout(() => {
            ratingMsg.remove();
        }, 1500);
    }
    
    togglePlaylist() {
        this.showingPlaylist = !this.showingPlaylist;
        
        if (this.showingPlaylist) {
            // Create playlist panel if it doesn't exist
            if (!document.querySelector('.playlist-panel')) {
                const playlistPanel = document.createElement('div');
                playlistPanel.className = 'playlist-panel';
                playlistPanel.style.position = 'absolute';
                playlistPanel.style.bottom = '100px';
                playlistPanel.style.left = '20px';
                playlistPanel.style.backgroundColor = 'rgba(20, 10, 40, 0.8)';
                playlistPanel.style.borderRadius = '12px';
                playlistPanel.style.padding = '15px';
                playlistPanel.style.maxWidth = '70%';
                playlistPanel.style.backdropFilter = 'blur(10px)';
                playlistPanel.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                playlistPanel.style.transform = 'translateY(20px)';
                playlistPanel.style.opacity = '0';
                playlistPanel.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                playlistPanel.style.zIndex = '10';
                
                // Create song list
                const songList = document.createElement('ul');
                songList.style.listStyle = 'none';
                songList.style.padding = '0';
                
                this.songs.forEach((song, index) => {
                    const songItem = document.createElement('li');
                    songItem.style.display = 'flex';
                    songItem.style.alignItems = 'center';
                    songItem.style.padding = '8px 0';
                    songItem.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
                    songItem.style.cursor = 'pointer';
                    songItem.style.transition = 'all 0.2s ease';
                    
                    // Add current song indicator
                    if (index === this.currentSongIndex) {
                        songItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        songItem.style.borderRadius = '6px';
                        songItem.style.padding = '8px 10px';
                    }
                    
                    // Add thumbnail
                    const thumb = document.createElement('div');
                    thumb.style.width = '40px';
                    thumb.style.height = '40px';
                    thumb.style.borderRadius = '6px';
                    thumb.style.overflow = 'hidden';
                    thumb.style.marginRight = '10px';
                    
                    const img = document.createElement('img');
                    img.src = song.albumArt;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    
                    thumb.appendChild(img);
                    songItem.appendChild(thumb);
                    
                    // Add song info
                    const info = document.createElement('div');
                    
                    const title = document.createElement('div');
                    title.textContent = song.title;
                    title.style.color = '#fff';
                    title.style.fontSize = '0.9rem';
                    title.style.fontWeight = 'bold';
                    
                    const artist = document.createElement('div');
                    artist.textContent = song.artist;
                    artist.style.color = 'rgba(255, 255, 255, 0.7)';
                    artist.style.fontSize = '0.8rem';
                    
                    info.appendChild(title);
                    info.appendChild(artist);
                    songItem.appendChild(info);
                    
                    // Add click handler
                    songItem.addEventListener('click', () => {
                        this.currentSongIndex = index;
                        this.loadSong(index);
                        if (this.isPlaying) {
                            this.startProgressSimulation();
                        }
                        this.togglePlaylist(); // Close playlist after selection
                    });
                    
                    // Add hover effect
                    songItem.addEventListener('mouseenter', () => {
                        if (index !== this.currentSongIndex) {
                            songItem.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }
                    });
                    
                    songItem.addEventListener('mouseleave', () => {
                        if (index !== this.currentSongIndex) {
                            songItem.style.backgroundColor = 'transparent';
                        }
                    });
                    
                    songList.appendChild(songItem);
                });
                
                playlistPanel.appendChild(songList);
                document.querySelector('.player-box').appendChild(playlistPanel);
                
                // Animate in
                setTimeout(() => {
                    playlistPanel.style.opacity = '1';
                    playlistPanel.style.transform = 'translateY(0)';
                }, 10);
            } else {
                // Show existing panel
                const playlistPanel = document.querySelector('.playlist-panel');
                playlistPanel.style.display = 'block';
                setTimeout(() => {
                    playlistPanel.style.opacity = '1';
                    playlistPanel.style.transform = 'translateY(0)';
                }, 10);
            }
            
            // Update left button appearance
            this.leftBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            // Hide panel
            const playlistPanel = document.querySelector('.playlist-panel');
            if (playlistPanel) {
                playlistPanel.style.opacity = '0';
                playlistPanel.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    playlistPanel.style.display = 'none';
                }, 300);
            }
            
            // Restore left button appearance
            this.leftBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
}); 