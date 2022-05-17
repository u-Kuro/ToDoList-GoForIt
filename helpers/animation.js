// const id = (id) =>{
//   if(typeof id!=="string"&&(id==="window"||id==="document"||id===window||id===document)) 
//     return new Element(eval(id))
//   else if(id.includes(" "))
//     return new Element(document.querySelector(id))
//   else if(id==="html"||id==="body")
//     return new Element(document.getElementsByTagName(id)[0])
//   else if(id.includes("."))
//     return new Element(document.getElementsByClassName(id)[0])
//   else
//     return new Element(document.getElementById(id))
// }

// class Element {
//   constructor(elem) {
//     this.elem = elem
//   }
//   //return element
//   element = () => {
//     return this.elem
//   }
//   //Listener
//   on = (e,callback) => {
//     return this.elem.addEventListener(e,callback())
//   }
//   //Animate
//   css = (property_value,value) =>{
//     if(typeof property_value==="object"){
//       for (var key in property_value){
//         var el = eval("this.elem.style."+key)
//         el = property_value[key]
//       }
//       return new Element(this.elem)
//     } else {
//       if(typeof value==="undefined"){
//         var el = eval("this.elem.style."+property_value)
//         return el
//       }
//       else {
//         console.log(this.elem+"\n"+property_value+"\n")
//         var el = eval("this.elem.style."+property_value)
//         el = value
//         return new Element(this.elem)
//       }
//     }
//   }
//   animate = (keyframe, duration, easing_callback, callback) => {
//     if(typeof callback==="undefined"&&typeof easing_callback==="function")callback = easing_callback
//     const xduration = typeof duration==="undefined"||typeof duration!=="number"?0:duration
//     const xeasing = typeof easing_callback==="undefined"||typeof easing_callback!=="string"?"cubic-bezier(0, 0, 0.5, 1.5)":easing_callback
//     this.elem.animate([{},keyframe],{
//       duration: xduration, fill: "forwards", easing:xeasing})
//     if(typeof callback==="undefined"||typeof callback!=="function") return new Element(this.elem)
//     else {
//       setTimeout(()=>{callback()},xduration)
//       return new Element(this.elem)
//     }
//   }
//   // Values
//   val = (value) => {
//     if(typeof value==="undefined") return this.elem.value
//     else return this.elem.value = value
//   }
//   show = () => {
//     this.elem.style.display = "block"
//     return new Element(this.elem)
//   }
//   hide = () => {
//     this.elem.style.display = "none"
//     return new Element(this.elem)
//   }
//   height = () => {
//     return this.elem.style.height
//   }
//   //
//   offset = () => {
//     return this.elem.offsetTop
//   }
//   innerWidth = () => {
//     return this.elem.innerWidth
//   }
//   outerWidth = () => {
//     return this.elem.outerWidth
//   }
//   scrollTop = (length) => {
//     return (typeof length==="undefined"?this.elem.scrollTop:this.elem.scrollTop = length)
//   }
//   isActive = () => {
//     return this.elem === document.activeElement
//   }
// }

// export default id;