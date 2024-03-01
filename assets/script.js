let mediaRecorder;
let chunks = [];
let isRecording = false;
let isPlaying = false;
let audioContext;
let audioSource;
let audioBuffer;
let audioPlayer;
let tuna;
let externalSpeakerDeviceId;

document.addEventListener('DOMContentLoaded', (event) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            selectExternalSpeaker();
        })
        .catch(err => {
            updateStatus("Error: " + err.message);
        });
});

function selectExternalSpeaker() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const audioDevices = devices.filter(device => device.kind === 'audiooutput');
        })
        .catch(err => {
            console.error('Error enumerating devices:', err);
        });
}

function setAudioOutput(audioElement, deviceId) {
  if (typeof audioElement.setSinkId === 'function') {
    audioElement.setSinkId(deviceId)
      .then(() => {
        console.log(`Output audio diarahkan ke perangkat dengan ID: ${deviceId}`);
      })
      .catch(err => {
        console.error('Gagal mengalihkan output audio:', err);
      });
  } else {
    console.error('Browser tidak mendukung setSinkId');
  }
}

function updateStatus(message) {
   document.getElementById('status').textContent = "Status: " + message;
}

recordButton.addEventListener('click', () => {
   if (!isRecording) {
      startRecording();
      recordButton.innerHTML = '<i class="fa fa-stop"></i>';
      updateStatus("Recording...");
   } else {
      stopRecording();
      recordButton.innerHTML = '<i class="fa fa-play"></i>';
      updateStatus("Stopped. Click 'Play' to listen.");
   }
   isRecording = !isRecording;
});

function startRecording() {
   navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
            audioPlayer = new Audio();
            audioPlayer.srcObject = stream;
            setAudioOutput(audioPlayer, externalSpeakerDeviceId);
            audioPlayer.play();
            mediaRecorder = new MediaRecorder(stream);
            chunks = [];
            mediaRecorder.ondataavailable = function (event) {
               chunks.push(event.data);
            }
            mediaRecorder.start();
      })
      .catch(err => {
            console.error('Error recording:', err);
            updateStatus("Error: " + err.message);
      });
}

function stopRecording() {
   if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
   }
   audioPlayer.pause();
   audioPlayer.srcObject = null;
}

function playRecordedAudio() {
   if (!isPlaying && chunks.length > 0) {
      isPlaying = true;
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      const fileReader = new FileReader();
      fileReader.onloadend = function () {
            const arrayBuffer = fileReader.result;
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(arrayBuffer, function (buffer) {
               audioBuffer = buffer;
               startPlayback();
            });
      };
      fileReader.readAsArrayBuffer(blob);
   }
}

function startPlayback() {
   audioSource = audioContext.createBufferSource();
   audioSource.buffer = audioBuffer;
   const gainNode = audioContext.createGain();
   gainNode.gain.value = 1.5;
   let equalizer = new tuna.Equalizer({
      frequency: [60, 230, 910, 3600, 14000],
      Q: [1.5, 1.5, 1.5, 1.5, 1.5],
      gain: [-5, -3, 0, 3, 5],
      bypass: 0
   });
   audioSource.connect(equalizer.input);
   equalizer.connect(gainNode);
   gainNode.connect(audioContext.destination);
   audioSource.start(0);
   audioSource.onended = function() {
      isPlaying = false;
      updateStatus("Playback finished");
   }
}
