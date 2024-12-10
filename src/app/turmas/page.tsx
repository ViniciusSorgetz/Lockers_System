'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ITurma } from '../models/Turma';

const Turmas = () => {
  const [turmas, setTurmas] = useState<ITurma[]>([]); 
  useEffect(() => {
    getData(); 
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('/api/turmas'); 
      setTurmas(response.data); 
    } catch (error) {
      console.error('Erro ao buscar as turmas:', error); 
    }
  };


  return (
    <div className="main">
        <div className="turmas-header">
            <label className="p-2">Turmas</label>
            <button className="btn-criar">
                Adicionar armário <i className="bi bi-plus-lg"></i>
            </button>
        </div>
        <div className="turmas">
            {turmas.map((turma, index) => (
            <div className="turma" key={index}>{turma.codigo}</div> 
            ))}
        </div>
    </div>
  );
};

export default Turmas;
