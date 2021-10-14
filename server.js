// Express
const express = require("express");
const app = express();

// Requires
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Routes requires
const courseRouter = require("./routes/courseRouter");
const loginRouter = require("./routes/loginRouter");
const adminRouter = require("./routes/adminRouter");
const { userFromTokenMid, isAdminMid } = require("./middlewares/middlewares");

// Cors options
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  credentials: true,
};

// Middlewares
app.use(express.static(path.join(__dirname, "build")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());

// Routes
app.use("/api/courses", courseRouter);
app.use("/api/login", loginRouter);
app.use("/api/admin", userFromTokenMid, isAdminMid, adminRouter);

app.listen(3000, function () {
  console.log(`Listening on port 3000!`);
});
