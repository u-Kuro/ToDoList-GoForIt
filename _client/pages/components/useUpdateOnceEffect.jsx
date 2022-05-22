import { useEffect, useRef } from "react";

//= Updates Once After Mount
const useUpdateOnceEffect = (fun, deps) => {
  const didMount = useRef(0);
  if(typeof deps === "undefined" ? true : deps === null ? true : deps.length === 0) return
  else {
    useEffect(() => {
      if (didMount.current===1) fun();
      didMount.current = didMount.current+1;
    }, deps);
  }
};

export default useUpdateOnceEffect;
