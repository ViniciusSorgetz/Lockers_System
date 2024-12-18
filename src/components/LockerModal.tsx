import { IClass, Student } from "@/app/models/Class";
import { ILocker } from "@/app/models/Locker";
import lockerClass from "@/app/utils/lockerClass";
import { useClassesContext } from "@/context/ClassesContext";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useState } from "react";

const LockerModal = (props : { closeModal : () => void }) => {

  const { 
          lockers, setLockers, 
          locker, setLocker, 
          lockerState, setLockerState,
          building, setBuilding,
  } = useLockersContext();

  const { classes, setClasses } = useClassesContext();

  const { closeModal } = props;
  const [historySection, setHistorySection] = useState(false);
  const [classCodes, setClassCodes] = useState<string[]>([]);
  const [currentClass, setCurrentClass] = useState<IClass>();
  const [selectedSutent, setSelectedStudent] = useState<string>();
  const [lockerDeadline, setLockerDeadline] = useState<string>();
  const [errorMessage, setErrorMessage] = useState("");

  const getLockerClass = () : string => {
      switch(lockerState){
          case "irregular" : return "Irregular";
          case "occupied" : return "Ocupado";
          case "free" : return "Livre";
          default: return "..."
      }
  }

  const formatDate = (someDate : Date) : string => {
    const date = new Date(someDate);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
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

  return (
    <div className={"modal my-modal modal-" + lockerState} style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="locker-header">
              <div className="locker-info">
                <h5 className="modal-title">
                  {locker.number} {building}
                </h5>
                <h5 className="estado">{getLockerClass()}</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
            </div>
            <div className="locker-header mt-2 locker-modal-section">
              <h6 
                className={historySection ? "" : "locker-section-selected"}
                onClick={() => setHistorySection(false)}
              >
                Informações
              </h6>
              <h6 
                className={historySection ? "locker-section-selected" : ""}
                onClick={() => setHistorySection(true)}
              >
                Histórico
              </h6>
            </div>
          </div>
          {historySection ?
          <>
            {/* --- Locker History --- */}
            <div className="modal-body">
              {locker.history.length > 0 ? 
                <>
                  {locker.history.slice(0).reverse().map((history) => (
                  <div className="locker-history border rounded-4 p-3 mb-2">
                    <div>
                      <span className="text-bold">Início: </span>{formatDate(history.start_date)}
                    </div>
                    <div>
                      <span className="text-bold">Término: </span>{formatDate(history.end_date)}
                    </div>
                    <div>
                      <span className="text-bold">Moivo do término: </span>{history.reason}
                    </div>
                  </div>
                  ))}
                </> :
                <><label>Sem histórico para este armário.</label></>
              }
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
            </div>
          </> 
          :
          <>
            {locker.occupied ? 
            <> {/* --- Locker Occupied --- */}
              <div className="modal-body">
            
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
              <button type="button" className="btn-main rounded-5">
                Liberar Armário <i className="bi bi-lock-fill"></i>
              </button>
            </div>
            </> : 
            <> {/* --- Locker Free --- */}
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
            </>}
          </>}
        </div>
      </div>
    </div>
  );
};

export default LockerModal;
