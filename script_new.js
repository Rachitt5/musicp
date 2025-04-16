class MusicPlayer { 
    constructor() { 
        this.currentSongIndex = 0; 
        this.isPlaying = true; // Start playing 
        this.progress = 0; 
        this.heartCount = 2; // Start with 2 hearts filled 
        this.currentBackground = 1; 
ECHO is on.
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
ECHO is on.
        this.songs = [ 
            { 
                title: "Espresso", 
                artist: "Sabrina Carpenter", 
                albumArt: "images/f204ddf0c4fc5e6c1911d3334c3268cb.jpg", 
                duration: 199, 
                mood: "energetic", 
                theme: "brown", 
                labelText: "espresso" 
            }, 
            { 
                title: "Please Please Please", 
                artist: "Sabrina Carpenter", 
                albumArt: "images/631e05ee97c45dc727ad9496120e6479.jpg", 
                duration: 178, 
                mood: "emotional", 
                theme: "blue", 
                labelText: "please" 
            }, 
            { 
                title: "The Real Slim Shady", 
                artist: "Eminem", 
                albumArt: "images/e8d8a622d9a7b9d210f8bb4aed1e32b6.jpg", 
                duration: 284, 
                mood: "intense", 
                theme: "blue", 
                labelText: "slim" 
            } 
        ]; 
