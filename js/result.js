const data = JSON.parse(localStorage.getItem("scanResult"));

if (!data) {
  alert("No scan data found");
} else {
  // Score & level
  document.getElementById("riskScore").innerText = data.risk_score;
  document.getElementById("riskLevel").innerText = data.risk_level;

  // Risk meter
  const meter = document.getElementById("meterFill");
  meter.style.width = data.risk_score + "%";

  if (data.risk_level === "High Risk") {
    meter.style.background = "red";
    document.getElementById("riskLevel").style.color = "red";
  } else if (data.risk_level === "Medium Risk") {
    meter.style.background = "orange";
    document.getElementById("riskLevel").style.color = "orange";
  } else {
    meter.style.background = "green";
    document.getElementById("riskLevel").style.color = "green";
  }

  // Permissions list
  const list = document.getElementById("permissionList");
  if (data.dangerous_permissions.length === 0) {
    list.innerHTML = "<li>No dangerous permissions detected</li>";
  } else {
    data.dangerous_permissions.forEach(p => {
      const li = document.createElement("li");
      li.innerText = `${p.permission} – ${p.risk}`;
      list.appendChild(li);
    });
  }
}
