const db = require("../data/db-config");

const checkOrder = (req, res, next) => {
  const { order } = req.body;
  const {
    first_name,
    last_name,
    email,
    shipping_city,
    shipping_state,
    shipping_address,
    shipping_zip,
    shipping_id,
    status,
    tax_rate,
    notes,
  } = order;
  if (
    !first_name ||
    !last_name ||
    !email ||
    !shipping_city ||
    !shipping_state ||
    !shipping_address ||
    !shipping_zip ||
    !shipping_id
  ) {
    next({
      status: 400,
      message: `Order is missing the following entries: ${
        first_name ? "" : "First Name "
      }${last_name ? "" : "Last Name "}${email ? "" : "Email "}${
        shipping_city ? "" : "City "
      }${shipping_state ? "" : "state "}${shipping_address ? "" : "address "}${
        shipping_zip ? "" : "Zip code "
      }${shipping_id ? "" : "Shipping Method "}`,
    });
  } else {
    next();
  }
};

const checkBag = (req, res, next) => {
  const { bag } = req.body;
  if (bag.length < 1) {
    next({ status: 400, message: "No items in bag" });
  } else {
    next();
  }
};

const checkIdExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await db("orders").where("order_id", id).first();
    if (order) {
      next();
    } else {
      next({ status: 404, message: `Order id ${id} does not exist` });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { checkOrder, checkBag, checkIdExists };
