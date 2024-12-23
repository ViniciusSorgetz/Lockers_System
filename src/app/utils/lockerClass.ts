import { ILocker } from "@/app/models/Locker";

const lockerClass = (locker: ILocker): string => {
        if (locker.occupied) {
            const deadline = locker.end_date ? new Date(locker.end_date) : null;
            const today = new Date();
            if (deadline) return today > deadline ? "irregular" : "occupied";
        }
        return "free";
};

export default lockerClass;