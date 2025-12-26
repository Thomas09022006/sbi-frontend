const BACKEND_URL = "https://sbi-backend.onrender.com"; // 🔴 CHANGE IF NEEDED

function scanApk() {
  const fileInput = document.getElementById("apk");
  const loading = document.getElementById("loading");

  if (!fileInput || fileInput.files.length === 0) {
    alert("Please select an APK file");
    return;
  }

  const file = fileInput.files[0];

  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("apk", file); // 🔴 key must be "apk"

  fetch(`${BACKEND_URL}/scan`, {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      loading.classList.add("hidden");

      if (data.error) {
        alert("Scan failed: " + data.error);
        return;
      }

      localStorage.setItem("scanResult", JSON.stringify(data));
      window.location.href = "result.html";
    })
    .catch(error => {
      loading.classList.add("hidden");
      alert("Backend connection failed");
      console.error(error);
    });
}


// 🔹 RESULT PAGE LOGIC
if (window.location.pathname.includes("result.html")) {

  const raw = localStorage.getItem("scanResult");

  if (!raw) {
    alert("No scan data found");
    window.location.href = "index.html";
  }

  const data = JSON.parse(raw);

  document.getElementById("riskLevel").innerText =
    `Risk Level: ${data.risk_level}`;

  document.getElementById("score").innerText =
    `Risk Score: ${data.risk_score}%`;

  const ul = document.getElementById("permissions");
  ul.innerHTML = "";

  if (data.dangerous_permissions.length === 0) {
    ul.innerHTML = "<li>No dangerous permissions found</li>";
  } else {
    data.dangerous_permissions.forEach(p => {
      const li = document.createElement("li");
      li.innerText = `${p.permission} – ${p.risk}`;
      ul.appendChild(li);
    });
  }
}
