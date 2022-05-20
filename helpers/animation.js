// const DOM = (element_s) => {
     if(typeof id==="string" || id instancof String)
       new Elements[...document.querySelectorAll(element_s)])
     else new Elements([element_s])
// }

// class Elements extends Array {
    
     isElement
     constructor(elements) {
       this.isElement = elements.length===1
       this.element = elements[0]
     }

//   //Listener
     ready(callback) {
       if(this.some(element=>element.readyState!==null && element.readyState!=="loading"))
         callback()
       else this.on("DOMContentLoaded,callback))
     }
//   on(event,callback_element,callback) {
       if(typeof callback_element==="function")
         this.forEach(element=>element.addEventListener(event,callback))
       else this.forEach(element=>element.addEventListener(event,e=>{
         if(e.target.matches(callback_element)) callback()
       })
//   }
//   //Animate
//   css(properties_values,values) {
       const _properties = typeof properties_values==="object"? Object.keys(properties_values):properties_values
       const _values = typeof properties_values==="object"? Object.values(properties_values):typeof values==="string"||values instanceof String? values:""
       if(_values.length) return this.map(element=>element.style[_properties])
       else {
         this.forEach(element=>element.style[_properties]=_values)
         return this
       }
     }
    animate(keyframe, duration_callback, easing_iterations_callback, iterations_callback, callback) {
      const _duration = typeof duration_callback==="function"? 0:duration_callback
      const _easing = typeof easing_callback==="function"? "cubic-bezier(0, 0, 0.5, 1.25)":easing_callback
      const _iterations = typeof iterations_callback==="function"? 1:iteration_callback
      const _callback = typeof callback==="function"? callback:()=>{}
      this.forEach(element=> {
        element.animate([{},keyframe], {
          duration:_duration, fill:"forwards", easing:_easing, iterations:_iterations})
      })
      setTimeout(()=> {
        _callback()
        return this
      },_duration)    
    }
//   // Validator
//   setCustomValidity(message) {
//     this.forEach(element=>element.setCustomValidity(message))
//     return this
//   }
//   get reportValidity(){
//     this.forEach(element=>element.reportValidity())
//     return this
//   }
//   // Setter
//   val(value) {
//     this.forEach(element=>element.value=value)
       return this
//   }
//   get show() {
//     this.forEach(element=>element.style.display = "block")
//     return this
//   }
//   get hide() {
//     this.forEach(element=>element.style.display="none")
//     return this
//   }
     // Getter
//   get height() {
//     return (this.isElement? this.element.style.height
         : this.map(element=>element.style.height)
       )
//   }
//   get width() {
//     return (this.isElement? this.element.style.width
         : this.map(element=>element.style.width)
       )
//   }
//   //
//   get offsetTop() {
//     return (this.isElement? this.element.offsetTop
         : this.map(element=>element.offsetTop)
       )
//   }
//   get offsetBottom() {
//     return (this.isElement? this.element.offsetBottom
         : this.map(element=>element.offsetBottom)
       )
//   }
//   get offsetRight() {
//     return (this.isElement? this.element.offsetRight
         : this.map(element=>element.offsetRight)
       )
//   }
//   get offsetLeft() {
//     return (this.isElement? this.element.offsetLeft
         : this.map(element=>element.offsetLeft)
       )
//   }
//   get innerWidth() {
//     return (this.isElement? this.element.innerWidth
         : this.map(element=>element.innerWidth)
       )
//   }
//   get outerWidth() {
//     return (this.isElement? this.element.outerWidth
         : this.map(element=>element.outerWidth)
       )
//   }
//   get innerHeight() {
//     return (this.isElement? this.element.innerHeight
         : this.map(element=>element.innerHeight)
       )
//   }
//   get outerHeight() {
//     return (this.isElement? this.element.outerHeight
         : this.map(element=>element.outerHeight)
       )
//   }
//   get scrollTop() {
//     return (this.isElement? this.element.scrollTop
         : this.map(element=>element.scrollTop)
//   }
//   get isActive() {
//     return (this.isElement? this.element === document.activeElement)
         : this.map(element=>element === document.activeElement)
       )
//   }
// }

// export default DOM;
