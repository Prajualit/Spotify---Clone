console.log('Script is running...');
let currentSong = new Audio();
let songs
let currFolder
function convertSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return '00:00';
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to always show two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a"))
            songs.push(element.href.split(`/${folder}/`)[1])
    }
       // show all the songs in the playlist
       let songUl = document.querySelector(".songlist").getElementsByTagName('ul')[0]
       songUl.innerHTML = ""
       for (const song of songs) {
           songUl.innerHTML = songUl.innerHTML + `
            <li>
                               <div class="songiconandinfo">
                                   <img src="img/music.svg" alt="" width="40px">
                                   <div class="songinfo">
                                       <div>${song.replaceAll('%20', ' ')}</div>
                                   </div>
                               </div>
                                   <img class="playbtn" src="img/playnow.svg" alt="" width="24px">
                           </li>`
       }
   
       // Attach an event listener to each song
       Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e => {
           e.addEventListener('click', element => {
               playMusic(e.querySelector('.songinfo').firstElementChild.innerHTML.trim())
           })
       })
       return songs
}

const playMusic = (track,) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track

    currentSong.play()
    play.innerHTML = `<img src="img/play.svg" width="18px">`
    document.querySelector(".songinfoplaybar").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = '00:00/00:00'

    
}

async function main() {

    // get the list of all songs
    await getSongs("songs/Pritam")
 

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.innerHTML = `<img src="img/play.svg" width="18px">`

        }
        else {
            currentSong.pause()
            play.innerHTML = `<img src="img/pause.svg" width="18px">`
        }
    })
    // Listen for timeupdate event
    currentSong.addEventListener('timeupdate', () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)
            }/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100
    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".sidebar").style.left = "0"
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".sidebar").style.left = "-200%"
    })

    // add an event listener to previous and next
    previous.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    forward.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an event to volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })

    // load the playlist whenever the card clicked
    Array.from(document.getElementsByClassName("artist1")).forEach(e=>{
        e.addEventListener("click", async (item)=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })

    })

    // add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
            currentSong.volume = 0.1
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10
        }
    })
}

main()
