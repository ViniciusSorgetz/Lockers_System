import { IClass } from "@/app/models/Class";
import { ILocker } from "@/app/models/Locker";
import { useClassesContext } from "@/context/ClassesContext";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useState } from "react";

const LockerFree = (props : { closeModal : () => void }) => {

    const { closeModal } = props;

    const { locker, lockers, setLockers } = useLockersContext();
    const { classes } = useClassesContext();

    const [currentClass, setCurrentClass] = useState<IClass>();
    const [selectedSutent, setSelectedStudent] = useState<string>();
    const [errorMessage, setErrorMessage] = useState("");
    const [lockerDeadline, setLockerDeadline] = useState<string>();

    const occupyLocker = async () : Promise<void> => {
        if(!selectedSutent){
          setErrorMessage("Selecione um estudante.");
          return;
        }
        if(!lockerDeadline){
          setErrorMessage("Selecione uma data.");
          return;
        }
        else{
          const deadLine = new Date(lockerDeadline + "T00:00:00");
          const today = new Date(Date.now());
          if(today > deadLine){
            setErrorMessage("Prazo inválido.");
            return;
          }
        }
        try {
          const resp = await axios.post("/api/lockers/occupy", {
            locker_id: locker?._id,
            student_id: selectedSutent,
            deadline: lockerDeadline + "T00:00:00"
          });
          const updatedLocker = resp.data.locker as ILocker;
          const lockerIndex = lockers.findIndex(l => l.number == locker.number);
          const updatedLockers = [...lockers];
          updatedLockers[lockerIndex] = updatedLocker;
          setLockers(updatedLockers);
          closeModal();
        } 
        catch (error) {
          setErrorMessage("Dados incorretos.");
          console.log("Algo de errado.", error)
        }
    }
    
    const handleClassChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClass = classes.find(c => c.code === e.target.value) as IClass;
        setCurrentClass(selectedClass);
        setSelectedStudent("");
    }

    const handleStudentChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStudent(e.target.value);
    }

    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLockerDeadline(e.target.value);
    }

    return(<>
        <div className="modal-body">
        <form>
            <div className="mb-1">
            <label className="text-bold">Turma</label>
            <select
                className="form-control rounded-3"
                onChange={handleClassChange}
            >
                <option value="" selected>
                Selecione uma turma
                </option>
                {classes.map((c) => (
                <option value={c.code}>
                    {c.code}
                </option>
                ))}
            </select>
            </div>
            <div className="mb-1">
            <label className="text-bold">Aluno</label>
            <select
                className="form-control rounded-3" 
                value={selectedSutent}
                onChange={handleStudentChange}
            >
                <option value="" selected>
                Selecione um aluno
                </option>
                {currentClass?.students.map(student => (
                <option value={student._id?.toString()}>{student.name}</option>
                ))}
            </select>
            </div>
            <div>
            <label className="text-bold">Prazo da Ocupação</label>
                <input
                type="date"
                className="form-control rounded-3"
                value={lockerDeadline}
                onChange={handleDeadlineChange}
                />
            </div>
        </form>
        <div className="mt-2">
            {errorMessage.length > 0 && 
            <span className="mt-5 text-danger">{errorMessage}</span>
            }
        </div>
        </div>
        <div className="modal-footer">
        <button
            type="button"
            className="btn btn-outline-secondary rounded-5"
            data-bs-dismiss="modal"
            onClick={closeModal}
        >
            Fechar
        </button>
        <button type="button" onClick={occupyLocker} className="btn-main rounded-5">
            Ocupar Armário <i className="bi bi-lock-fill"></i>
        </button>
        </div>
    </>)
}

export default LockerFree;