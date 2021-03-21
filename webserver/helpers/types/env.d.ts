interface Env {
    server: {
        host: string,
        port: number
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
}

export = Env;