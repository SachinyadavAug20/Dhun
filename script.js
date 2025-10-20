console.log("Welocme to Dhun(a spotify clone)");
let on_click_go_home=document.querySelectorAll(".click-to-home");
for (const a of on_click_go_home) {
   a.addEventListener('click',()=>{
      location.href="index.html"
   })
}
document.querySelector(".sign").addEventListener('click',()=>{
   window.open("https://www.spotify.com/in-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F","_blank");
})
document.querySelector(".log").addEventListener('click',()=>{
   window.open("https://accounts.spotify.com/en/v2/login?continue=https%3A%2F%2Fopen.spotify.com%2F","_blank");
})

let playbutton=document.querySelectorAll(".album-img");
for (const a of playbutton) {
a.addEventListener('mouseenter',()=>{
   a.nextElementSibling.style.opacity = 1;
   a.nextElementSibling.style.transform = 'translateY(-7.5%)';
})
a.addEventListener('mouseleave',()=>{
   a.nextElementSibling.style.opacity = 0;
   a.nextElementSibling.style.transform = 'translateY(+25%)';
})
a.nextElementSibling.addEventListener('mouseenter',()=>{
   a.nextElementSibling.style.opacity = 1;
   a.nextElementSibling.style.transform = 'translateY(-25.5%)';
})
a.nextElementSibling.addEventListener('mouseleave',()=>{
   a.nextElementSibling.style.opacity = 1;
   a.nextElementSibling.style.transform = 'translateY(-25.5%)';
})
}

let play_container=document.querySelector(".play_song_container");
let playBtn = play_container.children[0];
let pauseBtn = play_container.children[1];
playBtn.style.opacity=1;
playBtn.style.pointerEvents="auto";
pauseBtn.style.opacity=0;
pauseBtn.style.pointerEvents="none"
playBtn.addEventListener('click',()=>{
playBtn.style.opacity=0;
playBtn.style.pointerEvents="none";
pauseBtn.style.opacity=1;
pauseBtn.style.pointerEvents="auto"
})
pauseBtn.addEventListener('click',()=>{
playBtn.style.opacity=1;
playBtn.style.pointerEvents="auto";
pauseBtn.style.opacity=0;
pauseBtn.style.pointerEvents="none"
})

