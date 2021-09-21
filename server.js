// Express
const express = require("express");
const app = express();

// Requires
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// DB
const DB = require("./db-files/db-functions");

// Routes requires
const courseRouter = require("./routes/courseRouter");
const loginRouter = require("./routes/loginRouter");
const adminRouter = require("./routes/adminRouter");
const { userFromTokenMid, isAdminMid } = require("./middlewares/middlewares");

// Middlewares
app.use(express.static(path.join(__dirname, "build")));

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Routes
app.use("/api/course", courseRouter);
app.use("/api/login", loginRouter);
app.use("/api/admin", userFromTokenMid, isAdminMid, adminRouter);

// API

app.post("/video-upload", function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.inputVideo;
  uploadPath = "volume-folder/" + sampleFile.name;

  console.log(uploadPath);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
  });
});

app.get("/mysql", async (req, res) => {
  try {
    const data = await DB.getWhere("video", "courseid", 1);

    res.json(data);
  } catch (err) {
    res.json({ err });
  }
});

app.listen(3000, function () {
  console.log(`Listening on port 3000!`);
});
