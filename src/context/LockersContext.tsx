'use client';

import { ILocker } from '@/app/models/Locker';
import { createContext, useContext, useState } from 'react';

const defaultLocker : ILocker = { number: 1, building: 'A', occupied: false, history: []}

type LockersContextType = {
    lockers: ILocker[]
    setLockers: React.Dispatch<React.SetStateAction<ILocker[]>>
    locker: ILocker
    setLocker: React.Dispatch<React.SetStateAction<ILocker>>
    lockerState : string,
    setLockerState: React.Dispatch<React.SetStateAction<string>>
    building: 'A' | 'B' | 'C' | 'D'
    setBuilding: React.Dispatch<React.SetStateAction<'A' | 'B' | 'C' | 'D'>>
};

const LockersContext = createContext<LockersContextType | undefined>(undefined);

export const LockersWrapper = ({ children }: { children: React.ReactNode }) => {
    
    const [lockers, setLockers] = useState<ILocker[]>([]);
    const [locker, setLocker] = useState<ILocker>(defaultLocker);
    const [lockerState, setLockerState] = useState("");
    const [building, setBuilding] = useState<'A' | 'B' | 'C' | 'D'>('A');

    return (
        <LockersContext.Provider value={{ 
            lockers, setLockers, 
            locker, setLocker, 
            lockerState, setLockerState,
            building, setBuilding,
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
