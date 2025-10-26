import React from 'react';
import { Bus, City } from '../types';
import { ArrowRightIcon } from './icons';

interface BusCardProps {
    bus: Bus;
    source: City;
    destination: City;
    onViewSeats: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ bus, onViewSeats }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col sm:flex-row">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{bus.name}</h3>
                        <p className="text-sm text-slate-700">Total Seats: {bus.totalSeats}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{bus.farePerSeat}</p>
                        <p className="text-xs text-slate-700">per seat</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-slate-800">
                    <div className="text-center">
                        <p className="font-semibold text-lg">{bus.departureTime}</p>
                        <p className="text-sm text-slate-700">Departure</p>
                    </div>
                    <div className="flex-grow flex items-center justify-center px-4">
                       <ArrowRightIcon className="w-10 h-10 text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-lg">{bus.arrivalTime}</p>
                        <p className="text-sm text-slate-700">Arrival</p>
                    </div>
                </div>
            </div>
            <div className="bg-slate-50 p-4 sm:p-6 flex items-center justify-center sm:w-48">
                <button 
                    onClick={onViewSeats}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                    View Seats
                </button>
            </div>
        </div>
    );
};

export default BusCard;
