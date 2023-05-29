
MACHINE_IP_ADDRESS = "192.168.1.179"; // TODO: CHANGE ME

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


async function get_temperature() {
    return new Promise((resolve, reject) => {
        fetch(`http://${MACHINE_IP_ADDRESS}/temperature`)
            .then(res => {
                res.json()
                    .then(data => {
                        let return_value = data.return_value;

                        resolve(return_value);
                    })
                    .catch(error => reject(error));
            })
            .catch(error => reject(error));
    });
}

module.exports = {
    dispense_product: dispense_product,
    get_temperature: get_temperature,
}
