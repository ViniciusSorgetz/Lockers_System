import { ILocker } from "@/app/models/Locker";
import { useLockersContext } from "@/context/LockersContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type PropsType = {
    closeModal : () => void 
}

const CreateLockerModal = (props : PropsType) => {

    const { closeModal } = props;
    const { lockers, setLockers, building } = useLockersContext();

    const lockerFormSchema = z.object({
        number: z.coerce.number().refine((number : number) => {
            return lockers?.find((l : ILocker) => l.number == number) == undefined
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
            const addedLocker = resp.data.locker as ILocker;
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
                <div className="modal-header d-flex">
                    <h5 className="modal-title">Criar Armário</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                </div>
                    <form onSubmit={handleSubmit(addLocker)}>
                        <div className="modal-body">
                            <label className="text-600 py-2">Número do armário</label><br/>
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
                            <button type="button" className="btn-cool btn-gray" data-bs-dismiss="modal" onClick={(closeModal)}>Fechar</button>
                            <button type="submit" className="btn-cool btn-blue">Adicionar armário</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default CreateLockerModal;