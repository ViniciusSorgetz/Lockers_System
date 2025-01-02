import { Student } from "@/app/models/Class";
import { ILocker } from "@/app/models/Locker";
import formatDate from "@/app/utils/formatDate";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useEffect, useState } from 'react';

type PropsType = {
    closeModal : () => void
    openDeleteModal : () => void
}

const LockerOccupied = ( props : PropsType) => {

    const { closeModal, openDeleteModal } = props;
    const { locker, lockers, setLockers } = useLockersContext();
    const [ student, setStudent ] = useState<Student>();

    const [unnocupySection, setUnnocupySection] = useState(false);
    const [reason, setReason] = useState("");
    const [reasons, setReasons] = useState([
        "Saiu da escola", 
        "Não renovou", 
        "Foi expulso", 
        "Não usava o armário", 
        "Outro"
    ])
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
    
    return unnocupySection ? (
        <>
            <div className="modal-body">
                {reasons.map(reason => (
                    <div className="form-check" key={reason}>
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="reason"
                            onChange={() => setReason(reason)}
                        />
                        <label className="form-check-label">
                            {reason}
                        </label>
                    </div>
                ))}
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
        </>
    ) : (<>
            <div className="modal-body">
                {student ? (
                    <>
                        <div className="mb-1 color-main">
                            <span className="text-bold">Ocupante: </span>
                            {student?.name}
                        </div>
                        {student.phone_number && (
                            <div className="mb-1 color-main">
                                <span className="text-bold">Telefone do Ocupante: </span>
                                {student?.phone_number}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="color-main">Aluno não encontrado.</div>
                )}
                <div className="mb-1 color-main">
                    <span className="text-bold">Ocupação: </span>
                    {(formatDate(locker.start_date as Date)).padStart(2, "0")}
                </div>
                <div className="color-main">
                    <span className="text-bold">Prazo: </span>
                    {formatDate(locker.end_date as Date).padStart(2, "0")}
                </div>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn-cool btn-red"
                    data-bs-dismiss="modal"
                    onClick={openDeleteModal}
                >
                    <i className="bi bi-trash"></i>
                </button>
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
        </>
    );    
}

export default LockerOccupied;