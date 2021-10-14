const jwt = require("jsonwebtoken");

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

function createToken(data, expiresIn) {
  const token = jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn,
  });

  return token;
}

function validateFingerprints(f1, f2) {
  f1 = JSON.parse(f1);
  f2 = JSON.parse(f2);

  if (
    f1.gpu == f2.gpu &&
    f1.cores == f2.cores &&
    f1.platform == f2.platform &&
    f1.orientation == f2.orientation
    // f1.screen == f2.screen &&
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

module.exports = {
  parseToken,
  cookieParser,
  createToken,
  validateFingerprints,
  checkFingerPrint,
};
