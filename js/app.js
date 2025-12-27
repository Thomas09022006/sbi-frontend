const BACKEND_URL = "https://sbi-backend.onrender.com";

console.log("SBI Frontend FINAL – silent warmup");

async function wakeBackend() {
  try {
    await fetch(`${BACKEND_URL}/`);
  } catch (e) {
    console.log("Backend still waking...");
  }
}

async function scanApk() {
  const fileInput = document.getElementById("apk");
  const loading = document.getElementById("loading");

  if (!fileInput || fileInput.files.length === 0) {
    return; // ❌ no alert
  }

  loading.classList.remove("hidden");

  // 🔔 Wake backend first (silent)
  await wakeBackend();

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("apk", file);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 90000);

      const response = await fetch(`${BACKEND_URL}/scan`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) throw new Error("Backend not ready");

      const data = await response.json();
      loading.classList.add("hidden");

      localStorage.setItem("scanResult", JSON.stringify(data));
      window.location.href = "result.html";
      return;

    } catch (err) {
      console.log("Backend warming silently...");
      await new Promise(res => setTimeout(res, 40000));
    }
  }

  loading.classList.add("hidden");
}
