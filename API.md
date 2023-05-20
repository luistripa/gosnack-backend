# API Specification

## Users

### Login

Endpoint: `/users/login`

Body (JSON):
```
{
    "username": <username>
}
```

### Logout

Endpoint: `/users/logout`


## Vending Machines

### Get All Vending Machines

Endpoint: `/api/vending_machines`

Response:
```
{
    "status": "success" or "error"
    "message": <error message>
    "data": [  // Not present in case of error
        {
            "id": <machine_id>
            "name": <machine_name>
        },
        ...
    ]
}
```

### Get Vending Machine By ID

Endpoint: `/api/vending_machines/<machine_id>`

Response:
```
{
    "status": "success" or "error"
    "message": <error message>
    "data": {  // Not present in case of error
        "id": <machine_id>
        "name": <machine_name>
        "slots" : [
            {
                "vending_machine_id": <machine_id>
                "slot_number": <slot_number>
                "product_id": <product_id>
                "product_name": <product_name>
                "product_price": <product_price>
                "product_quantity": <product_quantity>
            }
        ]
    }
}
```

### Purchase Item

Endpoint: `/api/vending_machines/<machine_id>/purchase/<slot_id>`

Response:
```
{
    "status": "success" or "error"
    "message": <success/error message>
}
```