const Orders = require("../orders-model");
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

describe("getOrders", () => {
  test("returns 2 orders", async () => {
    const response = await Orders.getOrders();
    expect(response).toHaveLength(2);
  });
  test("has products and subtotal property", async () => {
    const response = await Orders.getOrders();
    expect(response[0]).toHaveProperty("products");
    expect(response[0]).toHaveProperty("subtotal");
  });
  test("products have info property", async () => {
    const response = await Orders.getOrders();
    expect(response[0].products[0]).toHaveProperty("info");
  });
});