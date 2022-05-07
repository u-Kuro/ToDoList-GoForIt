import { useEffect, useRef } from "react";

//=Use Interval on Update (After Mount)
const useUpdateEffectInterval = (fun, deps, time) => {
  const didMount = useRef(false);
  const interval = useRef('');
  useEffect(() => {
    if (didMount.current) 
    interval.current = setInterval(()=>{
      fun();
    }, time);
    else didMount.current = true;
    return () => clearInterval(interval.current)
  }, deps);
};

export default useUpdateEffectInterval;
