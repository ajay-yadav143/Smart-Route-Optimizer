// Initialize map (Google Maps feel)
const map = L.map("map").setView([28.6139, 77.2090], 13);

// Map tiles (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// Fake node coordinates
const locations = {
  A: [28.6139, 77.2090],
  B: [28.6200, 77.2100],
  C: [28.6100, 77.2150],
  D: [28.6050, 77.2200],
  E: [28.6000, 77.2250]
};

let routeLine;
let selectedSource = null;
let selectedDestination = null;

// Add markers
for (let key in locations) {
  L.marker(locations[key]).addTo(map).bindPopup(key);
}

function setSource(button) {
  document.querySelectorAll(".controls .button-group:first-of-type .node-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  selectedSource = button.textContent;
  console.log("Source set to:", selectedSource);
}

function setDestination(button) {
  document.querySelectorAll(".controls .button-group:nth-of-type(2) .node-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  selectedDestination = button.textContent;
  console.log("Destination set to:", selectedDestination);
}

async function getRoute() {
  const source = selectedSource;
  const destination = selectedDestination;
  const traffic = document.getElementById("traffic").value;

  if (!source || !destination) {
    document.getElementById("output").innerText = "Please select both source and destination";
    return;
  }

  if (source === destination) {
    document.getElementById("output").innerText = "Source and destination must be different";
    return;
  }

  try {
    console.log(`Fetching route: ${source} -> ${destination} (${traffic})`);
    
    const res = await fetch(
      `http://127.0.0.1:8000/route?source=${source}&destination=${destination}&traffic=${traffic}`
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("Route response:", data);

    document.getElementById("output").innerText =
      `Path: ${data.route.join(" → ")} | Distance: ${data.time}`;

    if (routeLine) map.removeLayer(routeLine);

    const pathCoords = data.route.map(p => locations[p]);

    routeLine = L.polyline(pathCoords, { color: "blue", weight: 5 }).addTo(map);
    map.fitBounds(routeLine.getBounds());
  } catch (error) {
    document.getElementById("output").innerText = `Error: ${error.message}`;
    console.error("Route error:", error);
  }
}
