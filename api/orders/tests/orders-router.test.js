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

describe("[GET] /api/orders/shipping-options", () => {
  test("returns 3 options", async () => {
    const response = await request(server).get("/api/orders/shipping-options");
    expect(response.body).toHaveLength(3);
  });
  test("returns status 200", async () => {
    const response = await request(server).get("/api/orders/shipping-options");
    expect(response.status).toBe(200);
  });
});

describe("[POST] /api/orders", () => {
  test("returns new order id", async () => {
    const testObj = {
      order: {
        first_name: "John",
        last_name: "Smith",
        email: "jsmith@gmail.com",
        shipping_city: "Boston",
        shipping_state: "MA",
        shipping_address: "12 College Street",
        shipping_zip: "09821",
        shipping_apartment: "",
        shipping_id: 1,
        status: "active",
        tax_rate: 7.0,
        notes: "Leave in Back",
      },
      bag: [
        {
          product_id: 1,
          quantity: 2,
          soldFor: 8,
        },
        {
          product_id: 2,
          quantity: 2,
          soldFor: 8,
        },
      ],
    };
    const response = await request(server).post("/api/orders").send(testObj);
    expect(response.body).toBe(3);
  });
  test("returns status 201", async () => {
    const testObj = {
      order: {
        first_name: "Brian",
        last_name: "Clark",
        email: "bClark@gmail.com",
        shipping_city: "Boston",
        shipping_state: "MA",
        shipping_address: "12 College Street",
        shipping_zip: "09821",
        shipping_apartment: "21",
        shipping_id: 1,
        status: "active",
        tax_rate: 7.0,
        notes: "",
      },
      bag: [
        {
          product_id: 1,
          quantity: 2,
          soldFor: 8,
        },
      ],
    };
    const response = await request(server).post("/api/orders").send(testObj);
    expect(response.status).toBe(201);
  });
  test("returns 400 on missing first name and email & correct message", async () => {
    const testObj = {
      order: {
        first_name: "",
        last_name: "Clark",
        email: "",
        shipping_city: "Boston",
        shipping_state: "MA",
        shipping_address: "12 College Street",
        shipping_zip: "09821",
        shipping_apartment: "21",
        shipping_id: 1,
        status: "active",
        tax_rate: 7.0,
        notes: "",
      },
      bag: [
        {
          product_id: 1,
          quantity: 2,
          soldFor: 8,
        },
      ],
    };
    const response = await request(server).post("/api/orders").send(testObj);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Order is missing the following entries: First Name Email "
    );
  });
  test("returns 400 and proper message on empty bag", async () => {
    const testObj = {
      order: {
        first_name: "Brian",
        last_name: "Clark",
        email: "bClark@gmail.com",
        shipping_city: "Boston",
        shipping_state: "MA",
        shipping_address: "12 College Street",
        shipping_zip: "09821",
        shipping_apartment: "21",
        shipping_id: 1,
        status: "active",
        tax_rate: 7.0,
        notes: "",
      },
      bag: [],
    };
    const response = await request(server).post("/api/orders").send(testObj);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("No items in bag");
  });
});

describe("[PUT] /api/orders/:id", () => {
  test("updates order id", async () => {
    await request(server).put("/api/orders/1").send({ status: "Cancelled" });
    const updatedOrder = await db("orders").where("order_id", 1).first();
    expect(updatedOrder.order_id).toBe(1);
    expect(updatedOrder.status).toBe("Cancelled");
  });
  test("returns status 200", async () => {
    const response = await request(server)
      .put("/api/orders/1")
      .send({ status: "Cancelled" });
    expect(response.status).toBe(200);
  });
  test("returns all orders", async () => {
    const response = await request(server)
      .put("/api/orders/1")
      .send({ status: "Cancelled" });
    expect(response.body).toHaveLength(2);
  });
  test("returns 404 in invalid ID", async () => {
    const response = await request(server)
      .put("/api/orders/99")
      .send({ status: "Cancelled" });
    expect(response.status).toBe(404);
  });
});
