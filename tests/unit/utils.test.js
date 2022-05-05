const { JsonWebTokenError } = require("jsonwebtoken");
const {
  countSubStrings,
  parseToken,
  createToken,
} = require("../../utils/utils");
const jwt = require("jsonwebtoken");

jwt.verify = jest.fn();
jwt.sign = jest.fn();

describe("utils.countSubStrings", () => {
  test("should count substrings", () => {
    expect(countSubStrings("aa ssss aa sss", "aa")).toBe(2);
    expect(countSubStrings("aa ssss aa ssas", "a")).toBe(5);
    expect(countSubStrings("kgfjgkf", "aa")).toBe(0);
  });

  test("should be 0 if called without string param", () => {
    expect(countSubStrings()).toBe(0);
    expect(countSubStrings(undefined, "asd")).toBe(0);
    expect(countSubStrings(null, "asd")).toBe(0);
    expect(countSubStrings(undefined)).toBe(0);
    expect(countSubStrings(undefined, undefined)).toBe(0);
  });
});

describe("utils.parseToken", () => {
  test("should call jwt.verify(token, secret)", () => {
    // Mock data for jwt.verify
    const mockData = { data: { name: "some name" } };
    jwt.verify.mockReturnValue(mockData);

    const token = "aaaa";
    const parsed = parseToken(token);

    expect(jwt.verify).toBeCalledWith(token, process.env.JWT_SECRET);
    expect(parsed).toStrictEqual(mockData.data);
  });

  test("should throw error", () => {
    // Mock function for jwt.verify
    const mockFunction = jwt.verify.mockImplementation(() => {
      throw new JsonWebTokenError("jwt malformed");
    });

    const token = "aaaa";
    const parsed = () => parseToken(token);

    expect(mockFunction).toBeCalledWith(token, process.env.JWT_SECRET);
    expect(parsed).toThrow(JsonWebTokenError);
    expect(parsed).toThrow("jwt malformed");
  });
});

describe("utils.createToken", () => {
  test("should call jwt.sign with exipiresIn", () => {
    const mockData = "some data";
    const secret = "secret";
    const time = "2h";
    createToken(mockData, secret, time);

    expect(jwt.sign).toBeCalledWith({ data: mockData }, secret, {
      expiresIn: time,
    });
  });

  test("should call jwt.sign without exipiresIn", () => {
    const mockData = "some data";
    const secret = "secret";
    createToken(mockData, secret);

    expect(jwt.sign).toBeCalledWith({ data: mockData }, secret);
  });
});
