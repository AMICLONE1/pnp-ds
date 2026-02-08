import { useEffect, useState } from "react";


interface AnimatedNumberProps{
    value: number; 
      prefix?: string; 
      suffix?: string;
      decimals?: number;
}
export default function AnimatedNumber({value, prefix = "", suffix = "", decimals = 0} : AnimatedNumberProps){
      
      const [displayValue, setDisplayValue] = useState(0);
      const [hasAnimated, setHasAnimated] = useState(false);
    
      useEffect(() => {
        if (hasAnimated && value === displayValue) return;
        
        const duration = 1500;
        const startTime = performance.now();
        const startValue = hasAnimated ? displayValue : 0;
    
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const newValue = startValue + (value - startValue) * easeOutQuart;
          setDisplayValue(newValue);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setHasAnimated(true);
          }
        };
        requestAnimationFrame(animate);
      }, [value, hasAnimated, displayValue]);
    return(
        <span>
          {prefix}{displayValue.toFixed(decimals)}{suffix}
        </span>
    )
}