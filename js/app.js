const BACKEND_URL = "https://sbi-backend.onrender.com";

async function scanApk() {
  const fileInput = document.getElementById("apk");
  const loading = document.getElementById("loading");

  if (!fileInput || fileInput.files.length === 0) {
    alert("Please select an APK file");
    return;
  }

  const file = fileInput.files[0];
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("apk", file);

  // 🔁 auto retry logic
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${BACKEND_URL}/scan`, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      if (!response.ok) throw new Error("Server not ready");

      const data = await response.json();

      loading.classList.add("hidden");

      if (data.error) {
        alert("Scan failed: " + data.error);
        return;
      }

      localStorage.setItem("scanResult", JSON.stringify(data));
      window.location.href = "result.html";
      return;

    } catch (err) {
      if (attempt === 1) {
        console.log("Backend sleeping, retrying...");
        await new Promise(res => setTimeout(res, 30000)); // wait 30 sec
      } else {
        loading.classList.add("hidden");
        alert("Backend busy. Please try again after 1 minute.");
        return;
      }
    }
  }
}
