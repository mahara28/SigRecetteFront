export interface RequestObject {
  uri: string;
  params?: {
    body?: object;
    query?: object;
    path?: string[];
    formData?: object;
  };
  listFiles?: any[];
  microservice?: string;
  method: "GET" | "DELETE" | "POST" | "PUT";
  server?: string;
  speCase?: string;
}
