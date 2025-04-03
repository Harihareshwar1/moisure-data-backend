import express from "express";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { configDotenv } from "dotenv";
configDotenv()
const app = express();
const PORT = process.env.PORT || 3000;

// Firebase configuration
const firebaseConfig = {
  databaseURL: "https://mannmathi-2d8c5-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// API route to fetch sensor data
app.get("/sensor-data", async (req, res) => {
  try {
    const dbRef = ref(db, "sensor_data"); // Path to the data
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      res.json({ success: true, data: snapshot.val() });
    } else {
      res.status(404).json({ success: false, message: "No data available" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching data", error: error.message });
  }
});
app.get("/trigger-analysis", async (req, res) => {
  try {
    await set(ref(db, "/analyse"), true);
    res.json({ message: "Analyse flag set to true" });
  } catch (error) {
    res.status(500).json({ error: "Error updating Firebase", details: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
