import { ILocker } from "@/app/models/Locker";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const CreateLockerModal = (props : { closeModal : () => void }) => {

    const { closeModal } = props;
    const { lockers, setLockers, building } = useLockersContext();

    const lockerFormSchema = z.object({
        number: z.string().transform(number => Number(number)).refine((number : number) => {
            const checkLocker = lockers?.findIndex((l : ILocker) => l.number == number);
            return checkLocker == -1;
        }, "Este armário já existe.")
    });
    type lockerFormData = z.infer<typeof lockerFormSchema>

    const { register, handleSubmit, reset, formState : {errors} } = useForm<lockerFormData>({
        resolver : zodResolver(lockerFormSchema)
    }); 

    useEffect(() => {
        nextNumber();
    }, [lockers]);

    const nextNumber = () : void => {
        if(lockers && lockers.length > 1)
            for(let i = 0; i < lockers.length - 1; i++)
                if(lockers[i+1].number - lockers[i].number > 1)
                    return reset({number: i+2});
        if(lockers) reset({number: lockers.length+1});
    }

    const addLocker = async (data : lockerFormData) => {
        try {
            const resp = await axios.post("api/lockers", {
                building : building,
                number: data.number
            });
            const addedLocker = resp.data.locker;
            const lockersCopy = [...lockers];
            lockersCopy.push(addedLocker);
            lockersCopy.sort((a:ILocker, b:ILocker) => a.number - b.number);
            setLockers(lockersCopy);
            closeModal();
        } 
        catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    }

    return (
        <div className={"modal my-modal"}style={{display: "block"}}>
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header" style={{display: "flex"}}>
                    <h5 className="modal-title">Criar Armário</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                </div>
                    <form onSubmit={handleSubmit(addLocker)}>
                        <div className="modal-body">
                            <label>Número do armário</label><br/><br/>
                            <input 
                                type="number" 
                                min={1}
                                className="form-control" 
                                {...register("number")}
                            />
                            {errors.number && 
                                <span className="small text-danger">
                                    {errors.number.message}
                                </span>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={(closeModal)}>Fechar</button>
                            <button type="submit" className="btn btn-outline-primary">Adicionar armário</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default CreateLockerModal;