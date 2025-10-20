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
function getsongs() {
   let songs = [
      "songs/Blindfold.mp3",
      "songs/Electronic.mp3",
      "songs/Hit The Ground.mp3",
      "songs/J Pop.mp3",
      "songs/MONTAGEM INDIA.mp3",
      "songs/Missing Life.mp3",
      "songs/Witch House.mp3"
   ];
   return songs;
}

var song_number = 5;//default case 
function look_for_usr_song_choice() {
   //take user input on song choice
   let j = getsongs().length;
   for (let i = 0; i < j; i++) {
      document.querySelector(`.song_name${i}`).addEventListener('click', () => {
         song_number = i;
         pause_song();
         main();
         console.log(song_number);
      });
   }

}
let play_container = document.querySelector(".play_song_container");
let playBtn = play_container.children[0];
let pauseBtn = play_container.children[1];
playBtn.style.opacity = 1;
playBtn.style.pointerEvents = "auto";
pauseBtn.style.opacity = 0;
pauseBtn.style.pointerEvents = "none"

function list_songs() {
   //try to list all songs
   let song_name=get_song_name();
   let songlist = document.querySelector(".songlist"), j = 0;
   for (const _name of song_name) {
      let li = document.createElement("li")
      li.innerHTML = _name;
      li.className = `song_name${j}`;
      j++;
      songlist.appendChild(li);
   }

}
function get_song_name() {
   let song_name = [];
   for (const song of getsongs()) {
      let address = song;
      let from = address.indexOf("/songs/") + "/songs/".length;
      let to = address.indexOf(".mp3");
      address = address.slice(from, to).replaceAll("%20", " ");
      song_name.push(address);
   }
   return song_name;
}
function pause_song(){
   let songs=getsongs();
   let audio = new Audio(songs[song_number]);
      playBtn.style.opacity = 1;
      playBtn.style.pointerEvents = "auto";
      pauseBtn.style.opacity = 0;
      pauseBtn.style.pointerEvents = "none";
      audio.currentTime=0; 
      audio.pause();

   audio.pause;
}
function main() {
   let songs = getsongs();
   let song_name = get_song_name();
   console.log(song_name);
   let audio = new Audio(songs[song_number]);

   let time_info = document.querySelector(".timeduration");
   let song_info = document.querySelector(".songinfo");
   playBtn.addEventListener('click', () => {
      playBtn.style.opacity = 0;
      playBtn.style.pointerEvents = "none";
      pauseBtn.style.opacity = 1;
      pauseBtn.style.pointerEvents = "auto";
      audio.play();
      let duration = audio.duration;
      //convert seconds to minutes
      let minutesT = parseInt(duration / 60);
      let secondsT = parseInt(duration - (minutesT * 60));
      if (minutesT < 10) { minutesT = `0${minutesT}` }
      if (secondsT < 10) { secondsT = `0${secondsT}` }
      time_info.innerHTML = `${minutesT}:${secondsT}`;
      var total_time = `${minutesT}:${secondsT}`;
      song_info.innerHTML = `${song_name[song_number]}`;

      audio.addEventListener("timeupdate", () => {
         let time_played = audio.currentTime;
         let mD = parseInt(time_played / 60);
         let sD = parseInt(time_played - mD * 60);
         if (mD < 10) { mD = `0${mD}` }
         if (sD < 10) { sD = `0${sD}` }
         time_info.innerHTML = `${mD}:${sD} / ${total_time}`;
      })
   })
   pauseBtn.addEventListener('click', () => {
      playBtn.style.opacity = 1;
      playBtn.style.pointerEvents = "auto";
      pauseBtn.style.opacity = 0;
      pauseBtn.style.pointerEvents = "none"
      audio.pause();
   })

}
main();
list_songs();
look_for_usr_song_choice();
