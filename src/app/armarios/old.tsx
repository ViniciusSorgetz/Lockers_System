"use client"
import { useEffect, useState, useRef } from "react";
import { IBuilding } from '../models/Locker';
import CriarArmario from '@/components/CriarArmario';
import ArmarioOcupado from '@/components/ArmarioOcupado';
import ArmarioLivre from '@/components/ArmarioLivre';
import Historico from "@/components/Historico";
import ExcluirArmario from "@/components/ExcluirArmario";
import mongoose, { Types } from "mongoose";
import axios from "axios";
import { useLockersContext } from "@/context/LockersContext";

const LockersPage = () => {

    const { lockers, setLockers, locker, setLocker, building, setBuilding } = useLockersContext();

    const [idArmario, setIdArmario] = useState<Types.ObjectId>();
    const [criarArmarioModal, setCriarArmarioModal] = useState(false);
    const [armarioOcupadoModal, setArmarioOcupadoModal] = useState(false);
    const [armarioLivreModal, setArmarioLivreModal] = useState(false);
    const [historicoModal, setHistoricoModal] = useState(false);
    const [removerArmarioModal, setRemoverArmarioModal] = useState(false);

    // State to control context menu visibility and position
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
    }>({ visible: false, x: 0, y: 0 });

    const contextMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getData();

        // Close context menu when clicking anywhere
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu({ visible: false, x: 0, y: 0 });
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const getData = async () => {
        try {
            const resp = await axios.get(`api/lockers/building/${building}`);
            const data = resp.data;

            // Ordena os armários de cada prédio
            const armariosOrdenados = Object.keys(data).reduce((acc: any, predio) => {
                acc[predio] = data[predio].sort((a: any, b: any) => a.numero - b.numero);
                return acc;
            }, {});

            setArmarios(armariosOrdenados);
            setArmariosPredioAtual(armariosOrdenados.predioA);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    const handlePredioAtual = (e: any) => {
        setPredioSelecionado(e.target.value);
        switch (e.target.value) {
            case "A":
                setArmariosPredioAtual(armarios.predioA);
                break;
            case "B":
                setArmariosPredioAtual(armarios.predioB);
                break;
            case "C":
                setArmariosPredioAtual(armarios.predioC);
                break;
            case "D":
                setArmariosPredioAtual(armarios.predioD);
                break;
        }
    };

    const classeArmario = (armario: IArmario): string => {
        if (armario.ocupado) {
            const prazo = armario.data_prazo ? new Date(armario.data_prazo) : null;
            const hoje = new Date();
            if (prazo) {
                return hoje > prazo ? "armario armario-irregular" : "armario armario-ocupado";
            }
        }
        return "armario armario-livre";
    };

    const handleClick = (armario: IArmario): void => {
        setArmario(armario);
        setIdArmario(armario._id);
        if (armario.ocupado) setArmarioOcupadoModal(true);
        else setArmarioLivreModal(true);
    };

    const handleContextMenu = (event: React.MouseEvent, armario: IArmario) => {
        event.preventDefault();
        setArmario(armario);
        setIdArmario(armario._id);
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
        });
    };

    return (
        <div className="main">
            {criarArmarioModal && (
                <CriarArmario
                    closeModal={() => setCriarArmarioModal(false)}
                    predioSelecionado={predioSelecionado}
                    setArmariosPredioAtual={setArmariosPredioAtual}
                    handlePredioAtual={handlePredioAtual}
                    armarios={armarios}
                    setArmarios={setArmarios}
                />
            )}
            {armarioOcupadoModal && (
                <ArmarioOcupado
                    closeModal={() => setArmarioOcupadoModal(false)}
                    armario={armario}
                    armarios={armarios}
                    setArmarios={setArmarios}
                    idArmario={idArmario}
                    handlePredioAtual={handlePredioAtual}
                    setArmariosPredioAtual={setArmariosPredioAtual}
                    predioSelecionado={predioSelecionado}
                />
            )}
            {armarioLivreModal && (
                <ArmarioLivre
                    armario={armario}
                    armarios={armarios}
                    predioSelecionado={predioSelecionado}
                    setArmarios={setArmarios}
                    setArmariosPredioAtual={setArmariosPredioAtual}
                    closeModal={() => setArmarioLivreModal(false)}
                />
            )}
            {historicoModal && (
                <Historico
                    closeModal={() => setHistoricoModal(false)}
                    armario={armario}
                    predioSelecionado={predioSelecionado}
                />
            )}
            {removerArmarioModal && (
                <ExcluirArmario
                    closeModal={() => setRemoverArmarioModal(false)}
                    numero={armario?.numero}
                    armarios={armarios}
                    setArmarios={setArmarios}
                    setArmariosPredioAtual={setArmariosPredioAtual}
                    predioSelecionado={predioSelecionado}
                />
            )}

            {contextMenu.visible && (
                <div
                    ref={contextMenuRef}
                    style={{
                        position: "absolute",
                        left: `${contextMenu.x}px`,
                        top: `${contextMenu.y}px`,
                        zIndex: 1000,
                    }}
                    className="card shadow"
                >
                    <div className="card" style={{cursor: "pointer"}}>
                        <ul className="list-group list-group-flush">
                            <li 
                                className="list-group-item"
                                onClick={() => {
                                    setContextMenu({ visible: false, x: 0, y: 0 });
                                    setHistoricoModal(true);
                                }}
                            >
                                Histórico <i className="bi bi-clock"></i>
                            </li>
                            <li 
                                className="list-group-item text-danger"
                                onClick={() => {
                                    setContextMenu({ visible: false, x: 0, y: 0 });
                                    setRemoverArmarioModal(true);
                                }}
                            >
                                Remover <i className="bi bi-trash"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            <div className="armarios-header">
                <select
                    className="armarios-select"
                    aria-label="Default select example"
                    onChange={handlePredioAtual}
                >
                    <option value="A" selected>
                        Predio A
                    </option>
                    <option value="B">Predio B</option>
                    <option value="C">Predio C</option>
                    <option value="D">Predio D</option>
                </select>
                <button className="btn-criar" onClick={() => setCriarArmarioModal(true)}>
                    Adicionar armário
                    <i className="bi bi-plus-lg"></i>
                </button>
            </div>
            <div className="armarios">
                {armariosPredioAtual?.map((armario) => (
                    <div
                        key={armario.numero}
                        className={classeArmario(armario)}
                        onClick={() => handleClick(armario)}
                        onContextMenu={(e) => handleContextMenu(e, armario)}
                    >
                        {armario.numero}
                    </div>
                ))}
                {armariosPredioAtual?.length === 0 && (
                    <label className="my-3">Sem armários por aqui...</label>
                )}
            </div>
        </div>
    );
};

export default LockersPage;
