// const DOM = (element) => {
     if(typeof id==="string" || id instancof String)
       new Elements[...document.querySelectorAll(element)])
     else new Elements([element])
// }

// class Elements extends Array {
//   //Listener
     ready(callback){
       if(this.some(element=>element.readyState!==null && element.readyState!=="loading"))
         callback()
       else this.on("DOMContentLoaded,callback))
     }
//   on(event,callback_element,callback){
       if(typeof callback_element==="function")
         this.forEach(element=>element.addEventListener(event,callback))
       else this.forEach(element=>element.addEventListener(event,e=>{
         if(e.target.matches(callback_element)) callback()
       })
//   }
//   //Animate
//   css(properties_values,values){
       const _properties = typeof properties_values==="object"? Object.keys(properties_values):properties_values
       const _values = typeof properties_values==="object"? Object.values(properties_values):typeof values==="string"||values instanceof String? values:""
       if(_values.length) return this.forEach(element=>element.style[_properties])
       else {
         this.forEach(element=>element.style[_properties]=_values)
         return this
       }
     }
    animate(keyframe, duration_callback, easing_iterations_callback, iterations_callback, callback){
      const _duration = typeof duration_callback==="function"? 0:duration_callback
      const _easing = typeof easing_callback==="function"? "cubic-bezier(0, 0, 0.5, 1.25)":easing_callback
      const _iterations = typeof iterations_callback==="function"? 1:iteration_callback
      const _callback = typeof callback==="function"? callback:()=>{}
      this.forEach(element=>{
        element.animate([{},keyframe],{
          duration:_duration, fill:"forwards", easing:_easing, iterations:_iterations})
      })
      setTimeout(()=>{
        _callback()
        return this
      },_duration)    
    }
//   // Validator
//   setCustomValidity(message) {
//     this.forEach(element=>element.setCustomValidity(message))
//     return this
//   }
//   reportValidity() {
//     this.element.reportValidity()
//     return this
//   }
//   // Values
//   val(value) {
//     this.
//     else return this.element.value = value
//   }
//   show() {
//     this.element.style.display = "block"
//     return this
//   }
//   hide = () => {
//     this.element.style.display = "none"
//     return this
//   }
//   height = () => {
//     return this.element.style.height
//   }
//   width = () => {
//     return this.element.style.width
//   }
//   //
//   offsetTop = () => {
//     return this.element.offsetTop
//   }
//   offsetBottom = () => {
//     return this.element.offsetBottom
//   }
//   offsetRight = () => {
//     return this.element.offsetRight
//   }
//   offsetLeft = () => {
//     return this.element.offsetLeft
//   }
//   innerWidth = () => {
//     return this.element.innerWidth
//   }
//   outerWidth = () => {
//     return this.element.outerWidth
//   }
//   innerHeight = () => {
//     return this.element.innerHeight
//   }
//   outerHeight = () => {
//     return this.element.outerHeight
//   }
//   scrollTop = (length) => {
//     return (typeof length==="undefined"?this.element.scrollTop:this.element.scrollTop = length)
//   }
//   isActive = () => {
//     return this.element === document.activeElement
//   }
// }

// export default DOM;
