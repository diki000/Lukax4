import { ParkingSpace } from "./ParkingSpot";

export class Parking {
    parkingId : number = 0;
    ManagerId : number;
    Name : string;
    PricePerHour : number;
    Description: string;
    idParkingImagePath: string = "";
    NumberOfBikePS: number = 0;
    parkingSpaces: ParkingSpace[];
    constructor(parkingId:number, managerId:number, parkingname:string, price:number, description:string, bikePS: number, parkingSpots: ParkingSpace[] = [], idParkingImagePath: string = "") {
        this.parkingId = parkingId;
        this.ManagerId = managerId;
        this.Name = parkingname;
        this.PricePerHour = price;
        this.Description = description;
        this.parkingSpaces = parkingSpots;
        this.NumberOfBikePS = bikePS;
        this.idParkingImagePath = idParkingImagePath;
    }
}