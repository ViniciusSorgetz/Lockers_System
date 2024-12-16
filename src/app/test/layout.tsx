'use client';

import { LockersWrapper } from '@/context/LockersContext';

const test = ({ children } : { children : React.ReactNode }) => {
    return (
        <LockersWrapper>
            { children }
        </LockersWrapper>
    )
}

export default test;