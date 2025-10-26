import React, { Suspense } from 'react';
import { Bus, City } from '../types';
import RouteMap from './RouteMap';

interface RouteMapModalProps {
    bus: Bus;
    source: City;
    destination: City;
    onClose: () => void;
    onProceed: () => void;
}

const RouteMapModal: React.FC<RouteMapModalProps> = ({ bus, source, destination, onClose, onProceed }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Route for {bus.name}</h2>
                    <button onClick={onClose} className="text-3xl font-light text-slate-600 hover:text-slate-800">&times;</button>
                </div>
                <div className="flex-grow relative">
                    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse">Loading Map...</div></div>}>
                         <RouteMap busId={bus.id} source={source} destination={destination} />
                    </Suspense>
                </div>
                <div className="p-5 border-t flex justify-end">
                    <button 
                        onClick={onProceed}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        Proceed to Seat Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RouteMapModal;
