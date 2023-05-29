

const db = require('./connection');

async function getMachines() {
    const sql = 'SELECT * FROM vending_machines';

    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Get a specific vending machine by id
 * @param {number} id
 * @returns {Promise<{id: number, name: string}>}
 */
async function getMachine(id) {
    const sql = 'SELECT * FROM vending_machines WHERE id = ?';

    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}


/**
 * Get all slots from a vending machine and all the information regarding the product in that slot.
 * @param machine_id
 * @returns {Promise<{vending_machine_id: number, slot_number: number, product_id: number, product_name: string, product_price: number, quantity: number}>}
 */
async function getSlots(machine_id) {
    const sql = `
        SELECT * FROM vw_slot_products
        WHERE vending_machine_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.all(sql, [machine_id], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}


/**
 * Get a specific slot from a vending machine and all the information regarding the product in that slot.
 *
 * @param {number} machine_id
 * @param {number} slot_number
 * @returns {Promise<{vending_machine_id: number, slot_number: number, product_id: number, product_name: string, product_price: number, product_quantity: number}>}
 */
async function getSlot(machine_id, slot_number) {
    const sql = `
        SELECT * FROM vw_slot_products
        WHERE vending_machine_id = ? AND slot_number = ?
    `;

    return new Promise((resolve, reject) => {
        db.get(sql, [machine_id, slot_number], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

async function createProductTransaction(user_id, product_id) {
    const sql = `
        INSERT INTO transactions (user_id, product_id)
        VALUES (?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [user_id, product_id], (err) => {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

async function decrementStock(machine_id, slot_number) {
    const sql = `
        UPDATE vending_machine_slots
        SET quantity = quantity - 1
        WHERE vending_machine_id = ? AND slot_number = ?
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [machine_id, slot_number], (err) => {
            if (err) {
                reject(err);
            }
            resolve(this.changes);
        });
    });
}

async function update_temperature(machine_id, temperature) {
    const sql = `
        UPDATE vending_machines
        SET temperature = ?
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        db.run(sql, [temperature, machine_id], (err) => {
            if (err)
                reject(err);
            resolve(this.changes);
        })
    })
}



module.exports = {
    getMachines: getMachines,
    getMachine: getMachine,
    getSlots: getSlots,
    getSlot: getSlot,
    createProductTransaction: createProductTransaction,
    decrementStock: decrementStock,
    update_temperature: update_temperature,
}