"use client";

import { useClassesContext } from "@/context/ClassesContext";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CreateStudentModal from "@/components/classes/CreateStudentModal";
import { api } from "@/app/axios/api";
import mongoose from "mongoose";

const ClassPage = (props : { 
        closePage : () => void,
        setDeleteModal : Dispatch<SetStateAction<boolean>>
        setRemoveFunction : Dispatch<SetStateAction<() => void>>
        setMessage : Dispatch<SetStateAction<string>>
    }) => {

    const { classes, setClasses, currentClass, setCurrentClass } = useClassesContext();
    const { closePage, setDeleteModal, setRemoveFunction, setMessage } = props;
    const [createStudentModal, setCreateStudentModal] = useState(false);

    const removeClass = async () => {
        try {
            await api.delete(`/classes/${currentClass.code}`);
            const classesCopy = classes
                .filter(c => c.code != currentClass.code)
                .sort((a, b) => a.code.localeCompare(b.code))
            setClasses(classesCopy);
            closePage();
        } 
        catch (error) {
            console.log("Algo deu errado", error);
        }
      }
      
      const removeStudent = async (studentId : undefined | mongoose.Types.ObjectId) => {
        try {
            console.log(studentId);
            await api.delete(`/classes/student/${studentId}`);
            const updatedStudents = currentClass.students.filter(s => s._id != studentId);
            const currentClassCopy = currentClass;
            currentClass.students = updatedStudents;
            const index = classes.findIndex(c => c.code == currentClass.code);
            const classesCopy = [...classes];
            classesCopy[index] = currentClassCopy;
            setCurrentClass(currentClassCopy);
            setClasses(classesCopy);
        } 
        catch (error) {
            console.log("Algo deu errado", error);
        }
      }

    return(<>
        {createStudentModal && 
            <CreateStudentModal closeModal={() => setCreateStudentModal(false)}/>
        }
        <div className="main">
            <div className="classes-header d-flex flex-column flex-md-row justify-content-center">
                <div>
                    <i 
                        className="bi bi-caret-left-fill color-main" 
                        style={{cursor: "pointer"}}
                        onClick={closePage}
                    ></i>
                    <span className="text-600 color-main px-4">{currentClass.code}</span>
                </div>
                <button className="btn-cool btn-gray" onClick={() => setCreateStudentModal(true)}>
                    Adicionar aluno
                    <i className="bi bi-plus-lg"></i>
                </button>
                <button 
                    className="btn-cool btn-red" 
                    onClick={() => {
                        setMessage("Essa ação irá remover a sala e todas as suas informações serão perdidas");
                        setRemoveFunction(() => () => removeClass());
                        setDeleteModal(true);
                    }}>
                        Excluir turma
                <i className="bi bi-trash"></i>
                </button>
            </div>
            <div className="students d-grid gap-4 limit">
                {currentClass.students.map(student => (
                    <div className="student">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-person-fill h3 color-main"></i>
                            <span className="mx-3 text-600 color-main">{student.name}</span>
                        </div>
                        <div className="d-flex align-items-center student-controller">
                            <i 
                                className="bi bi-pencil h5 color-blue"
                            ></i>
                            <i 
                                className="bi bi-trash h5 color-red"
                                onClick={() => {
                                    setMessage("Esta ação ira remover o aluno e todas as suas informações serão perdidas");
                                    setRemoveFunction(() => () => removeStudent(student._id));
                                    setDeleteModal(true);
                                }}
                            ></i>
                            <i 
                                className="bi bi-caret-down-fill color-main h6">
                            </i>
                        </div>
                    </div>
                ))}
            </div>
        </div>    
    </>)
}

export default ClassPage;