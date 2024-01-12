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
    ParkingId : number;
    ParkingSpaceType : number;
    hasSensor : number;
    isOccupied : number;
    points : Point[] = [];
    constructor(parkingId:number, parkingSpaceType:number, hasSensor:number, isOccupied:number, points: Point[] = []) {
        this.ParkingId = parkingId;
        this.ParkingSpaceType = parkingSpaceType;
        this.hasSensor = hasSensor;
        this.isOccupied = isOccupied;
        this.points = points;
    }
}