import { EnvironmentDef } from './environement.def';

export const environment: EnvironmentDef = {
  production: false,
  servers: {
    app: 'http://127.0.0.1:8060',
    websocket: 'http://127.0.0.1:8060/ws',
  },
  ToastDuration: 3000,
  Session: {
    expired: 1800, // sec
    timeout: 60, // sec
  },
};
