'use client';

import { useLockersContext } from "@/context/LockersContext";

const Test = () => {
    const { building } = useLockersContext();
    return (
        <>
            <h1>AAA222</h1>
            <h2>{building}</h2>
        </>
    )
}

export default Test;