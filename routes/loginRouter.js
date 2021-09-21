const express = require("express");
const router = express.Router();
const DB = require("../db-files/db-functions");
const { createToken, checkFingerPrint } = require("../utils/utils");

// dodati browser fp
router.post("/", async (req, res) => {
  try {
    const { userId, fingerprint } = req.body;

    // User data, his courses and  fingerprints
    const user = await DB.getUserForToken(userId);

    // User doesnt exist
    if (!user) {
      return res.send({ case: "register", msg: "User doesnt exist" });
    }

    // Fingerprints doesnt match
    if (!checkFingerPrint(fingerprint, user.fingerprints)) {
      return res.send({ case: "fingerprint", msg: "Bad fingerprint" });
    }

    //  Token creation
    const forToken = {
      userid: user.userid,
      role: user.role,
      courses: user.courses,
    };

    console.log("\n\nUser for token");
    console.log(forToken);
    console.log("\n\n");
    // console.log(forToken);
    const token = createToken(forToken, "2h");

    // Response
    const forUser = {
      userId: user.userid,
      name: user.name,
      mail: user.mail,
      role: user.role,
      courses: user.courses,
      token: token,
    };

    res.json({ case: "login", data: forUser });
  } catch (err) {
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

module.exports = router;
