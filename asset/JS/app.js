const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8-PLAYER";

const heading = $("Header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");

const btnPlay = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomSong = $(".btn-random");
const repeatSong = $(".btn-repeat");
const playList = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Cá lớn",
            singer: "Châu Thâm",
            path: "./asset/music/song-1.mp3",
            img: "./asset/img/image-1.jpg",
        },
        {
            name: "Sóng Nổi Lên Rồi",
            singer: "Điệp Ca",
            path: "./asset/music/song-2.mp3",
            img: "./asset/img/image-2.jpg",
        },
        {
            name: "Tay Trái Chỉ Trăng",
            singer: "Châu Thâm ft Tát Đỉnh Đỉnh",
            path: "./asset/music/song-3.mp3",
            img: "./asset/img/image-3.jpg",
        },
        {
            name: "Người Theo Đuổi Ánh Sáng",
            singer: "Từ Vi",
            path: "./asset/music/song-4.mp3",
            img: "./asset/img/image-4.jpg",
        },
        {
            name: "Anh Ấy Nói",
            singer: "Từ Vi Vi",
            path: "./asset/music/song-5.mp3",
            img: "./asset/img/image-5.jpg",
        },
        {
            name: "Gió Nổi Rồi",
            singer: "Châu Thâm",
            path: "./asset/music/song-6.mp3",
            img: "./asset/img/image-6.jpg",
        },
        {
            name: "Gặp Người Đúng Lúc",
            singer: "Cao Tiến",
            path: "./asset/music/song-7.mp3",
            img: "./asset/img/image-7.jpg",
        },
        {
            name: "Giày Cao Gót Màu Đỏ",
            singer: "Luân Trang",
            path: "./asset/music/song-8.mp3",
            img: "./asset/img/image-8.jpg",
        },
        {
            name: "Nữ Nhi Tình",
            singer: "Đồng Lệ",
            path: "./asset/music/song-9.mp3",
            img: "./asset/img/image-9.jpg",
        },
        {
            name: "Yêu Người Có Ước Mơ",
            singer: "Bùi Trường Linh",
            path: "./asset/music/song-10.mp3",
            img: "./asset/img/image-10.jpg",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        console.log(this.config[key]);
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const html = this.songs.map(function (song, index) {
            return `
            <div class="song ${
                index === app.currentIndex ? "active" : ""
            }"data-index = "${index}">
            <div
                class="thumb"
                style="
                    background-image: url('${song.img}');
                "
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
                `;
        });
        playList.innerHTML = html.join("");
        randomSong.classList.toggle("active", app.isRandom);
        repeatSong.classList.toggle("active", app.isRepeat);
    },
    defineProperty: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        //Xử lý phóng to thu nhỏ
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //Xu ly CD quay va dung khi pause
        const cbThumbAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 30000, //30 giay/1 vong
                iterations: Infinity,
            }
        );
        cbThumbAnimate.pause();
        // Xử lý khi click play
        btnPlay.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            // app.isPlaying = !app.isPlaying;
            // if (app.isPlaying) {
            //     audio.play();
            //     player.classList.add("playing");
            // } else {
            //     audio.pause();
            //     player.classList.remove("playing");
            // }

            // if (audio.paused) {
            //     audio.play();
            //     player.classList.add("playing");
            // } else {
            //     audio.pause();
            //     player.classList.remove("playing");
            // }
        };
        // Khi song duoc play
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add("playing");
            cbThumbAnimate.play();
        };
        // Khi song duoc pause
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove("playing");
            cbThumbAnimate.pause();
        };
        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration != NaN) {
                const progressPercent = Math.floor(
                    (audio.currentTime * 100) / audio.duration
                );
                progress.value = progressPercent;
            }
        };
        //xu ly khi tua song
        progress.onchange = function (e) {
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        };
        //Xu ly next bai hat
        nextSong.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
        };
        //Xu ly prev bai hat
        prevSong.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
        };

        //Lang nghe su kien random
        randomSong.onclick = function () {
            app.isRandom = !app.isRandom;
            app.setConfig("isRandom", app.isRandom);
            this.classList.toggle("active", app.isRandom);
        };

        //Xu ly next song khi het bai
        audio.onended = function () {
            if (app.isRandom === true && app.isRepeat === false) {
                app.randomSong();
            } else if (app.isRandom === false && app.isRepeat === false) {
                app.nextSong();
            } else {
                audio.load();
            }
            audio.play();
        };
        //Xu ly khi lap lai bai hat
        repeatSong.onclick = function () {
            app.isRepeat = !app.isRepeat;
            app.setConfig("isRepeat", app.isRepeat);
            this.classList.toggle("active", app.isRepeat);
        };
        //Xu ly khi click vaof bai nao thi phat bai do
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                //Xu ly khi click vao bai hat
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.render();
                    app.loadCurrentSong();
                    audio.play();
                }

                //Xu ly khi click vao tuy chon
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        app.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        app.loadCurrentSong();
    },
    randomSong: function () {
        let songRandom;
        do {
            songRandom = Math.floor(Math.random() * this.songs.length);
        } while (songRandom === this.currentIndex);
        this.currentIndex = songRandom;
        this.loadCurrentSong();
    },
    loopListSong: function () {
        if (progress.value >= 100) {
            this.currentIndex++;
            this.loadCurrentSong();
            audio.play();
        }
    },

    start: function () {
        //Gan cau hinh tu config vao ung dung
        this.loadConfig();
        //Định nghĩa các thuộc tính cho object
        this.defineProperty();
        //Lắng nghe các sự kiện (DOM events)
        this.handleEvents();
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //Render playlist
        this.render();
    },
};
app.start();
