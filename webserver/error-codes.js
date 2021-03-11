const error = (errorCode) => {
    let err = new Error(errorCode);
    err.name = 'HandlerError';
    return err;
};

module.exports = {
    error,
    errors: {
        serverError: 'server_error',
        invalidRequest: 'invalid_request',
        unauthorized: 'unauthorized',
        badSessionToken: 'bad_session_token',
        badCredentials: 'bad_credentials',
        emailAlreadyTaken: 'email_already_taken'
    }
};