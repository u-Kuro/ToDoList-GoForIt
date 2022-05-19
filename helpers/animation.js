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
//   css(property_value,value){
       if(typeof property_value==="string"){
         if(typeof value==="string"){
           this.forEach(element=>{
             element.style[property_value] = value
           }) return this
         } else return this.element.style[property_values]
       } else {
         this.forEach(()=>{
           Object.entries(property_values).forEach(([property,value]) => {
             element.style[property]=value
           }) return this
         }
       }
     }
//   animate(keyframe, duration, easing_callback, callback) {
//     if(typeof easing_callback==="function") callback = easing_callback
//     const _duration = typeof duration==="undefined"||typeof duration!=="number"?0:duration
//     const _easing = typeof easing_callback==="undefined"||typeof easing_callback!=="string"?"cubic-bezier(0, 0, 0.5, 1.5)":easing_callback
//     this.element.animate([{},keyframe],{
//       duration: xduration, fill: "forwards", easing:xeasing})
//     if(typeof callback==="undefined"||typeof callback!=="function") return this
//     else {
//       setTimeout(()=>{callback()},xduration)
//       return this
//     }
//   }
//   // Validator
//   setCustomValidity(message) {
//     this.element.setCustomValidity(message)
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
