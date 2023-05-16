const express = require('express');
const router = express.Router();

const vending_machine_db = require('../database/vending_machine_db');
const {verbose} = require("sqlite3");
const {dispense_product} = require("../vending_machine/connection")


// GET all vending machines
router.get('/', (req, res) => {

    vending_machine_db.getMachines().then((rows) => {
        res.json({
            "status":"success",
            "data":rows
        });
    }).catch((err) => {
        res.status(400).json({"error":err.message});
    });

});

/*
    GET /api/vending_machines/:id
    Return a single vending machine with all of its slots
 */
router.get('/:id', (req, res) => {

    vending_machine_db.getMachine(req.params.id).then((row) => {
        if (row) {
            vending_machine_db.getSlots(row.id).then((slots) => {
                row.slots = slots;
                res.json({
                    "status":"success",
                    "data":row
                });
            }).catch((err) => {
                res.json({
                    status: "error",
                    message: err.message,
                });
            });
        } else {
            res.json({
                status: "error",
                message: "Vending machine not found"
            });
        }
    }).catch((err) => {
        res.json({
            status: "error",
            message: err.message,
        });
    });

});


/*
    POST /api/vending_machines/:id/purchase/:slot_id
    Purchase a product from a slot
 */
router.get('/:id/purchase/:slot_number', (req, res) => {

    const machine_id = req.params.id;
    const slot_number = req.params.slot_number;

    const user = req.user;

    vending_machine_db.getSlot(machine_id, slot_number).then((slot) => {

        if (slot) {
            if (slot.product_quantity > 0) {
                console.log(slot.product_quantity)
                vending_machine_db.createProductTransaction(user_id, slot.product_id).then((transaction) => {

                    // Wait for machine to dispense the product
                    dispense_product(slot.slot_id).then((response) => {
                        // TODO: Update transaction status and update product quantity
                        vending_machine_db.purchaseProduct(machine_id, slot_number).then(() => {

                        }).catch((err) => {
                            res.json({
                                status: "error",
                                message: err.message,
                            });
                        })

                    }).catch((err) => {
                        res.json({
                            status: "error",
                            message: err.message,
                        });
                    });

                }).catch((err) => {
                    res.json({
                        status: "error",
                        message: err.message,
                    });
                });

                vending_machine_db.purchaseProduct(machine_id, slot_number).then(() => {
                    res.json({
                        status: "success",
                        message: "Product purchased successfully"
                    });
                }).catch((err) => {
                    res.json({
                        status: "error",
                        message: err.message,
                    });
                });
            } else {
                res.json({
                    status: "error",
                    message: "Product out of stock"
                });
            }
        } else {
            res.json({
                status: "error",
                message: "Slot not found"
            });
        }
    }).catch((err) => {
        res.json({
            status: "error",
            message: err.message,
        });
    });
});

module.exports = router;