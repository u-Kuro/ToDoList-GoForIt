import { useEffect, useRef } from "react";

//= Updates After Mount 
const useUpdateEffect = (fun, deps) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) fun()
    else didMount.current = true;
  }, deps);
};

export default useUpdateEffect;
