import songList from "./songList.js";

const fillBar = document.querySelector(".fill-bar");
const time = document.querySelector(".time");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const prog = document.querySelector(".progress-bar");
const showAnswer = document.getElementById("show-answer");
const answer = document.getElementById("answer");
const rightSign = document.querySelector(".answer p");

let song = new Audio();
let arr = randomNumber();
let currentSong = 0;
let playing = false;

// Start main JavaScript
document.addEventListener("DOMContentLoaded", () => {
  loadSong(arr[currentSong]);
  song.addEventListener("timeupdate", updateProgress);
  song.addEventListener("ended", reStart);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", nextSong);
  playBtn.addEventListener("click", togglePlayPause);
  prog.addEventListener("click", seek);
});

function loadSong(index) {
  const { src } = songList[index];
  song.src = src;
}

function updateProgress() {
  if (song.duration) {
    const pos = (song.currentTime / song.duration) * 100;
    fillBar.style.width = `${pos}%`;

    const duration = formatTime(song.duration);
    const currentTime = formatTime(song.currentTime);
    time.innerText = `${currentTime} - ${duration}`;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function togglePlayPause() {
  if (playing) {
    song.pause();
  } else {
    song.play();
  }
  playing = !playing;
  playBtn.classList.toggle("fa-pause", playing);
  playBtn.classList.toggle("fa-play", !playing);
  cover.classList.toggle("active", playing);
}

function nextSong() {
  showAnswer.innerText = `Translation:`;
  currentSong = currentSong == songList.length - 1 ? 0 : ++currentSong;
  answer.classList.remove("right");
  rightSign.style.display = `none`;
  answer.value = "";
  playMusic();
}

function prevSong() {
  currentSong = currentSong == 0 ? songList.length - 1 : --currentSong;
  answer.classList.remove("right");
  rightSign.style.display = `none`;
  answer.value = "";
  playMusic();
}

function reStart() {
  playing = true;
  togglePlayPause();
}

function playMusic() {
  loadSong(arr[currentSong]);
  song.play();
  playing = true;
  playBtn.classList.add("fa-pause");
  playBtn.classList.remove("fa-play");
  cover.classList.add("active");
}

function seek(e) {
  const pos = (e.offsetX / prog.clientWidth) * song.duration;
  song.currentTime = pos;
}
// End main JavaScript
showAnswer.addEventListener("click", () => {
  const { translation } = songList[arr[currentSong]];
  showAnswer.innerText = `Translation: ${translation}`;
});

function randomNumber() {
  let data = [];
  for (let i = 0; i < songList.length; i++) {
    let number = Math.floor(Math.random() * songList.length);
    if (data.includes(number)) {
      i--;
    } else {
      data.push(number);
    }
  }
  return data;
}

answer.addEventListener("keyup", (e) => {
  let userAnswer = e.target.value;
  checkAnswer(userAnswer);
});

function checkAnswer(word) {
  const { name } = songList[arr[currentSong]];
  if (name == word) {
    answer.classList.add("right");
    rightSign.style.display = `block`;
  }
}
