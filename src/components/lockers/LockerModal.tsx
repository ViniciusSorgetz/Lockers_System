import { useLockersContext } from "@/context/LockersContext";
import { useState } from "react";
import LockerFree from "./LockerFree";
import LockerOccupied from "./LockerOccupied";
import formatDate from "@/app/utils/formatDate";

const LockerModal = (props : { closeModal : () => void }) => {

  const { 
          lockers, setLockers, 
          locker, setLocker, 
          lockerState, setLockerState,
          building, setBuilding,
  } = useLockersContext();

  const { closeModal } = props;
  const [historySection, setHistorySection] = useState(false);

  const getLockerClass = () : string => {
      switch(lockerState){
          case "irregular" : return "Irregular";
          case "occupied" : return "Ocupado";
          case "free" : return "Livre";
          default: return "..."
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
            {locker.occupied 
              ? <LockerOccupied closeModal={closeModal}/>
              : <LockerFree closeModal={closeModal}/>}
          </>}
        </div>
      </div>
    </div>
  );
};

export default LockerModal;
