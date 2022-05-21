// const DOM = (element_s) => {
     if(typeof id==="string" || id instancof String)
       return new Elements[...document.querySelectorAll(element_s)])
     else return new Elements([element_s])
// }

   const propVal = (element, property) => {
     if(element[property]===null)
       if(element.style[property].replace(/\D/g,'').length>0)
         return parseFloat(window.getComputedStyle(element)[property])
       else return element.style[property]
     } else return element[property]    
   }

// class Elements extends Array {   
     isElement
     element
     constructor(elements) {
       this.isElement = elements.length===1
       this.element = elements[0]
     }
//   //Listener
     ready(callback) {
       if(this.some(element=>element.readyState!==null && element.readyState!=="loading"))
         callback()
       else this.on("DOMContentLoaded",callback))
       return this
     }
//   on(event,callback_element,callback) {
       if(typeof callback_element==="function")
         this.forEach(element=>element.addEventListener(event,callback))
       else this.forEach(element=>element.addEventListener(event,e=>{
         if(e.target.matches(callback_element)) callback()
       }) return this
//   }
//   //Animate
//   css(properties_values,values) {
       const _properties = typeof properties_values==="object"? Object.keys(properties_values):properties_values
       const _values = typeof properties_values==="object"? Object.values(properties_values):typeof values==="string"||values instanceof String? values:""
       if(_values.length===0) 
         return this.map(element=>propVal(element,_properties))
       else {
         this.forEach(element=>element.style[_properties]=_values)
         return this
       }
     }
     get show() {
//     this.forEach(element=>element.style.display = "block")
//     return this
//   }
//   get hide() {
//     this.forEach(element=>element.style.display="none")
//     return this
//   }
     animate(keyframe, duration_callback, easing_iterations_callback, iterations_callback, callback) {
       const _duration = typeof duration_callback==="function"? 0:duration_callback
       const _easing = typeof easing_callback==="function"? "cubic-bezier(0, 0, 0.5, 1.25)":easing_callback
       const _iterations = typeof iterations_callback==="function"? 1:iteration_callback
       const _callback = typeof callback==="function"? callback:()=>{}
       const _keyframes = Object.entries(obj).reduce((kfs, [p, v]) => {
                            if(p==="scrollTop") return [kfs[0],{...kfs[1],p:parseFloat(v)}]
                            else if(p==="scrollLeft") return [kfs[0],{...kfs[1],p:parseFloat(v)}]   
                            else return [{...kfs[0],[p]:v},kfs[1]]
                          }, [])
       if(typeof _keyframes[1]!=="undefined") //Scroll Animation
         Object.entries(_keyframes[1]).forEach(([p,v])=>{
           const to = parseFloat(v)
           const from = propVal(element,p)
           this.forEach(element=> {
             dif = _duration===0? to-from:(to-from)/_duration
             for(let i=_duration===0?0:1;i<=_duration;++i){
               setTimeout(()=>{
                 element[p]+=dif
               },i)
             }
           })
         })
         //Alternative: window.scrollTo({..._keyframes[1],behavior:"smooth"})
       this.forEach(element=> {
         element.animate([{},_keyframes[0]], {
           duration:_duration, fill:"forwards", easing:_easing, iterations:_iterations})
       })   
       setTimeout(()=> {
         _callback()
         return this
       },_duration)    
     }
     // Append
     insert(newElement, position_nodeBefore) {
       const div= document.createElement("div");
       div.innerHTML = newElement
       const _newElement = div.firstChild
       if(this.isElement) {
         if(typeof position_nodeBefore==="undefined") this.element.append(_newElement)
         else if(typeof position_nodeBefore==="string" || position_nodeBefore instanceof String) {
           
         }
         else {
           const _nodeBefore = 
             position_nodeBefore instanceof Elements?
               position_nodeBefore[0] : typeof position_nodeBefore==="object" && typeof position_nodeBefore.nodeType!==undefined ?
                 position_nodeBefore : this.element.querySelector(position_nodeBefore)
           this.element.insertBefore(_newElement, _nodeBefore)
         }
       } else this.map(element=> {
         if(typeof nodeBefore==="undefined") element.append(_newElement)
         else {
           nodeBefore instanceof Elements?
               nodeBefore[0] : typeof nodeBefore==="object" && typeof nodeBefore.nodeType!==undefined ?
                 nodeBefore : this.element.querySelector(nodeBefore)
           element.insertBefore(_newElement, _nodeBefore)
         }
       })
       return this
     }
     extract(element_s) {
       
       return this
     }
     // Selectors
     parent(element_s) {
       if(element_s===undefined) return new Elements([this.element.parentElement]))
       else return (this.isElement? new Element([...this.element.parentElement.parentElement.querySelectorAll(element_s)])
         : this.map(element=>new Element([....element.parentElement.parentElement.querySelectorAll(element_s)])
       )
     }
     child(element_s) {
       if(element_s===undefined) return new Elements([...this.element.children]))
       else return (this.isElement? new Element([...this.element.querySelectorAll(element_s)])
         : this.map(element=>new Element([....element.querySelectorAll(element_s)]))
       )
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
//   set val(value) {
//     this.forEach(element=>element.value=value)
//   }
     // Getter
     get val() {
       return (this.isElement? this.element.value
         : this.map(element=>element.value)
       )
     }
//   get height(content, border, padding, margin) {
//     const options = cbpm.replace(" ","").toLowerCase().split("")
//     if(this.isElement) {
         const scrollbarHeight = 
           this.element.offsetHeight - 
           (this.element.clientHeight +
           propVal(this.element,"borderTop") + 
           propVal(this.element,"borderBottom"))
         return (
           typeof cbpm==="undefined" ? (
             scrollbarHeight +
             propVal(this.element,"height") +
             propVal(this.element,"borderTop") +
             propVal(this.element,"borderBottom") +
             propVal(this.element,"paddingTop") +
             propVal(this.element,"paddingBottom")
           ):(
             (scrollbarHeight) +
             (options.includes("c")? propVal(this.element,"height"):0) + 
             (options.include("b")? (
               propVal(this.element,"borderTop") + 
               propVal(this.element,"borderBottom")):0) +
             (options.includes("p")? (
               propVal(this.element,"paddingTop") +
               propVal(this.element,"paddingBottom")):0) +
             (options.includes("m")? (
               propVal(this.element,"marginTop") +
               propVal(this.element,"marginBottom")):0)
           )
         )
       } else {
         return (
           this.map(element=> { 
             const scrollbarHeight = 
               element.offsetHeight - 
               (element.clientHeight +
               propVal(element,"borderTop") + 
               propVal(element,"borderBottom"))
             typeof cbpm==="undefined" ? (
               scrollbarHeight +
               propVal(element,"height") +
               propVal(element,"borderTop") +
               propVal(element,"borderBottom") +
               propVal(element,"paddingTop") +
               propVal(element,"paddingBottom")
             ):(
               (scrollbarHeight) +
               (options.includes("c")? propVal(element,"height"):0) + 
               (options.include("b")? (
                 propVal(element,"borderTop") +
                 propVal(element,"borderBottom")):0) +
               (options.includes("p")? (
                 propVal(element,"paddingTop") +
                 propVal(element,"paddingBottom")):0) +
               (options.includes("m")? (
                 propVal(element,"marginTop") +
                 propVal(element,"marginBottom")):0)
             )
           })
         )
       }
//   }
//   get width(cbpm) {
       const options = cbpm.replace(" ","").toLowerCase().split("")
//     if(this.isElement) {
         const scrollbarWidth = 
           this.element.offsetWidth - 
           (this.element.clientWidth +
           propVal(this.element,"borderLeft") + 
           propVal(this.element,"borderRight"))
         return (
           typeof cbpm==="undefined" ? (
             scrollbarWidth +
             propVal(this.element,"width") +
             propVal(this.element,"borderLeft") +
             propVal(this.element,"borderRight") +
             propVal(this.element,"paddingLeft") +
             propVal(this.element,"paddingRight")
           ):(
             (scrollbarWidth) +
             (options.includes("c")? propVal(this.element,"width"):0) + 
             (options.include("b")? (
               propVal(this.element,"borderLeft") + 
               propVal(this.element,"borderRight")):0) +
             (options.includes("p")? (
               propVal(this.element,"paddingLeft") +
               propVal(this.element,"paddingRight")):0) +
             (options.includes("m")? (
               propVal(this.element,"marginLeft") +
               propVal(this.element,"marginRight")):0)
           )
         )
       } else {
         return (
           this.map(element=> { 
             const scrollbarWidth = 
               element.offsetWidth - 
               (element.clientWidth +
               propVal(element,"borderLeft") + 
               propVal(element,"borderRight"))
             typeof cbpm==="undefined" ? (
               scrollbarWidth +
               propVal(element,"width") +
               propVal(element,"borderLeft") +
               propVal(element,"borderRight") +
               propVal(element,"paddingLeft") +
               propVal(element,"paddingRight")
             ):(
               (scrollbarWidth) +
               (options.includes("c")? propVal(element,"width"):0) + 
               (options.include("b")? (
                 propVal(element,"borderLeft") +
                 propVal(element,"borderRight")):0) +
               (options.includes("p")? (
                 propVal(element,"paddingLeft") +
                 propVal(element,"paddingRight")):0) +
               (options.includes("m")? (
                 propVal(element,"marginLeft") +
                 propVal(element,"marginRight")):0)
             )
           })
         )
       }  
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
