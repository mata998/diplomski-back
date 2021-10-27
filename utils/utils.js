const jwt = require("jsonwebtoken");
const fs = require("fs");
const VideoLib = require("node-video-lib");

function countSubStrings(string, subString) {
  return string.split(subString).length - 1;
}

function parseToken(token) {
  const parsed = jwt.verify(token, process.env.JWT_SECRET);

  return parsed.data;
}

function cookieParser(cookie) {
  if (!cookie) return {};

  const parsedObject = {};
  let keyvalue;

  cookie.split("; ").forEach((element) => {
    keyvalue = element.split("=");
    parsedObject[keyvalue[0]] = keyvalue[1];
  });

  return parsedObject;
}

function createToken(data, secret, expiresIn) {
  if (expiresIn) {
    return jwt.sign({ data }, secret, {
      expiresIn,
    });
  }

  return jwt.sign({ data }, secret);
}

function validateFingerprints(f1, f2) {
  f1 = JSON.parse(f1);
  f2 = JSON.parse(f2);

  if (
    f1.gpu == f2.gpu &&
    f1.cores == f2.cores &&
    f1.platform == f2.platform &&
    f1.orientation == f2.orientation
    // f1.screen == f2.screen
  ) {
    // Fingerprints matching
    return true;
  } else {
    // Fingerprints not matching
    console.log("\n\nPOSLAT\n");
    console.log(f1);
    console.log("\n\nPRAVI\n");
    console.log(f2);

    return false;
  }
}

function checkFingerPrint(f, array) {
  for (let i = 0; i < array.length; i++) {
    if (validateFingerprints(f, array[i])) {
      return true;
    }
  }

  return false;
}

function getVideoDuration(videoPath) {
  if (!videoPath.endsWith(".mp4")) {
    console.log("Not .mp4");
    return 0;
  }

  try {
    const fd = fs.openSync(videoPath, "r");
    let movie = VideoLib.MovieParser.parse(fd);
    // Work with movie
    const duration = Math.floor(movie.relativeDuration());

    return duration;
  } catch (err) {
    console.log("getVideoDuration error");
    console.log(err);
    return 0;
  }
}

function calculateVideoDurations(videosData) {
  videosData.forEach((video) => {
    video.duration = getVideoDuration(`volume-folder/${video.path}`);
  });
}

module.exports = {
  countSubStrings,
  parseToken,
  cookieParser,
  createToken,
  validateFingerprints,
  checkFingerPrint,
  getVideoDuration,
  calculateVideoDurations,
};
