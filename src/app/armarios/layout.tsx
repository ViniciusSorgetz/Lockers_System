import { LockersWrapper } from "@/context/LockersContext"

const LockersPageLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <LockersWrapper>
            {children}
        </LockersWrapper>
    )
}

export default LockersPageLayout;