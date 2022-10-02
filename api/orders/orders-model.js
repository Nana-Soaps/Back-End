const db = require("../data/db-config");

const getOrders = async () => {
  const orders = await db("orders");
  const products = await db("orders_products");
  const product_info = await db("products");
  const shipping_options = await db("shipping_options");

  products.forEach((product) => {
    product.total = product.quantity * product.soldFor;
    product.info = product_info.filter((prod) => {
      return prod.product_id == product.product_id;
    });
  });

  orders.forEach((order) => {
    order.subtotal = 0;
    order.shipping = shipping_options.find((option) => {
      return option.shipping_id == order.shipping_id;
    });
    order.products = products.filter((product) => {
      return product.order_id === order.order_id;
    });
    order.products.forEach((product) => {
      order.subtotal += product.total;
    });
  });
  return orders;
};

const getOrderById = async (id) => {
  const orders = await getOrders();
  const order = orders.find((cur) => cur.order_id == id);
  return order;
};

const postOrder = async (order, bag) => {
  const newOrder = await db("orders").insert(order, "order_id");
  const bagToInsert = bag.map((prod) => {
    return { ...prod, order_id: newOrder[0] };
  });
  await db("orders_products").insert(bagToInsert);
  return newOrder[0];
};

const updateOrder = async (order_id, updates) => {
  await db("orders").where("order_id", order_id).update(updates);
  const allOrders = getOrders();
  return allOrders;
};

const getShippingOptions = async () => {
  const options = await db("shipping_options");
  return options;
};

module.exports = {
  getOrders,
  getShippingOptions,
  postOrder,
  updateOrder,
  getOrderById,
};
