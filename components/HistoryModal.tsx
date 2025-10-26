import React from 'react';
// Fix: Import `Bus` type and remove static `BUSES` constant import
import { Booking, Bus } from '../types';

interface HistoryModalProps {
    bookings: Booking[];
    // Fix: Add `buses` prop to accept the list of all buses
    buses: Bus[];
    onClose: () => void;
    onCancelBooking: (bookingId: string) => void;
}

// Fix: Destructure `buses` from props
const HistoryModal: React.FC<HistoryModalProps> = ({ bookings, buses, onClose, onCancelBooking }) => {
    
    const handleCancelClick = (booking: Booking) => {
        // Fix: Use the `buses` prop to find the bus, allowing for dynamic data
        const bus = buses.find(b => b.id === booking.busId);
        if (!bus) return;

        const departureDateTime = new Date(`${booking.date}T${bus.departureTime}:00`);
        const now = new Date();
        const hoursBeforeDeparture = (departureDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        let refundPercentage = 0;
        if (hoursBeforeDeparture > 24) {
            refundPercentage = 90;
        } else if (hoursBeforeDeparture >= 6) {
            refundPercentage = 50;
        }

        const refundAmount = booking.totalFare * (refundPercentage / 100);
        
        const confirmationMessage = `You are about to cancel this ticket.
Departure is in ${hoursBeforeDeparture.toFixed(1)} hours.
You will receive a ${refundPercentage}% refund of ₹${refundAmount.toFixed(2)}.
Do you want to proceed?`;

        if (window.confirm(confirmationMessage)) {
            onCancelBooking(booking.id);
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">My Bookings</h2>
                    <button onClick={onClose} className="text-3xl font-light text-slate-600 hover:text-slate-800">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 bg-slate-50">
                    {bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map(booking => {
                                // Fix: Use the `buses` prop to find the bus, allowing for dynamic data
                                const bus = buses.find(b => b.id === booking.busId);
                                const isPastBooking = new Date(booking.date) < new Date(new Date().toDateString());
                                return (
                                    <div key={booking.id} className={`p-4 rounded-lg shadow ${isPastBooking ? 'bg-slate-100' : 'bg-white'}`}>
                                        <div className="flex flex-col sm:flex-row justify-between">
                                            <div>
                                                <p className="font-bold text-blue-700">{booking.source} to {booking.destination}</p>
                                                <p className="text-sm text-slate-800">{bus?.name} on {booking.date}</p>
                                                <p className="text-sm text-slate-700">Seats: {booking.seats.join(', ')}</p>
                                            </div>
                                            <div className="text-left sm:text-right mt-2 sm:mt-0">
                                                <p className="font-semibold">Total Fare: ₹{booking.totalFare}</p>
                                                <p className="text-xs text-slate-600">ID: {booking.id}</p>
                                            </div>
                                        </div>
                                        {!isPastBooking && (
                                            <div className="mt-3 pt-3 border-t text-right">
                                                <button 
                                                    onClick={() => handleCancelClick(booking)}
                                                    className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                                                >
                                                    Cancel Ticket
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 py-10">You have no bookings.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;