
MACHINE_IP_ADDRESS = "127.0.0.1"; // TODO: CHANGE ME

async function dispense_product(slot_id) {

    return new Promise((resolve, reject) => {
        fetch(`http://${MACHINE_IP_ADDRESS}/dispense/${slot_id}`).then((res) => {
            resolve(res); // TODO: Check how to get the response from the arduino

        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = {
    dispense_product: dispense_product,
}
