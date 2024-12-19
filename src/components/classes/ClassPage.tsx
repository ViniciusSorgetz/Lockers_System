"use client";

import { useClassesContext } from "@/context/ClassesContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ClassPage = (props : { closePage : () => void }) => {

    const { classes, currentClass, setCurrentClass } = useClassesContext();
    const { closePage } = props;

    return(<>
            <div className="mb-5 turmas-header">
                <i 
                    className="bi bi-caret-left-fill" 
                    style={{cursor: "pointer"}}
                    onClick={closePage}
                ></i>
                <span className="text-600 px-4">{currentClass.code}</span>
            </div>
            <div className="students d-grid gap-4">
                {currentClass.students.map(student => (
                    <div className="student">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle h2 color-main"></i>
                            <span className="mx-3 text-600">{student.name}</span>
                        </div>
                        <div className="d-flex align-items-center student-controller">
                            <i className="bi bi-pencil h5 color-blue"></i>
                            <i className="bi bi-trash h5 color-red"></i>
                            <i className="bi bi-caret-down-fill color-main h6"></i>
                        </div>
                    </div>
                ))}
            </div>    
    </>)
}

export default ClassPage;