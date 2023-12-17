function successResponse(message) {
    return {
        "status": 200,
        "connection": "Connected",
        "message": message
    }
}

function failedResponse(message) {
    return {
        "status": 400,
        "connection": "Dissconnected",
        "message": message
    }
}

function profileResponse(message, statusCode, data) {
    return {
        "status": statusCode,
        "connection": "Connected",
        "message": message,
        "userData": {
            "user_id": data.unique_id,
            "username": data.username,
            "email": data.email,
            "dateOfBirth": data.dateOfBirth,
            "mobileNumber": data.mobileNumber
        }
    }
}


function resposeLogin(success, message, data) {
    return {
        "success": success,
        "message": message,
        "data": data
    }
}

function resposeRegistration(success, message, data) {
    return {
        "success": success,
        "message": message,
        "data": data
    }
}

function responseAddProduct(success, message, error) {
    return {
        "success": success,
        "message": message,
        "errors": error
    }
}

function responseFetchProduct(success, data) {
    return {
        "success": success,
        "data": data
    }
}

module.exports = {
    successResponse,
    failedResponse,
    resposeLogin,
    resposeRegistration,
    responseAddProduct,
    responseFetchProduct,
}
