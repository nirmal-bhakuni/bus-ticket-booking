import { City, Route, Bus, Booking } from '../types';
import * as db from './database';

class BusService {
    private routes: Route[];
    private buses: Bus[];

    constructor() {
        this.routes = db.getRoutes();
        this.buses = db.getBuses();
    }

    public findBuses(source: City, destination: City, date: string): Bus[] {
        const availableBuses: Bus[] = [];
        for (const bus of this.buses) {
            const route = this.routes.find(r => r.id === bus.routeId);
            if (route) {
                const sourceIndex = route.stops.indexOf(source);
                const destIndex = route.stops.indexOf(destination);
                if (sourceIndex !== -1 && destIndex !== -1 && sourceIndex < destIndex) {
                    availableBuses.push(bus);
                }
            }
        }
        return availableBuses;
    }

    public getBookedSeats(busId: string, date: string, source: City, destination: City): Set<number> {
        const allBookings = db.getBookings();
        const relevantBookings = allBookings.filter(b => b.busId === busId && b.date === date);

        if (relevantBookings.length === 0) return new Set();

        const route = this.getRouteForBus(busId);
        if (!route) return new Set();

        const journeySourceIndex = route.stops.indexOf(source);
        const journeyDestIndex = route.stops.indexOf(destination);

        const bookedSeats = new Set<number>();
        for (const booking of relevantBookings) {
            const bookingSourceIndex = route.stops.indexOf(booking.source);
            const bookingDestIndex = route.stops.indexOf(booking.destination);
            
            // Overlap condition: max(start1, start2) < min(end1, end2)
            if (Math.max(journeySourceIndex, bookingSourceIndex) < Math.min(journeyDestIndex, bookingDestIndex)) {
                booking.seats.forEach(seat => bookedSeats.add(seat));
            }
        }

        return bookedSeats;
    }

    public bookTicket(userId: string, busId: string, date: string, source: City, destination: City, seats: number[]): Booking {
        const bus = this.buses.find(b => b.id === busId);
        if (!bus) throw new Error("Bus not found");

        const newBooking: Booking = {
            id: `TKT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            userId,
            busId,
            date,
            source,
            destination,
            seats,
            totalFare: seats.length * bus.farePerSeat,
            bookingTime: new Date(),
        };

        const allBookings = db.getBookings();
        allBookings.push(newBooking);
        db.setBookings(allBookings);

        return newBooking;
    }
    
    public cancelBooking(bookingId: string): { success: boolean, refundAmount: number, message: string } {
        const allBookings = db.getBookings();
        const bookingToRemove = allBookings.find(b => b.id === bookingId);

        if (!bookingToRemove) {
            return { success: false, refundAmount: 0, message: "Booking not found." };
        }
        
        const bus = this.buses.find(b => b.id === bookingToRemove.busId);
        if (!bus) {
            return { success: false, refundAmount: 0, message: "Associated bus not found." };
        }

        const departureDateTime = new Date(`${bookingToRemove.date}T${bus.departureTime}:00`);
        const now = new Date();
        const hoursBeforeDeparture = (departureDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        let refundPercentage = 0;
        if (hoursBeforeDeparture > 24) {
            refundPercentage = 0.90;
        } else if (hoursBeforeDeparture >= 6) {
            refundPercentage = 0.50;
        }

        const refundAmount = bookingToRemove.totalFare * refundPercentage;
        
        const updatedBookings = allBookings.filter(b => b.id !== bookingId);
        db.setBookings(updatedBookings);
        
        const message = `Cancellation successful. ${refundPercentage * 100}% refund issued.`;

        return { success: true, refundAmount, message };
    }

    public getBookingsForUser(userId: string): Booking[] {
        const allBookings = db.getBookings();
        return allBookings
            .filter(booking => booking.userId === userId)
            .sort((a, b) => b.bookingTime.getTime() - a.bookingTime.getTime());
    }

    public getAllBookings(): Booking[] {
        return db.getBookings().sort((a, b) => b.bookingTime.getTime() - a.bookingTime.getTime());
    }
    
    public getRouteForBus(busId: string): Route | undefined {
        const bus = this.buses.find(b => b.id === busId);
        return this.routes.find(r => r.id === bus?.routeId);
    }
    
    public getAllRoutes(): Route[] {
        return this.routes;
    }

    public getAllBuses(): Bus[] {
        return this.buses;
    }

    public addRoute(stops: City[]): Route {
        const newRoute: Route = {
            id: `R${Date.now()}`,
            stops,
        };
        db.addRoute(newRoute);
        this.routes.push(newRoute);
        return newRoute;
    }

    public addBus(busData: Omit<Bus, 'id'>): Bus {
        const newBus: Bus = {
            ...busData,
            id: `B${Date.now()}`,
        };
        db.addBus(newBus);
        this.buses.push(newBus);
        return newBus;
    }
}

export const busService = new BusService();