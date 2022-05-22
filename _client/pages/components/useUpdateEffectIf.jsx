import { useEffect, useRef } from "react";

//= Updates After Mount 
const useUpdateEffectIf = (fun, deps, condition) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current)
      if(condition) 
        fun();
    else didMount.current = true;
  }, deps);
};

export default useUpdateEffectIf;
