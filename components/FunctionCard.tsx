
import React from 'react';

interface FunctionCardProps {
    name: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

export const FunctionCard: React.FC<FunctionCardProps> = ({ name, icon, active, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
                p-3 rounded-xl cursor-pointer transition-all duration-300
                flex flex-col items-center justify-center gap-2 border
                ${active ? 'bg-orange-500 text-white border-transparent shadow-lg' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:shadow-md hover:-translate-y-1'}
            `}
        >
            <div className="text-2xl">{icon}</div>
            <span className="text-xs font-semibold">{name}</span>
        </div>
    );
};
