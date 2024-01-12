import { ParkingSpace } from "./ParkingSpot";

export class Parking {
    ManagerId : number;
    Name : string;
    PricePerHour : number;
    Description: string;
    idParkingImagePath: string = "";
    parkingSpaces: ParkingSpace[];
    constructor(managerId:number, parkingname:string, price:number, description:string, parkingSpots: ParkingSpace[] = [], idParkingImagePath: string = "") {
        this.ManagerId = managerId;
        this.Name = parkingname;
        this.PricePerHour = price;
        this.Description = description;
        this.parkingSpaces = parkingSpots;
        this.idParkingImagePath = idParkingImagePath;
    }
}