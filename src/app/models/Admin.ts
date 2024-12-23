import mongoose from "mongoose"


export interface IAdmin{
    name: string,
    password: string
}

export const adminSchema = new mongoose.Schema<IAdmin>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

const Admin : mongoose.Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;