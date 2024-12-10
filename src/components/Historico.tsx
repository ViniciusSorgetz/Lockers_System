import axios from "axios";
import { useState } from "react";

const Historico = (props: any) => {
  const { closeModal, predioSelecionado, armario } = props;

  const estadoArmario = (): string => {
    if (armario.ocupado) {
      const prazo = armario.data_prazo ? new Date(armario.data_prazo) : null;
      const hoje = new Date();
      if (prazo) return hoje > prazo ? "modal meu-modal modal-irregular" : "modal meu-modal modal-ocupado";
    }
    return "modal meu-modal modal-livre";
  };

  return (
    <div className={estadoArmario()} style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ color: "var(--modalColor)" }}>
              {armario.numero} {predioSelecionado}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div style={{ maxHeight: '300px', paddingRight: "25px", minHeight: "200px", overflowY: 'auto', border: "none" }}>
                  {/* Mapeando o histórico */}
                  {armario.historico.length > 0 ? (
                    armario.historico.map((item: any) => (
                      <div key={item._id} className="mb-3">
                        <p>
                          <strong>Início:</strong> {new Date(item.inicio).toLocaleDateString('pt-BR')}
                        </p>
                        <p>
                          <strong>Término:</strong> {new Date(item.termino).toLocaleDateString('pt-BR')}
                        </p>
                        <p>
                          <strong>Motivo:</strong> {item.motivo}
                        </p>
                        <hr/>
                      </div>
                    ))
                  ) : (
                    <p>Não há histórico para este armário.</p>
                  )}
                </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historico;
