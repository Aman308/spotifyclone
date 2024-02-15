console.log("lets write java script");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUl.innerHTML = ""
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li> 
      
                  <img class="invert" src="music.svg" alt="">
                  <div class="info">
                      <div> ${song.replaceAll("%20", " ")}</div>
                      <div>Aman</div>
                  </div>
                  <div class="playnow">Play Now</div>
                  <img class="invert" src="play.svg" alt="">
     </li>`;
  }

  // Attach a event listner to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/song/" + track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


  
async function main() {
  await getSongs("song/chill");
  playMusic(songs[0], true);


  // Attach an event listner to play next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // Listen for time update event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  // add an event listner to seek bar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add event listner for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // Add event listner to previous and next
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add event listner to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e, e.target, e.target.value);
      currentSong.volume = parseInt(e.target.value) / 100;
    });

 // load th eplay list when ever card li clicked

 Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click", async item=>{
    console.log(item, item.currentTarget.dataset);
    songs = await getSongs(`song/${item.currentTarget.dataset.folder}`);
  });
});
}

main();
