

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    username TEXT NOT NULL ,
    credit INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    user_id INTEGER NOT NULL ,
    product_id INTEGER NOT NULL ,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS vending_machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    name TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS vending_machine_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    vending_machine_id INTEGER NOT NULL ,
    slot_number INTEGER NOT NULL ,
    product_id INTEGER DEFAULT NULL, -- NULL if empty
    quantity INTEGER NOT NULL DEFAULT 0,

    UNIQUE (vending_machine_id, slot_number),
    FOREIGN KEY (vending_machine_id) REFERENCES vending_machines(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    name TEXT NOT NULL ,
    price INTEGER NOT NULL DEFAULT 0
);


CREATE VIEW IF NOT EXISTS vw_slot_products AS
    SELECT vms.vending_machine_id, vms.slot_number, p.name AS product_name, p.price AS product_price, vms.quantity
    FROM products p
    INNER JOIN vending_machine_slots vms on p.id = vms.product_id;

CREATE VIEW IF NOT EXISTS vw_low_stock_products AS
    SELECT * FROM products INNER JOIN vending_machine_slots vms on products.id = vms.product_id
    WHERE vms.quantity < 2;


UPDATE vending_machine_slots
SET quantity = quantity - 1
WHERE vending_machine_id = ? AND slot_number = ?