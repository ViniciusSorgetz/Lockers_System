'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useClassesContext } from '@/context/ClassesContext';
import Link from 'next/link';
import ClassPage from '@/components/classes/ClassPage';
import CreateclassNameModal from '@/components/classes/CreateClassModal';

const Turmas = () => {

  const { classes, setCurrentClass } = useClassesContext();
  const [classesPage, setClassesPage] = useState(true);
  const [createClassModal, setCreateClassModal] = useState(false);

  return (<>
    {createClassModal && <CreateclassNameModal closeModal={() => setCreateClassModal(false)}/>}
        {classesPage ? 
          <div className="main">
            <div className="turmas-header">
              <label className="p-2 text-600 color-main">Turmas</label>
              <button className="btn-cool btn-gray" onClick={() => setCreateClassModal(true)}>
                  Criar turma 
                  <i className="bi bi-plus-lg"></i>
              </button>
              <button className="btn-cool btn-blue">
                  Editar turma 
                  <i className="bi bi-pencil"></i>
              </button>
              <button className="btn-cool btn-red">
                  Remover turma 
                  <i className="bi bi-trash"></i>
              </button>
          </div>
          <div className="classes">
              {classes.map((currentClass, index) => (
                <div 
                  className="class_item text-600 color-main" 
                  key={index}
                  onClick={() => {
                    setCurrentClass(currentClass);
                    setClassesPage(false);
                  }}
                >
                  {currentClass.code}
                </div> 
              ))}
          </div>
        </div> : <ClassPage closePage={() => setClassesPage(true)}/>
        }
  </>);
};

export default Turmas;
