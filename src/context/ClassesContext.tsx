'use client';

import { IClass } from '@/app/models/Class';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const defaultClass : IClass = { code: "123", students: [] }

type ClassesContextType = {
    classes: IClass[]
    setClasses: React.Dispatch<React.SetStateAction<IClass[]>>
    currentClass: IClass
    setCurrentClass: React.Dispatch<React.SetStateAction<IClass>>
};

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const ClassesWrapper = ({ children }: { children: React.ReactNode }) => {
    
    const [classes, setClasses] = useState<IClass[]>([]);
    const [currentClass, setCurrentClass] = useState<IClass>(defaultClass);

    useEffect(() => {
        getClasses();
    }, []);

    const getClasses = async () => {
        try {
            const resp = await axios.get("api/classes");
            setClasses(resp.data.classes as IClass[]);
            console.log(resp.data.classes);
        } 
        catch (error) {
            console.log("Algo deu errado.", error);
        }
    }

    return (
        <ClassesContext.Provider value={{ 
            classes, setClasses,
            currentClass, setCurrentClass
        }}>
            {children}
        </ClassesContext.Provider>
    );
};

export const useClassesContext = () => {
    const context = useContext(ClassesContext);
    if (!context) {
        throw new Error("useClassesContext must be used within a ClassesProvider");
    }
    return context;
};
