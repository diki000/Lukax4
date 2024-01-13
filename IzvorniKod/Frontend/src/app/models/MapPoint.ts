export class Point{
    Latitude: number;
    Longitude: number;
    ParkingSpaceId: number;
    constructor(Latitude:number, Longitude:number, parkingSpotId:number) {
        this.Latitude = Latitude;
        this.Longitude = Longitude;
        this.ParkingSpaceId = parkingSpotId;
    }
}