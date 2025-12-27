const BACKEND_URL = "https://sbi-backend.onrender.com";

async function wakeBackend() {
  try {
    await fetch(`${BACKEND_URL}/`);
    return true;
  } catch {
    return false;
  }
}

async function scanApk() {
  const fileInput = document.getElementById("apk");
  const loading = document.getElementById("loading");

  if (!fileInput || fileInput.files.length === 0) {
    alert("Please select an APK file");
    return;
  }

  loading.classList.remove("hidden");

  // 🔔 Wake backend first
  await wakeBackend();

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("apk", file);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 90000); // 90 sec

      const response = await fetch(`${BACKEND_URL}/scan`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) throw new Error("Server not ready");

      const data = await response.json();
      loading.classList.add("hidden");

      localStorage.setItem("scanResult", JSON.stringify(data));
      window.location.href = "result.html";
      return;

    } catch (err) {
      if (attempt === 1) {
        console.log("Cold start detected, retrying...");
        await new Promise(res => setTimeout(res, 40000));
      } else {
        loading.classList.add("hidden");
        alert("Server warming up. Please retry once more.");
        return;
      }
    }
  }
}
