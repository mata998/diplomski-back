const pool = require("./mysql-connection");

// Abstract

async function getAll(tableName) {
  const rows = await pool.query(`select * from ${tableName}`);

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("0 rows found");
  }
}

async function getWhere(tableName, field, value) {
  const rows = await pool.query(
    `select * from ${tableName} where ${field} = ?`,
    [value]
  );

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("0 rows found");
  }
}

// Users

async function getUnlockedCourses(userId) {
  const rows = await pool.query(
    `
    select c.* from usercourse uc
    join course c on (uc.courseid = c.courseid)
    where 
    	uc.userid = ? and 
      uc.finishedat is null and
      uc.unlockedat is not null 
  `,
    [userId]
  );

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("No courses found");
  }
}

async function getUserForToken(userId) {
  const data = await pool.query(
    `
    select u.*, uc.courseid, uf.fingerprint from user u
	    left join usercourse uc on (u.userid = uc.userid)
      left join userfingerprint uf on (u.userid = uf.userid)
    where 
        u.userid = ?
    `,
    [userId]
  );

  if (data.length == 0) {
    return undefined;
  }

  const user = data[0];
  user.courses = [...new Set(data.map((row) => row.courseid))];
  user.fingerprints = [...new Set(data.map((row) => row.fingerprint))];

  return user;
}

async function registerUser(user) {
  await pool.query(
    `
    INSERT INTO user (userid, name, mail, role)
    VALUES (?, ?, ?, "user")  
    `,
    [user.uid, user.name, user.mail]
  );

  await pool.query(
    `
    INSERT INTO userfingerprint (userid, fingerprint)
    VALUES (?, ?)
  `,
    [user.uid, user.fingerprint]
  );
}

async function deleteUser(userId) {
  await pool.query(`delete from user where userid=?`, [userId]);
  await pool.query(`delete from userfingerprint where userid=?`, [userId]);
  await pool.query(`delete from usercourse where userid=?`, [userId]);
}

// Courses

async function createCourse({ name, description }) {
  const res = await pool.query(
    `
    INSERT INTO course (name, description) VALUES (?,?)
    `,
    [name, description]
  );

  return res.insertId;
}

async function deleteCourse(courseId) {
  await pool.query(`delete from course where courseid=?`, [courseId]);
  await pool.query(`delete from usercourse where courseid=?`, [courseId]);
  await pool.query(`delete from video where courseid=?`, [courseId]);
}

// Videos

async function deleteVideo(videoId) {
  await pool.query(`delete from video where videoid=?`, [videoId]);
}

async function insertVideos(videosDB) {
  const res = await pool.query(
    "INSERT INTO video (courseid, name, path) VALUES ?",
    [videosDB.map((video) => [video.courseid, video.name, video.path])]
  );

  return res;
}

module.exports = {
  pool,
  getAll,
  getWhere,
  getUnlockedCourses,
  getUserForToken,
  registerUser,
  createCourse,
  deleteCourse,
  deleteUser,
  deleteVideo,
  insertVideos,
};
