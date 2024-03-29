

// oscillator.type 
// sine, square, sawtooth, triangle
function playPitch(frequency,duration) {

    let currentTime = audioContext.currentTime 
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(frequency,currentTime)

    gainNode.gain.setValueAtTime(1,audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(1,currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0,currentTime + 2*duration - 0.01);

    oscillator.connect(mediaStreamDestination)
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration);

}


function playPitches(frequencies,durations){
    if(frequencies.length != durations.length) alert('Not valid!')
    // const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let currentTime = audioContext.currentTime 
    
    for(let i = 0;i<frequencies.length;i++){
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(frequencies[i],currentTime)

        gainNode.gain.setValueAtTime(1,audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(1,currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0,currentTime + 2*durations[i] - 0.01);

        oscillator.connect(mediaStreamDestination)
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start(currentTime);
        oscillator.stop(currentTime + durations[i]);

        currentTime += durations[i] + 0.1;
    }

}


