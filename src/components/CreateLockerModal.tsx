import { ILocker } from "@/app/models/Locker";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useEffect, useState } from "react";

const CreateLockerModal = (props : { closeModal : () => void }) => {

    const { 
        lockers, setLockers, 
        locker, setLocker, 
        lockerState, setLockerState,
        building, setBuilding,
    } = useLockersContext();

    const { closeModal } = props;
    const [lockerNumber, setLockerNumber] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        nextNumber();
        
    }, [lockers]);

    const nextNumber = () : void => {
        if(lockers && lockers.length > 1)
            for(let i = 0; i < lockers.length - 1; i++)
                if(lockers[i+1].number - lockers[i].number > 1)
                    return setLockerNumber(i+2);
        if(lockers) setLockerNumber(lockers.length+1);
    }

    const addLocker = async () => {
        // check locker if it doesn't already exist
        if(lockers?.findIndex((l : ILocker) => l.number == lockerNumber) != -1){
            setErrorMessage("Este armário já existe.");
        }
        try {
            const resp = await axios.post("api/lockers", {
                building : building,
                number: lockerNumber
            });
            const addedLocker = resp.data.locker;
            const lockersCopy = [...lockers];
            lockersCopy.push(addedLocker);
            lockersCopy.sort((a:ILocker, b:ILocker) => a.number - b.number);
            setLockers(lockersCopy);
            closeModal();
        } 
        catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) : void => {
        setLockerNumber(Number(e.target.value));
    }

    return (
        <div className={"modal my-modal"}style={{display: "block"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header" style={{display: "flex"}}>
                    <h5 className="modal-title">Criar Armário</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                    <label>Número do armário</label><br/><br/>
                    <input 
                        type="number" 
                        className="form-control" 
                        onChange={handleChange}
                        value={lockerNumber}
                    />
                    {errorMessage.length > 1 && 
                        <p className="text-danger mt-4">{errorMessage}</p>
                    }
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={(closeModal)}>Fechar</button>
                    <button type="button" className="btn btn-outline-primary" onClick={addLocker}>Adicionar armário</button>
                </div>
                </div>
            </div>
        </div>
  )
}

export default CreateLockerModal;