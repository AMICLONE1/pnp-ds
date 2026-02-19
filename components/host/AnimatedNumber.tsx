import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps{
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}
useState
export default function AnimatedNumber({value, prefix = "", suffix = "", decimals = 0} : AnimatedNumberProps){
        const [displayValue, setDisplayValue] = useState(0);
        const hasAnimated = useRef(false);
    
        useEffect(() => {
        const duration = 1500;
        const startTime = performance.now();
        const startValue = hasAnimated.current ? displayValue : 0;
    
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const newValue = startValue + (value - startValue) * easeOutQuart;
            setDisplayValue(newValue);
    
            if (progress < 1) {
            requestAnimationFrame(animate);
            } else {
            hasAnimated.current = true;
            }
        };
        requestAnimationFrame(animate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value]);
    
        const formatted =
        decimals > 0
            ? displayValue.toFixed(decimals)
            : Math.round(displayValue).toLocaleString("en-IN");
    return(
        <span>
            {prefix}
            {formatted}
            {suffix}
        </span>
    )
}