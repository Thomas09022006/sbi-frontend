const data = JSON.parse(localStorage.getItem("scanResult"));

// 🔒 If no data, go back silently
if (!data) {
  window.location.href = "index.html";
} else {

  // =========================
  // Risk Score & Prediction
  // =========================
  document.getElementById("riskScore").innerText = data.risk_score;
  document.getElementById("riskLevel").innerText = data.risk_level;

  // =========================
  // Risk Meter
  // =========================
  const meter = document.getElementById("meterFill");
  meter.style.width = data.risk_score + "%";

  const riskLevelEl = document.getElementById("riskLevel");

  if (data.risk_level === "High Risk") {
    meter.style.background = "red";
    riskLevelEl.style.color = "red";
  } else if (data.risk_level === "Medium Risk") {
    meter.style.background = "orange";
    riskLevelEl.style.color = "orange";
  } else {
    meter.style.background = "green";
    riskLevelEl.style.color = "green";
  }

  // =========================
  // Dangerous Permissions
  // =========================
  const list = document.getElementById("permissionList");
  list.innerHTML = "";

  if (!data.dangerous_permissions || data.dangerous_permissions.length === 0) {
    const li = document.createElement("li");
    li.innerText = "No dangerous permissions detected ✅";
    li.style.color = "#9ca3af";
    list.appendChild(li);
  } else {
    data.dangerous_permissions.forEach(p => {
      const li = document.createElement("li");
      li.innerText = `${p.permission} – ${p.risk}`;
      li.style.color = "#f87171";
      list.appendChild(li);
    });
  }
}
