let mediaRecorder;
let chunks = [];
let isRecording = false;
let isPlaying = false;
let audioContext;
let audioSource;
let audioBuffer;
let audioPlayer;
let tuna; // Tambahkan variabel tuna untuk equalizer

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

   // Tambahkan GainNode untuk mengontrol volume
   const gainNode = audioContext.createGain();
   gainNode.gain.value = 1.5; // Tingkatkan volume. Sesuaikan nilai ini berdasarkan kebutuhan.

   // Inisialisasi equalizer dengan Tuna.js
   let equalizer = new tuna.Equalizer({
      frequency: [60, 230, 910, 3600, 14000], // Ini adalah frekuensi center untuk setiap band.
      Q: [1.5, 1.5, 1.5, 1.5, 1.5], // Q factor untuk setiap band.
      gain: [-5, -3, 0, 3, 5], // Sesuaikan gain untuk setiap band untuk mengurangi noise dan meningkatkan kualitas.
      bypass: 0
   });

   // Sambungkan audioSource ke equalizer, kemudian ke gainNode, dan akhirnya ke destination.
   audioSource.connect(equalizer.input);
   equalizer.connect(gainNode);
   gainNode.connect(audioContext.destination);

   audioSource.start(0);
   audioSource.onended = function() {
      isPlaying = false;
      updateStatus("Playback finished");
   }
}


function updateStatus(message) {
   document.getElementById('status').textContent = "Status: " + message;
}

