'use client';

import { useEffect, useState } from 'react';
import { useClassesContext } from '@/context/ClassesContext';
import ClassPage from '@/components/classes/ClassPage';
import CreateclassNameModal from '@/components/classes/CreateClassModal';
import { Student } from '@/app/models/Class';
import { useRouter } from 'next/navigation';

const Turmas = () => {

  const { classes, setCurrentClass } = useClassesContext();
  const [classesPage, setClassesPage] = useState(true);
  const [createClassModal, setCreateClassModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {}, [isLoggedIn]);

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
          {isLoggedIn ? 
            <div className="classes">
              {classes.map((currentClass, index) => (
                <div 
                  className="class_item text-600 color-main" 
                  key={index}
                  onClick={() => {
                    currentClass.students.sort((a: Student, b:Student) => 
                      a.name.localeCompare(b.name)
                    );
                    setCurrentClass(currentClass);
                    setClassesPage(false);
                  }}
                >
                  {currentClass.code}
                </div> 
              ))}
          </div> 
        : <></>}
        </div> : <ClassPage closePage={() => setClassesPage(true)}/>
        }
  </>);
};

export default Turmas;
