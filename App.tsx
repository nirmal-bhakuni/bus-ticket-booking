import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { busService } from './services/busService';
import { CITIES, City, User, UserRole, Bus, Booking, Route } from './types';
import { initializeDB, findUserByEmail } from './services/database';
import BusCard from './components/BusCard';
import LoginForm from './components/LoginForm';
import BookingModal from './components/BookingModal';
import HistoryModal from './components/HistoryModal';
import AdminPanel from './components/AdminPanel';
import { BusIcon, CalendarIcon, MapPinIcon, UsersIcon } from './components/icons';
import RouteMapModal from './components/RouteMapModal';

// Initialize the localStorage database when the app loads
initializeDB();

// Define this type at the top level
type PendingBookingAction = {
    bus: Bus;
    source: City;
    destination: City;
    date: string;
    seats: number[];
};

export default function App() {
    // State management
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [source, setSource] = useState<City>('Mumbai');
    const [destination, setDestination] = useState<City>('Pune');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [searchResults, setSearchResults] = useState<Bus[]>([]);
    const [error, setError] = useState<string>('');

    // Modal states
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [isRouteMapModalOpen, setRouteMapModalOpen] = useState(false);
    
    // Data for modals and admin panel
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [allBookings, setAllBookings] = useState<Booking[]>(() => busService.getAllBookings());
    const [allBuses, setAllBuses] = useState<Bus[]>(() => busService.getAllBuses());
    const [allRoutes, setAllRoutes] = useState<Route[]>(() => busService.getAllRoutes());


    // Pending action state
    const [pendingAction, setPendingAction] = useState<PendingBookingAction | null>(null);

    const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (source === destination) {
            setError('Source and Destination cannot be the same.');
            setSearchResults([]);
            return;
        }
        setError('');
        const results = busService.findBuses(source, destination, date);
        setSearchResults(results);
    };

    // Initial search on load
    useEffect(() => {
        handleSearch();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogin = (email: string) => {
        const user = findUserByEmail(email);
        if (user) {
            const { email: _email, ...currentUserData } = user;
            setCurrentUser(currentUserData);
            setLoginModalOpen(false);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setUserBookings([]);
    };

    const handleViewSeats = (bus: Bus) => {
        setSelectedBus(bus);
        setRouteMapModalOpen(true);
    };

    const handleProceedToBooking = () => {
        setRouteMapModalOpen(false);
        setBookingModalOpen(true);
    };
    
    const fetchUserBookings = useCallback(() => {
        if (currentUser) {
            setUserBookings(busService.getBookingsForUser(currentUser.id));
        }
    }, [currentUser]);

    const fetchAllBookingsAdmin = useCallback(() => {
        if (currentUser?.role === UserRole.ADMIN) {
            setAllBookings(busService.getAllBookings());
        }
    }, [currentUser]);
    
    const finalizeBooking = useCallback((action: PendingBookingAction) => {
        if (!currentUser) return;
        try {
            busService.bookTicket(currentUser.id, action.bus.id, action.date, action.source, action.destination, action.seats);
            setBookingModalOpen(false);
            setSelectedBus(null);
            fetchUserBookings();
            fetchAllBookingsAdmin();
            alert('Booking successful!');
        } catch (error) {
            alert(`Booking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [currentUser, fetchUserBookings, fetchAllBookingsAdmin]);

    const handleAttemptBooking = (bus: Bus, seats: number[]) => {
        const action: PendingBookingAction = { bus, source, destination, date, seats };
        if (!currentUser) {
            setPendingAction(action);
            setLoginModalOpen(true);
        } else {
            finalizeBooking(action);
        }
    };
    
    // Effect to trigger pending action after login
    useEffect(() => {
        if (currentUser && pendingAction) {
            finalizeBooking(pendingAction);
            setPendingAction(null);
        }
    }, [currentUser, pendingAction, finalizeBooking]);
    

    useEffect(() => {
        fetchUserBookings();
        fetchAllBookingsAdmin();
    }, [currentUser, fetchUserBookings, fetchAllBookingsAdmin]);
    
    const handleCancelBooking = (bookingId: string) => {
        const result = busService.cancelBooking(bookingId);
        alert(result.message);
        if(result.success) {
            fetchUserBookings();
            fetchAllBookingsAdmin();
        }
    }

    const handleAddRoute = (stops: City[]) => {
        try {
            const newRoute = busService.addRoute(stops);
            setAllRoutes(prev => [...prev, newRoute]);
            alert(`Route created successfully! ID: ${newRoute.id}`);
            return true;
        } catch (error) {
            alert(`Failed to add route: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    };

    const handleAddBus = (busData: Omit<Bus, 'id'>) => {
        try {
            const newBus = busService.addBus(busData);
            setAllBuses(prev => [...prev, newBus]);
            handleSearch(); // Refresh search results
            alert(`Bus "${newBus.name}" added successfully!`);
            return true;
        } catch (error) {
            alert(`Failed to add bus: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    };
    
    const closeBookingModals = () => {
        setRouteMapModalOpen(false);
        setBookingModalOpen(false);
        setSelectedBus(null);
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <header className="bg-white shadow-md sticky top-0 z-20">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <BusIcon className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-slate-900">Bus Route Finder</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <span className="hidden sm:block">Welcome, {currentUser.name}</span>
                                <button onClick={() => setHistoryModalOpen(true)} className="font-semibold text-blue-600 hover:text-blue-800 transition">My Bookings</button>
                                <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Logout</button>
                            </>
                        ) : (
                            <button onClick={() => setLoginModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition">Login</button>
                        )}
                    </div>
                </nav>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Search Form */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="col-span-1">
                            <label htmlFor="from" className="block text-sm font-medium text-slate-700 mb-1">From</label>
                            <div className="relative">
                                <MapPinIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-slate-500" />
                                <select id="from" value={source} onChange={(e) => setSource(e.target.value as City)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900">
                                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="to" className="block text-sm font-medium text-slate-700 mb-1">To</label>
                            <div className="relative">
                                <MapPinIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-slate-500" />
                                <select id="to" value={destination} onChange={(e) => setDestination(e.target.value as City)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900">
                                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <div className="relative">
                                <CalendarIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-slate-500" />
                                <input type="date" id="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900" />
                            </div>
                        </div>
                        <div className="col-span-1">
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">Search Buses</button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                {/* Search Results */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-900">Available Buses</h2>
                        <div className="flex items-center space-x-2 text-slate-700">
                            <UsersIcon/>
                            <span>{searchResults.length} Buses Found</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {searchResults.length > 0 ? (
                            searchResults.map(bus => (
                                <BusCard key={bus.id} bus={bus} onViewSeats={() => handleViewSeats(bus)} source={source} destination={destination} />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-slate-500">No buses available for this route on the selected date.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Panel */}
                {currentUser?.role === UserRole.ADMIN && (
                    <AdminPanel 
                        bookings={allBookings}
                        buses={allBuses}
                        routes={allRoutes}
                        onAddBus={handleAddBus}
                        onAddRoute={handleAddRoute}
                    />
                )}
            </main>

            {/* Modals */}
            {isLoginModalOpen && <LoginForm onClose={() => setLoginModalOpen(false)} onLogin={handleLogin} />}
            
            {isRouteMapModalOpen && selectedBus && (
                <RouteMapModal
                    bus={selectedBus}
                    source={source}
                    destination={destination}
                    onClose={closeBookingModals}
                    onProceed={handleProceedToBooking}
                />
            )}

            {isBookingModalOpen && selectedBus && (
                <BookingModal
                    bus={selectedBus}
                    source={source}
                    destination={destination}
                    date={date}
                    onClose={closeBookingModals}
                    onAttemptBooking={(seats) => handleAttemptBooking(selectedBus, seats)}
                />
            )}
            
            {isHistoryModalOpen && currentUser && (
                <HistoryModal 
                    bookings={userBookings}
                    buses={allBuses}
                    onClose={() => setHistoryModalOpen(false)}
                    onCancelBooking={handleCancelBooking}
                />
            )}
        </div>
    );
}