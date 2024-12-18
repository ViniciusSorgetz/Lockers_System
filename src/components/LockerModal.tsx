import lockerClass from "@/app/utils/lockerClass";
import { useLockersContext } from "@/context/LockersContext";
import { useState } from "react";

const LockerModal = (props : { closeModal : () => void }) => {

    const { 
            lockers, setLockers, 
            locker, setLocker, 
            lockerState, setLockerState,
            building, setBuilding,
    } = useLockersContext();

    const { closeModal } = props;
    const [historySection, setHistorySection] = useState(true);

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
            <div className="modal-body">
              {/* Seleção de turma */}
              <label className="text-bold">Turma</label>
              <select
                className="form-control"
              >
                <option value="" disabled>
                  Selecione uma turma
                </option>
              </select>
              <br />

              {/* Seleção de aluno */}
              <label className="text-bold">Aluno</label>
              <select
                className="form-control"
              >
                <option value="" disabled>
                  Selecione um aluno
                </option>
              </select>
              <br />

              {/* Prazo da ocupação */}
              <label className="text-bold">Prazo da Ocupação</label>
              <input
                type="date"
                className="form-control"
              />
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
                Ocupar Armário <i className="bi bi-lock-fill"></i>
              </button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
};

export default LockerModal;
