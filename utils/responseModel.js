// responseUtils.js

/**
 * Standard response for successful operations.
 * @param {string} message - Success message
 * @param {object} [data=null] - Optional data to include in the response
 * @returns {object} - Response object
 */
function successResponse(message, data = null) {
    return {
        status: 200,
        connection: 'Connected',
        message: message,
        data: data,
    };
}

/**
 * Standard response for failed operations.
 * @param {string} message - Error message
 * @param {number} [statusCode=400] - HTTP status code
 * @param {object} [errors=null] - Optional error details
 * @returns {object} - Response object
 */
function failedResponse(message, statusCode = 400, errors = null) {
    return {
        status: statusCode,
        connection: 'Disconnected',
        message: message,
        errors: errors,
    };
}

/**
 * Response format for profile data.
 * @param {string} message - Success or error message
 * @param {number} statusCode - HTTP status code
 * @param {object} data - User data
 * @returns {object} - Response object
 */
function profileResponse(message, statusCode, data) {
    return {
        status: statusCode,
        connection: 'Connected',
        message: message,
        userData: {
            user_id: data.unique_id,
            username: data.username,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            mobileNumber: data.mobileNumber,
            profilePic: data.profilePic
        },
    };
}

/**
 * Response format for login operations.
 * @param {boolean} success - Indicates if the operation was successful
 * @param {string} message - Success or error message
 * @param {object} [data=null] - Optional data to include in the response
 * @returns {object} - Response object
 */
function responseLogin(success, message, data = null) {
    return {
        success: success,
        message: message,
        data: data,
    };
}

/**
 * Response format for registration operations.
 * @param {boolean} success - Indicates if the operation was successful
 * @param {string} message - Success or error message
 * @param {object} [data=null] - Optional data to include in the response
 * @returns {object} - Response object
 */
function responseRegistration(success, message, data = null) {
    return {
        success: success,
        message: message,
        data: data,
    };
}

/**
 * Response format for adding products.
 * @param {boolean} success - Indicates if the operation was successful
 * @param {string} message - Success or error message
 * @param {object} [errors=null] - Optional error details
 * @returns {object} - Response object
 */
function responseAddProduct(success, message, errors = null) {
    return {
        success: success,
        message: message,
        errors: errors,
    };
}

/**
 * Response format for fetching products.
 * @param {boolean} success - Indicates if the operation was successful
 * @param {object} data - Data to include in the response
 * @returns {object} - Response object
 */
function responseFetchProduct(success, data) {
    return {
        success: success,
        data: data,
    };
}

module.exports = {
    successResponse,
    failedResponse,
    profileResponse,
    responseLogin,
    responseRegistration,
    responseAddProduct,
    responseFetchProduct,
};
