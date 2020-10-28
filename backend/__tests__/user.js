const request = require("supertest");
const app = require("../src/server");
const Cookies = require("expect-cookies");
const agent = request.agent(app);

const userData = {
  names: "mannal",
  username: "nomoreisconny11",
  password: "test12",
};

describe("Register Endpoint", () => {
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app).post("/register").send({});
    expect(statusCode).toEqual(400);
  });
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app)
      .post("/register")
      .send({ names: "mannal" });
    expect(statusCode).toEqual(400);
  });
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app).post("/register").send({
      username: "nomoreisconny11",
    });
    expect(statusCode).toEqual(400);
  });
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app).post("/register").send({
      password: "test12",
    });
    expect(statusCode).toEqual(400);
  });
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app).post("/register").send({
      names: "mannal",
      username: "nomoreisconny11",
      password: "te",
    });
    expect(statusCode).toEqual(400);
  });
  it("should respond with status code 200 if register succeeds", async () => {
    const { statusCode, body } = await request(app)
      .post("/register")
      .send(userData);
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 400 if user already exists", async () => {
    const { statusCode } = await request(app).post("/register").send(userData);
    expect(statusCode).toEqual(400);
  });
});

describe("Login Endpoint", () => {
  let token = null;
  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "nomoreisconny11", password: "test12" });
    token = res.body.data.token;
  });

  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app).post("/login").send({});
    expect(statusCode).toEqual(401);
  });
  it("should fail if validation fails", async () => {
    const { statusCode } = await request(app)
      .post("/login")
      .send({ username: "nomoreisconny11", password: "pass" });
    expect(statusCode).toEqual(401);
  });
  it("should respond with status code 401 if password is wrong", async () => {
    const { statusCode } = await request(app)
      .post("/login")
      .send({ username: "nomoreisconny11", password: "password" });
    expect(statusCode).toEqual(401);
  });
  it("should respond with status code 401 if user does not exist", async () => {
    const { statusCode } = await request(app)
      .post("/login")
      .send({ username: "nomoreis", password: "password" });
    expect(statusCode).toEqual(401);
  });

  it("should respond with status code 200 if login succeeds", async () => {
    const { statusCode, body } = await request(app)
      .post("/login")
      .send({ username: "nomoreisconny11", password: "test12" })
      .expect(Cookies);
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 400 if user alredy login", async () => {
    const { statusCode, body } = await request(app)
      .post("/login")
      .set("Cookie", `jwt=${token};`)
      .send({ username: "nomoreisconny11", password: "test12" });
    expect(statusCode).toEqual(400);
  });
});

describe("Logout Endpoint", () => {
  let token = null;
  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "nomoreisconny11", password: "test12" });
    token = res.body.data.token;
  });

  it("should respond with status code 200 if logout succeeds", async () => {
    const { statusCode, body } = await request(app)
      .post("/logout")
      .set("Cookie", `jwt=${token};`);
    expect(statusCode).toEqual(200);
  });

  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app).post("/logout");
    expect(statusCode).toEqual(401);
  });
});
