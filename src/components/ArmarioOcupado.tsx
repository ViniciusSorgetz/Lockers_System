import { IArmario } from "@/app/models/Locker";
import axios from "axios";
import { Types } from "mongoose";
import { useEffect, useState } from "react";

const CriarArmario = (props: any) => {
    
    const { closeModal, idArmario, armario, setArmariosPredioAtual, setArmarios, armarios, predioSelecionado } = props;
    const [estado, setEstado] = useState("Ocupado");
    const [aluno, setAluno] = useState<any>({});
    const [exibirLiberacao, setExibirLiberacao] = useState(false); // Controle de exibição
    const [motivo, setMotivo] = useState(""); // Armazena o motivo selecionado

    const formatarData = (dataString: string): string => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    useEffect(() => {
        if (armario.ocupado) {
            const prazo = armario.data_prazo ? new Date(armario.data_prazo) : null;
            const hoje = new Date();
            if (prazo) {
                if (hoje > prazo) {
                    setEstado("Irregular");
                } else {
                    setEstado("Ocupado");
                }
            }
        }
        getStudentInfo(armario.aluno_id);
    }, [armario]);

    const estadoArmario = (armario: IArmario): string => {
        if (armario.ocupado) {
            const prazo = armario.data_prazo ? new Date(armario.data_prazo) : null;
            const hoje = new Date();
            if (prazo) return hoje > prazo ? "modal meu-modal modal-irregular" : "modal meu-modal modal-ocupado";
        }
        return "modal meu-modal";
    };

    const getStudentInfo = async (alunoId: Types.ObjectId) => {
        try {
            const resp = await axios.get(`/api/aluno/${alunoId}`);
            const data = resp.data;
            setAluno(data);
        } catch (error) {
            console.log(error);
        }
    };

    const liberarArmario = async () => {

        const data = {
            armario_id: armario._id,
            motivo: motivo
        }

        try {
            const response = await axios.post('/api/armarios/desocupar', data);
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
        
            console.log(predioAtualizado);
            setArmariosPredioAtual(predioAtualizado);
            setArmarios(armariosAtualizados);
            closeModal();
        } catch (error) {
            console.log("Erro ao liberar armário:", error);
        }        
        
    };

    return (
        <div className={estadoArmario(armario)} style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="armario-header">
                            <h5 className="modal-title" style={{ color: "var(--modalColor)" }}>{armario?.numero} {predioSelecionado}</h5>
                            <h5 className="estado">{estado}</h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={closeModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {!exibirLiberacao ? (
                            <>
                                <p><span className="text-bold">Ocupação:</span> {formatarData(armario?.data_ocupacao)}</p>
                                <p><span className="text-bold">Prazo:</span> {formatarData(armario?.data_prazo)}</p>
                                {aluno.aluno && (
                                    <>
                                        <p><span className="text-bold">Aluno:</span> {aluno.aluno.nome}</p>
                                        {aluno.aluno.telefone && (
                                            <p><span className="text-bold">Telefone:</span> {aluno.aluno.telefone}</p>
                                        )}
                                        <p><span className="text-bold">Turma:</span> {aluno.turma.codigo}</p>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <p><span className="text-bold">Motivo da liberação:</span></p>
                                <select
                                    className="form-select"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Vencimento do prazo">Vencimento do prazo</option>
                                    <option value="Mudança de aluno">Aluno saiu da escola</option>
                                    <option value="Aluno foi expulso">Aluno foi expulso</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        {!exibirLiberacao ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={closeModal}
                                >
                                    Fechar
                                </button>
                                <button
                                    type="button"
                                    className="btn-main"
                                    onClick={() => setExibirLiberacao(true)}
                                >
                                    Liberar armário <i className="bi bi-key-fill"></i>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setExibirLiberacao(false)}
                                >
                                    Voltar
                                </button>
                                <button
                                    type="button"
                                    className="btn-main"
                                    disabled={!motivo}
                                    onClick={liberarArmario}
                                >
                                    Confirmar Liberação
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriarArmario;
