"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useLockersContext } from "@/context/LockersContext";
import { ILocker } from "../models/Locker";
import LockerModal from "@/components/LockerModal";
import CreateLockerModal from "@/components/CreateLockerModal";

const LockersPage = () => {

    const { 
        lockers, setLockers, 
        locker, setLocker, 
        lockerState, setLockerState,
        building, setBuilding,
    } = useLockersContext();

    const [lockerModal, setLockerModal] = useState(false);
    const [createLockerModal, setCreateLockerModal] = useState(false);

    useEffect(() => {

        getData('A');
    }, []);

    const getData = async (letter : 'A' | 'B' | 'C' | 'D') => {
        try {
            const resp = await axios.get(`api/lockers/building/${letter}`);
            const data = resp.data as ILocker[];

            const sortedLockers = data.sort((a:ILocker, b:ILocker) => a.number - b.number);
            setLockers(sortedLockers);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    const lockerClass = (locker: ILocker): string => {
        if (locker.occupied) {
            const deadline = locker.end_date ? new Date(locker.end_date) : null;
            const today = new Date();
            if (deadline) return today > deadline ? "irregular" : "occupied";
        }
        return "free";
    };

    const handleClick = (locker: ILocker): void => {
        setLocker(locker);
        setLockerModal(true);
        const state = lockerClass(locker);
        setLockerState(state);
    }

    const handleBuilding = (e : React.ChangeEvent<HTMLSelectElement>) : void => {
        const letter = e.target.value as 'A' | 'B' | 'C' | 'D';
        setBuilding(letter);
        getData(letter);
    }

    return (<>
        {lockerModal && <LockerModal closeModal={() => setLockerModal(false)}/>}
        {createLockerModal && <CreateLockerModal closeModal={() => setCreateLockerModal(false)}/>}
        <div className="main">
            <div className="lockers-header">
                <select
                    className="lockers-select"
                    aria-label="building select"
                    onChange={handleBuilding}
                    defaultValue={"A"}
                >
                    <option value="A">Predio A</option>
                    <option value="B">Predio B</option>
                    <option value="C">Predio C</option>
                    <option value="D">Predio D</option>
                </select>
                <button className="btn-create" onClick={() => {setCreateLockerModal(true)}}>
                    Adicionar armário
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>
            <div className="lockers">
                {lockers?.map((locker) => (
                    <div
                        key={locker.number}
                        className={"locker locker-" + lockerClass(locker)}
                        onClick={() => handleClick(locker)}
                    >
                        {locker.number}
                    </div>
                ))}
                {lockers?.length === 0 && (
                    <label className="my-3">Sem armários por aqui...</label>
                )}
            </div>
        </div>
    </>);
};

export default LockersPage;
