import axios from "axios";
import { useState, useEffect } from "react";
import { ITurma } from "@/app/models/Turma";
import { IArmario } from "@/app/models/Locker";
import { Aluno } from "@/app/models/Turma";

const ArmarioLivre = (props: any) => {
  const {
    closeModal,
    predioSelecionado,
    armario,
    armarios,
    setArmarios,
    handlePredioAtual,
    setArmariosPredioAtual,
  } = props;

  const [turmas, setTurmas] = useState<ITurma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]); 
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState(""); 
  const [prazo, setPrazo] = useState(""); 

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const response = await axios.get("/api/turmas");
        setTurmas(response.data);
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      }
    };

    fetchTurmas();
  }, []);


  useEffect(() => {
    if (turmaSelecionada) {
      const turma = turmas.find((t: any) => t._id === turmaSelecionada);
      setAlunos(turma ? turma.alunos : []);
    } else {
      setAlunos([]); 
    }
  }, [turmaSelecionada, turmas]);

  // Função para ocupar o armário
  const ocuparArmario = async () => {

    if (!alunoSelecionado || !prazo) {
      alert("Por favor, selecione um aluno e defina o prazo!");
      return;
    }

    try {
      const response =  await axios.post("/api/armarios/ocupar", {
          armario_id: armario._id,
          prazo: new Date(prazo).toISOString(),
          aluno_id: alunoSelecionado,
      });

      const armarioNovo = response.data;
        let armariosAtualizados = { ...armarios };
        let predioAtualizado;
        
        // Remove o armário antigo antes de adicionar o novo
        switch (predioSelecionado) {
            case 'A':
                // Filtra o armário para remover o antigo antes de adicionar o novo
                armariosAtualizados.predioA = armariosAtualizados.predioA.filter((armario: IArmario) => armario._id !== armarioNovo._id);
                predioAtualizado = [...armariosAtualizados.predioA, armarioNovo];
                predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                armariosAtualizados = {
                    ...armariosAtualizados,
                    predioA: predioAtualizado
                };
                break;
            case 'B':
                armariosAtualizados.predioB = armariosAtualizados.predioB.filter((armario: IArmario) => armario._id !== armarioNovo._id);
                predioAtualizado = [...armariosAtualizados.predioB, armarioNovo];
                predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                armariosAtualizados = {
                    ...armariosAtualizados,
                    predioB: predioAtualizado
                };
                break;
            case 'C':
                armariosAtualizados.predioC = armariosAtualizados.predioC.filter((armario: IArmario) => armario._id !== armarioNovo._id);
                predioAtualizado = [...armariosAtualizados.predioC, armarioNovo];
                predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                armariosAtualizados = {
                    ...armariosAtualizados,
                    predioC: predioAtualizado
                };
                break;
            case 'D':
                armariosAtualizados.predioD = armariosAtualizados.predioD.filter((armario: IArmario) => armario._id !== armarioNovo._id);
                predioAtualizado = [...armariosAtualizados.predioD, armarioNovo];
                predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                armariosAtualizados = {
                    ...armariosAtualizados,
                    predioD: predioAtualizado
                };
                break;
      }
      setArmariosPredioAtual(predioAtualizado);
      setArmarios(armariosAtualizados);
      closeModal();
    }
    catch (error) {
      console.error("Erro ao ocupar armário:", error);
    }
  }

  return (
    <div className="modal meu-modal modal-livre" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="armario-header">
              <h5 className="modal-title" style={{ color: "var(--modalColor)" }}>
                {armario?.numero} {predioSelecionado}
              </h5>
              <h5 className="estado">Livre</h5>
            </div>
          </div>
          <div className="modal-body">
            {/* Seleção de turma */}
            <label className="text-bold">Turma</label>
            <select
              className="form-control"
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
            >
              <option value="" disabled>
                Selecione uma turma
              </option>
              {turmas.map((turma: any) => (
                <option key={turma._id} value={turma._id}>
                  {turma.codigo}
                </option>
              ))}
            </select>
            <br />

            {/* Seleção de aluno */}
            <label className="text-bold">Aluno</label>
            <select
              className="form-control"
              value={alunoSelecionado}
              onChange={(e) => setAlunoSelecionado(e.target.value)}
            >
              <option value="" disabled>
                Selecione um aluno
              </option>
              {alunos.map((aluno: any) => (
                <option key={aluno._id} value={aluno._id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
            <br />

            {/* Prazo da ocupação */}
            <label className="text-bold">Prazo da Ocupação</label>
            <input
              type="date"
              className="form-control"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
            />
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
            <button type="button" className="btn-main" onClick={ocuparArmario}>
              Ocupar Armário <i className="bi bi-lock-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmarioLivre;
