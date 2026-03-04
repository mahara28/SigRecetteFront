export interface EnvironmentDef {
    production: boolean;
    servers: {
        app: string;
        websocket?: string;
    };

    ToastDuration: number,
    Session: {
        expired: number;
        timeout: number;
    };
}
