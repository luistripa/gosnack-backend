const express = require('express');
const router = express.Router();

const machine_db = require('../database/vending_machine_db');
const users_db = require('../database/user_db');

const {dispense_product} = require("../vending_machine/connection")


/*
    GET /api/vending_machines/:id
    Return a single vending machine with all of its slots
 */
router.get('/:machine_id', (req, res) => {
    const machine_id = req.params.machine_id;

    machine_db.getMachine(machine_id)
        .then(machine => {
            res.json(
                machine
            );
        })
        .catch(err => console.error(err));
});


/*
    POST /api/vending_machines/:id/purchase/:slot_id
    Purchase a product from a slot
 */
router.get('/:machine_id/purchase/:slot_number', async (req, res) => {
    const machine_id = req.params.machine_id;
    const slot_number = parseInt(req.params.slot_number);

    const username = req.query.username;

    let user = await users_db.getUser(username);

    machine_db.getSlot(machine_id, slot_number)
        .then(slot => {
            if (slot) {
                if (user.credit < slot.product_price) {
                    console.error("not enough funds");
                    res.json({
                        status: "error",
                        message: "Not enough funds",
                    })
                    return;
                }

                if (slot.product_quantity === 0) {
                    console.error("not enough stock");
                    res.json({
                        status: "error",
                        message: "Not enough stock",
                    })
                    return;
                }

                dispense_product(slot_number)
                    .then(async data => {
                        console.log(data);
                        if (data.return_value === 0) { // Machine detected a product falling
                            await users_db.updateCredit(username, -slot.product_price)
                            await machine_db.decrementStock(slot.vending_machine_id, slot.slot_number);
                            await users_db.addTransaction(user, slot);

                            res.json(
                                {
                                    status: "success"
                                }
                            )
                        } else {
                            res.json({
                                status: "error",
                                message: "No product fell. No credit has been deducted.",
                            });
                            console.error("No product fell");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        res.json(
                            {
                                status: "error",
                                message: err.message
                            }
                        )
                    })

            } else {
                console.error("Slot not found: ", slot_number);
                res.json({
                    status: "error",
                    message: "Slot not found: " + slot_number,
                })
            }
        })
        .catch(err => console.error(err));
});


router.post('/:machine_id/update_temperature', (req, res) => {
    let machine_id = req.params.machine_id;
    let temperature = req.body.temperature;

    machine_db.update_temperature(machine_id, temperature)
        .then(() => {
            res.json({
                status: "success"
            })
        })
        .catch(err => console.error(err));
});

router.get('/:machine_id/temperature', (req, res) => {

    const machine_id = req.params.machine_id;

    machine_db.getMachine(machine_id)
        .then(machine => {
            if (machine) {
                res.send({
                    status: "success",
                    data: machine.temperature,
                });
            } else {
                res.json({
                    status: "error",
                    message: "Machine not found",
                })
            }
        })
        .catch(err => console.error(err));
});

module.exports = router;