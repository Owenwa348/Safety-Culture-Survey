const express = require("express");
const cors = require("cors");
// const uploadRoutes = require("./routes/excelUploadRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// app.use("/excel-upload", uploadRoutes);
app.get('/', (req, res) => {
  res.send('Backend API is running 🚀');
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
