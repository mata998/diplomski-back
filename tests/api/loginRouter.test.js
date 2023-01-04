// require("iconv-lite").encodingExists("foo");

const request = require("supertest");
const app = require("../../app");
const pool = require("../../db-files/mysql-connection");

const endpointUrl = "/api/login/";

afterAll((done) => {
  pool.end();
  done();
});

describe("/test", () => {
  test("get test", async () => {
    const response = await request(app).get("/test");

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ msg: "ok" });
  });
});
