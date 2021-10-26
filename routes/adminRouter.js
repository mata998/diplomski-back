const express = require("express");
const router = express.Router();
const util = require("util");
const fs = require("fs");
const path = require("path");
const DB = require("../db-files/db-functions");

// Is admin

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

router.get("/requested-courses", async (req, res) => {
  try {
    const rows = await DB.getAllRequestedCourses();

    res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.patch("/approve-course", async (req, res) => {
  try {
    const userId = req.body.userId;
    const courseId = req.body.courseId;

    const resp = await DB.approveCourseRequest(userId, courseId);

    if (resp.affectedRows == 1) {
      return res.json({ success: true, msg: "Course approved" });
    } else {
      return res.json({ success: false, err: resp });
    }
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.post("/delete-usercourse", async (req, res) => {
  try {
    const userId = req.body.userId;
    const courseId = req.body.courseId;

    const resp = await DB.deleteUserCourse(userId, courseId);

    if (resp.affectedRows == 1) {
      return res.json({ success: true, msg: "Usercourse deleted" });
    } else {
      return res.json({ success: false, err: resp });
    }
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

    // Delete video from fs
    const fullPath = `volume-folder/${videoPath}`;
    fs.unlinkSync(fullPath);

    const dirPath = path.dirname(fullPath);

    // If folder is empy, delete it
    if (fs.readdirSync(dirPath).length === 0) {
      fs.rmdirSync(dirPath);
    }

    // Delete from table videos
    await DB.deleteVideo(videoId);

    res.json({ success: true, msg: "Video deleted" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.post("/videos", async function (req, res) {
  if (!req.files) {
    return res.json({ success: false, err: "No req.files" });
  }

  try {
    // req.files.files can be array or single object,
    // if its an obj, put it in array
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];

    const paths = Array.isArray(req.body.paths)
      ? req.body.paths
      : [req.body.paths];

    console.log(files);
    console.log(paths);

    const videosDB = [];

    const promises = [];

    // Upload to fs

    files.forEach((file, index) => {
      // "Novi folder/Unutrasnji folder/video.mp4"
      const videoPath = paths[index];

      const uploadPath = `volume-folder/${videoPath}`;
      const dirPath = path.dirname(uploadPath);

      // If file exists throw err
      if (fs.existsSync(uploadPath)) {
        throw new Error("Error: That file exists");
      }

      // If folder doesnt exist, create it
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Promisify .mv function
      file.mv = util.promisify(file.mv);

      // Add create file promise to promises arr
      promises.push(file.mv(uploadPath));

      // videoDB object
      videoObj = {
        courseid: videoPath.split("/")[0],
        name: path.basename(videoPath),
        path: videoPath,
      };

      // Add video object to videosDB arr for db insert
      videosDB.push(videoObj);
    });

    // Every file uploaded
    await Promise.all(promises);

    // Add to db
    const result = await DB.insertVideos(videosDB);
    console.log(result);

    return res.json({ success: true, msg: "Files uploaded" });
  } catch (err) {
    // console.log(err.message);
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.delete("/folder", async function (req, res) {
  try {
    const path = req.query.path;

    // Delete from table video
    const data = await DB.deleteVideosInFolder(path);
    console.log(data);

    if (data.affectedRows > 0) {
      // Delete folder
      const fullPath = `volume-folder/${path}`;
      fs.rmdirSync(fullPath, { recursive: true });

      res.json({ success: true, msg: "Folder deleted" });
    } else {
      res.json({ success: false, err: "0 rows deleted" });
    }
  } catch (err) {
    console.log(err);
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
