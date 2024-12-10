import React from "react";
import axios from "axios";
import { IArmario } from "@/app/models/Locker";

const RemoveConfirmationModal = (props: any) => {
  const { closeModal, numero, predioSelecionado, armarios, setArmarios, setArmariosPredioAtual } = props;

  const handleDelete = async () => {
    try {
      // Fazendo a requisição DELETE para a API
      const response = await axios.delete("/api/armarios", {
        data: {
          predio: predioSelecionado,
          numero: numero,
        },
      });

      let armariosAtualizados = { ...armarios };
      let predioAtualizado;

      // Atualiza os armários com base no prédio selecionado
      switch (predioSelecionado) {
        case 'A':
          armariosAtualizados.predioA = armariosAtualizados.predioA.filter(
            (armario: IArmario) => armario.numero !== numero
          );
          predioAtualizado = [...armariosAtualizados.predioA];
          predioAtualizado.sort((a, b) => a.numero - b.numero);
          armariosAtualizados = {
            ...armariosAtualizados,
            predioA: predioAtualizado,
          };
          break;
        case 'B':
          armariosAtualizados.predioB = armariosAtualizados.predioB.filter(
            (armario: IArmario) => armario.numero !== numero
          );
          predioAtualizado = [...armariosAtualizados.predioB];
          predioAtualizado.sort((a, b) => a.numero - b.numero);
          armariosAtualizados = {
            ...armariosAtualizados,
            predioB: predioAtualizado,
          };
          break;
        case 'C':
          armariosAtualizados.predioC = armariosAtualizados.predioC.filter(
            (armario: IArmario) => armario.numero !== numero
          );
          predioAtualizado = [...armariosAtualizados.predioC];
          predioAtualizado.sort((a, b) => a.numero - b.numero);
          armariosAtualizados = {
            ...armariosAtualizados,
            predioC: predioAtualizado,
          };
          break;
        case 'D':
          armariosAtualizados.predioD = armariosAtualizados.predioD.filter(
            (armario: IArmario) => armario.numero !== numero
          );
          predioAtualizado = [...armariosAtualizados.predioD];
          predioAtualizado.sort((a, b) => a.numero - b.numero);
          armariosAtualizados = {
            ...armariosAtualizados,
            predioD: predioAtualizado,
          };
          break;
      }

      setArmariosPredioAtual(predioAtualizado);
      setArmarios(armariosAtualizados);

      closeModal();
    } catch (error) {
      console.error("Erro ao remover o armário:", error);
      alert("Houve um erro ao tentar remover o armário.");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", display: "block" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmação de Remoção</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <p>Tem certeza de que deseja remover o armário?</p>
            <strong>
              Armário selecionado: {numero}-{predioSelecionado}
            </strong>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;
