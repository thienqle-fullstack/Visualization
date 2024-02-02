
let chain = ['E4','D4','C4','D4','E4','E4','E4','D4','D4','D4','E4','G4','G4','D4','E4','D4','C4'];
let durations = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
let record = false;
let exportAudio = false;
let whiteNotes = []
let blackNotes = []

const notes = {
    0: 'space',
}

const base = {
    'C': 261.626,
    'C#': 277.183,
    'D': 293.665,
    'D#': 311.127,
    'E': 329.628,
    'F':  349.228,
    'F#': 369.994,
    'G':391.995 ,
    'G#':  415.305,
    'A' : 440.000,
    'A#': 466.164,
    'B': 493.883,
}

const pitches = {
    'space' : 0,
}

function construct_pitches_freqency(){
    const keys = Object.keys(base)
    let index = 1
    //Base 3
    for(let i=0;i<keys.length;i++){
        notes[index] = `${keys[i]}3`
        pitches[`${keys[i]}3`] = base[keys[i]]/2
        index+=1;
    }
    //Base 4
    for(let i=0;i<keys.length;i++){
        notes[index] = `${keys[i]}4`
        pitches[`${keys[i]}4`] = base[keys[i]]
        index+=1;
    }
    //Base 5
    for(let i=0;i<keys.length;i++){
        notes[index] = `${keys[i]}5`
        pitches[`${keys[i]}5`] = base[keys[i]]*2
        index+=1;
    }
}

construct_pitches_freqency()

function setup(){
    const panel = document.getElementById('piano_panel')
    let keys = Object.keys(notes)
    panel.innerHTML = `<div id="piano" class="line">`
    for(let i=0;i<keys.length;i++) {
        if(notes[i].includes('#'))
        {
            col = `<div id="${notes[i]}" class="border cell-sharp" onclick="play('${notes[i]}',1/4)"><span class='note-name'>${notes[i]}</span></div>`
            blackNotes.push(notes[i])
        } else if(notes[i].includes('space')) 
        {
            col = '';
        }
         else {
            col = `<div id="${notes[i]}" class="border cell" onclick="play('${notes[i]}',1/4)"><span class='note-name'>${notes[i]}</span></div>`
            whiteNotes.push(notes[i])
        }
        panel.innerHTML += col
    }
    panel.innerHTML += `</div>`
    const space = `<div id="${notes[0]}" class="border cell-space" onclick="play('${notes[0]}',1/4)">${notes[0]}</div>`
    panel.innerHTML += space

    panel.innerHTML += `<div id="menu" class="line">`
    const playChain = `<button id="playchain" class="border cellButton" onclick="playChain()">Play Music</button>`
    const record = `<button id="control" class="border cellButton" onclick="controlRecord()">Record</button>`
    const reset = `<button class="border cellButton" onclick="clean()">Reset</button>`
    const exportAudioStart = `<button id="export-audio" class="border cellButton" onclick="exportRecording()">Start WAV</button>`
    
    panel.innerHTML += playChain
    panel.innerHTML += record
    panel.innerHTML += reset
    panel.innerHTML += exportAudioStart
    
    panel.innerHTML += `</div>`

    const output = document.getElementById('output')
    output.value = chain.toString();

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    mediaStreamDestination = audioContext.createMediaStreamDestination();

    let startX = 0
    let startY = 200
    let panelHeight = 0
    let panelWidth = 0
    let noteWidth = 0
    whiteNotes.forEach((id)=> {
        let note = document.getElementById(id)
        let x = startX
        let y = startY
        note.style.position = 'absolute';
        note.style.left= `${x}px`
        note.style.top=`${y}px`
        startX += note.offsetWidth
        panelHeight = note.offsetHeight
        panelWidth = startX
        noteWidth = note.offsetWidth
    })
    
    startX = noteWidth/2+3
    let octave_index = 1
     for(let i=0;i<blackNotes.length;i++) {
        let note = document.getElementById(blackNotes[i])
        let x = startX
        let y = startY
        note.style.position = 'absolute';
        note.style.left= `${x}px`
        note.style.top=`${y}px`
        note.style.zIndex = '1'
        
        if(octave_index==2 ) {
            startX += 2*noteWidth   
            octave_index+=1
        } else if (octave_index==5){
            startX += 2*noteWidth
            octave_index = 1
        } else {
            startX +=  noteWidth
            octave_index+=1
        }
        
       
        
       
    }
   
    let note = document.getElementById('space')
    let x = panelWidth
    let y = 200
    note.style.position = 'absolute';
    note.style.left= `${x}px`
    note.style.top=`${y}px`



}

setup();



function playChain(){
    // for(let i=0;i<chain.length;i++) {
    //     setTimeout(()=> {
    //         let d = durations[i] ? durations[i] : 4;
    //         playPitch(pitches[chain[i]],durations[i]);
    //     },1000*i)
    // }
    const btn = document.getElementById('playchain')
    btn.innerText = "Stop Music"
    btn.disabled = true;
    let frequencies = []
    for(let i=0;i<chain.length;i++) {
       frequencies.push(pitches[chain[i]])
    }
    playPitches(frequencies,durations);

    let totaltime = 0
    durations.forEach((duration) => {
        totaltime+=duration;
    }
    )
    console.log(totaltime)
    setTimeout(()=>{
        btn.innerText = "Play Music"
        btn.disabled = false;
    },totaltime*1000)
   
}

function clean() {
    chain = []
    durations = []
    updateOutput();
}

function updateOutput(){
    output.value = chain.toString();
}

function controlRecord(){
    record=!record;
    const btn = document.getElementById('control')
    if(record) {
        btn.innerText = "Stop"
    } else {
        btn.innerText = "Record"
    }
}

function play(note,duration){
    playPitch(pitches[note],duration)
    if(record) {
        chain.push(note)
        durations.push(duration)
        updateOutput();
    }
}

function editChain() {
    const output = document.getElementById('output')
    let value =  output.value
    value = value.replace(/\r?\n|\r/gm,"");
    value = value.replace(/\s/g,'')
    const temp = value.split(',')
    console.log(temp)
    chain = []
    durations = []
    for(let i = 0;i<temp.length;i++){
        chain.push(temp[i]) 
        durations.push(1/4);
    }
    updateOutput();
}

function exportRecording(){
 
    exportAudio=!exportAudio;
    const btn = document.getElementById('export-audio')
    if(exportAudio) {
        recordStart()
        btn.innerText = "Stop WAV"

    } else {
        recordStop()
        btn.innerText = "Start WAV"
    }
  
  
}