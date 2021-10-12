const shipping_options = [
  {
    shipping_name: "Standard Shipping",
    shipping_description: "4-7 Business Days",
    cost: 4.5,
  },
  {
    shipping_name: "Priority Shipping",
    shipping_description: "3-5 Business Days",
    cost: 9.5,
  },
  {
    shipping_name: "2-Day Shipping",
    shipping_description: "2 Business Days",
    cost: 15.0,
  },
];

exports.shipping_options = shipping_options;

exports.seed = function (knex) {
  return knex("shipping_options").insert(shipping_options);
};
