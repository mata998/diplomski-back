const { cookieParser, parseToken } = require("../utils/utils");

function userFromTokenMid(req, res, next) {
  try {
    const cookies = cookieParser(req.headers.cookie);
    if (cookies.token) {
      // Add user object to req
      req.user = parseToken(cookies.token);

      next();
    } else {
      res.json({ success: false, err: "Nema tokena" });
    }
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
}

function isAdminMid(req, res, next) {
  const user = req.user;

  // User is admin
  if (user.role == "admin") {
    next();
  }
  // User is not admin
  else {
    return res.json({ success: false, msg: "nije admin" });
  }
}

module.exports = { userFromTokenMid, isAdminMid };
