'use client';

import { useEffect, useState } from 'react';
import { useClassesContext } from '@/context/ClassesContext';
import ClassPage from '@/components/classes/ClassPage';
import CreateclassNameModal from '@/components/classes/CreateClassModal';
import { Student } from '@/app/models/Class';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import DeleteModal from '@/components/DeleteModal';
import { api } from '@/app/axios/api';
import mongoose from 'mongoose';

const Turmas = () => {

  const { classes, setClasses, setCurrentClass, currentClass } = useClassesContext();
  const [classesPage, setClassesPage] = useState(true);
  const [createClassModal, setCreateClassModal] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const [deleteModal, setDeleteModal] = useState(false);
  const [removeFunction, setRemoveFunction] = useState<() => Promise<void>>(async () => {});
  const [message, setMessage] = useState("");

  useEffect(() => {}, [isAuthenticated]);

  return (<>
    {createClassModal && <CreateclassNameModal closeModal={() => setCreateClassModal(false)}/>}

    {deleteModal && !classesPage &&
      <DeleteModal
        closeDeleteModal={() => setDeleteModal(false)}
        message={message}
        remove={removeFunction}
      ></DeleteModal> }

        {classesPage ? 
          <div className="main">
            <div className="classes-header d-flex flex-column flex-md-row justify-content-center">
              <label className="p-2 text-600 color-main">Turmas</label>
              <button className="btn-cool btn-gray" onClick={() => setCreateClassModal(true)}>
                  Criar turma 
                  <i className="bi bi-plus-lg"></i>
              </button>
              <button className="btn-cool btn-blue">
                  Editar turma 
                  <i className="bi bi-pencil"></i>
              </button>
          </div>
          {isAuthenticated ? 
            <div className="classes limit">
              {classes.map((currentClass, index) => (
                <div 
                  className="class_item text-600 color-main" 
                  key={index}
                  onClick={() => {
                    currentClass.students.sort((a, b) => 
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
        </div> : 
          <ClassPage 
            closePage={() => setClassesPage(true)}
            setDeleteModal={setDeleteModal}
            setRemoveFunction={setRemoveFunction}
            setMessage={setMessage}
          />
        }
  </>);
};

export default Turmas;
