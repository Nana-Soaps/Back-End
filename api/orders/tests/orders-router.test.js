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

describe("[GET] /api/orders", () => {
  test("returns 2 orders", async () => {
    const response = await request(server).get("/api/orders");
    expect(response.body).toHaveLength(2);
  });
  test("returns status 200", async () => {
    const response = await request(server).get("/api/orders");
    expect(response.status).toBe(200);
  });
});
