const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const {
  countSubStrings,
  parseToken,
  createToken,
} = require("../../utils/utils");

describe("Create and parse token", () => {
  test("should create and parse correctly", () => {
    const data = {
      name: "Bob",
      mail: "bob@bob.com",
    };

    const token = createToken(data, process.env.JWT_SECRET);

    const parsed = parseToken(token);

    expect(parsed).toStrictEqual(data);
  });

  test("should create and parse correctly with expiry", () => {
    const data = {
      name: "Bob",
      mail: "bob@bob.com",
    };

    const token = createToken(data, process.env.JWT_SECRET, "1h");
    const parsed = parseToken(token);

    expect(parsed).toStrictEqual(data);
  });

  test("expiry fail", async () => {
    const data = {
      name: "Bob",
      mail: "bob@bob.com",
    };

    const token = createToken(data, process.env.JWT_SECRET, "0.001ms");

    await sleep(0.1);

    const parsed = () => parseToken(token);

    expect(parsed).toThrow(TokenExpiredError);
    expect(parsed).toThrow("jwt expired");
  });
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
