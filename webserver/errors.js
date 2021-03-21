const error = function(errorCode) {
    let err = new Error(errorCode);
    err.name = 'HandlerError';

    return err;
    /*return () => {
        throw err;
    };*/
};

module.exports = {
    serverError:        error('server_error'),
    invalidRequest:     error('invalid_request'),
    notFound:           error('not_found'),
    unauthorized:       error('unauthorized'),
    badSessionToken:    error('bad_session_token'),
    badCredentials:     error('bad_credentials'),
    emailAlreadyTaken:  error('email_already_taken')
};