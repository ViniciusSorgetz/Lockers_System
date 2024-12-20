import { IClass } from "@/app/models/Class";
import { ILocker } from "@/app/models/Locker";
import { useClassesContext } from "@/context/ClassesContext";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const occupyLockerFormSchema = z.object({
    student_id : z.string()
        .nonempty("Selecione um estudante."),
    deadline: z.string()
        .date("Prazo é obrigatório.")
        .refine(deadline => {
            return new Date(deadline) > new Date(Date.now())
        }, "Data inválida.")
        .transform(deadline => new Date(deadline).toISOString())
});

type occupyLockerData = z.infer<typeof occupyLockerFormSchema>

const LockerFree = (props : { closeModal : () => void }) => {

    const { closeModal } = props;
    const { register, handleSubmit, formState : {errors}, reset } = useForm<occupyLockerData>({
        resolver : zodResolver(occupyLockerFormSchema)
    });

    const { locker, lockers, setLockers } = useLockersContext();
    const { classes } = useClassesContext();

    const [currentClass, setCurrentClass] = useState<IClass>();
    const [errorMessage, setErrorMessage] = useState("");

    const occupyLocker = async (data: occupyLockerData) => {
        const resp = await axios.post("/api/lockers/occupy", {
            locker_id: locker?._id,
            student_id: data.student_id,
            deadline: data.deadline
        });
        const lockerIndex = lockers.findIndex(l => l.number == locker.number);
        const updatedLockers = [...lockers];
        updatedLockers[lockerIndex] = resp.data.locker;
        setLockers(updatedLockers);
        closeModal();
    }
    
    const handleClassChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClass = classes.find(c => c.code === e.target.value) as IClass;
        setCurrentClass(selectedClass);
        reset({student_id : ""});
    }

    return(
        <form onSubmit={handleSubmit(occupyLocker)}>
            <div className="modal-body">
                <div className="mb-1">
                    <label className="text-bold">Turma</label>
                    <select
                        className="form-control rounded-3"
                        onChange={handleClassChange}
                    >
                        <option value="" selected>
                            Selecione uma turma
                        </option>
                        {classes.map((c) => (
                            <option value={c.code} key={c.code}>
                                {c.code}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-1">
                    <label className="text-bold">Aluno</label>
                    <select
                        className="form-control rounded-3" 
                        {...register("student_id")}
                        id="student"
                    >
                        <option value="" selected>
                            Selecione um aluno
                        </option>
                        {currentClass?.students.map(student => (
                        <option 
                            key={student.name} 
                            value={student._id?.toString()}>{student.name}
                        </option>))}
                    </select>
                    {errors.student_id && <span className="small text-danger">{errors.student_id.message}</span>}
                </div>
                <div>
                    <label className="text-bold">Prazo da Ocupação</label>
                    <input
                        type="date"
                        className="form-control rounded-3"
                        {...register("deadline")}
                    />
                    {errors.deadline && <span className="small text-danger">{errors.deadline.message}</span>}
                </div>
                <div className="mt-2">
                    {errorMessage.length > 0 && 
                    <span className="mt-5 text-danger">{errorMessage}</span>
                    }
                </div>
            </div>
            <div className="modal-footer">
                <button
                    type="button"
                    className="btn-cool btn-gray"
                    data-bs-dismiss="modal"
                    onClick={closeModal}
                >
                    Fechar
                </button>
                <button type="submit" className="btn-cool btn-modal">
                    Ocupar Armário <i className="bi bi-lock-fill"></i>
                </button>
            </div>
    </form>);
}

export default LockerFree;