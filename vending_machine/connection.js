
MACHINE_IP_ADDRESS = "127.0.0.1"; // TODO: CHANGE ME

async function dispense_product(slot_id) {

    return new Promise((resolve, reject) => {
        fetch(`http://${MACHINE_IP_ADDRESS}/dispense?slot=${slot_id}`).then((res) => {

            res.json().then(data => {
                let return_value = data.return_value;

                if (return_value === 2 || return_value === 0) {
                    resolve(data);

                } else if (return_value === 2) {
                    reject({message: "No product dispensed"});
                }

                reject({message: "Unknown error", data: data});
            })

        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = {
    dispense_product: dispense_product,
}
