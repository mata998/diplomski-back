// Express
const express = require("express");
const app = express();

// Requires
const cors = require("cors");
const fileUpload = require("express-fileupload");

// env?
require("dotenv").config();

// Routes requires
const coursesRouter = require("./routes/coursesRouter");
const loginRouter = require("./routes/loginRouter");
const adminRouter = require("./routes/adminRouter");
const { userFromTokenMid, isAdminMid } = require("./middlewares/middlewares");

// Cors options
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5000",
    "http://35.198.186.251:5000",
    "http://138.3.250.151:5000",
    "http://185.187.169.222:5000",
  ],
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Routes
app.use("/api/courses", coursesRouter);
app.use("/api/login", loginRouter);
app.use("/api/admin", userFromTokenMid, isAdminMid, adminRouter);

app.listen(3000, () => {
  console.log(`Listening on port 3000!`);
});

app.get("/test", async (req, res) => {
  console.log(`sifra: ${process.env.NESTO}`);

  res.json({ msg: "ok" });
});

exports = app;
