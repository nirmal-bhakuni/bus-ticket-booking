import { Route, Bus, User, Booking } from '../types';
import { ROUTES, BUSES, CREDENTIALS } from '../constants';

const DB_KEY_ROUTES = 'gemini_bus_routes';
const DB_KEY_BUSES = 'gemini_bus_buses';
const DB_KEY_USERS = 'gemini_bus_users';
const DB_KEY_BOOKINGS = 'gemini_bus_bookings';

// Helper functions for localStorage
const setItem = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage: ${key}`, error);
    }
};

const getItem = <T>(key: string): T | null => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage: ${key}`, error);
        return null;
    }
};

// Initial data seeding
export const initializeDB = (): void => {
    if (!getItem(DB_KEY_ROUTES)) {
        setItem<Route[]>(DB_KEY_ROUTES, ROUTES);
    }
    if (!getItem(DB_KEY_BUSES)) {
        setItem<Bus[]>(DB_KEY_BUSES, BUSES);
    }
    if (!getItem(DB_KEY_USERS)) {
        // Convert credentials object to an array of users for easier querying
        const usersArray = Object.entries(CREDENTIALS).map(([email, user]) => ({
            ...user,
            email,
        }));
        setItem<any[]>(DB_KEY_USERS, usersArray);
    }
    if (!getItem(DB_KEY_BOOKINGS)) {
        setItem<Booking[]>(DB_KEY_BOOKINGS, []);
    }
};

// --- Data Accessors ---

// Users
export const getUsers = (): (User & { email: string })[] => {
    return getItem<(User & { email: string })[]>(DB_KEY_USERS) || [];
};

export const findUserByEmail = (email: string): (User & { email: string }) | undefined => {
    return getUsers().find(user => user.email === email);
}

// Routes
export const getRoutes = (): Route[] => {
    return getItem<Route[]>(DB_KEY_ROUTES) || [];
};

export const addRoute = (route: Route): void => {
    const routes = getRoutes();
    routes.push(route);
    setItem(DB_KEY_ROUTES, routes);
};

// Buses
export const getBuses = (): Bus[] => {
    return getItem<Bus[]>(DB_KEY_BUSES) || [];
};

export const addBus = (bus: Bus): void => {
    const buses = getBuses();
    buses.push(bus);
    setItem(DB_KEY_BUSES, buses);
};


// Bookings
export const getBookings = (): Booking[] => {
    // Dates are stored as strings, so we need to convert them back to Date objects
    const bookings = getItem<Booking[]>(DB_KEY_BOOKINGS) || [];
    return bookings.map(b => ({ ...b, bookingTime: new Date(b.bookingTime) }));
};

export const setBookings = (bookings: Booking[]): void => {
    setItem<Booking[]>(DB_KEY_BOOKINGS, bookings);
};