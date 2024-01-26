/*
function recordAudio(duration, onDataAvailable, onRecordingFinished) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    const chunks = [];
  
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
        if (onDataAvailable) {
          onDataAvailable(event.data);
        }
      }
    };
  
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/wav' });
      if (onRecordingFinished) {
        onRecordingFinished(audioBlob);
      }
    };
  
    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event.error);
    };
  
    mediaRecorder.onwarning = (event) => {
      console.warn('MediaRecorder warning:', event);
    };
  
    mediaRecorder.start();
  
    // Stop recording after the specified duration
    setTimeout(() => {
      mediaRecorder.stop();
    }, duration * 1000); // Convert duration to milliseconds
  
    return mediaStreamDestination;
  }
  
*/
let audioContext;
let mediaRecorder;
let mediaStreamDestination ;

function recordStart() {
    // Create an audio context


    // Create a media stream destination node
    

    // Connect your audio nodes to the destination
    // (You would connect your own audio nodes or sources here)

    // Create a media recorder
    mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    const chunks = [];

    // Handle data available event
    mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
        chunks.push(event.data);
    }
    };

    // Handle recording stopped event
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        // Now you can use the audioBlob as needed (e.g., play it or save it)
        playAudioBlob(audioBlob)
         exportAudioURL(audioBlob)
    };

    // Start recording
    mediaRecorder.start();

    return mediaRecorder
}
  

function recordStop(){
            mediaRecorder.stop();
}

function playAudioBlob(audioBlob){
    // Callback when recording is finished
    const audioUrl = URL.createObjectURL(audioBlob);
    // You can use audioUrl to play the audio or create a download link
    const audio = new Audio(audioUrl);
    audio.play()
      .catch(error => console.error('Audio playback error:', error));
}

function exportAudioURL(audioBlob){
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log(audioUrl)
    let download = document.getElementById('download')
    const downloadLink = document.createElement('a');
    downloadLink.href = audioUrl;
    downloadLink.download = 'recorded_audio.wav';
    downloadLink.text = "Download"
    download.innerHTML = ''
    download.appendChild(downloadLink)
    download.innerHTML += '<br/><br/>'

    
    const audioFile = document.createElement('audio');
    audioFile.controls = true;
    const source  = document.createElement('source');
    source.src = audioUrl
    source.type = 'audio/wav';
    audioFile.appendChild(source)
    download.appendChild(audioFile)
}