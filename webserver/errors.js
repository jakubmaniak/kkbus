const error = function(errorCode) {
    return () => {
        let err = new Error(errorCode);
        err.name = 'HandlerError';
        return err;
    };
};

module.exports = {
    serverError:        error('server_error'),
    invalidRequest:     error('invalid_request'),
    notFound:           error('not_found'),
    unauthorized:       error('unauthorized'),
    badSessionToken:    error('bad_session_token'),
    invalidValue:       error('invalid_value'),
    notEnough:          error('not_enough'),
    tooLate:            error('too_late'),
    badCredentials:     error('bad_credentials'),
    emailAlreadyTaken:  error('email_already_taken'),
    bookingLocked:      error('booking_locked')
};