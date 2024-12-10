import axios from "axios";
import { useState } from "react";

const CriarArmario = (props: any) => {

    const {closeModal, predioSelecionado, armarios, setArmarios, handlePredioAtual, setArmariosPredioAtual} = props;
    const [number, setNumber] = useState("1");
    const [message, setMessage] = useState("");

    const sendData = async () => {
        const armario = {
            predio: predioSelecionado,
            numero: number,
            ocupado: false,
            historico: []
        };
    
        try {
            // Fazendo o POST para a API do Next.js
            const response = await axios.post('/api/armarios', armario);
            const armarioNovo = response.data;
            // Caso seja bem-sucedido, define a mensagem
            setMessage('Armário adicionado com sucesso!');
            let armariosAtualizados = {...armarios};
            let predioAtualizado;
            switch(predioSelecionado){
                case 'A':
                    predioAtualizado = [...armariosAtualizados.predioA, armarioNovo]
                    predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                    armariosAtualizados = {
                        ...armariosAtualizados, 
                        predioA: predioAtualizado
                    }
                    break;
                case 'B':
                    predioAtualizado = [...armariosAtualizados.predioB, armarioNovo];
                    predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                    armariosAtualizados = {
                        ...armariosAtualizados, 
                        predioB: predioAtualizado 
                    }
                    break;
                case 'C':
                    predioAtualizado = [...armariosAtualizados.predioC, armarioNovo];
                    predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                    armariosAtualizados = {
                        ...armariosAtualizados, 
                        predioC: predioAtualizado
                    }
                    break;
                case 'D':
                    predioAtualizado = [...armariosAtualizados.predioD, armarioNovo];
                    predioAtualizado = predioAtualizado.sort((a, b) => a.numero - b.numero);
                    armariosAtualizados = {
                        ...armariosAtualizados, 
                        predioD: predioAtualizado
                    }
                    break;
            }
            console.log(predioAtualizado);
            setArmariosPredioAtual(predioAtualizado);
            setArmarios(armariosAtualizados);
            closeModal();

        } catch (error: any) {
            console.log(error);
            // Em caso de erro, define a mensagem de erro
            setMessage(error.response?.data?.mensagem || 'Erro ao adicionar o armário.');
        }
    };    

    return (
        <div className="modal meu-modal" style={{display: "block"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Criar Armário</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                    <label>Número do armário</label><br/><br/>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={number} onChange={(e) => setNumber(e.target.value)}
                    />
                    {message.length > 0 && <label className="text-danger mt-3">{message}</label>}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={closeModal}>Fechar</button>
                    <button type="button" className="btn btn-outline-primary" onClick={sendData}>Adicionar armário</button>
                </div>
                </div>
            </div>
        </div>
  )
}

export default CriarArmario;