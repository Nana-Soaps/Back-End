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

describe("getShippingOptions", () => {
  test("returns 3 shipping options", async () => {
    const response = await Orders.getShippingOptions();
    expect(response).toHaveLength(3);
  });
  test("each option has the correct properties", async () => {
    const response = await Orders.getShippingOptions();
    expect(response[2]).toHaveProperty("shipping_name");
    expect(response[2]).toHaveProperty("shipping_id");
    expect(response[2]).toHaveProperty("cost");
  });
});

describe("postOrder", () => {
  test("adds new entry to orders table", async () => {
    const testOrder = {
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
    };
    const testBag = [
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
    ];

    await Orders.postOrder(testOrder, testBag);
    const allOrders = await db("orders");
    expect(allOrders).toHaveLength(3);
  });
  test("adds 2 new entries to orders_products table", async () => {
    const testOrder = {
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
    };
    const testBag = [
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
    ];

    await Orders.postOrder(testOrder, testBag);
    const allOrderProducts = await db("orders_products");
    expect(allOrderProducts).toHaveLength(7);
  });
  test("new order_products entry has correct order_id", async () => {
    const testOrder = {
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
    };
    const testBag = [
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
    ];

    await Orders.postOrder(testOrder, testBag);
    const allOrderProducts = await db("orders_products");
    expect(allOrderProducts[6].order_id).toBe(3);
  });
  test("returns newOrder id", async () => {
    const testOrder = {
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
    };
    const testBag = [
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
    ];

    const response = await Orders.postOrder(testOrder, testBag);
    expect(response).toBe(3);
  });
});
