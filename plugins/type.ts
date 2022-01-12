export type IOptions = {
  entry?: string;
}

export type IMockItem = {
  url: string;
  type: string;
  response: () => void;
}

export type IRoute = {
  url: string;
  method: string;
  handler: () => void;
}