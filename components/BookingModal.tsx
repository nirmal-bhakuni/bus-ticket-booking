import React, { useState, useMemo } from 'react';
import { Bus, City } from '../types';
import { busService } from '../services/busService';
import Seat from './Seat';

interface BookingModalProps {
    bus: Bus;
    source: City;
    destination: City;
    date: string;
    onClose: () => void;
    onAttemptBooking: (selectedSeats: number[]) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ bus, source, destination, date, onClose, onAttemptBooking }) => {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const bookedSeats = useMemo(() => {
        return busService.getBookedSeats(bus.id, date, source, destination);
    }, [bus.id, date, source, destination]);

    const handleSelectSeat = (seatNumber: number) => {
        setSelectedSeats(prev => 
            prev.includes(seatNumber) 
                ? prev.filter(s => s !== seatNumber) 
                : [...prev, seatNumber]
        );
    };

    const handleBookNow = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }
        onAttemptBooking(selectedSeats);
    };

    const totalFare = selectedSeats.length * bus.farePerSeat;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Select Seats for {bus.name}</h2>
                    <button onClick={onClose} className="text-3xl font-light text-slate-600 hover:text-slate-800">&times;</button>
                </div>
                
                <div className="flex flex-col md:flex-row">
                    {/* Seat Layout */}
                    <div className="p-6 flex-grow border-b md:border-b-0 md:border-r">
                        <h3 className="font-semibold mb-4 text-center">Bus Layout</h3>
                        <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
                            {Array.from({ length: bus.totalSeats }, (_, i) => i + 1).map(seatNumber => (
                                <React.Fragment key={seatNumber}>
                                    {seatNumber % 4 === 3 && <div className="col-span-1"></div>}
                                    <Seat
                                        seatNumber={seatNumber}
                                        isBooked={bookedSeats.has(seatNumber)}
                                        isSelected={selectedSeats.includes(seatNumber)}
                                        onSelect={handleSelectSeat}
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                         <div className="flex justify-center space-x-4 mt-6 text-sm">
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-blue-100 border mr-2"></span>Available</div>
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-blue-600 mr-2"></span>Selected</div>
                            <div className="flex items-center"><span className="w-4 h-4 rounded-full bg-slate-500 mr-2"></span>Booked</div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="p-6 bg-slate-50 md:w-1/3">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Booking Summary</h3>
                        <div className="space-y-2 text-sm text-slate-800">
                            <p><strong>From:</strong> {source}</p>
                            <p><strong>To:</strong> {destination}</p>
                            <p><strong>Date:</strong> {date}</p>
                            <p><strong>Bus:</strong> {bus.name}</p>
                            <p><strong>Selected Seats:</strong> <span className="font-medium">{selectedSeats.sort((a,b)=>a-b).join(', ') || 'None'}</span></p>
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-slate-800">Total Fare:</span>
                                <span className="text-2xl font-bold text-blue-600">₹{totalFare}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t flex justify-end">
                    <button 
                        onClick={handleBookNow}
                        disabled={selectedSeats.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
