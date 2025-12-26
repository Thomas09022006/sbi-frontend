const BACKEND_URL = "https://sbi-backend.onrender.com"; // DO NOT CHANGE

// =======================
// SCAN APK FUNCTION
// =======================
function scanApk() {
  const fileInput = document.getElementById("apk");
  const loading = document.getElementById("loading");

  if (!fileInput || fileInput.files.length === 0) {
    alert("Please select an APK file");
    return;
  }

  const file = fileInput.files[0];

  // Show loading
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("apk", file); // backend expects "apk"

  // ⏱ Timeout controller (Render sleep handling)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 sec

  fetch(`${BACKEND_URL}/scan`, {
    method: "POST",
    body: formData,
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Server not ready");
      }
      return response.json();
    })
    .then(data => {
      loading.classList.add("hidden");

      if (data.error) {
        alert("Scan failed: " + data.error);
        return;
      }

      // Save result & redirect
      localStorage.setItem("scanResult", JSON.stringify(data));
      window.location.href = "result.html";
    })
    .catch(error => {
      loading.classList.add("hidden");

      if (error.name === "AbortError") {
        alert(
          "Backend is waking up (free server).\n\n" +
          "Please wait 30 seconds and click Analyze again."
        );
      } else {
        alert(
          "Backend connection lost.\n\n" +
          "Please retry in 30 seconds."
        );
      }

      console.error("Scan error:", error);
    });
}


// =======================
// RESULT PAGE LOGIC
// =======================
if (window.location.pathname.includes("result.html")) {

  const raw = localStorage.getItem("scanResult");

  if (!raw) {
    alert("No scan data found. Please scan again.");
    window.location.href = "index.html";
  }

  const data = JSON.parse(raw);

  document.getElementById("riskLevel").innerText =
    `Risk Level: ${data.risk_level}`;

  document.getElementById("score").innerText =
    `Risk Score: ${data.risk_score}%`;

  const ul = document.getElementById("permissions");
  ul.innerHTML = "";

  if (!data.dangerous_permissions || data.dangerous_permissions.length === 0) {
    ul.innerHTML = "<li>No dangerous permissions found</li>";
  } else {
    data.dangerous_permissions.forEach(p => {
      const li = document.createElement("li");
      li.innerText = `${p.permission} – ${p.risk}`;
      ul.appendChild(li);
    });
  }
}
