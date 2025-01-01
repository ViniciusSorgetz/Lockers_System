import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useClassesContext } from "@/context/ClassesContext";
import axios from "axios";
import { IClass } from "@/app/models/Class";

type PropsType = {
    closeModal : () => void,
    currentClass? : IClass
}

const CreateclassNameModal = (props : PropsType) => {

    const { closeModal, currentClass } = props;
    const { classes, setClasses } = useClassesContext();

    const classFormSchema = z.object({
        code: z.string()
            .toUpperCase()
            .nonempty("Insira um código de turma.")
            .min(2, "Código de turma curto demais.")
            .refine((code) => {
                return classes.find((currentClass) => currentClass.code == code) == undefined;
            }, { message: "Esta turma já existe." })
    });
    type classFormData = z.infer<typeof classFormSchema>;

    const { register, handleSubmit, formState : { errors } } = useForm<classFormData>({
        resolver : zodResolver(classFormSchema)
    });

    const createClass = async (data : classFormData) => {
        try {
            if(currentClass){
                const response = await axios.patch(`/api/classes/${currentClass.code}`, {
                    newCode : data.code
                });
                const classesCopy = [...classes];
                const currentClassIndex = classes.findIndex(c => c.code == currentClass.code);
                classesCopy[currentClassIndex].code = data.code;
                classesCopy.sort((a: IClass, b: IClass) => a.code.localeCompare(b.code));
                setClasses(classesCopy);
            }
            else{
                const response = await axios.post("/api/classes", {code : data.code});
                const createdClass = response.data.class as IClass;
                const classesCopy = [...classes];
                classesCopy.push(createdClass);
                classesCopy.sort((a: IClass, b: IClass) => a.code.localeCompare(b.code));
                setClasses(classesCopy);
            }
            closeModal();
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
                        <h5 className="modal-title color-main">
                            { currentClass 
                                ? "Editar turma"
                                : "Criar turma"
                            }
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                    </div>
                    <form onSubmit={handleSubmit(createClass)}>
                        <div className="modal-body">
                            <label className="text-600 py-2">Código da turma</label><br/>
                            <input 
                                type="text"
                                className="form-control color-main" 
                                defaultValue={currentClass && currentClass.code}
                                {...register("code")}
                            />
                            {errors.code && <span className="text-danger small">
                                    {errors.code.message}
                                </span>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-cool btn-gray" data-bs-dismiss="modal" onClick={closeModal}>Fechar</button>
                            <button 
                                type="submit" 
                                className="btn-cool btn-modal"
                            >
                                { currentClass 
                                    ? "Editar turma"
                                    : "Criar turma"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateclassNameModal;