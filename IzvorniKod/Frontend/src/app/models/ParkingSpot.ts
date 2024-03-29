import { Point } from "./MapPoint";

export class ParkingSpace{
    equals(newSpot: ParkingSpace) {
        var equals = true;
        if (this.points.length != newSpot.points.length) {
            equals = false;
        }
        else {
            for (var i = 0; i < this.points.length; i++) {
                if (this.points[i].Latitude != newSpot.points[i].Latitude || this.points[i].Longitude != newSpot.points[i].Longitude) {
                    equals = false;
                    break;
                }
            }
        }
        return equals;
    }
    ParkingSpaceId: number;
    ParkingId : number;
    ParkingManagerId: number;
    ParkingSpaceType : number;
    hasSensor : number;
    isOccupied : number;
    reservationPossible : number = 0;
    points : Point[] = [];
    constructor(parkingSpaceId:number, parkingId:number, parkingSpaceType:number, hasSensor:number, isOccupied:number, reservationPossible: number, points: Point[] = [], parkingManagerId: number) {
        this.ParkingSpaceId = parkingSpaceId;
        this.ParkingId = parkingId;
        this.ParkingSpaceType = parkingSpaceType;
        this.hasSensor = hasSensor;
        this.isOccupied = isOccupied;
        this.reservationPossible = reservationPossible;
        this.points = points;
        this.ParkingManagerId = parkingManagerId;
    }
}