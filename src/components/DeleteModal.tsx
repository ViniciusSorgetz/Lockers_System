
type PropsType = {
    message : string,
    remove : () => Promise<void>
    closeDeleteModal : () => void
}


const DeleteModal = ( props: PropsType ) => {
    
    const { closeDeleteModal, message, remove } = props;

    return(
        <div className="modal my-modal" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Confirmar remoção</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeDeleteModal}></button>
                    </div>
                    <div className="modal-body">
                        {message}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cool btn-red"
                            data-bs-dismiss="modal"
                            onClick={() => {
                                remove();
                            }}
                        >
                            Remover <i className="bi bi-trash"></i>
                        </button>
                        <button
                            type="button"
                            className="btn-cool btn-gray"
                            data-bs-dismiss="modal"
                            onClick={closeDeleteModal}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal;