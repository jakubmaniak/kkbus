interface Env {
    server: {
        host: string,
        port: number,
        externalAddress: string
    };
    jwtSecret: string;
    mysql: {
        connectionLimit: number,
        host: string,
        port: number,
        database: string,
        user: string,
        password: string
    };
    mail: {
        service: string;
        senderName: string;
        user: string;
        password: string;
    };
}

export = Env;