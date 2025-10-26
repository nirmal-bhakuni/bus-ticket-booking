import React from 'react';

interface SeatProps {
    seatNumber: number;
    isBooked: boolean;
    isSelected: boolean;
    onSelect: (seatNumber: number) => void;
}

const Seat: React.FC<SeatProps> = ({ seatNumber, isBooked, isSelected, onSelect }) => {
    const getSeatClasses = () => {
        if (isBooked) {
            return 'bg-slate-500 text-white cursor-not-allowed';
        }
        if (isSelected) {
            return 'bg-blue-600 text-white border-blue-700';
        }
        return 'bg-blue-100 hover:bg-blue-200 cursor-pointer';
    };

    return (
        <button
            onClick={() => onSelect(seatNumber)}
            disabled={isBooked}
            className={`w-10 h-10 flex items-center justify-center text-sm font-semibold border-2 border-transparent rounded-md transition-colors duration-200 ${getSeatClasses()}`}
        >
            {seatNumber}
        </button>
    );
};

export default Seat;
