const express = require('express');
const router = express.Router();

const machine_db = require('../database/vending_machine_db');
const users_db = require('../database/user_db');

const {dispense_product} = require("../vending_machine/connection")
const {sendTemperatureWarningEmail} = require("../utils/email/email");


router.get('/', (req, res) => {
    machine_db.getMachines()
        .then(machines => {
            res.json(
                {
                    status: "success",
                    data: machines
                }
            );
        })
        .catch(err => console.error(err));
});


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


router.get('/:machine_id/slot/:slot_id/', (req, res) => {
    const machine_id = req.params.machine_id;
    const slot_id = req.params.slot_id;

    machine_db.getSlot(machine_id, slot_id)
        .then(slot => {
            res.json(
                {
                    status: "success",
                    data: slot
                }
            );
        })
        .catch(err => console.error(err));
});


router.get('/:machine_id/slots', (req, res) => {

    const machine_id = req.params.machine_id;

    machine_db.getSlots(machine_id)
        .then(slots => {
            res.json(
                {
                    status: "success",
                    data: slots
                }
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

    machine_db.getMachine(machine_id)
        .then(machine => {

            machine_db.updateHeartBeat(machine_id)
                .catch(err => {
                    console.error(err);
                    console.error("Failed to update machine heartbeat: ", machine_id);
                })

            machine_db.updateTemperature(machine_id, temperature)
                .then(() => {
                    res.json({
                        status: "success"
                    });
                })
                .catch(err => console.error(err));

            // Check if temperature is too high. In that case email the machine's admin
            if (temperature > 28) { // Set as a limit for email notifications

                let time_elapsed = (new Date() - new Date(machine.last_alert_time))/1000;
                if (time_elapsed > 60) {
                    console.log("Sending email to admin of machine: ", machine.id);
                    users_db.getUserById(machine.admin_id)
                        .then(user => {
                            sendTemperatureWarningEmail(user, machine, temperature);
                        })
                        .catch(err => console.error(err));

                    machine_db.updateLastAlertTime(machine.id)
                        .catch(err => {
                            console.error(err);
                            console.error("Failed to set last alert time: ", machine.id);
                        })
                }
            }

        })
        .catch(err => {
            console.error(err);
            res.json({
                status: "error",
                message: err.message,
            })
        })
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