class AppExtension {
    constructor(app, reqValidator) {
        this.app = app;
        this.reqValidator = reqValidator;
    }

    post(path) {
        let extension = {
            get: this.get,
            role: (role) => {
                this.reqValidator.setProtected(path, role);
                return extension;
            },
            schema: (schema) => {
                this.reqValidator.addSchema(path, schema);
                return extension;
            },
            handle: (handler) => {
                this.app.post(path, handler);
                return extension;
            }
        };

        return extension;
    }

    get(path) {
        let extension = {
            post: this.post,
            role: (role) => {
                this.reqValidator.setProtected(path, role);
                return extension;
            },
            schema: (schema) => {
                this.reqValidator.addSchema(path, schema);
                return extension;
            },
            handle: (handler) => {
                this.app.get(path, handler);
                return extension;
            }
        };

        return extension;
    }
}

module.exports = (app, reqValidator) => new AppExtension(app, reqValidator);