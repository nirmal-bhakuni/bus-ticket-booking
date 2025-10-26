import React, { useState } from 'react';
import { Booking, Bus, Route, City, CITIES } from '../types';

interface AdminPanelProps {
    bookings: Booking[];
    buses: Bus[];
    routes: Route[];
    onAddBus: (busData: Omit<Bus, 'id'>) => boolean;
    onAddRoute: (stops: City[]) => boolean;
}

const AddRouteForm: React.FC<{ onAddRoute: (stops: City[]) => boolean }> = ({ onAddRoute }) => {
    const [stops, setStops] = useState<City[]>([]);
    const [currentStop, setCurrentStop] = useState<City>(CITIES[0]);

    const handleAddStop = () => {
        if (currentStop && !stops.includes(currentStop)) {
            setStops([...stops, currentStop]);
        }
    };
    
    const handleRemoveStop = (index: number) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (stops.length < 2) {
            alert("A route must have at least 2 stops.");
            return;
        }
        const success = onAddRoute(stops);
        if (success) {
            setStops([]);
        }
    };

    return (
        <div className="bg-slate-50 p-4 rounded-lg border">
            <h4 className="text-lg font-semibold mb-2">Create New Route</h4>
            <form onSubmit={handleSubmit}>
                <div className="flex items-end gap-2 mb-3">
                    <div className="flex-grow">
                        <label htmlFor="stop" className="text-sm font-medium">Add Stop</label>
                        <select id="stop" value={currentStop} onChange={(e) => setCurrentStop(e.target.value as City)} className="w-full mt-1 p-2 border border-slate-300 rounded-md">
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button type="button" onClick={handleAddStop} className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600">-&gt; Add</button>
                </div>

                <div className="bg-white p-3 rounded-md border min-h-[60px] mb-3">
                    <p className="font-semibold">Current Route:</p>
                    {stops.length > 0 ? (
                        <ol className="flex flex-wrap items-center gap-2 mt-1">
                            {stops.map((stop, index) => (
                                <li key={index} className="flex items-center bg-slate-200 rounded-full px-3 py-1 text-sm">
                                    <span>{stop}</span>
                                    <button type="button" onClick={() => handleRemoveStop(index)} className="ml-2 text-red-500 hover:text-red-700 font-bold">&times;</button>
                                </li>
                            ))}
                        </ol>
                    ) : <p className="text-sm text-slate-500">Add stops to create a route.</p>}
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Create Route</button>
            </form>
        </div>
    );
};

const AddBusForm: React.FC<{ routes: Route[], onAddBus: (bus: Omit<Bus, 'id'>) => boolean }> = ({ routes, onAddBus }) => {
    const [busData, setBusData] = useState({
        name: '',
        routeId: routes[0]?.id || '',
        totalSeats: '40',
        departureTime: '10:00',
        arrivalTime: '22:00',
        farePerSeat: '1000'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setBusData({ ...busData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!busData.routeId) {
            alert("Please select a route. If no routes are available, create one first.");
            return;
        }
        const success = onAddBus({
            ...busData,
            totalSeats: parseInt(busData.totalSeats, 10),
            farePerSeat: parseFloat(busData.farePerSeat)
        });
        if(success) {
             e.currentTarget.closest('form')?.reset();
        }
    };

    return (
        <div className="bg-slate-50 p-4 rounded-lg border">
            <h4 className="text-lg font-semibold mb-2">Add New Bus</h4>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label>Bus Name</label>
                    <input name="name" onChange={handleChange} required className="w-full mt-1 p-2 border rounded"/>
                </div>
                <div>
                    <label>Route</label>
                    <select name="routeId" value={busData.routeId} onChange={handleChange} required className="w-full mt-1 p-2 border rounded">
                         {routes.map(r => <option key={r.id} value={r.id}>{r.stops.join(' - ')}</option>)}
                    </select>
                </div>
                <div>
                    <label>Total Seats</label>
                    <input name="totalSeats" type="number" value={busData.totalSeats} onChange={handleChange} required className="w-full mt-1 p-2 border rounded"/>
                </div>
                <div>
                    <label>Fare per Seat (₹)</label>
                    <input name="farePerSeat" type="number" value={busData.farePerSeat} onChange={handleChange} required className="w-full mt-1 p-2 border rounded"/>
                </div>
                <div>
                    <label>Departure Time</label>
                    <input name="departureTime" type="time" value={busData.departureTime} onChange={handleChange} required className="w-full mt-1 p-2 border rounded"/>
                </div>
                <div>
                    <label>Arrival Time</label>
                    <input name="arrivalTime" type="time" value={busData.arrivalTime} onChange={handleChange} required className="w-full mt-1 p-2 border rounded"/>
                </div>
                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700">Add Bus</button>
                </div>
            </form>
        </div>
    );
};


const AdminPanel: React.FC<AdminPanelProps> = ({ bookings, buses, routes, onAddBus, onAddRoute }) => {
    const [activeTab, setActiveTab] = useState<'bookings' | 'buses' | 'routes'>('bookings');

    const renderTabContent = () => {
        switch(activeTab) {
            case 'bookings':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                             <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Booking ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">User ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Route</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Seats</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Fare</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.id.slice(-8)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{booking.userId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{booking.source} &rarr; {booking.destination}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{booking.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{booking.seats.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">₹{booking.totalFare}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {bookings.length === 0 && <p className="text-center py-4 text-slate-500">No bookings in the system yet.</p>}
                    </div>
                );
            case 'buses':
                return (
                    <div className="space-y-6">
                        <AddBusForm routes={routes} onAddBus={onAddBus} />
                         <div>
                            <h4 className="text-lg font-semibold mb-2">Existing Buses ({buses.length})</h4>
                             <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">Route ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">Seats</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">Fare</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {buses.map(bus => <tr key={bus.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{bus.name}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{bus.routeId}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{bus.totalSeats}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">₹{bus.farePerSeat}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'routes':
                 return (
                    <div className="space-y-6">
                        <AddRouteForm onAddRoute={onAddRoute} />
                         <div>
                            <h4 className="text-lg font-semibold mb-2">Existing Routes ({routes.length})</h4>
                             <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">Route ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase">Stops</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {routes.map(route => <tr key={route.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{route.id}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{route.stops.join(' → ')}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
        }
    }

    const TabButton: React.FC<{ tab: typeof activeTab, children: React.ReactNode }> = ({ tab, children }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                activeTab === tab 
                ? 'bg-white border-b-2 border-blue-600 text-blue-600' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
        >{children}</button>
    );

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Panel</h2>
            <div className="border-b border-slate-200">
                <TabButton tab="bookings">All Bookings</TabButton>
                <TabButton tab="buses">Manage Buses</TabButton>
                <TabButton tab="routes">Manage Routes</TabButton>
            </div>
            <div className="bg-white p-6 rounded-b-lg shadow-lg">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminPanel;
