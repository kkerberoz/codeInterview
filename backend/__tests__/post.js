const request = require("supertest");
const app = require("../src/server");

const postData = {
  title: "testpost",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
};

const publishData = {
  title: "let publish",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
};

const userData = {
  names: "mannal",
  username: "mannal",
  password: "test12",
};

describe("Get post Endpoint", () => {
  it("should respond with status code 200 if get post succeeds", async () => {
    const { statusCode, body } = await request(app).get("/posts").send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 1 will skip 1 first post and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=1`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 2 will skip 10 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=2`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 3 will skip 3 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=3`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 4 will skip 4 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=4`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 5 will skip 5 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=5`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 6 will skip 6 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=6`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 7 will skip 7 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=7`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 8 will skip 8 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=8`).send({});
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 200 if offset 9 will skip 9 first posts and limit 10 post", async () => {
    const { statusCode, body } = await request(app).get(`/posts?p=9`).send({});
    expect(statusCode).toEqual(200);
  });
});

describe("Create post Endpoint", () => {
  let token = null;
  beforeAll(async () => {
    await request(app).post("/register").send(userData);
    const res = await request(app)
      .post("/login")
      .send({ username: "mannal", password: "test12" });
    token = res.body.data.token;
  });

  it("should fail if auth fails", async () => {
    const { statusCode, body } = await request(app)
      .post("/post")
      .send(postData);
    expect(statusCode).toEqual(401);
  });

  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app)
      .post("/post")
      .set("Cookie", `jwt=${token};`)
      .send({});
    expect(statusCode).toEqual(400);
  });
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app)
      .post("/post")
      .set("Cookie", `jwt=${token};`)
      .send({ title: "mannal" });
    expect(statusCode).toEqual(400);
  });
  it("should fail if validation fails", async () => {
    const { statusCode, body } = await request(app)
      .post("/post")
      .set("Cookie", `jwt=${token};`)
      .send({
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      });
    expect(statusCode).toEqual(400);
  });
  it("should respond with status code 200 if create post succeeds", async () => {
    const { statusCode, body } = await request(app)
      .post("/post")
      .set("Cookie", `jwt=${token};`)
      .send(postData);
    expect(statusCode).toEqual(200);
  });
  it("should respond with status code 400 if post title is already exist", async () => {
    const { statusCode, body } = await request(app)
      .post("/post")
      .set("Cookie", `jwt=${token};`)
      .send(postData);
    expect(statusCode).toEqual(400);
  });
});

describe("Published post Endpoint", () => {
  let token = null;
  let postID = null;
  beforeAll(async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "mannal", password: "test12" });

    token = res.body.data.token;
    const post = await request(app)
      .post("/post")
      .set("Cookie", `jwt=${token};`)
      .send(publishData);
    postID = post.body.data.doc._id;
  });
  it("should fail if postID wrong", async () => {
    const { statusCode, body } = await request(app)
      .get("/post/5f980668c6f7e62f043a1211/publish")
      .set("Cookie", `jwt=${token};`);
    expect(statusCode).toEqual(400);
  });
  it("should respond with status code 200 if publish succeeds", async () => {
    const { statusCode, body } = await request(app)
      .get(`/post/${postID}/publish`)
      .set("Cookie", `jwt=${token};`);
    expect(statusCode).toEqual(200);
  });
  it("should error if postID is not _id", async () => {
    const { statusCode, body } = await request(app)
      .get("/post/1/publish")
      .set("Cookie", `jwt=${token};`);
    expect(statusCode).toEqual(500);
  });
});
