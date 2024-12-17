import lockerClass from "@/app/utils/lockerClass";
import { useLockersContext } from "@/context/LockersContext";

const LockerModal = (props : { closeModal : () => void }) => {

    const { 
            lockers, setLockers, 
            locker, setLocker, 
            lockerState, setLockerState,
            building, setBuilding,
    } = useLockersContext();

    const { closeModal } = props;

    const getLockerClass = () : string => {
        switch(lockerState){
            case "irregular" : return "Irregular"
            case "occupied" : return "Ocupado"
            case "free" : return "Livre"
        }
        return "...";
    }

  return (
    <div className={"modal my-modal modal-" + lockerState} style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="armario-header">
              <h5 className="modal-title" style={{ color: "var(--modalColor)" }}>
                {locker?.number} {building}
              </h5>
              <h5 className="estado">{getLockerClass()}</h5>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default LockerModal;
