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

                clearInstantReservations(parkings[i].Id);
                ParkingSpace[] currentParkingSpaces = parkingSpaces.Where(p => p.ParkingId == parkings[i].Id).ToArray();
                for (int j = 0; j < currentParkingSpaces.Length; j++)
                {
                    ParkingSpaceModel currentParkingSpace = new ParkingSpaceModel()
                    {
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

        private void clearInstantReservations(int id)
        {
            ParkingSpace[] currentParkingSpaces = _db.ParkingSpaces.Where(p => p.ParkingId == id).ToArray();
            ParkingSpace[] currentlyOccupiedParkingSpaces = currentParkingSpaces.Where(ps => ps.isOccupied == 1).ToArray();
            for (int j = 0; j < currentlyOccupiedParkingSpaces.Length; j++)
            {
                InstantReservation[] reservations = _db.InstantReservations.Where(ir => ir.ParkingSpaceId == currentlyOccupiedParkingSpaces[j].Id).ToArray();
                bool reserved = false;
                foreach (var reservation in reservations)
                {
                    if (reservation.Time.AddHours(reservation.Duration) > DateTime.Now)
                    {
                        reserved = true;
                        break;
                    }
                }

                if (!reserved)
                {
                    currentlyOccupiedParkingSpaces[j].isOccupied = 0;
                }
            }

            _db.SaveChanges();

        }

        public double HaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371000;

            double dLat = DegreeToRadian(lat2 - lat1);
            double dLon = DegreeToRadian(lon2 - lon1);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(DegreeToRadian(lat1)) * Math.Cos(DegreeToRadian(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            double distance = R * c;

            return distance;
        }

        public double DegreeToRadian(double degree)
        {
            return degree * Math.PI / 180;
        }

        public PointModel GetNearestParkingSpaceCoordinates(int userId, double startLongitude, double startLatitude, double endLongitude, double endLatitude, int profile, int duration, int paymentType)
        {
            
            List<Point> distinctPoints = _db.Points.ToList().GroupBy(p => p.ParkingSpaceId)
                                         .Select(group => group.First())
                                         .ToList();

            PointModel nearestParkingSpaceCoordinates = null;
            double distance = Double.MaxValue;
            foreach(var point in distinctPoints)
            {
                double d = HaversineDistance(endLatitude, endLongitude, point.Latitude, point.Longitude);
                var parkingSpace = _db.ParkingSpaces.FirstOrDefault(parkingSpace => parkingSpace.Id == point.ParkingSpaceId);
                if (d < distance && parkingSpace.hasSensor == 1 && parkingSpace.isOccupied == 0)
                {
                    nearestParkingSpaceCoordinates = new PointModel
                    {
                        Longitude = point.Longitude,
                        Latitude = point.Latitude,
                        ParkingSpaceId = point.ParkingSpaceId,
                    };
                    distance = d;
                }
            }

            if (nearestParkingSpaceCoordinates == null)
            {
                var ex = new Exception();
                ex.Data["Kod"] = 419;
                throw ex;
            }
            else
            {
                var parkingSpace = _db.ParkingSpaces.FirstOrDefault(parkingSpace => parkingSpace.Id == nearestParkingSpaceCoordinates.ParkingSpaceId);
                parkingSpace.isOccupied = 1;

                InstantReservation reservation = new InstantReservation()
                {
                    UserId = userId,
                    ParkingSpaceId = parkingSpace.Id,
                    Duration = duration,
                    Time = DateTime.Now,
                    PaymentType = paymentType
                };

                _db.InstantReservations.Add(reservation);
                _db.SaveChanges();
            }

            return nearestParkingSpaceCoordinates;
        }
    }
}
