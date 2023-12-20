export type ProfileModel = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone:string;
  state: string;
  country: string;
  subscribe: boolean;
  tags: string[];
  addressType: string;
  homeAddress1?: string ;
  homeAddress2?: string ;
  companyAddress1?: string ;
  companyAddress2?: string ;
  file: string |  ArrayBuffer;
};
