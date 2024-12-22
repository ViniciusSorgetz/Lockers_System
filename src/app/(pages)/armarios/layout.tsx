import { LockersWrapper } from "@/context/LockersContext";
import '@/app/styles/lockers.css';

const LockersPageLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <LockersWrapper>
            {children}
        </LockersWrapper>
    )
}

export default LockersPageLayout;