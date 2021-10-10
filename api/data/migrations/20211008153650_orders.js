exports.up = async function (knex) {
  await knex.schema.createTable("orders", (tbl) => {
    tbl.increments("order_id");
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.string("first_name").notNullable();
    tbl.string("last_name").notNullable();
    tbl.string("email").notNullable();
    tbl.string("shipping_city").notNullable();
    tbl.string("shipping_state").notNullable();
    tbl.string("shipping_address").notNullable();
    tbl.string("shipping_zip").notNullable();
    tbl.string("shipping_apartment");
    tbl
      .integer("shipping_id")
      .unsigned()
      .notNullable()
      .references("shipping_id")
      .inTable("shipping_options")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.string("status").notNullable();
    tbl.float("tax");
    tbl.string("notes");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("orders");
};
