const request = require("supertest");
const app = require("../src/server");

describe("Server [GET /]", () => {
  it("should return status code 404", async () => {
    const { statusCode } = await request(app).get("/");
    expect(statusCode).toEqual(404);
  });
});
