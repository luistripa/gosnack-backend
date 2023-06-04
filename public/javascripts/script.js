


fetch('/api/vending_machines')
    .then((res) => res.json())
    .then((data) => {
        const machine_list = document.getElementById('machine_list');

        let html = '';
        data.data.forEach((machine) => {
            html += `
                <li>
                    <a href="/api/vending_machines/${machine.id}"> ${machine.id} ${machine.name}</a>
                </li>
            `;
        });
        machine_list.innerHTML = html;
    })
    .catch((err) => console.err(err));
