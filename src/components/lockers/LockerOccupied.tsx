import { Student } from "@/app/models/Class";
import { ILocker } from "@/app/models/Locker";
import formatDate from "@/app/utils/formatDate";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useEffect, useState } from 'react';

const LockerOccupied = ( props : { closeModal : () => void }) => {

    const { closeModal } = props;
    const { locker, lockers, setLockers } = useLockersContext();
    const [ student, setStudent ] = useState<Student>();

    const [unnocupySection, setUnnocupySection] = useState(false);
    const [reason, setReason] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect (() => {
        getStudent();
    }, []);
    
    const getStudent = async () => {
        try {
            const resp = await axios.get(`/api/classes/student/${locker.student_id}`);
            setStudent(resp.data.student as Student);
        } 
        catch (error) {
            console.log("Algo deu errado.", error);
        }
    }

    const unoccupyLocker = async () => {
        if (reason == ""){
            setErrorMessage("Escolha um motivo.");
            return;
        }
        try {
            const resp = await axios.post("/api/lockers/unoccupy", {
                locker_id: locker._id,
                reason: reason
            });
            const updatedLocker = resp.data.locker as ILocker;
            const lockerIndex = lockers.findIndex(l => l.number == locker.number);
            const lockersCopy = [...lockers];
            lockersCopy[lockerIndex] = updatedLocker;
            setLockers(lockersCopy);
            closeModal();
        } 
        catch (error : unknown) {
            console.log("Algo deu errado.", error);
        }
    }

    return ( unnocupySection ? 
        (<>
            <div className="modal-body">
                <div className="form-check">
                    <input 
                        className="form-check-input" type="radio" name="reason"
                        onChange={() => setReason("Saiu da Escola")}
                    />
                    <label className="form-check-label">
                        Saiu da Escola
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" type="radio" name="reason"
                        onChange={() => setReason("Não renovou")}
                    />
                    <label className="form-check-label">
                        Não renovou
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" type="radio" name="reason"
                        onChange={() => setReason("Foi expulso")}
                    />
                    <label className="form-check-label">
                        Foi expulso
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" type="radio" name="reason"
                        onChange={() => setReason("Não usava o armário")}
                    />
                    <label className="form-check-label">
                        Não usava o armário
                    </label>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" type="radio" name="reason"
                        onChange={() => setReason("Outro")}
                    />
                    <label className="form-check-label">
                        Outro
                    </label>
                </div>
                {errorMessage.length > 1 && <span className="text-danger">{errorMessage}</span>}
            </div> 
            <div className="modal-footer">
            <button
                type="button"
                className="btn btn-outline-secondary rounded-5"
                data-bs-dismiss="modal"
                onClick={() => setUnnocupySection(false)}
            >
                Voltar
            </button>
            <button 
                type="button" 
                className="btn-main rounded-5"
                onClick={unoccupyLocker}
            >
                Liberar Armário <i className="bi bi-lock-fill"></i>
            </button>
            </div>
        </>) : 
        (<>
        {student 
        ? <div className="modal-body">
            <div className="mb-1">
                <span className="text-bold">Ocupante: </span>
                {student?.name}
            </div>
            {student.phone_number && 
                <div className="mb-1">
                    <span className="text-bold">Telefone do Ocupante: </span>
                    {student?.phone_number}
                </div>}
            <div className="mb-1">
                <span className="text-bold">Ocupação: </span>
                {formatDate(locker.start_date as Date)}
            </div>
            <div>
                <span className="text-bold">Prazo: </span>
                {formatDate(locker.end_date as Date)}
            </div>
        </div> 
        : <div className="modal-body">
            <div>Carregando...</div>
        </div>}
        <div className="modal-footer">
            <button
                type="button"
                className="btn-cool btn-gray"
                data-bs-dismiss="modal"
                onClick={closeModal}
            >
                Fechar
            </button>
            <button 
                type="button" 
                className="btn-cool btn-modal"
                onClick={() => setUnnocupySection(true)}
            >
                Liberar Armário <i className="bi bi-lock-fill"></i>
            </button>
        </div>
    </>))
}

export default LockerOccupied;