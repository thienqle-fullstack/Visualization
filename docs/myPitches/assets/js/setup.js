
let chain = ['E4','D4','C4','D4','E4','E4','E4','D4','D4','D4','E4','G4','G4','D4','E4','D4','C4'];
let durations = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
let record = false;

const notes = {
    0: 'space',
    1: 'C4',
    2: 'C#4',
    3: 'D4',
    4 :'D#4',
    5: 'E4',
    6: 'F4',
    7: 'F#4',
    8: 'G4',
    9: 'G#4',
    10: 'A4',
    11: 'A#4',
    12: 'B4',
}

const pitches = {
    'space' : 0,
    'C4': 261.626,
    'C#4': 277.183,
    'D4': 293.665,
    'D#4': 311.127,
    'E4': 329.628,
    'F4':  349.228,
    'F#4': 369.994,
    'G4':391.995 ,
    'G#4':  415.305,
    'A4' : 440.000,
    'A#4': 466.164,
    'B4': 493.883,
}


function setup(){
    const panel = document.getElementById('piano_panel')
    let keys = Object.keys(notes)
    panel.innerHTML = `<div id="piano" class="line">`
    for(let i=0;i<keys.length;i++) {
        if(notes[i].includes('#'))
        {
            col = `<div id="${notes[i]}" class="border cell-sharp" onclick="play('${notes[i]}',4)">${notes[i]}</div>`
        } else if(notes[i].includes('space')) 
        {
            col = `<div id="${notes[i]}" class="border cell-space" onclick="play('${notes[i]}',4)">${notes[i]}</div>`
        }
         else {
            col = `<div id="${notes[i]}" class="border cell" onclick="play('${notes[i]}',4)">${notes[i]}</div>`
        }
        panel.innerHTML += col
    }
    panel.innerHTML += `</div>`

    panel.innerHTML += `<br/><br/>`
    panel.innerHTML += `<div id="menu" class="line">`
    const playChain = `<button class="border cellButton" onclick="playChain()">Play</button>`
    const record = `<button id="control" class="border cellButton" onclick="controlRecord()">Record</button>`
    const reset = `<button class="border cellButton" onclick="clean()">Reset</button>`
    panel.innerHTML += playChain
    panel.innerHTML += record
    panel.innerHTML += reset
    panel.innerHTML += `</div>`

    const output = document.getElementById('output')
    output.value = chain.toString();
}

setup();



function playChain(){
    for(let i=0;i<chain.length;i++) {
        setTimeout(()=> {
            let d = durations[i] ? durations[i] : 4;
            playPitch(pitches[chain[i]],durations[i]);
        },1000*i)
    }
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
    const temp = output.value.split(',')
    chain = []
    durations = []
    for(let i = 0;i<temp.length;i++){
        chain.push(temp[i]) 
        durations.push(4);
    }
    updateOutput();
}