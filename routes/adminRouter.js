const express = require("express");
const router = express.Router();
const fs = require("fs");
const DB = require("../db-files/db-functions");
const { userFromTokenMid, isAdminMid } = require("../middlewares/middlewares");
const { createToken, checkFingerPrint } = require("../utils/utils");

router.get("/isadmin", async (req, res) => {
  try {
    return res.json({ success: true, msg: "jeste admin" });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

// Courses

router.post("/create-course", async (req, res) => {
  try {
    const course = req.body;

    // Create course in db
    const id = await DB.createCourse(course);

    // Create course folder
    const path = `volume-folder/${id}/${course.name}`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }

    res.json({ success: true, msg: "Course created" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.delete("/delete-course/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Delete from tables  course, vide, usercourse
    await DB.deleteCourse(courseId);

    // Delete folder
    const path = `volume-folder/${courseId}`;
    fs.rmdirSync(path, { recursive: true });

    res.json({ success: true, msg: "Course deleted" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

// Videos

router.delete("/videos/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;

    // Get video
    const rows = await DB.getWhere("video", "videoid", parseInt(videoId));
    const video = rows[0];

    console.log(video);

    // Video path
    const videoPath = video.path;

    // Delete from table videos
    await DB.deleteVideo(videoId);

    // Delete video from fs
    const path = `volume-folder/${videoPath}`;
    fs.unlinkSync(path);

    res.json({ success: true, msg: "Video deleted" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

// Users

router.get("/users", async (req, res) => {
  try {
    const users = await DB.getWhere("user", "role", "user");

    return res.json({ success: true, data: users });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    await DB.deleteUser(userId);

    res.json({ success: true, msg: "User deleted" });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

router.get("/creators", async (req, res) => {
  try {
    const users = await DB.getWhere("user", "role", "creator");

    return res.json({ success: true, data: users });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

module.exports = router;
