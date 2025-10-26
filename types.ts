
export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
}

export const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Goa"] as const;
export type City = typeof CITIES[number];

export interface Route {
    id: string;
    stops: City[];
}

export interface Bus {
    id: string;
    name: string;
    routeId: string;
    totalSeats: number;
    departureTime: string; // HH:MM
    arrivalTime: string; // HH:MM
    farePerSeat: number;
}

export interface Booking {
    id: string;
    userId: string;
    busId: string;
    date: string; // YYYY-MM-DD
    source: City;
    destination: City;
    seats: number[];
    totalFare: number;
    bookingTime: Date;
}

export type CityLatLng = {
    [key in City]: { lat: number, lng: number }
};
