const db = require("../data/db-config");

const getOrders = async () => {
  const orders = await db("orders");
  const products = await db("orders_products");
  const product_info = await db("products");

  products.forEach((product) => {
    product.total = product.quantity * product.soldFor;
    product.info = product_info.filter((prod) => {
      return prod.product_id == product.product_id;
    });
  });

  orders.forEach((order) => {
    order.subtotal = 0;
    order.products = products.filter((product) => {
      return product.order_id === order.order_id;
    });
    order.products.forEach((product) => {
      order.subtotal += product.total;
    });
  });
  return orders;
};

const postOrder = async (order, bag) => {
  const newOrder = await db("orders").insert(order, "order_id");
  const bagToInsert = bag.map((prod) => {
    return { ...prod, order_id: newOrder[0] };
  });
  await db("orders_products").insert(bagToInsert);
  return newOrder[0];
};

const getShippingOptions = async () => {
  const options = await db("shipping_options");
  return options;
};

module.exports = { getOrders, getShippingOptions, postOrder };
