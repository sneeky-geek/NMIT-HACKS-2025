// Helper to detect if device is likely mobile
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

// Store webcam streams to stop them later
const webcamStreams = {};

// Helper to create object upload fields dynamically
function createObjectFields(num) {
  const container = document.getElementById("objects-container");
  container.innerHTML = "";
  for (let i = 0; i < num; i++) {
    const div = document.createElement("div");
    div.className = "object-block";
    div.innerHTML = `
      <h3>Object ${i + 1}</h3>
      <label>Number of items for object ${i + 1}:</label>
      <input type="number" name="num_items_${i}" min="1" value="1" required>
      <div class="camera-section" id="camera-section-${i}"></div>
      <img id="preview_${i}" style="display:none;max-width:120px;margin-top:8px;" />
    `;
    container.appendChild(div);

    const cameraSection = div.querySelector(`#camera-section-${i}`);
    const previewImg = div.querySelector(`#preview_${i}`);

    if (isMobileDevice()) {
      // On mobile, use file input with camera capture
      cameraSection.innerHTML = `
        <label>Take photo for object ${i + 1}:</label>
        <input type="file" name="image_${i}" accept="image/*" capture="environment" required>
      `;
      const fileInput = cameraSection.querySelector(`input[name="image_${i}"]`);
      fileInput.addEventListener("change", function () {
        if (fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewImg.style.display = "block";
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      });
    } else {
      // On desktop, always launch webcam and show video
      cameraSection.innerHTML = `
        <video id="video_${i}" width="180" height="135" autoplay style="display:block;border-radius:8px;margin-top:8px;"></video>
        <button type="button" id="scan-btn-${i}" style="margin-top:8px;">Scan</button>
        <input type="file" name="image_${i}" accept="image/*" style="display:none;" />
      `;
      const video = cameraSection.querySelector(`#video_${i}`);
      const scanBtn = cameraSection.querySelector(`#scan-btn-${i}`);
      const fileInput = cameraSection.querySelector(`input[name="image_${i}"]`);
      let stream = null;

      // Start webcam immediately
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function (s) {
            stream = s;
            webcamStreams[i] = stream;
            video.srcObject = stream;
            video.style.display = "block";
          })
          .catch(function (err) {
            alert(
              "Could not access webcam. Please allow camera access or use file upload."
            );
            fileInput.style.display = "block";
            video.style.display = "none";
            scanBtn.style.display = "none";
          });
      } else {
        alert("Webcam not supported. Please use file upload.");
        fileInput.style.display = "block";
        video.style.display = "none";
        scanBtn.style.display = "none";
      }

      scanBtn.addEventListener("click", function () {
        // Capture frame from video
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 180;
        canvas.height = video.videoHeight || 135;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function (blob) {
          // Show preview
          const url = URL.createObjectURL(blob);
          previewImg.src = url;
          previewImg.style.display = "block";
          // Set file input for form submission (simulate file input)
          const dt = new DataTransfer();
          const file = new File([blob], `object_${i}_capture.jpg`, {
            type: "image/jpeg",
          });
          dt.items.add(file);
          fileInput.files = dt.files;
        }, "image/jpeg");
      });
    }
  }
}

document.getElementById("num-objects").addEventListener("input", function (e) {
  // Stop all previous webcam streams
  Object.values(webcamStreams).forEach((stream) => {
    if (stream) stream.getTracks().forEach((track) => track.stop());
  });
  createObjectFields(parseInt(e.target.value) || 1);
});

// Initialize with 1 object field
createObjectFields(1);

function showVerifyingOverlay() {
  let overlay = document.createElement('div');
  overlay.className = 'verifying-overlay';
  overlay.innerHTML = `
    <div class='verifying-modal'>
      <div class='verifying-spinner'></div>
      <div class='verifying-text'>Verifying your images...<br><span style='font-size:0.95rem;font-weight:400;'>Please wait</span></div>
    </div>
  `;
  document.body.appendChild(overlay);
  // Add shimmer to all object blocks
  document.querySelectorAll('.object-block').forEach(el => el.classList.add('shimmer'));
}
function hideVerifyingOverlay() {
  let overlay = document.querySelector('.verifying-overlay');
  if (overlay) overlay.remove();
  document.querySelectorAll('.object-block').forEach(el => el.classList.remove('shimmer'));
}

document.getElementById("scan-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  // Stop all webcam streams before submitting
  Object.values(webcamStreams).forEach(stream => {
    if (stream) stream.getTracks().forEach(track => track.stop());
  });
  const userId = document.getElementById("user-id").value;
  const numObjects = parseInt(document.getElementById("num-objects").value);
  const objects = [];
  const analysisResultsDiv = document.getElementById("analysis-results");
  analysisResultsDiv.innerHTML = "";
  document.getElementById("qr-section").style.display = "none";

  // Animate the submit button
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Verifying images...';
  showVerifyingOverlay();

  // Analyze each object (sequentially)
  for (let i = 0; i < numObjects; i++) {
    const numItems = document.querySelector(`[name="num_items_${i}"]`).value;
    const imageInput = document.querySelector(`[name="image_${i}"]`);
    const file = imageInput.files[0];
    if (!file) {
      alert(`Please scan/take a photo for object ${i + 1}`);
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalBtnText;
      hideVerifyingOverlay();
      return;
    }
    // Upload image and get analysis
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("num_items", numItems);
    let analysis = null;
    try {
      // Debug: log request method and URL
      console.log('POST /scan-item', formData);
      const res = await fetch("/scan-item", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        analysisResultsDiv.innerHTML += `<div class='error'>Server error for object ${i + 1}: ${res.status} ${res.statusText}<br>${text}</div>`;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalBtnText;
        hideVerifyingOverlay();
        return;
      }
      const data = await res.json();
      if (data.error) {
        analysisResultsDiv.innerHTML += `<div class='error'>Error analyzing object ${i + 1}: ${data.error}</div>`;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalBtnText;
        hideVerifyingOverlay();
        return;
      }
      analysis = data.analysis || data.object || data;
      analysisResultsDiv.innerHTML += `<div><b>Object ${i + 1}:</b><pre>${JSON.stringify(analysis, null, 2)}</pre></div>`;
      objects.push({
        number_of_items: parseInt(numItems),
        analysis: analysis,
      });
    } catch (err) {
      analysisResultsDiv.innerHTML += `<div class='error'>Error analyzing object ${i + 1}: ${err}</div>`;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = originalBtnText;
      hideVerifyingOverlay();
      return;
    }
  }

  // Generate QR code for all analysis reports
  try {
    const qrRes = await fetch("/generate_qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, objects: objects }),
    });
    const qrData = await qrRes.json();
    if (qrData.qr_code_url) {
      document.getElementById("qr-image").src = qrData.qr_code_url;
      document.getElementById("qr-section").style.display = "block";
      showConfetti();
      // Show timer below QR code with circular progress
      let timerDiv = document.getElementById("qr-timer");
      if (!timerDiv) {
        timerDiv = document.createElement("div");
        timerDiv.id = "qr-timer";
        document.getElementById("qr-section").appendChild(timerDiv);
      }
      let seconds = 180;
      const radius = 32;
      const circumference = 2 * Math.PI * radius;
      timerDiv.innerHTML = `
        <svg class='qr-timer-circle' width='80' height='80'>
          <circle cx='40' cy='40' r='${radius}' stroke='#ede9fe' stroke-width='8' fill='none'/>
          <circle id='timer-progress' cx='40' cy='40' r='${radius}' stroke='#a18cd1' stroke-width='8' fill='none' stroke-linecap='round' style='transform: rotate(-90deg); transform-origin: 50% 50%; stroke-dasharray: ${circumference}; stroke-dashoffset: 0; transition: stroke-dashoffset 1s linear;'/>
        </svg>
        <div class='qr-timer-count' id='timer-count'>${seconds}</div>
        <div class='qr-timer-label'>This page will reload automatically</div>
      `;
      timerDiv.style.display = 'flex';
      // Animate timer
      const progressCircle = document.getElementById('timer-progress');
      let elapsed = 0;
      const interval = setInterval(() => {
        seconds--;
        elapsed++;
        document.getElementById('timer-count').textContent = seconds;
        // Animate circle
        if (progressCircle) {
          progressCircle.style.strokeDashoffset = (circumference * elapsed / 15).toString();
        }
        if (seconds <= 0) {
          clearInterval(interval);
          document.getElementById('timer-count').textContent = '0';
          timerDiv.querySelector('.qr-timer-label').textContent = 'Reloading...';
          setTimeout(() => { window.location.reload(); }, 600);
        }
      }, 1000);
    } else {
      document.getElementById("qr-section").style.display = "none";
    }
  } catch (err) {
    analysisResultsDiv.innerHTML += `<div class='error'>Error generating QR code: ${err}</div>`;
  }
  // Restore the submit button and hide overlay
  submitBtn.classList.remove('loading');
  submitBtn.textContent = originalBtnText;
  hideVerifyingOverlay();
});

function showConfetti() {
  const colors = [
    "#a18cd1",
    "#7c3aed",
    "#fbc2eb",
    "#ede9fe",
    "#c084fc",
    "#f472b6",
  ];
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  for (let i = 0; i < 32; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = Math.random() * 10 + 5 + "vh";
    piece.style.transform = `scale(${Math.random() * 0.7 + 0.7})`;
    piece.style.animationDelay = Math.random() * 0.3 + "s";
    confetti.appendChild(piece);
  }
  document.body.appendChild(confetti);
  setTimeout(() => {
    confetti.remove();
  }, 1400);
}
