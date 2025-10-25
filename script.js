console.log("Welocme to Dhun(a spotify clone)");
let on_click_go_home = document.querySelectorAll(".click-to-home");
for (const a of on_click_go_home) {
   a.addEventListener('click', () => {
      location.href = "index.html"
   })
}
document.querySelector(".sign").addEventListener('click', () => {
   window.open("https://www.spotify.com/in-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F", "_blank");
})
document.querySelector(".log").addEventListener('click', () => {
   window.open("https://accounts.spotify.com/en/v2/login?continue=https%3A%2F%2Fopen.spotify.com%2F", "_blank");
})

let playbutton = document.querySelectorAll(".album-img");
for (const a of playbutton) {
   a.addEventListener('mouseenter', () => {
      a.nextElementSibling.style.opacity = 1;
      a.nextElementSibling.style.transform = 'translateY(-7.5%)';
   })
   a.addEventListener('mouseleave', () => {
      a.nextElementSibling.style.opacity = 0;
      a.nextElementSibling.style.transform = 'translateY(+25%)';
   })
   a.nextElementSibling.addEventListener('mouseenter', () => {
      a.nextElementSibling.style.opacity = 1;
      a.nextElementSibling.style.transform = 'translateY(-25.5%)';
   })
   a.nextElementSibling.addEventListener('mouseleave', () => {
      a.nextElementSibling.style.opacity = 1;
      a.nextElementSibling.style.transform = 'translateY(-25.5%)';
   })
}

// Get all song file paths
async function getSongs(folder) {
   let a = await fetch(`http://192.168.0.105:8000/songs/${folder}/`);
   let resoponce = await a.text();
   // console.log(resoponce);
   let tempDiv = document.createElement("div");
   tempDiv.innerHTML = resoponce;
   let anchors = tempDiv.querySelectorAll("ul li a");
   let Songs = [];
   anchors.forEach(a => {
      if (a.href.endsWith(".mp3")) {
         Songs.push("http://192.168.0.105:8000/" + `songs/${folder}/` + a.getAttribute("href"));
      }
   });
   return Songs;
}

// Global state
let currentfolder = "hindi";
let songNumber = 0;
let audio = new Audio();

// UI buttons
const playContainer = document.querySelector(".play_song_container");
const playBtn = playContainer.children[0];
const pauseBtn = playContainer.children[1];
const previousBtn = document.querySelector(".previous_song");
const nextBtn = document.querySelector(".next_song");
const seakbar = document.querySelector(".seakbar");
const seakbar_ball = document.querySelector(".seakbar").querySelector(".circle");
const hamburger = document.querySelector(".hamburger");

// Default button states
function setPlayButton(active) {
   if (active) {
      playBtn.style.opacity = 1;
      playBtn.style.pointerEvents = "auto";
      pauseBtn.style.opacity = 0;
      pauseBtn.style.pointerEvents = "none";
   } else {
      playBtn.style.opacity = 0;
      playBtn.style.pointerEvents = "none";
      pauseBtn.style.opacity = 1;
      pauseBtn.style.pointerEvents = "auto";
   }
}
setPlayButton(true);//this is deafult case in start all pause

// Get song names (remove path + extension)
async function getSongNames() {
   let songs = await getSongs(currentfolder);
   return songs.map(path => {
      return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".mp3")).replaceAll("%20", " ");
   });
}

// List songs in UI
async function listSongs() {
   const songNames = await getSongNames();
   const songList = document.querySelector(".songlist");
   songList.innerHTML = "";

   songNames.forEach((name, i) => {
      const element = `
      <div class="playcard playcard${i}">
        <img src="assets/song_icon.svg" alt="">
        <div class="song_info">
          <li>${name}</li>
          <li class="to_my_git_profile" >SachinYadavAug20</li>
        </div>
        <img class="play_it_now" data-index="${i}" src="assets/play.svg" alt="play">
      </div>`;
      songList.innerHTML += element;
   });
}

// Pause current song
function pauseSong() {
   audio.pause();
   setPlayButton(true);
}

// Play selected song
async function playSong(index) {
   const songNames = await getSongNames();
   let songs = await getSongs(currentfolder);
   songNumber = index;
   audio.src = songs[songNumber];
   audio.play();
   setPlayButton(false);

   const timeInfo = document.querySelector(".timeduration");
   const songInfo = document.querySelector(".songinfo");
   songInfo.textContent = songNames[songNumber];

   audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      const totalMin = String(Math.floor(duration / 60)).padStart(2, "0");
      const totalSec = String(Math.floor(duration % 60)).padStart(2, "0");
      const totalTime = `${totalMin}:${totalSec}`;

      audio.addEventListener("timeupdate", () => {
         const current = audio.currentTime;
         const total = audio.duration;
         const curMin = String(Math.floor(current / 60)).padStart(2, "0");
         const curSec = String(Math.floor(current % 60)).padStart(2, "0");
         timeInfo.textContent = `${curMin}:${curSec} / ${totalTime}`;
         const _completion = (current / total) * 100;
         seakbar_ball.style.left = `${_completion - 1}%`
         seakbar_ball.previousElementSibling.style.width = `${_completion}%`
      });
   });
   //eventlisterner for seakbar to have resoponce and forword and backord moves
   seakbar.addEventListener("click", (e) => {
      console.log(e.offsetX, e.target.getBoundingClientRect().width, e);
      //bounding rectangle's width is total possible width and offsetX is the x where clicked
      let where_clicked_percent = ((e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width) * 100;
      console.log(where_clicked_percent);
      audio.currentTime = (audio.duration * (where_clicked_percent)) / 100;
   })
}

// Initialize player buttons
async function setupPlayerControls() {
   let songs = await getSongs(currentfolder);
   playBtn.addEventListener("click", () => {
      if (audio.src) {
         audio.play();
         setPlayButton(false);
      } else {
         playSong(songNumber);
      }
   });

   pauseBtn.addEventListener("click", pauseSong);
   previousBtn.addEventListener("click", () => {
      songNumber--;
      console.log(songNumber)
      if (songNumber == -1) {
         songNumber = songs.length - 1;
      }
      console.log(songNumber)
      playSong(songNumber)
   })
   nextBtn.addEventListener("click", () => {
      songNumber++;
      console.log(songNumber)
      if (songNumber == songs.length) {
         songNumber = 0;
      }
      console.log(songNumber)
      playSong(songNumber);
   })
}

// Detect user song clicks
function setupSongChoice() {
   document.querySelector(".songlist").addEventListener("click", e => {
      if (e.target.classList.contains("play_it_now")) {
         const index = parseInt(e.target.dataset.index);
         pauseSong();
         playSong(index);
      }
   });
}
let hamburger_status = false;
hamburger.addEventListener("click", () => {
   if (hamburger_status == false) {
      document.querySelector(".left").style.transform = `translateX(${0}%)`;
      document.querySelector(".left").style.width = `7000vw`;
      document.querySelector(".right").style.width = `140px`;
      document.querySelector(".right").style.overflow = `hidden`;
      document.querySelector(".playmenu").style.left = '2%';
      document.querySelector(".playmenu").style.width = `90%`;
      document.querySelector(".hamburger").firstElementChild.style.opacity = 0;
      document.querySelector(".hamburger").lastElementChild.style.opacity = 1;
      hamburger_status = true;
   }
   else if (hamburger_status == true) {
      document.querySelector(".left").style.transform = `translateX(${-150}%)`;
      document.querySelector(".left").style.width = `20vw`;
      document.querySelector(".right").style.width = `10000%`;
      document.querySelector(".right").style.overflow = `hidden`;
      document.querySelector(".playmenu").style.left = '2%';
      document.querySelector(".playmenu").style.width = `90%`;
      document.querySelector(".hamburger").lastElementChild.style.opacity = 0;
      document.querySelector(".hamburger").firstElementChild.style.opacity = 1;
      hamburger_status = false;

   }
})
if (hamburger.style.display != "none") {
   document.querySelector(".searchBox").firstElementChild.addEventListener("focus", () => {
      document.querySelector(".usr-in").style.display = "none";
   })
   document.querySelector(".searchBox").firstElementChild.addEventListener("blur", () => {
      document.querySelector(".usr-in").style.display = "flex";
   })

}

listSongs();
document.querySelectorAll(".to_my_git_profile").forEach((a) => {
   a.addEventListener("click", () => {
      window.open("https://github.com/SachinyadavAug20/Dhun", "_blank");
   }
   )
});

setupPlayerControls();
setupSongChoice();
let volumeSeakBar = document.querySelector(".volume_control").firstElementChild, volumeSeakBar_visibe = false, muted = false;
document.querySelector(".volumeBtn123").addEventListener("click", (e) => {

   if (volumeSeakBar_visibe == false) {
      volumeSeakBar.style.display = "block";
      volumeSeakBar_visibe = true;
      e.target.src = e.target.src.replace("volume_icon.svg", "volume0.svg");
      console.log(volumeSeakBar);
      volumeSeakBar.value = 0;
      audio.volume = 0;
   }
   else if (volumeSeakBar_visibe == true) {
      volumeSeakBar.value = 10;
      audio.volume = 0.1;
      e.target.src = e.target.src.replace("volume0.svg", "volume_icon.svg");
      volumeSeakBar.style.display = "none";
      volumeSeakBar_visibe = false;
   }


})
document.querySelector(".volume_seakbar").addEventListener("change", (e) => {
   // console.log(e,e.target,e.target.value)
   document.querySelector(".volumeBtn123").src = document.querySelector(".volumeBtn123").src.replace("volume0.svg", "volume_icon.svg");
   audio.volume = e.target.value / 100;
   if (audio.volume == 0) {
      muted = true;
   }
})
//make folders audo apperar
async function getplaylists() {
   let a = await fetch("http://192.168.0.105:8000/songs/")
   let text = await a.text();
   const matches = text.match(/href="([^"]*\/)"/g);
   let playlist = [];
   if (matches) {
      matches.forEach(m => {
         const folder = m.match(/href="([^"]*\/)"/)[1].replace("/", "");
         playlist.push(folder);
      });
   }
   return playlist;
}
async function display_cards() {
   let playlist = await getplaylists();
   playlist.forEach(async (e) => {
      let metadata = await fetch(`http://192.168.0.105:8000/songs/${e}/info.json`);
      let data = await metadata.text();
      let coveradd=data.slice(data.indexOf("cover")+"cover".length+2,data.lastIndexOf(",")-1);
      console.log(coveradd);
      let title = data.slice(data.indexOf("title") + "title".length + 2, data.indexOf(",") - 1);
      let discripion = data.slice(data.indexOf("discription") + "discription".length + 2, data.lastIndexOf("\""));
      let card = document.createElement("div");
      card.classList.add("songcard");
      card.dataset.folder = e;
      card.innerHTML = `
                  <img class="album-img" src="${coveradd}" alt="img">
                  <img class="play" src="assets/playbutton.svg" alt="play">
                  <h3 class="pointer on-hover-underline">${title}</h3>
                  <ul class="list-style-none artist-names">
                     <li class="pointer click-to-home on-hover-underline">${discripion}</li>
                     <li class="pointer click-to-home on-hover-underline"></li>
                     <li class="pointer click-to-home on-hover-underline"></li>
                  </ul>`;
      document.querySelector(".songcard-container").appendChild(card);

      let songcard = document.querySelector(`[data-folder="${e}"]`);
      songcard.addEventListener("click", (a) => {
         console.log(a.currentTarget);
         currentfolder = a.currentTarget.dataset.folder;
         playSong(songNumber);
         listSongs();
         setupPlayerControls();
         setupSongChoice();
      })
   });
}
getplaylists();
display_cards();

