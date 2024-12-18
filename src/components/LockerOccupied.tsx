import { Student } from "@/app/models/Class";
import formatDate from "@/app/utils/formatDate";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useEffect, useState } from 'react';

const LockerOccupied = ( props : { closeModal : () => void }) => {

    const { closeModal } = props;
    const { locker, lockers, setLockers } = useLockersContext();
    const [ student, setStudent ] = useState<Student>();

    const [unnocupySection, setUnnocupySection] = useState(false);

    useEffect (() => {
        getStudent();
    }, []);
    
    const getStudent = async () => {
        try {
            const resp = await axios.get(`/api/classes/student/${locker.student_id}`);
            setStudent(resp.data.student as Student);
        } 
        catch (error) {
            
        }
    }

    return ( unnocupySection ? 
        (<>
            <div className="modal-body">
                <div className="form-check">
                    <input 
                        className="form-check-input" type="radio" name="reason"
                        />
                    <label className="form-check-label">
                        Default radio
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="reason"/>
                    <label className="form-check-label">
                        Default checked radio
                    </label>
                </div>
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
                className="btn btn-outline-secondary rounded-5"
                data-bs-dismiss="modal"
                onClick={closeModal}
            >
                Fechar
            </button>
            <button 
                type="button" 
                className="btn-main rounded-5"
                onClick={() => setUnnocupySection(true)}
            >
                Liberar Armário <i className="bi bi-lock-fill"></i>
            </button>
        </div>
    </>))
}

export default LockerOccupied;