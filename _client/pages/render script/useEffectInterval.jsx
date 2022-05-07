
import { useEffect, useRef } from "react";

//=Use Interval On Mount
const useEffectInterval = (fun, deps, time) => {
  const interval = useRef('');
  useEffect(() => {
    interval.current = setInterval(()=>{
      fun();
    }, time);
    return () => clearInterval(interval.current)
  }, deps);
}

export default useEffectInterval;