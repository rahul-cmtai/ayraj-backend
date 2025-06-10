const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Add middleware to parse JSON bodies

app.use(fileUpload())

app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Welcome to Ayraj API",
  });
});


app.use("/api/gallery", galleryRoutes);
app.use("/api/contacts", contactRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});