const express = require("express");
const router = express.Router();
const DB = require("../db-files/db-functions");
const { createToken, checkFingerPrint } = require("../utils/utils");
const { userFromTokenMid } = require("../middlewares/middlewares");

async function login(userId, fingerprint, loginToken) {
  // User data, his courses and  fingerprints
  const user = await DB.getUserForToken(userId);

  // User doesnt exist
  if (!user) {
    return { case: "register", msg: "User doesnt exist" };
  }

  // Fingerprints dont match
  if (!checkFingerPrint(fingerprint, user.fingerprints)) {
    return { case: "fingerprint", msg: "Bad fingerprint" };
  }

  // normal login
  if (!loginToken) {
    // user.logintoken exists
    if (user.logintoken) {
      loginToken = user.logintoken;
    }
    // user.logintoken doesnt exist
    else {
      // create new
      loginToken = createToken(
        { userid: user.userid },
        process.env.JWT_LOGINTOKEN_SECRET
      );

      // Update login token in user table
      const data = await DB.updateLoginToken(user.userid, loginToken);
    }
  }

  //  Token creation
  const forToken = {
    userid: user.userid,
    role: user.role,
    courses: user.courses,
  };

  console.log("User for token");
  console.log(forToken);
  const token = createToken(forToken, process.env.JWT_SECRET, "10h");

  // Response
  const forUser = {
    name: user.name,
    mail: user.mail,
    role: user.role,
    courses: user.courses,
    token: token,
    loginToken: loginToken,
  };

  return { case: "login", data: forUser };
}

router.post("/", async (req, res) => {
  try {
    const { userId, fingerprint } = req.body;

    const respData = await login(userId, fingerprint);

    res.json(respData);
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.post("/autologin", async (req, res) => {
  try {
    const { loginToken, fingerprint } = req.body;

    // Get userid from logintoken
    const rows = await DB.getWhere("user", "logintoken", loginToken);

    const userId = rows[0].userid;

    const respData = await login(userId, fingerprint, loginToken);

    res.json(respData);
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = req.body;

    await DB.registerUser(user);

    console.log(`Uspesan register: ${user.name}`);
    console.log(user);
    res.json({ success: true, data: user.uid });
  } catch (err) {
    console.log("Neuspesan register");
    console.log(err);
    res.json({ success: false, err: err.message });
  }
});

router.patch("/logoutdevices", userFromTokenMid, async (req, res) => {
  try {
    const user = req.user;

    const data = await DB.deleteLoginToken(user.userid);

    console.log(`Login token removed for ${user.name}`);
    res.json({ success: true, msg: "Logout successful" });
  } catch (err) {
    console.log("Failed logout");
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.post("/refresh-token", userFromTokenMid, async (req, res) => {
  try {
    const user = req.user;
    const fingerprint = req.body.fingerprint;

    const rows = await DB.getUserFingerprints(user.userid);

    // Fingerprints match
    if (checkFingerPrint(fingerprint, rows)) {
      const token = createToken(user, process.env.JWT_SECRET, "10h");

      return res.json({ success: true, data: token });
    }
    // Fingerprints dont match
    else {
      return res.json({
        success: false,
        err: "Bad fingerprint for refresh token",
      });
    }
  } catch (err) {
    console.log("Error in refresh token");
    console.log(err.message);
    return res.json({ success: false, err: err.message });
  }
});

module.exports = router;
