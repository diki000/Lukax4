using SpotPicker.EFCore;
using SpotPicker.Models;

namespace SpotPicker.Services
{
    public class ParkingFunctions
    {
        private readonly _EFCore _db;
        private readonly IConfiguration _config;
        public ParkingFunctions(_EFCore database, IConfiguration config)
        {
            _db = database;
            _config = config;
        }

        public void addNewParking(ParkingModel parking)
        {
            Parking dbParking = new Parking()
            {
                PricePerHour= parking.PricePerHour,
                ManagerId= parking.ManagerId,
                Name = parking.Name,
                Description= parking.Description
            };
            _db.Parkings.Add(dbParking);
            _db.SaveChanges();
            var currentParkingId = _db.Parkings.Where(p => p.Name == parking.Name).FirstOrDefault().Id;
            for(int i = 0; i < parking.parkingSpaces.Length; i++)
            {
                ParkingSpace parkingSpace = new ParkingSpace()
                {
                    ParkingId = currentParkingId,
                    ParkingSpaceType = parking.parkingSpaces[i].ParkingSpaceType,
                    hasSensor = parking.parkingSpaces[i].hasSensor,
                    isOccupied = parking.parkingSpaces[i].isOccupied
                };

                _db.ParkingSpaces.Add(parkingSpace);
                _db.SaveChanges();
                var currentParkingSpaceId = parkingSpace.Id;

                for(int j = 0; j < parking.parkingSpaces[i].points.Length; j++)
                {
                    Point point = new Point()
                    {
                        ParkingSpaceId= currentParkingSpaceId,
                        Latitude = parking.parkingSpaces[i].points[j].Latitude,
                        Longitude = parking.parkingSpaces[i].points[j].Longitude
                    };
                    _db.Points.Add(point);
                }
                _db.SaveChanges();
            }
        }
        public ParkingModel[] getAllParkings()
        {
            Parking[] parkings = _db.Parkings.ToArray();
            ParkingSpace[] parkingSpaces = _db.ParkingSpaces.ToArray();
            Point[] points = _db.Points.ToArray();

            List<ParkingModel> parkingsResult = new List<ParkingModel>();

            for(int i = 0; i < parkings.Length; i++)
            {
                List<ParkingSpaceModel> parkingSpacesResult = new List<ParkingSpaceModel>();
                ParkingModel currentParking = new ParkingModel() { 
                    ManagerId = parkings[i].ManagerId,
                    Name = parkings[i].Name,
                    Description= parkings[i].Description,
                    idParkingImagePath = parkings[i].idParkingImagePath,
                    PricePerHour = parkings[i].PricePerHour
                };

                ParkingSpace[] currentParkingSpaces = parkingSpaces.Where(p => p.ParkingId == parkings[i].Id).ToArray();
                for(int j = 0; j < currentParkingSpaces.Length; j++)
                {
                    ParkingSpaceModel currentParkingSpace = new ParkingSpaceModel()
                    {
                        ParkingSpaceId = currentParkingSpaces[j].Id,
                        ParkingSpaceType = currentParkingSpaces[j].ParkingSpaceType,
                        ParkingId = currentParkingSpaces[j].ParkingId,
                        hasSensor = currentParkingSpaces[j].hasSensor,
                        isOccupied = currentParkingSpaces[j].isOccupied
                    };
                    Point[] currentPoints = points.Where(p => p.ParkingSpaceId == currentParkingSpaces[j].Id).ToArray();
                    List<PointModel> pointsResult = new List<PointModel>();

                    for (int k = 0; k < currentPoints.Length; k++)
                    {
                        PointModel currentPoint = new PointModel()
                        {
                            ParkingSpaceId = currentPoints[k].ParkingSpaceId,
                            Latitude= currentPoints[k].Latitude,
                            Longitude= currentPoints[k].Longitude
                        };
                        pointsResult.Add(currentPoint);
                    }

                    currentParkingSpace.points = pointsResult.ToArray();
                    parkingSpacesResult.Add(currentParkingSpace);
                }
                currentParking.parkingSpaces = parkingSpacesResult.ToArray();
                parkingsResult.Add(currentParking);

            }
            return parkingsResult.ToArray();
        }
    }
}
