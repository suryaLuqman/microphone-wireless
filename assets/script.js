let mediaRecorder;
let chunks = [];
let isRecording = false;
let isPlaying = false;
let audioContext;
let audioSource;
let audioBuffer;
let audioPlayer; // Variabel baru untuk pemutar audio

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
            audioPlayer = new Audio(); // Membuat pemutar audio baru
            audioPlayer.srcObject = stream; // Mengatur sumber audio ke stream
            audioPlayer.play(); // Memutar audio stream

            mediaRecorder = new MediaRecorder(stream);
            chunks = [];

            mediaRecorder.ondataavailable = function(event) {
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

   audioPlayer.pause(); // Menjeda pemutar audio
   audioPlayer.srcObject = null; // Menghapus sumber audio
}

function playRecordedAudio() {
   if (!isPlaying && chunks.length > 0) {
      isPlaying = true;
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      const fileReader = new FileReader();
      
      fileReader.onloadend = function() {
            const arrayBuffer = fileReader.result;
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContext.decodeAudioData(arrayBuffer, function(buffer) {
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
   audioSource.connect(audioContext.destination);
   audioSource.start(0);
   audioSource.onended = function() {
      isPlaying = false;
      updateStatus("Playback finished");
   }
}

function updateStatus(message) {
   document.getElementById('status').textContent = "Status: " + message;
}
