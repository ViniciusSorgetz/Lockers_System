import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useClassesContext } from "@/context/ClassesContext";
import axios from "axios";
import { Student } from "@/app/models/Class";

const CreateStudentModal = (props : {closeModal : () => void}) => {

    const { closeModal } = props;
    const { classes, setClasses, currentClass, setCurrentClass } = useClassesContext();

    const studentFormSchema = z.object({
        name: z.string()
            .nonempty("Necessário informar o nome do estudante.")
            .min(2, "Nome curto demais.")
            .refine(name => {
                return currentClass.students.find((s:Student) => s.name == name) == undefined;
            }, "Este estudante já existe nesta turma."),
        phone_number: z.string()
            .min(9, "O número de telefone deve conter ao menos 9 caracteres").optional().or(z.literal(''))
    });
    type studentFormData = z.infer<typeof studentFormSchema>;

    const { register, handleSubmit, formState : { errors } } = useForm<studentFormData>({
        resolver : zodResolver(studentFormSchema)
    });

    const createClass = async (data : studentFormData) => {
        try {
            const response = await axios.post(`/api/classes/${currentClass.code}`, {...data});
            const newStudent = response.data.student as Student;
            const currentClassCopy = currentClass;
            currentClassCopy.students.push(newStudent)
            currentClassCopy.students.sort((a:Student, b:Student) => a.name.localeCompare(b.name));
            setCurrentClass(currentClassCopy);
            const index = classes.findIndex(c => c.code == currentClass.code);
            const classesCopy = classes;
            classesCopy[index] = currentClassCopy;
            setClasses(classesCopy);
            closeModal()
        } 
        catch (error) {
            console.log("Algo deu errado.", error);
        }
    }

    return (
        <div className="modal my-modal" style={{display: "block"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header d-flex">
                        <h5 className="modal-title">Adicionar estudante</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                    </div>
                    <form onSubmit={handleSubmit(createClass)}>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label className="text-600 py-2">Nome do aluno</label><br/>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    {...register("name")}
                                />
                                {errors.name && <span className="text-danger small">
                                        {errors.name.message}
                                    </span>}
                            </div>
                            <div className="mb-2">
                                <label className="text-600 py-2">
                                    Telefone de contato do aluno
                                </label><br/>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    {...register("phone_number")}
                                />
                                {errors.phone_number && <span className="text-danger small">
                                        {errors.phone_number.message}
                                    </span>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cool btn-gray" data-bs-dismiss="modal" onClick={closeModal}>Fechar</button>
                            <button 
                                type="submit" 
                                className="btn-cool btn-modal"
                            >
                                Adicionar estudante
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateStudentModal;