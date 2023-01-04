const pool = require("./mysql-connection");

// Abstract

async function getAll(tableName) {
  const [rows, fields] = await pool.query(`select * from ${tableName}`);

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("0 rows found");
  }
}

async function getWhere(tableName, field, value) {
  const [rows, fields] = await pool.query(
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

async function getUserForToken(userId) {
  const [rows, fields] = await pool.query(
    `
    select u.*, uc.courseid, uc.unlockedat, uc.finishedat, uf.fingerprint 
    from user u
	    left join usercourse uc on (u.userid = uc.userid)
      left join userfingerprint uf on (u.userid = uf.userid)
    where 
        u.userid = ?
    `,
    [userId]
  );

  if (rows.length == 0) {
    return undefined;
  }

  // console.log(rows);

  const user = rows[0];

  user.courses = [];
  rows.forEach((row) => {
    if (row.unlockedat != null && row.finishedat == null) {
      user.courses.push(row.courseid);
    }
  });
  user.courses = [...new Set(user.courses)];

  user.fingerprints = [
    ...new Set(rows.map((row) => JSON.stringify(row.fingerprint))),
  ];

  return user;
}

async function registerUser(user) {
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    await connection.query(
      `
        INSERT INTO user (userid, name, mail, role)
        VALUES (?, ?, ?, "user")  
      `,
      [user.uid, user.name, user.mail]
    );

    await connection.query(
      `
        INSERT INTO userfingerprint (userid, fingerprint)
        VALUES (?, ?)
      `,
      [user.uid, JSON.stringify(user.fingerprint)]
    );

    connection.commit();
    connection.release();
  } catch (err) {
    connection.rollback();
    connection.release();
    console.log("Transaction rolled back");
    throw err;
  }
}

async function deleteUser(userId) {
  const [data, smth] = await pool.query(`delete from user where userid=?`, [
    userId,
  ]);
  return data;
}

async function updateLoginToken(userId, loginToken) {
  const [data, smth] = await pool.query(
    `
    update user 
    set logintoken=? 
    where userid=?
    `,
    [loginToken, userId]
  );

  return data;
}

async function deleteLoginToken(userId) {
  const [data, smth] = await pool.query(
    `
    update user 
    set logintoken = NULL 
    where userid = ?
    `,
    [userId]
  );

  return data;
}

async function getUserFingerprints(userId) {
  const [rows, fields] = await pool.query(
    `
    select fingerprint
    from userfingerprint
    where 
      userid = ?
  `,
    [userId]
  );

  if (rows.length != 0) {
    return rows.map((row) => row.fingerprint);
  } else {
    throw new Error("No courses found");
  }
}

// Courses

async function getUnlockedCourses(userId) {
  const [rows, fields] = await pool.query(
    `
    select c.* from usercourse uc
    join course c on (uc.courseid = c.courseid)
    where 
    	uc.userid = ? and 
      uc.unlockedat is not null and
      uc.finishedat is null 
  `,
    [userId]
  );

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("No courses found");
  }
}

async function getAllCoursesForUser(userId) {
  const [rows, fields] = await pool.query(
    `
    select c.*, uc.userid, uc.unlockedat, uc.finishedat 
    from course c
      left join (select * from usercourse where userid = ?) uc 
        on (c.courseid = uc.courseid)
    order by 
      uc.finishedat asc, 
      uc.userid asc, 
      uc.unlockedat asc
  `,
    [userId]
  );

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("No courses found");
  }
}

async function requestCourse(userId, courseId) {
  const [data, smth] = await pool.query(
    `
    INSERT INTO usercourse(userid, courseid) VALUES (?,?)
    `,
    [userId, courseId]
  );
}

async function getAllRequestedCourses() {
  const [rows, fields] = await pool.query(
    `
    select u.userid, u.name as username, c.courseid, c.name as coursename 
    from usercourse uc
      join user u on (uc.userid = u.userid)
      join course c on (uc.courseid = c.courseid)
     where 
      uc.unlockedat is null and 
      uc.finishedat is null
    order by c.courseid
  `
  );

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("No requests found");
  }
}

async function approveCourseRequest(userId, courseId) {
  const [data, smth] = await pool.query(
    `
    update usercourse
    set unlockedat =  SYSDATE()
    where 
      userid = ? and 
      courseid = ? and
      unlockedat is null
    `,
    [userId, courseId]
  );

  return data;
}

async function deleteUserCourse(userId, courseId) {
  const [data, smth] = await pool.query(
    `
    delete from usercourse
    where 
      userid = ? and 
      courseid = ?
    `,
    [userId, courseId]
  );

  return data;
}

async function createCourse({ name, description }) {
  const [data, smth] = await pool.query(
    `
    INSERT INTO course (name, description) VALUES (?,?)
    `,
    [name, description]
  );

  return data.insertId;
}

async function deleteCourse(courseId) {
  const [data, smth] = await pool.query(`delete from course where courseid=?`, [
    courseId,
  ]);

  return data;
}

// Videos

async function getVideosSorted(courseId) {
  const [rows, fields] = await pool.query(
    `
    select *
    from video
    where courseid = ?
    order by path
  `,
    [courseId]
  );

  if (rows.length != 0) {
    return rows;
  } else {
    throw new Error("No videos found");
  }
}

async function deleteVideo(videoId) {
  const [data, smth] = await pool.query(`delete from video where videoid=?`, [
    videoId,
  ]);

  return data;
}

async function insertVideos(videosData) {
  const [data, fields] = await pool.query(
    "INSERT INTO video (courseid, name, path, duration) VALUES ?",
    [
      videosData.map((video) => [
        video.courseid,
        video.name,
        video.path,
        video.duration,
      ]),
    ]
  );

  return data;
}

async function deleteVideosInFolder(path) {
  const [data, smth] = await pool.query(
    `
    delete from video 
    where path like CONCAT(?, "%")
    `,
    [path]
  );

  return data;
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
  getAllCoursesForUser,
  requestCourse,
  getAllRequestedCourses,
  approveCourseRequest,
  deleteUserCourse,
  deleteVideosInFolder,
  updateLoginToken,
  deleteLoginToken,
  getVideosSorted,
  getUserFingerprints,
};
