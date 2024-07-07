import { v4 as uuidv4 } from 'uuid';

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }
  
  export interface UserResponse {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    // dateCreated: Date;
  }


export interface userIdDTO {
  userId: ReturnType<typeof uuidv4>;
}
  // export interface updateVendorinput {
  //     name: string;
  //     emailAddress: string;
  //     phoneNumber: string;
  //     address: string;
  //     businessName: string;
  // };
  
  export interface UserLoginInput {
    email: string;
    password: string;
  }
  
  export interface updateuserProfileInput {
    name: string;
    phoneNumber: string;
  }
  
  export interface userPayload {
    userId: string;
    email: string;
    password: string;
  }
  
  export interface userSignUpPayload {
    emailAddress: string;
    password: string;
  }
  
//   export class OrderInputs {
//     _id: string;
//     unit: number;
//     address: string;
//     variantId?: string;
//   }
  
//   export interface MetaInput {
//     ref: string;
//     orderId: string;
//     cart: Array<string>;
//   }
  