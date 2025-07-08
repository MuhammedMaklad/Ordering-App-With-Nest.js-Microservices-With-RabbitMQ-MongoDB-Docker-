

export class GetOrderResponse {
  name: string;
  price: number;
  phoneNumber: string
  constructor(partial: Partial<GetOrderResponse>) {
    Object.assign(this, partial);
  }
}