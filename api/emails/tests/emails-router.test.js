const request = require("supertest");
const server = require("../../server");
const db = require("../../data/db-config");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

it("sanity check", () => {
  expect(true).not.toBe(false);
});

describe("[POST] /api/emails", () => {
  test("Can successfully send a basic email", async () => {
    const response = await request(server).post("/api/emails");
    expect(response.status).toBe(200);
  });
});
