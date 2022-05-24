const dom = (element_s) => {
  if(element_s instanceof Elements)
    return element_s
  else if(typeof element_s==="string" 
  || element_s instanceof String){
    if(document.querySelectorAll(element_s).length===0)
      return undefined
    else 
      return new Elements(...document.querySelectorAll(element_s))
  } 
  else {
    if(!(element_s instanceof Window)
    &&!(element_s instanceof Document)
    &&!(element_s instanceof HTMLElement)) 
      return undefined
    else 
      return new Elements(element_s)
  } 
}

const getProp = (element, property) => {
  return element[property]||window.getComputedStyle(element)[property]
}

const setProp = (element, property, value) => {
  if(typeof element[property]!=="undefined")
    return element[property]=value
  else 
    return element.style[property]=value
}

const getSize = (element, property) => {
  return parseFloat(window.getComputedStyle(element)[property])
}

class Elements extends Array {   
  //Re-Initialize
  dom(element_s) {
    return dom(element_s)
  }
  //Listener
  ready(callback) {
    if(this.some(element=>element.readyState!==null 
    && element.readyState!=="loading"))
      callback()
    else 
      this.on("DOMContentLoaded",callback)
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
    if(typeof values==="undefined" 
    && (typeof properties_values==="string" 
    || properties_values instanceof String)) {
      return this.length===1? 
        getProp(this[0],properties_values)
        : this.map(element=>{
            return getProp(element,properties_values)
          })
    }
    // Change String parameters to Object
    const props = 
      (typeof properties_values==="string" 
      || properties_values instanceof String) 
      && (typeof values==="string" || values instanceof String) ?
        {[properties_values]:values}
        : properties_values
    // Configure Props and Values
    const tnonUnit = ["matrix","matrix3d","scale","scaleX","scaleY","scale3d","scaleZ"]
    const transformShorcut = 
    [ "translate", "translateY", "translateX", "translate3d", "translateZ",
      "scale", "scaleX", "scaleY", "scale3d", "scaleZ",
      "rotate", "rotateX", "rotateY", "rotate3d", "rotateZ",
      "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d" ]
    const _props = 
      Object.entries(props).reduce((kfs, [p, v]) => {
        // For transform props shortcut also accepts Numeric
        if(transformShorcut.some(prop=>prop===p)) {
          if(v instanceof Array) {
            var newval
            for(let i=0;i<v.length;++i){
              if(tnonUnit.some(unit=>p===unit)
              ||parseInt(v)===0
              ||isNaN(v))
                newval = i===0? v[i] : newval+","+v[i]
              else
                newval = i===0? v[i]+"px" : newval+","+v[i]+"px"  
            }
            return {...kfs,transform: p+"("+newval+")"}
          } else if(tnonUnit.some(unit=>p===unit)
            ||parseInt(v)===0
            ||isNaN(v)){
            return {...kfs[0],transform: p+"("+v+")"}
          } else  
            return {...kfs[0],transform: p+"("+parseFloat(v)+"px)"}
        // For original transform accepting Numeric
        } else if(p==="transform") {
          const transformProps = 
            (v+" ").split(") ").slice(0,-1)
              .map(p=>{return p.split("(")})
              .map(([p,v])=>{return [p, v.split(",")]})
              .map(([p,vs])=>{
                const newval = vs.map(v=>{ 
                  if(tnonUnit.some(unit=>p===unit)
                  ||parseInt(v)===0
                  ||isNaN(v)) 
                    return v
                  else return v+"px"  
                })
                var val
                for(let i=0;i<newval.length;++i)
                  val = i===0? newval[0] : val+","+newval[i]
                return [p, val]
              })
          var newVal
          for(let i=0;i<transformProps.length;++i)
            newVal = i===0? 
              transformProps[i][0]+"("+transformProps[i][1]+")" 
              : newVal+" "+transformProps[i][0]+"("+transformProps[i][1]+")"        
          return {...kfs,[p]:newVal}
        }
        // Check if Inputted Value is a number
        else if(window.getComputedStyle(this[0])[p].split("px").length-1===1 && typeof v==="number") 
          return {...kfs,[p]:v+"px"}
        else
          return {...kfs,[p]:v}
      }, {})
    Object.entries(_props).forEach(([property,value])=>{
      if(this.length===0) {
        setProp(this[0],property,value)
      }
      else 
        this.forEach(element=>{
          setProp(element,property,value)
        })
    })
    this.animate(_props)// Fix props to elements that was Changed by Animate keyframes
    return this
  }
  animate(keyframe, duration_callback, easing_callback, callback) {
    const _duration = 
      typeof duration_callback==="number"?
        duration_callback : 0
    const _easing = 
      typeof easing_callback==="string"||easing_callback instanceof String ? 
        easing_callback
        : "cubic-bezier(.5, .05, .1, 1.25)"
    const _callback = 
      typeof duration_callback==="function" ? 
        duration_callback
        : typeof easing_callback==="function" ?
          easing_callback
          : typeof callback==="function" ?
            callback:()=>{}
    const nonStylesProp = ["scrollTop","scrollLeft"]
    const tnonUnit = ["matrix","matrix3d","scale","scaleX","scaleY","scale3d","scaleZ"]
    const transformShorcut = 
      [ "translate", "translateY", "translateX", "translate3d", "translateZ",
        "scale", "scaleX", "scaleY", "scale3d", "scaleZ",
        "rotate", "rotateX", "rotateY", "rotate3d", "rotateZ",
        "skew", "skewX", "skewY", "perspective", "matrix", "matrix3d" ]
    const _keyframes = 
      Object.entries(keyframe).reduce((kfs, [p, v]) => {
        if(nonStylesProp.some(prop=>{return p===prop}))
          return [kfs[0],{...kfs[1],[p]:v}]
        // Added transform shortcut Props
        else if(transformShorcut.some(prop=>prop===p)) {
          if(v instanceof Array) {
            var newval
            for(let i=0;i<v.length;++i){
              if(tnonUnit.some(unit=>p===unit)
              ||parseInt(v)===0
              ||isNaN(v)){
                newval = i===0? v[i] : newval+","+v[i]
              }
              else {
                newval = i===0? v[i]+"px" : newval+","+v[i]+"px"  
              }
            }
            return [{...kfs[0],transform: p+"("+newval+")"},kfs[1]]
          } else if(tnonUnit.some(unit=>p===unit)
            ||parseInt(v)===0
            ||isNaN(v)){
            return [{...kfs[0],transform: p+"("+v+")"},kfs[1]]
          } else  
            return [{...kfs[0],transform: p+"("+parseFloat(v)+"px)"},kfs[1]]
        }
        // Transform accepts numeric
        else if(p==="transform") {
          const transformProps = 
            (v+" ").split(") ").slice(0,-1)
              .map(p=>{return p.split("(")})
              .map(([p,v])=>{return [p, v.split(",")]})
              .map(([p,vs])=>{
                const newval = vs.map(v=>{ 
                  if(tnonUnit.some(unit=>p===unit)
                  ||parseInt(v)===0
                  ||isNaN(v)) 
                    return v
                  else return v+"px"  
                })
                var val
                for(let i=0;i<newval.length;++i)
                  val = i===0? newval[0] : val+","+newval[i]
                return [p, val]
              })
          var newVal
          for(let i=0;i<transformProps.length;++i)
            newVal = i===0? 
              transformProps[i][0]+"("+transformProps[i][1]+")" 
              : newVal+" "+transformProps[i][0]+"("+transformProps[i][1]+")"        
          return [{...kfs[0],[p]:newVal},kfs[1]]
        }
        // Check if Inputted Value is a number
        else if(window.getComputedStyle(this[0])[p].split("px").length-1===1 && typeof v==="number") 
          return [{...kfs[0],[p]:v+"px"},kfs[1]]
        else
          return [{...kfs[0],[p]:v},kfs[1]]
      }, [])
    // Additional Non Computed Style Properties Animation 
    if(typeof _keyframes[1]!=="undefined") { 
      Object.entries(_keyframes[1]).forEach(([p,v])=>{
        const to = parseFloat(v)
        if(this.length===1) {
          const from = this[0].style[p] || this[0][p]
          const dif = _duration===0? to-from:(to-from)/_duration
          const frames=[];
          for(let i=_duration===0?0:1;i<=_duration;++i)
            frames.push([i , _duration===0?to:(dif*i)+from])
          frames.forEach(([time,location])=>{
            setTimeout(()=>{
              this[0][p]=location
            },time)
          })
        } else {
          scrolled.forEach(element=> {
            const from = element[p] || element.style[p]
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
        }
      })
    }
    // CSS Styles Animation Keyframes
    if(this.length===1)
      this[0].animate([{},_keyframes[0]], {
        duration:_duration, fill:"forwards", easing:_easing}) 
    else
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
  y(cbpm, tblr) {
    const options = typeof cbpm==="undefined"? ["c","p","b"] : cbpm.replace(" ","").toLowerCase().split("")
    if(typeof tblr==="string"||tblr instanceof String){
      const fl = tblr.charAt(0).toLowerCase()
      const _position = fl==="t"?"Top": fl==="b"?"Bottom": fl==="r"?"Right" : "Left"
        if(this.length===1) {
          const scrollbarHeight = 
            (_position==="Bottom"? 
              (this[0].offsetHeight - this[0].clientHeight): 0 +
          getSize(this[0],"border"+_position+"Width"))
          return (
            (scrollbarHeight) +
            (options.includes("c")? 
              (getSize(this[0],"height")
                -getSize(this[0],"paddingTop")
                -getSize(this[0],"paddingBottom")
                -getSize(this[0],"borderTopWidth")
                -getSize(this[0],"borderBottomWidth"))/2:0) + 
            (options.includes("b")?
              getSize(this[0],"border"+_position+"Width"):0) +
            (options.includes("p")?
              getSize(this[0],"padding"+_position):0) +
            (options.includes("m")?
              getSize(this[0],"margin"+_position):0)
          )
        } else {
          this.map(element=> { 
            const scrollbarHeight = 
            (_position==="Bottom"? 
              (element.offsetHeight - element.clientHeight): 0 +
              getSize(element,"border"+_position+"Width"))
            return (
              (scrollbarHeight) +
              (options.includes("c")? 
                (getSize(element,"height")
                  -getSize(element,"paddingTop")
                  -getSize(element,"paddingBottom")
                  -getSize(element,"borderTopWidth")
                  -getSize(element,"borderBottomWidth"))/2:0) + 
              (options.includes("b")?
                getSize(element,"border"+_position+"Width"):0) +
              (options.includes("p")?
                getSize(element,"padding"+_position):0) +
              (options.includes("m")?
                getSize(element,"margin"+_position):0)
            )
          })
        }
    } else {
      if(this.length===1) {
        const scrollbarHeight = 
          this[0].offsetHeight - 
          (this[0].clientHeight +
          getSize(this[0],"borderTopWidth") + 
          getSize(this[0],"borderBottomWidth"))
        return (
          (scrollbarHeight) +
          (options.includes("c")? 
            getSize(this[0],"height")
              -getSize(this[0],"paddingTop")
              -getSize(this[0],"paddingBottom")
              -getSize(this[0],"borderTopWidth")
              -getSize(this[0],"borderBottomWidth"):0) + 
          (options.includes("b")? (
            getSize(this[0],"borderTopWidth") +
            getSize(this[0],"borderBottomWidth")):0) +
          (options.includes("p")? (
            getSize(this[0],"paddingTop") +
            getSize(this[0],"paddingBottom")):0) +
          (options.includes("m")? (
            getSize(this[0],"marginTop") +
            getSize(this[0],"marginBottom")):0)
        )
      } else {
        this.map(element=> { 
          const scrollbarHeight = 
            element.offsetHeight - 
            (element.clientHeight +
            getSize(element,"borderTopWidth") + 
            getSize(element,"borderBottomWidth"))
          return (
            (scrollbarHeight) +
            (options.includes("c")? 
              getSize(element,"height")
                -getSize(element,"paddingTop")
                -getSize(element,"paddingBottom")
                -getSize(element,"borderTopWidth")
                -getSize(element,"borderBottomWidth"):0) + 
            (options.includes("b")? (
              getSize(element,"borderTopWidth") +
              getSize(element,"borderBottomWidth")):0) +
            (options.includes("p")? (
              getSize(element,"paddingTop") +
              getSize(element,"paddingBottom")):0) +
            (options.includes("m")? (
              getSize(element,"marginTop") +
              getSize(element,"marginBottom")):0)
          )
        })
      }
    }
  }
  x(cbpm, tblr) {
    const options = typeof cbpm==="undefined"? ["c","p","b"] : cbpm.replace(" ","").toLowerCase().split("")
    if(typeof tblr==="string"||tblr instanceof String){
      const fl = tblr.charAt(0).toLowerCase()
      const _position = fl==="t"?"Top": fl==="b"?"Bottom": fl==="r"?"Right" : "Left"
      if(this.length===1){
        const scrollbarHeight = 
          (_position==="Right"? 
            (this[0].offsetWidth - this[0].clientWidth): 0 +
            getSize(this[0],"border"+_position+"Width"))
        return (
          (scrollbarHeight) +
          (options.includes("c")? 
            (getSize(this[0],"width")
              -getSize(this[0],"paddingLeft")
              -getSize(this[0],"paddingRight")
              -getSize(this[0],"borderLeftWidth")
              -getSize(this[0],"borderRightWidth"))/2:0) +
          (options.includes("b")?
            getSize(this[0],"border"+_position+"Width"):0) +
          (options.includes("p")?
            getSize(this[0],"padding"+_position):0) +
          (options.includes("m")?
            getSize(this[0],"margin"+_position):0)
        )
      } else {
        this.map(element=> { 
          const scrollbarHeight = 
          (_position==="Right"? 
            (element.offsetWidth - element.clientWidth): 0 +
          getSize(element,"border"+_position+"Width"))
          return (
            (scrollbarHeight) +
            (options.includes("c")? 
              (getSize(element,"width")
                -getSize(this[0],"paddingLeft")
                -getSize(this[0],"paddingRight")
                -getSize(this[0],"borderLeftWidth")
                -getSize(this[0],"borderRightWidth"))/2:0) + 
            (options.includes("b")?
              getSize(element,"border"+_position+"Width"):0) +
            (options.includes("p")?
              getSize(element,"padding"+_position):0) +
            (options.includes("m")?
              getSize(element,"margin"+_position):0)
          )
        })
      }
    } else {
      if(this.length===1){
        const scrollbarWidth = 
          this[0].offsetWidth - 
            (this[0].clientWidth +
            getSize(this[0],"borderLeftWidth") + 
            getSize(this[0],"borderRightWidth"))
        return ( 
          (scrollbarWidth) +
          (options.includes("c")? 
            getSize(this[0],"width")
              -getSize(this[0],"paddingLeft")
              -getSize(this[0],"paddingRight")
              -getSize(this[0],"borderLeftWidth")
              -getSize(this[0],"borderRightWidth"):0) + 
          (options.includes("b")? (
            getSize(this[0],"borderLeftWidth") +
            getSize(this[0],"borderRightWidth")):0) +
          (options.includes("p")? (
            getSize(this[0],"paddingLeft") +
            getSize(this[0],"paddingRight")):0) +
          (options.includes("m")? (
            getSize(this[0],"marginLeft") +
            getSize(this[0],"marginRight")):0)
        )
      } else {
        this.map(element=> { 
          const scrollbarWidth = 
            element.offsetWidth - 
            (element.clientWidth +
            getSize(element,"borderLeftWidth") + 
            getSize(element,"borderRightWidth"))
          return ( 
            (scrollbarWidth) +
            (options.includes("c")? 
              getSize(element,"width")
                -getSize(element,"paddingLeft")
                -getSize(element,"paddingRight")
                -getSize(element,"borderLeftWidth")
                -getSize(element,"borderRightWidth"):0) + 
            (options.includes("b")? (
              getSize(element,"borderLeftWidth") +
              getSize(element,"borderRightWidth")):0) +
            (options.includes("p")? (
              getSize(element,"paddingLeft") +
              getSize(element,"paddingRight")):0) +
            (options.includes("m")? (
              getSize(element,"marginLeft") +
              getSize(element,"marginRight")):0)
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
    else if(this[0]===document) return new Elements("html").x("cp")
    else return (
      this.length===1? this.x("cp"):this.map(element=>new Elements(element).x("cp"))
    )
  }
  get outerWidth() {
    if(this[0]===window) return this[0].outerWidth
    else if(this[0]===document) return new Elements("html").x("cpb")
    else return (
      this.length===1? this.x("cpb"):this.map(element=>new Elements(element).x("cpb"))
    )
   }
  get innerHeight() {
    if(this[0]===window) return this[0].innerHeight
    else if(this[0]===document) return new Elements("html").y("cp")
    else return (
      this.length===1? this.y("cp"):this.map(element=>new Elements(element).y("cp"))
    )
  }
  get outerHeight() {
    if(this[0]===window) return this[0].outerHeight
    else if(this[0]===document) return new Elements("html").y("cpb")
    else return (
      this.length===1? this.y("cpb"):this.map(element=>new Elements(element).y("cpb"))
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

module.exports = dom

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
