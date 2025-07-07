import { IsNotEmpty, IsNumber, IsPhoneNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateOrderRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsPhoneNumber()
  phoneNumber: string;
}

export class CreateOrderResponse {
  name: string;
  price: number;
  phoneNumber: string;

  constructor(partial: Partial<CreateOrderResponse>) {
    Object.assign(this, partial)
  }
}