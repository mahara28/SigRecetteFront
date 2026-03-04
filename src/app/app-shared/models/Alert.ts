// alert.model.ts
export enum AlertType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}

export class Alert {
  id?: string;
  type: AlertType = AlertType.Info;
  message = '';
  autoClose = true;
  keepAfterRouteChange = false;
  fade = true;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}
