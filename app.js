// JavaScript: Mengatur fungsi button untuk play dan stop
document.addEventListener('DOMContentLoaded', function() {
  var playStopButton = document.getElementById('playStopButton');
  var playIcon = document.getElementById('playIcon');
  var stopIcon = document.getElementById('stopIcon');
  var audioContext;
  var source;
  var stream;

  // Fungsi untuk mengganti icon play dan stop
  function toggleIcon() {
    if (playIcon.style.display === 'none') {
      playIcon.style.display = 'block';
      stopIcon.style.display = 'none';
    } else {
      playIcon.style.display = 'none';
      stopIcon.style.display = 'block';
    }
  }

  // Fungsi untuk memulai dan menghentikan karaoke
  playStopButton.onclick = function() {
    // Jika icon play terlihat, maka mulai karaoke
    if (playIcon.style.display === 'block') {
      // Meminta izin pengguna untuk menggunakan mikrofon
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(mediaStream) {
          // Membuat AudioContext baru setelah tindakan pengguna
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          stream = mediaStream;
          source = audioContext.createMediaStreamSource(stream);

          // Menghubungkan sumber audio ke output (pengeras suara)
          source.connect(audioContext.destination);
          toggleIcon();
        }).catch(function(err) {
          console.error('Tidak dapat mengakses mikrofon:', err);
        });
    } else {
      // Jika icon stop terlihat, maka hentikan karaoke
      // Menonaktifkan mikrofon dan menghentikan AudioContext
      if (audioContext) {
        audioContext.close();
      }
      if (stream) {
        stream.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      toggleIcon();
    }
  };
});
