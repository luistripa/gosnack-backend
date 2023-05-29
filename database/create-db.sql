
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS vending_machines;
DROP TABLE IF EXISTS vending_machine_slots;
DROP TABLE IF EXISTS products;
DROP VIEW IF EXISTS vw_user_recent_transactions;
DROP VIEW IF EXISTS vw_slot_products;
DROP VIEW IF EXISTS vw_low_stock_products;


CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    username TEXT NOT NULL ,
    credit INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    user_id INTEGER NOT NULL ,
    product_id INTEGER NOT NULL ,
    price_paid REAL NOT NULL ,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS vending_machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    name TEXT NOT NULL,
    temperature REAL NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS vending_machine_slots (
    vending_machine_id INTEGER NOT NULL ,
    slot_number INTEGER NOT NULL ,
    product_id INTEGER DEFAULT NULL, -- NULL if empty
    quantity INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (vending_machine_id, slot_number),
    FOREIGN KEY (vending_machine_id) REFERENCES vending_machines(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT ,
    name TEXT NOT NULL ,
    image TEXT NOT NULL ,
    price REAL NOT NULL DEFAULT 0
);


-- View that joins products and machine slots
CREATE VIEW IF NOT EXISTS vw_slot_products AS
    SELECT vms.vending_machine_id, vms.slot_number, p.id as product_id,
           p.name AS product_name, p.image as product_image, p.price AS product_price,
           vms.quantity AS product_quantity
    FROM products p
    INNER JOIN vending_machine_slots vms on p.id = vms.product_id;

-- View that joins users, transactions and products to get the most recent products bought by users
CREATE VIEW IF NOT EXISTS vw_user_recent_transactions AS
    SELECT u.id AS user_id, u.username, t.product_id, p.name AS product_name, p.image as product_image, t.price_paid AS price_paid
    FROM users u
    INNER JOIN transactions t on u.id = t.user_id
    INNER JOIN products p on t.product_id = p.id
    ORDER BY t.id DESC;

-- View that joins products and machine slots to get the products that are low in stock
CREATE VIEW IF NOT EXISTS vw_low_stock_products AS
    SELECT vms.vending_machine_id AS machine_id, vms.slot_number AS slot_number,
           p.id AS product_id, p.name AS product_name, p.price AS product_price, vms.quantity AS product_quantity
    FROM products p INNER JOIN vending_machine_slots vms on p.id = vms.product_id
    WHERE vms.quantity <= 2;


-- Create users
INSERT INTO users VALUES (0, 'admin', 100);
INSERT INTO users VALUES (1, 'user', 100);

-- Create machine
INSERT INTO vending_machines VALUES (0, 0, 'Máquina Fixe');

-- Create products
INSERT INTO products VALUES (0, 'KitKat', 'assets/images/KitKat.png', 1.0);
INSERT INTO products VALUES (1, 'Twix', 'assets/images/Twix.png', 1.0);

-- Add products to machine
INSERT INTO vending_machine_slots VALUES (0, 1, 0, 3);
INSERT INTO vending_machine_slots VALUES (0, 2, 1, 3);

-- Create transactions
INSERT INTO transactions VALUES (0, 1, 0, 1.0);
INSERT INTO transactions VALUES (1, 1, 0, 1.0);
INSERT INTO transactions VALUES (2, 1, 0, 1.0);
