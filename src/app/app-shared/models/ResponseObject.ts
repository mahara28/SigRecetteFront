export class ResponsePayload {
  total!: number;
  data!: any[];
  isLoading!: boolean;
  constructor() {

  }
}


export interface ResponseObject {
  data: any;
  code: string;
  // payload: object | ResponsePayload;
  payload: any;

}
