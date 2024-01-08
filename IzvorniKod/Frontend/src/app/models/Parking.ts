export class Parking {
    AccessToken : string;
    ParkingName : string;
    Price : number;
    Description: string;
    constructor(accesstoken:string, parkingname:string, price:number, description:string) {
        this.AccessToken = accesstoken;
        this.ParkingName = parkingname;
        this.Price = price;
        this.Description = description;
    }
}