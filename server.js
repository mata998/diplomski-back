// Express
const express = require("express");
const app = express();

// Requires
const fs = require("fs");
const util = require("util");
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

app.post("/video-upload", async function (req, res) {
  if (!req.files) {
    return res.json({ success: false, err: "No req.files" });
  }

  try {
    console.log(req.files.files);
    console.log(req.body.paths);

    const files = req.files.files;
    const paths = req.body.paths;

    const promises = [];

    files.forEach((file, index) => {
      const uploadPath = "volume-folder/" + paths[index];
      const dirPath = path.dirname(uploadPath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      file.mv = util.promisify(file.mv);

      promises.push(file.mv(uploadPath));
    });

    await Promise.all(promises);

    return res.send("File uploaded!");
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

app.listen(3000, function () {
  console.log(`Listening on port 3000!`);
});
