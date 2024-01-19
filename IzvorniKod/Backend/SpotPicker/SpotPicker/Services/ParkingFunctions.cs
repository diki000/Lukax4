using Microsoft.EntityFrameworkCore;
using SpotPicker.EFCore;
using SpotPicker.Migrations;
using SpotPicker.Models;


namespace SpotPicker.Services
{
    public class ParkingFunctions
    {
        private readonly _EFCore _db;
        private readonly IConfiguration _config;
        private UserFunctions _userFunctions;
        public ParkingFunctions(_EFCore database, IConfiguration config)
        {
            _db = database;
            _config = config;
            _userFunctions = new UserFunctions(database, config);
        }

        public void addNewParking(ParkingModel parking)
        {
            Parking dbParking = new Parking()
            {
                PricePerHour= parking.PricePerHour,
                ManagerId= parking.ManagerId,
                Name = parking.Name,
                Description= parking.Description,
                NumberOfBikePS= parking.NumberOfBikePS,
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
                    ParkingManagerId = parking.ManagerId,
                    hasSensor = parking.parkingSpaces[i].hasSensor,
                    isOccupied = parking.parkingSpaces[i].isOccupied,
                    reservationPossible = parking.parkingSpaces[i].reservationPossible,
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
                    ParkingId = parkings[i].Id,
                    ManagerId = parkings[i].ManagerId,
                    Name = parkings[i].Name,
                    Description= parkings[i].Description,
                    idParkingImagePath = parkings[i].idParkingImagePath,
                    PricePerHour = parkings[i].PricePerHour,
                    NumberOfBikePS = parkings[i].NumberOfBikePS,
                };

                clearInstantReservations(parkings[i].Id);
                ParkingSpace[] currentParkingSpaces = parkingSpaces.Where(p => p.ParkingId == parkings[i].Id).ToArray();
                for (int j = 0; j < currentParkingSpaces.Length; j++)
                {
                    ParkingSpaceModel currentParkingSpace = new ParkingSpaceModel()
                    {
                        ParkingSpaceId = currentParkingSpaces[j].Id,
                        ParkingSpaceType = currentParkingSpaces[j].ParkingSpaceType,
                        ParkingManagerId = parkings[i].ManagerId,
                        ParkingId = currentParkingSpaces[j].ParkingId,
                        hasSensor = currentParkingSpaces[j].hasSensor,
                        isOccupied = currentParkingSpaces[j].isOccupied,
                        reservationPossible = currentParkingSpaces[j].reservationPossible,
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

        public static double HaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371;

            double dLat = DegreeToRadian(lat2 - lat1);
            double dLon = DegreeToRadian(lon2 - lon1);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(DegreeToRadian(lat1)) * Math.Cos(DegreeToRadian(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            double distance = R * c;

            return distance;
        }

        public static double DegreeToRadian(double degree)
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
                    ParkingManagerId = parkingSpace.ParkingManagerId,
                    Duration = duration,
                    Time = DateTime.Now,
                    PaymentType = paymentType
                };
                if (paymentType == 1) // 1 je placanje odma racunom u aplikaciji
                {
                    var pricePerHour = _db.Parkings.FirstOrDefault(p => p.Id == parkingSpace.ParkingId).PricePerHour;

                    var transactionID = _userFunctions.payForReservation(userId, (float)(pricePerHour * duration));
                    reservation.TransactionId= transactionID;
                }
                _db.InstantReservations.Add(reservation);
                _db.SaveChanges();
            }

            return nearestParkingSpaceCoordinates;
        }
        public void deleteParking(int parkingId)
        {
            Parking parkingToDelete = _db.Parkings.Find(parkingId);
            _db.Parkings.Remove(parkingToDelete);
            _db.SaveChanges();
            var parkingSpaces = _db.ParkingSpaces.Where(p => p.ParkingId == parkingId).ToList();
            parkingSpaces.ForEach(parkingSpace =>
            {
                var points = _db.Points.Where(p => p.ParkingSpaceId == parkingSpace.Id).ToList();
                points.ForEach(point =>
                {
                    _db.Points.Remove(point);
                });
                _db.ParkingSpaces.Remove(parkingSpace);
            });
            _db.SaveChanges();

        }
        public StatisticsInformation[] getStatistics(int ownerId)
        {
            List<StatisticsInformation> result = new List<StatisticsInformation>();
            DateTime[] last10Days = new DateTime[10];

            for(int i = 0; i < 10; i++)
            {
                last10Days[i] = DateTime.UtcNow.AddDays(-i);

                StatisticsInformation statisticsForTheDay = new StatisticsInformation();
                statisticsForTheDay.day = last10Days[i].Date;
                statisticsForTheDay.reservations = 0;
                statisticsForTheDay.moneyAmount = 0;

                List<InstantReservation> instatReservations = _db.InstantReservations.Where(ir => ir.Time.Date == last10Days[i].Date && ir.ParkingManagerId == ownerId).ToList();
                statisticsForTheDay.reservations += instatReservations.Count();
                double amount = 0;
                instatReservations.ForEach(reservation =>
                {
                    ParkingSpace parkingSpace = _db.ParkingSpaces.FirstOrDefault(ps => ps.Id == reservation.ParkingSpaceId);
                    Parking parking = _db.Parkings.FirstOrDefault(p => p.Id == parkingSpace.ParkingId);
                    if (parking != null)
                    {
                        amount += parking!.PricePerHour * reservation.Duration;
                    }
                });

                Reservation[] reservations = _db.Reservations.Where(r => r.ReservationDate.Date == last10Days[i].Date && r.ParkingManagerID == ownerId).ToArray();
                statisticsForTheDay.reservations += reservations.Count();
                for(int j = 0; j < reservations.Count(); j++)
                {

                    ParkingSpace parkingSpace = _db.ParkingSpaces.FirstOrDefault(ps => ps.Id == reservations[j].ParkingSpaceID);
                    Parking parking = _db.Parkings.FirstOrDefault(p => p.Id == parkingSpace.ParkingId);
                    if (parking != null)
                    {
                        amount += parking!.PricePerHour * ((reservations[j].ReservationDuration - reservations[j].ReservationDate).Minutes/60.0);
                    }
                }
                statisticsForTheDay.moneyAmount += amount;
                result.Add(statisticsForTheDay);
            }


            return result.ToArray();
        }
    }
}
