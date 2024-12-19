'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useClassesContext } from '@/context/ClassesContext';
import Link from 'next/link';
import ClassPage from '@/components/classes/ClassPage';

const Turmas = () => {

  const { classes, setCurrentClass } = useClassesContext();
  const [classesPage, setClassesPage] = useState(true);

  return (
    <div className="main">
        {classesPage ? <>
          <div className="turmas-header">
            <label className="p-2 text-600">Turmas</label>
            <button className="btn-create">
                Criar turma <i className="bi bi-plus-lg"></i>
            </button>
        </div>
        <div className="classes">
            {classes.map((currentClass, index) => (
              <div 
                className="class_item text-600" 
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
        </> : <ClassPage closePage={() => setClassesPage(true)}/>
        }
    </div>
  );
};

export default Turmas;
