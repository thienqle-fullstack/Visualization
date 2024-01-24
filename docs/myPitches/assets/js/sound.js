

// oscillator.type 
// sine, square, sawtooth, triangle
function playPitch(frequency,duration) {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency,audioContext.currentTime)

    //The GainNode represents a change in volume
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start();

    //Stop after duration
    gainNode.gain.setValueAtTime(1,audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001,audioContext.currentTime + duration)
    oscillator.stop(audioContext.currentTime + duration)
}

