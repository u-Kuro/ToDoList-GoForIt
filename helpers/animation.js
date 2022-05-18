// const DOM = (id) =>{
//   const xid = typeof id==="object"?id:id.split(' ').join('')
//   if(xid==="window"||xid==="document"||id===window||id===document) 
//     return new Element(eval(xid))
//   else if((xid.includes(".")?xid.split(".")[0].length!==0:false)||(xid.includes("#")?xid.split("#")[0].length!==0:false)||xid.includes("#",2)||xid.includes(".",2)||xid.includes(":")||(xid.includes("[")&&xid.includes("]"))||xid.includes(">")||xid.includes(",")
//     ||((xid.includes(".")||xid.includes("#"))&&xid.includes(":")||(xid.includes("[")&&xid.includes("]"))||xid.includes(">")||xid.includes(",")))
//     return new Element(document.querySelector(id))
//   else if(xid.includes("#"))
//     return new Element(document.getElementById(xid.replace("#","")))
//   else if(xid.includes("."))
//     return new Element(document.getElementsByClassName(xid.replace(".",""))[0])
//   else if(typeof document.getElementsByTagName(xid)!=="undefined")
//     return new Element(document.getElementsByTagName(xid)[0])
//   else //fallback
//     return new Element(document.querySelector(id))
// }

// class Element {
  
//   element

//   constructor(element) {
//     this.element = element
//   }
//   //Listener
//   on = (e,callback) => {
//     return this.element.addEventListener(e,callback())
//   }
//   //Animate
//   css = (property_value,value) => {
//     if(typeof property_value==="object"){
//       for (var key in property_value){
//         eval("this.element.style."+key+" = "+"property_value["+key+"]")
//       }
//       return this
//     } else {
//       if(typeof value==="undefined"){
//         return eval("this.element.style."+property_value)
//       }
//       else {
//         eval("this.element.style."+property_value+"=value")
//         return this
//       }
//     }
//   }
//   animate = (keyframe, duration, easing_callback, callback) => {
//     if(typeof callback==="undefined"&&typeof easing_callback==="function")callback = easing_callback
//     const xduration = typeof duration==="undefined"||typeof duration!=="number"?0:duration
//     const xeasing = typeof easing_callback==="undefined"||typeof easing_callback!=="string"?"cubic-bezier(0, 0, 0.5, 1.5)":easing_callback
//     this.element.animate([{},keyframe],{
//       duration: xduration, fill: "forwards", easing:xeasing})
//     if(typeof callback==="undefined"||typeof callback!=="function") return this
//     else {
//       setTimeout(()=>{callback()},xduration)
//       return this
//     }
//   }
//   // Validator
//   setCustomValidity = (message) => {
//     this.element.setCustomValidity(message)
//     return this
//   }
//   reportValidity = () => {
//     this.element.reportValidity()
//     return this
//   }
//   // Values
//   val = (value) => {
//     if(typeof value==="undefined") {
//       try{
//         return this.element.value
//       } catch(err) {
//         return ""
//       }
//     }
//     else return this.element.value = value
//   }
//   show = () => {
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