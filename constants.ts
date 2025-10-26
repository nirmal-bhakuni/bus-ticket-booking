import { City, Route, Bus, User, UserRole, CityLatLng, CITIES } from './types';

export const CITY_LAT_LNG: CityLatLng = {
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "Delhi": { lat: 28.7041, lng: 77.1025 },
    "Bangalore": { lat: 12.9716, lng: 77.5946 },
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Kolkata": { lat: 22.5726, lng: 88.3639 },
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
    "Pune": { lat: 18.5204, lng: 73.8567 },
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "Jaipur": { lat: 26.9124, lng: 75.7873 },
    "Goa": { lat: 15.2993, lng: 74.1240 }
};

export const ROUTES: Route[] = [
    { id: 'R1', stops: ["Mumbai", "Pune", "Bangalore", "Chennai"] },
    { id: 'R2', stops: ["Delhi", "Jaipur", "Ahmedabad", "Mumbai"] },
    { id: 'R3', stops: ["Kolkata", "Hyderabad", "Bangalore"] },
    { id: 'R4', stops: ["Hyderabad", "Pune", "Goa"] },
    { id: 'R5', stops: ["Chennai", "Bangalore", "Hyderabad"] },
    { id: 'R6', stops: ["Mumbai", "Goa"] },
    { id: 'R7', stops: ["Delhi", "Kolkata"]},
    { id: 'R8', stops: ["Jaipur", "Pune"]}
];

export const BUSES: Bus[] = [
    { id: 'B1', name: 'Galaxy Express', routeId: 'R1', totalSeats: 40, departureTime: '08:00', arrivalTime: '22:00', farePerSeat: 1500 },
    { id: 'B2', name: 'Star Cruiser', routeId: 'R1', totalSeats: 30, departureTime: '10:00', arrivalTime: '23:30', farePerSeat: 1800 },
    { id: 'B3', name: 'Desert Runner', routeId: 'R2', totalSeats: 45, departureTime: '06:00', arrivalTime: '20:00', farePerSeat: 2000 },
    { id: 'B4', name: 'Royal Rajasthan', routeId: 'R2', totalSeats: 35, departureTime: '09:30', arrivalTime: '23:00', farePerSeat: 2200 },
    { id: 'B5', name: 'Deccan Queen', routeId: 'R3', totalSeats: 40, departureTime: '18:00', arrivalTime: '09:00', farePerSeat: 1700 },
    { id: 'B6', name: 'Coastal Voyager', routeId: 'R4', totalSeats: 30, departureTime: '20:00', arrivalTime: '06:00', farePerSeat: 1300 },
    { id: 'B7', name: 'IT Corridor Link', routeId: 'R5', totalSeats: 50, departureTime: '21:00', arrivalTime: '05:00', farePerSeat: 900 },
    { id: 'B8', name: 'Goa Getaway', routeId: 'R6', totalSeats: 40, departureTime: '22:00', arrivalTime: '07:00', farePerSeat: 1000 },
    { id: 'B9', name: 'Capital Connect', routeId: 'R7', totalSeats: 40, departureTime: '19:00', arrivalTime: '15:00', farePerSeat: 2500 },
    { id: 'B10', name: 'Pink City Express', routeId: 'R8', totalSeats: 30, departureTime: '07:00', arrivalTime: '21:00', farePerSeat: 1600 },
    { id: 'B11', name: 'Mumbai Night Rider', routeId: 'R6', totalSeats: 35, departureTime: '23:00', arrivalTime: '08:00', farePerSeat: 1100 },
];

export const CREDENTIALS: { [key: string]: User } = {
    'user@gemini.com': { id: 'u1', name: 'Sam User', role: UserRole.USER },
    'admin@gemini.com': { id: 'a1', name: 'Alex Admin', role: UserRole.ADMIN }
};