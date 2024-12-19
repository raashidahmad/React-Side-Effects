import { useEffect, useState } from "react";

const TIMEOUT = 5000;
export const ProgressBar = () => {
    const [remainingTime, setRemainingTime] = useState(TIMEOUT);

    useEffect(() => {
        const interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                return;
            }
            setRemainingTime((prevTime: number) => {
                return prevTime - 100;
            });
        }, 100);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <progress value={remainingTime} max={TIMEOUT} />
    );
}