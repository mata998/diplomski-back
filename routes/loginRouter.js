const express = require("express");
const router = express.Router();
const DB = require("../db-files/db-functions");
const { createToken, checkFingerPrint } = require("../utils/utils");
const { userFromTokenMid } = require("../middlewares/middlewares");

async function login(userId, fingerprint, loginToken) {
  // User data, his courses and  fingerprints
  const user = await DB.getUserForToken(userId);

  // console.log(user);

  // User doesnt exist
  if (!user) {
    // return res.send({ case: "register", msg: "User doesnt exist" });
    return { case: "register", msg: "User doesnt exist" };
  }

  // Fingerprints doesnt match
  if (!checkFingerPrint(fingerprint, user.fingerprints)) {
    // return res.send({ case: "fingerprint", msg: "Bad fingerprint" });
    return { case: "fingerprint", msg: "Bad fingerprint" };
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

  let newLoginToken;

  if (loginToken) {
    newLoginToken = loginToken;
  } else {
    // Login token creation
    newLoginToken = createToken(
      { userid: user.userid },
      process.env.JWT_LOGINTOKEN_SECRET
    );

    // Insert login token into logintoken table
    const data = await DB.createLoginToken(user.userid, newLoginToken);
  }

  // Response
  const forUser = {
    name: user.name,
    mail: user.mail,
    role: user.role,
    courses: user.courses,
    token: token,
    loginToken: newLoginToken,
  };

  return { case: "login", data: forUser };
}

router.post("/", async (req, res) => {
  try {
    const { userId, fingerprint } = req.body;

    const respData = await login(userId, fingerprint);

    res.json(respData);
  } catch (err) {
    console.log(err);
    res.json({ success: false, err: err.message });
  }
});

router.post("/autologin", async (req, res) => {
  try {
    const { loginToken, fingerprint } = req.body;

    const rows = await DB.getWhere("logintoken", "logintoken", loginToken);

    const userId = rows[0].userid;
    console.log(userId);

    const respData = await login(userId, fingerprint, loginToken);

    res.json(respData);
  } catch (err) {
    console.log(err);
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
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const loginToken = req.body.loginToken;

    const data = await DB.logout(loginToken);

    console.log(`Logout successful`);
    res.json({ success: true, msg: "Logout successful" });
  } catch (err) {
    console.log("Failed logout");
    console.log(err.message);
    res.json({ success: false, err: err.message });
  }
});

module.exports = router;
