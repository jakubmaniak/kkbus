interface Env {
    server: {
        host: string,
        port: number
    };
    jwtSecret: string;
    mysql: {
        host: string,
        port: number,
        database: string,
        username: string,
        password: string
    };
}

export = Env;