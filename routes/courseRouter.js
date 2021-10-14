const express = require("express");
const fs = require("fs");
const router = express.Router();
const DB = require("../db-files/db-functions");
const { userFromTokenMid } = require("../middlewares/middlewares");

// api/course/

router.get("/", async (req, res) => {
  try {
    const data = await DB.getAll("course");

    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

router.get("/info/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const data = await DB.getWhere("course", "courseid", courseId);

    const course = data[0];

    res.json({ success: true, data: course });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

router.get("/unlocked", userFromTokenMid, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);

    const userId = user.userid;

    const data = await DB.getUnlockedCourses(userId);

    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

router.get("/videos/:courseId", userFromTokenMid, async (req, res) => {
  try {
    const user = req.user;
    const courseId = parseInt(req.params.courseId);

    if (user.role != "admin" && !user.courses.includes(courseId)) {
      console.log("Korisnik nema pravo na kursss");
      return res.json({ success: false, err: "You dont own this course" });
    }

    const data = await DB.getWhere("video", "courseid", courseId);

    res.json({ success: true, data });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
});

router.get("/video", userFromTokenMid, function (req, res) {
  console.log("pogadja se video ruta");
  try {
    const user = req.user;
    const videoName = req.query.name;

    const courseId = videoName.split("/")[0];

    if (!user.courses.includes(parseInt(courseId))) {
      return res.send({ msg: "KUDA???" });
    }

    const path = `volume-folder/${videoName}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const CHUNK_SIZE = 10 ** 6;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

      if (start >= fileSize) {
        res
          .status(416)
          .send(
            "Requested range not satisfiable\n" + start + " >= " + fileSize
          );
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      return res.json({ msg: "deces poso" });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
});

module.exports = router;
