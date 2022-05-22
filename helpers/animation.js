const DOM = (element_s) => {
  if(typeof element_s==="string" || element_s instanceof  String){
    if(document.querySelectorAll(element_s).length===0)
      return undefined
    else return new Elements(...document.querySelectorAll(element_s))
  } else {
    if(!(element_s instanceof Window)&&!(element_s instanceof Document)&&!(element_s instanceof HTMLElement)) 
      return undefined
    else return new Elements(element_s)
  } 
}

const propVal = (element, property) => {  
  if(typeof element[property]==="undefined"||element[property]===null)
    if(element.style[property].length===0){
      const value = window.getComputedStyle(element)[property].toString()
      const cssUnits=["px","em","rem","ch","%","vh","vw","ex","cm","mm","in","pt","pc","vmin","vmax"]
      if(cssUnits.some(unit=>value.indexOf(unit)>-1))
        return parseFloat(window.getComputedStyle(element)[property])
      else return window.getComputedStyle(element)[property]
    } else return element.style[property]
  else return element[property]    
}

class Elements extends Array {   
  //Listener
  ready(callback) {
    if(this.some(element=>element.readyState!==null && element.readyState!=="loading"))
      callback()
    else this.on("DOMContentLoaded",callback)
    return this
  }
  on(event,callback_element,callback) {
    if(typeof callback_element==="function")
      this.forEach(element=>{
        element.addEventListener(event,callback_element)})
    else 
      this.forEach(element=>element.addEventListener((e)=>{
        if(e.target.matches(callback_element)) callback()
      }))
    return this
  }
  //Animate
  css(properties_values,values) {
    const _properties = typeof properties_values==="object"? Object.keys(properties_values):properties_values
    const _values = typeof properties_values==="object"? Object.values(properties_values):typeof values==="string"||values instanceof String? values:""
      if(_values.length===0) {
        return this.length===1? propVal(this[0],_properties) : this.map(element=>propVal(element,_properties))
      } else 
        this.forEach(element=>{
          element.style[_properties]===null?
          element[_properties]=values :
          element.style[_properties]=_values
        })      
    return this
  }
  animate(keyframe, duration_callback, easing_callback, callback) {
    const _duration = typeof duration_callback==="number"? duration_callback:0
    const _easing = typeof easing_callback==="string"||easing_callback instanceof String? easing_callback:"cubic-bezier(.5, .05, .1, 1.25)"
    const _callback = typeof duration_callback==="function"? duration_callback:typeof easing_callback==="function"? easing_callback:typeof callback==="function"? callback:()=>{}
    const _keyframes = Object.entries(keyframe).reduce((kfs, [p, v]) => {
                        if(p==="scrollTop") return [kfs[0],{...kfs[1],[p]:parseFloat(v)}]
                        else if(p==="scrollLeft") return [kfs[0],{...kfs[1],[p]:parseFloat(v)}]   
                        else return [{...kfs[0],[p]:v},kfs[1]]
                      }, [])
    // Additional Scroll Animation 
    if(typeof _keyframes[1]!=="undefined"&&_keyframes[1]!==null) { 
      const scrolled = this[0]===document.body||this[0]===window||this[0]===document? DOM("html"):this
      DOM("body").css("overflow","visible")
      DOM("html").css("overflow","visible")// Allow scroll
      Object.entries(_keyframes[1]).forEach(([p,v])=>{
        const to = parseFloat(v)
        if(scrolled.length===1){
          const from = propVal(scrolled[0],p)
          const dif = _duration===0? to-from:(to-from)/_duration
          const frames=[];
          for(let i=_duration===0?0:1;i<=_duration;++i)
            frames.push([i , _duration===0?to:(dif*i)+from])
          frames.forEach(([time,location])=>{
            setTimeout(()=>{
              scrolled[0][p]=location
            },time)
          })
        } else 
        scrolled.forEach(element=> {
          const from = propVal(element,p)
          const dif = _duration===0? to-from:(to-from)/_duration
          const frames=[];
          for(let i=_duration===0?0:1;i<=_duration;++i)
            frames.push([i , _duration===0?to:(dif*i)+from])
          frames.forEach(([time,location])=>{
            setTimeout(()=>{
              element[p]=location
            },time)
          })
        })
      })
    }
    // CSS Animation Keyframes
    this.length===1? 
    this[0].animate([{},_keyframes[0]], {
        duration:_duration, fill:"forwards", easing:_easing}) 
    :
    this.forEach(element=> {
      element.animate([{},_keyframes[0]], {
        duration:_duration, fill:"forwards", easing:_easing})
    })
    setTimeout(()=> {
      _callback()
      return this
    },_duration)    
  }
  get show() {
    this.forEach(element=>element.style.display = "block")
    return this
  }
  get hide() {
    this.forEach(element=>element.style.display="none")
    return this
  }
  //Selectors
  parent(element_s) {
    if(element_s==="undefined") {return new Elements(this[0].parentElement)}
    else return (
      this.length===1? new Element(...this[0].parentElement.parentElement.querySelectorAll(element_s)):
      this.map(element=>new Element(...element.parentElement.parentElement.querySelectorAll(element_s)))
    )
   }
  child(element_s) {
    if(element_s===undefined) return new Elements(...this[0].children)
    else return (
      this.length===1? new Element(...this[0].querySelectorAll(element_s)) :
      this.map(element=>new Element(...element.querySelectorAll(element_s)))
    )
  }
  //Validator
  setCustomValidity(message) {
      this.forEach(element=>element.setCustomValidity(message))
    return this
  }
  get reportValidity(){
      this.length===0? this[0].reportValidity() :
      this.forEach(element=>element.reportValidity())
    return this
  }
  //Setter
  set val(value) {
      this.forEach(element=>element.value=value)
    return this
  }
  //Getter
  get val() {
    return (
      this.length===1? this[0].value:this.map(element=>element.value)
    )
  }
  height(cbpm, position) {
    const options = typeof cbpm==="undefined"? ["c","p","b"] : cbpm.replace(" ","").toLowerCase().split("")
    if(typeof position==="string"||position instanceof String){
      const _position = position.charAt(0).toUpperCase() + position.slice(1)
        if(this.length===1) {
          const scrollbarHeight = 
            (_position==="Bottom"? 
              (this[0].offsetHeight - this[0].clientHeight): 0 +
          propVal(this[0],"border"+_position+"Width"))
          return (
            (scrollbarHeight) +
            (options.includes("c")? 
              propVal(this[0],"height")
                -propVal(this[0],"paddingTop")
                -propVal(this[0],"paddingBottom")
                -propVal(this[0],"borderTopWidth")
                -propVal(this[0],"borderBottomWidth")
                -propVal(this[0],"marginTop")
                -propVal(this[0],"marginBottom"):0) + 
            (options.includes("b")?
              propVal(this[0],"border"+_position+"Width"):0) +
            (options.includes("p")?
              propVal(this[0],"padding"+_position):0) +
            (options.includes("m")?
              propVal(this[0],"margin"+_position):0)
          )
        } else {
          this.map(element=> { 
            const scrollbarHeight = 
            (_position==="Bottom"? 
              (element.offsetHeight - element.clientHeight): 0 +
              propVal(element,"border"+_position+"Width"))
            return (
              (scrollbarHeight) +
              (options.includes("c")? 
                propVal(element,"height")
                  -propVal(element,"paddingTop")
                  -propVal(element,"paddingBottom")
                  -propVal(element,"borderTopWidth")
                  -propVal(element,"borderBottomWidth")
                  -propVal(element,"marginTop")
                  -propVal(element,"marginBottom"):0) + 
              (options.includes("b")?
                propVal(element,"border"+_position+"Width"):0) +
              (options.includes("p")?
                propVal(element,"padding"+_position):0) +
              (options.includes("m")?
                propVal(element,"margin"+_position):0)
            )
          })
        }
    } else {
      if(this.length===1) {
        const scrollbarHeight = 
          this[0].offsetHeight - 
          (this[0].clientHeight +
          propVal(this[0],"borderTopWidth") + 
          propVal(this[0],"borderBottomWidth"))
        return (
          (scrollbarHeight) +
          (options.includes("c")? 
            propVal(this[0],"height")
              -propVal(this[0],"paddingTop")
              -propVal(this[0],"paddingBottom")
              -propVal(this[0],"borderTopWidth")
              -propVal(this[0],"borderBottomWidth")
              -propVal(this[0],"marginTop")
              -propVal(this[0],"marginBottom"):0) + 
          (options.includes("b")? (
            propVal(this[0],"borderTopWidth") +
            propVal(this[0],"borderBottomWidth")):0) +
          (options.includes("p")? (
            propVal(this[0],"paddingTop") +
            propVal(this[0],"paddingBottom")):0) +
          (options.includes("m")? (
            propVal(this[0],"marginTop") +
            propVal(this[0],"marginBottom")):0)
        )
      } else {
        this.map(element=> { 
          const scrollbarHeight = 
            element.offsetHeight - 
            (element.clientHeight +
            propVal(element,"borderTopWidth") + 
            propVal(element,"borderBottomWidth"))
          return (
            (scrollbarHeight) +
            (options.includes("c")? 
              propVal(element,"height")
                -propVal(element,"paddingTop")
                -propVal(element,"paddingBottom")
                -propVal(element,"borderTopWidth")
                -propVal(element,"borderBottomWidth")
                -propVal(element,"marginTop")
                -propVal(element,"marginBottom"):0) + 
            (options.includes("b")? (
              propVal(element,"borderTopWidth") +
              propVal(element,"borderBottomWidth")):0) +
            (options.includes("p")? (
              propVal(element,"paddingTop") +
              propVal(element,"paddingBottom")):0) +
            (options.includes("m")? (
              propVal(element,"marginTop") +
              propVal(element,"marginBottom")):0)
          )
        })
      }
    }
  }
  width(cbpm, position) {
    const options = typeof cbpm==="undefined"? ["c","p","b"] : cbpm.replace(" ","").toLowerCase().split("")
    if(typeof position==="string"||position instanceof String){
      const _position = position.charAt(0).toUpperCase() + position.slice(1)
      if(this.length===1){
        const scrollbarHeight = 
          (_position==="Right"? 
            (this[0].offsetWidth - this[0].clientWidth): 0 +
            propVal(this[0],"border"+_position+"Width"))
        return (
          (scrollbarHeight) +
          (options.includes("c")? 
            (propVal(this[0],"width")
              -propVal(this[0],"paddingLeft")
              -propVal(this[0],"paddingRight")
              -propVal(this[0],"borderLeftWidth")
              -propVal(this[0],"borderRightWidth")
              -propVal(this[0],"marginRight")
              -propVal(this[0],"marginLeft")):0) +
          (options.includes("b")?
            propVal(this[0],"border"+_position+"Width"):0) +
          (options.includes("p")?
            propVal(this[0],"padding"+_position):0) +
          (options.includes("m")?
            propVal(this[0],"margin"+_position):0)
        )
      } else {
        this.map(element=> { 
          const scrollbarHeight = 
          (_position==="Right"? 
            (element.offsetWidth - element.clientWidth): 0 +
          propVal(element,"border"+_position+"Width"))
          return (
            (scrollbarHeight) +
            (options.includes("c")? 
              propVal(element,"width")
                -propVal(this[0],"paddingLeft")
                -propVal(this[0],"paddingRight")
                -propVal(this[0],"borderLeftWidth")
                -propVal(this[0],"borderRightWidth")
                -propVal(this[0],"marginRight")
                -propVal(this[0],"marginLeft"):0) + 
            (options.includes("b")?
              propVal(element,"border"+_position+"Width"):0) +
            (options.includes("p")?
              propVal(element,"padding"+_position):0) +
            (options.includes("m")?
              propVal(element,"margin"+_position):0)
          )
        })
      }
    } else {
      if(this.length===1){
        const scrollbarWidth = 
          this[0].offsetWidth - 
            (this[0].clientWidth +
            propVal(this[0],"borderLeftWidth") + 
            propVal(this[0],"borderRightWidth"))
        return ( 
          (scrollbarWidth) +
          (options.includes("c")? 
            propVal(this[0],"width")
              -propVal(this[0],"paddingLeft")
              -propVal(this[0],"paddingRight")
              -propVal(this[0],"borderLeftWidth")
              -propVal(this[0],"borderRightWidth")
              -propVal(this[0],"marginRight")
              -propVal(this[0],"marginLeft"):0) + 
          (options.includes("b")? (
            propVal(this[0],"borderLeftWidth") +
            propVal(this[0],"borderRightWidth")):0) +
          (options.includes("p")? (
            propVal(this[0],"paddingLeft") +
            propVal(this[0],"paddingRight")):0) +
          (options.includes("m")? (
            propVal(this[0],"marginLeft") +
            propVal(this[0],"marginRight")):0)
        )
      } else {
        this.map(element=> { 
          const scrollbarWidth = 
            element.offsetWidth - 
            (element.clientWidth +
            propVal(element,"borderLeftWidth") + 
            propVal(element,"borderRightWidth"))
          return ( 
            (scrollbarWidth) +
            (options.includes("c")? 
              propVal(element,"width")
                -propVal(element,"paddingLeft")
                -propVal(element,"paddingRight")
                -propVal(element,"borderLeftWidth")
                -propVal(element,"borderRightWidth")
                -propVal(element,"marginRight")
                -propVal(element,"marginLeft"):0) + 
            (options.includes("b")? (
              propVal(element,"borderLeftWidth") +
              propVal(element,"borderRightWidth")):0) +
            (options.includes("p")? (
              propVal(element,"paddingLeft") +
              propVal(element,"paddingRight")):0) +
            (options.includes("m")? (
              propVal(element,"marginLeft") +
              propVal(element,"marginRight")):0)
          )
        })
      }
    }  
  }
  get offsetTop() {
    return (
      this.length===1? this[0].offsetTop:this.map(element=>element.offsetTop)
    )
  }
  get offsetBottom() {
    return (
      this.length===1? this[0].offsetBottom:this.map(element=>element.offsetBottom)
    )
  }
  get offsetRight() {
    return (
      this.length===1? this[0].offsetRight:this.map(element=>element.offsetRight)
    )
  }
  get offsetLeft() {
    return (
      this.length===1? this[0].offsetLeft:this.map(element=>element.offsetLeft)
    )
   }
  get innerWidth() {
    if(this[0]===window) return this[0].innerWidth
    else if(this[0]===document) return new Elements("html").width("cp")
    else return (
      this.length===1? this.width("cp"):this.map(element=>new Elements(element).width("cp"))
    )
  }
  get outerWidth() {
    if(this[0]===window) return this[0].outerWidth
    else if(this[0]===document) return new Elements("html").width("cpb")
    else return (
      this.length===1? this.width("cpb"):this.map(element=>new Elements(element).width("cpb"))
    )
   }
  get innerHeight() {
    if(this[0]===window) return this[0].innerHeight
    else if(this[0]===document) return new Elements("html").height("cp")
    else return (
      this.length===1? this.height("cp"):this.map(element=>new Elements(element).height("cp"))
    )
  }
  get outerHeight() {
    if(this[0]===window) return this[0].outerHeight
    else if(this[0]===document) return new Elements("html").height("cpb")
    else return (
      this.length===1? this.height("cpb"):this.map(element=>new Elements(element).height("cpb"))
    )
  }
  get scrollTop() {
    return (
      this.length===1? this[0].scrollTop:this.map(element=>element.scrollTop)
    )
  }
  get isActive() {
    return (
      this.length===1? this[0]===document.activeElement:this.map(element=>element === document.activeElement)
    )
  }
}

export default DOM;


// Extra
    //Append
    // insert(newElement, position_nodeBefore) {
    //    const div= document.createElement("div");
    //    div.innerHTML = newElement
    //    const _newElement = div.firstChild
    //    if(this.isElement) {
    //      if(typeof position_nodeBefore==="undefined") this.elements.append(_newElement)
    //      else {
    //        const _nodeBefore = 
    //          position_nodeBefore instanceof Elements?
    //            position_nodeBefore[0] : typeof position_nodeBefore==="object" && typeof position_nodeBefore.nodeType!==undefined ?
    //              position_nodeBefore : this.elements.querySelector(position_nodeBefore)
    //        this.elements.insertBefore(_newElement, _nodeBefore)
    //      }
    //    } else this.map(element=> {
    //      if(typeof nodeBefore==="undefined") element.append(_newElement)
    //      else {
    //        nodeBefore instanceof Elements?
    //            nodeBefore[0] : typeof nodeBefore==="object" && typeof nodeBefore.nodeType!==undefined ?
    //              nodeBefore : this.elements.querySelector(nodeBefore)
    //        element.insertBefore(_newElement, _nodeBefore)
    //      }
    //    })
    //   return this
    //  }
    //  extract(element_s) {
       
    //    return this
    //  }