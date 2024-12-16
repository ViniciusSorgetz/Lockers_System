'use client';

import { ILocker } from '@/app/models/Locker';
import { createContext, useContext, useState } from 'react';

type LockersContextType = {
    lockers: ILocker[] | null;
    setLockers: React.Dispatch<React.SetStateAction<ILocker[] | null>>;
    locker: ILocker | null;
    setLocker: React.Dispatch<React.SetStateAction<ILocker | null>>;
    building: 'A' | 'B' | 'C' | 'D';
    setBuilding: React.Dispatch<React.SetStateAction<'A' | 'B' | 'C' | 'D'>>;
};

const LockersContext = createContext<LockersContextType | undefined>(undefined);

export const LockersWrapper = ({ children }: { children: React.ReactNode }) => {
    const [lockers, setLockers] = useState<ILocker[] | null>(null);
    const [locker, setLocker] = useState<ILocker | null>(null);
    const [building, setBuilding] = useState<'A' | 'B' | 'C' | 'D'>('A');

    return (
        <LockersContext.Provider value={{ 
            lockers, setLockers, 
            locker, setLocker, 
            building, setBuilding 
        }}>
            {children}
        </LockersContext.Provider>
    );
};

export const useLockersContext = () => {
    const context = useContext(LockersContext);
    if (!context) {
        throw new Error("useLockersContext must be used within a LockersProvider");
    }
    return context;
};
