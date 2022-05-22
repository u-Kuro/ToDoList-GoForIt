import Head from "next/head"
import Router from "next/router"
import $ from "jquery"

import DOM from "../../helpers/animation"

import { useState, useEffect, useRef } from "react"
import useUpdateEffect from "./components/useUpdateEffect"
import useEffectInterval from "./components/useEffectInterval"
import useUpdateEffectInterval from "./components/useUpdateEffectInterval"

import {
  UTCSQLtoLocal,
  UTCSQLtoLocalHTML,
  LocalHTMLtoSQL,
  CheckTimeStatus,
  TimezoneOffset,
} from "../../helpers/time"

export default function Home() {
  //=initializations
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [clientTimezoneOffset, setclientTimezoneOffset] = useState(TimezoneOffset())

  //=interactive
    //Category
    const [openedCategory, setopenedCategory] = useState([])
    const [chosenUpdateCategory, setchosenUpdateCategory] = useState([])
    const [updateCategoryIsOpen, setupdateCategoryIsOpen] = useState(false)
    const [updateCategoryAlertIsOpen, setupdateCategoryAlertIsOpen] = useState(false)
    //Task
    const [addTaskIsOpen, setaddTaskIsOpen] = useState(false)
    const [chosenUpdateTask, setchosenUpdateTask] = useState([])
    const [updateTaskIsOpen, setupdateTaskIsOpen] = useState(false)
    const [updateTaskAlertIsOpen, setupdateTaskAlertIsOpen] = useState(false)
    const [deleteAllFinishedTasksIsOpen, setdeleteAllFinishedTasksIsOpen] = useState(false)
    const [deleteAllFinishedTasksAlertIsOpen, setdeleteAllFinishedTasksAlertIsOpen] = useState(false)
    const [openUpdateTaskIsFromdeleteFinishedTasks, setopenUpdateTaskIsFromdeleteFinishedTasks] = useState(false)

  //=input values
    //category
    const [addCategoryName, setaddCategoryName] = useState([])
    const [updateCategoryName, setupdateCategoryName] = useState([])
    //tasks
    const [addTaskName, setaddTaskName] = useState([])
    const [addTaskStartDate, setaddTaskStartDate] = useState([])
    const [addTaskEndDate, setaddTaskEndDate] = useState([])
    const [addTaskDescription, setaddTaskDescription] = useState([])
    const [updateTaskName, setupdateTaskName] = useState([])
    const [updateTaskStartDate, setupdateTaskStartDate] = useState([])
    const [updateTaskEndDate, setupdateTaskEndDate] = useState([])
    const [updateTaskDescription, setupdateTaskDescription] = useState([])

  //=update default input
    //initialization
    const [taskStatusIsChanging, settaskStatusIsChanging] = useState(false)
    const [taskDateStatusIsChanging, settaskDateStatusIsChanging] = useState(false)
    //update default input functions
    useUpdateEffect(()=>{
      taskDateStatusIsChanging? settaskDateStatusIsChanging(false) : null
    },[taskDateStatusIsChanging])
    useUpdateEffect(()=>{
      taskStatusIsChanging? settaskStatusIsChanging(false) : null
    },[taskStatusIsChanging])

  //=helper
  const isRunning = useRef(false)
  const closeAllPopups = useRef(false)
  const currentTimezoneOffset = useRef(new Date().getTimezoneOffset())
    //helper functions
    const nulled = (v) => {return typeof v === "undefined" ? true : v === null ? true : v.length === 0}
    // const totalSizePosition = (v,position) => {return (
    //   (position==="Left"||position==="Right")?v.width("cbpm"):v.height("cbpm")
    // )}
    const val = (v) => {return nulled(v)?[]:v}

  //=first render
  useEffect(() => {
    $.ajax({
      type: "GET",
      url: "/auth/userdata",
      success: (result) => {
        if (!result.isAuth) {
          alert("Unauthorized, Please Login first!")
          Router.push({pathname: "/login"},"/login",{ shallow: true })
        }
        else {
          return setData(val(result))
        }
      },
    })
  }, [])

  //=consequent renders
  useUpdateEffect(() => {
    setCategories(data.categories)
    setTasks(data.tasks)
  },[data])

  useUpdateEffect(() => {
    setopenedCategory(val(categories[0]))
  },[categories])

  //=CheckDateStatus
  useUpdateEffectInterval(()=>{ 
    if(nulled(tasks)) return
    tasks.map((task)=>{
      var currentTaskDateStatus = CheckTimeStatus(new Date(), new Date(task.start_date), new Date(task.end_date))
      if(currentTaskDateStatus!==task.date_status){
        $.ajax({
          type: "POST",
          url: "/task/changetaskdatestatus",
          data: {
            task_id: task.id,
            date_status: currentTaskDateStatus
          },
          success: (result) => {
            setTasks(result.tasks)
          }
        })
      }
    })
  },[tasks],500)
  
  //=Timezone Changed
  useUpdateEffect(()=>{
    if (nulled(tasks)) return
    const clientOffset = TimezoneOffset()
    alert("Detected changes in Location, new Timezone: (UTC"
    +(clientOffset[0]<0?"-":"+")
    +((clientOffset[0]<10&&clientOffset[0]>=0)||(clientOffset[0]>-10&&clientOffset[0]<=0)?"0"
    +Math.abs(clientOffset[0]):(Math.abs(TimeOffset[0])))+":"
    +((clientOffset[1]<10&&clientOffset[1]>=0)||(clientOffset[1]>-10&&clientOffset[1]<=0)?"0"
    +Math.abs(clientOffset[1]):Math.abs(clientOffset[1]))+") at \n'"
    +Intl.DateTimeFormat().resolvedOptions().timeZone
    +"', you may notice some changes.")
    new Promise((resolve)=>{
      tasks.map((task) => {
        if (task !== chosenUpdateTask) return
        setchosenUpdateTask(task)
      })
      resolve()
    }).then(()=>{
      settaskDateStatusIsChanging(true)
    })
  },[clientTimezoneOffset])

  //=check live timezones
  useEffectInterval(()=>{
    if(currentTimezoneOffset.current!==new Date().getTimezoneOffset()){
      currentTimezoneOffset.current=new Date().getTimezoneOffset()
      setclientTimezoneOffset(TimezoneOffset())
    }
  },[],500)

  //=logout form
  const logout = (e) => {
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current=true
    if (window.confirm("Are you sure you want to logout?")) {
      $.ajax({
        type: "GET",
        url: "/auth/logout",
        success: () => {
          Router.push("/login", undefined, { shallow: true })
          return isRunning.current=false
        },error: ()=>{return isRunning.current=false}
      })               
    } else return isRunning.current=false
  }

  //=category form
  const addCategory = (e) => {
    e.preventDefault()
    if(nulled(addCategoryName)) return DOM("#add-category_name").reportValidity
    if(isRunning.current) return
    isRunning.current=true
    setaddCategoryName([])
    setCategories([{
      category_name:addCategoryName,
    },...categories])
    $.ajax({
      type: "POST",
      url: "/category/addcategory",
      data: {
        category_name: addCategoryName
      },
      success: (result) => {
        setCategories(result.categories)
        setopenedCategory(result.categories[0])
        return isRunning.current=false
      },error: ()=>{return isRunning.current=false}
    })
  }

  const updateCategory = (e) => {
    e.preventDefault()
    if(nulled(updateCategoryName)) return DOM("#update-category_name").reportValidity
    if(isRunning.current) return
    isRunning.current=true
    setCategories([{
      category_name: updateCategoryName,
      ...categories
    }])
    closeUpdateCategory()
    $.ajax({
      type: "POST",
      url: "/category/updatecategory",
      data: {
        category_name: updateCategoryName,
        category_id: chosenUpdateCategory.id,
      },
      success: (result) => {
        isRunning.current=false
        setopenedCategory(result.categories[0])
        return setCategories(result.categories)
      },error: ()=>{return isRunning.current=false}
    })
  }

  const deleteCategory = (e) => {
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current=true
    closeAllPopups.current=true
    closeUpdateCategoryAlert()
    if(openedCategory === chosenUpdateCategory)
      setopenedCategory(val(categories[0]))
    setTasks(tasks.filter((task)=>{return task.category_id!==chosenUpdateCategory.id}))
    setCategories(categories.filter((category)=>{return category!==chosenUpdateCategory}))
    $.ajax({
      type: "POST",
      url: "/category/deletecategory",
      data: {
        category_id: chosenUpdateCategory.id,
      },
      success: (result) => {
        isRunning.current=false
        if(nulled(result.categories)) return setopenedCategory([])
        else if(openedCategory === chosenUpdateCategory)
          setopenedCategory(result.categories[0])
        setTasks(result.tasks)
        return setCategories(result.categories)
      },error: ()=>{return isRunning.current=false}
    })
  }
  
  //=category live
  const openCategory = (category) => {
    if(isRunning.current) return
    isRunning.current=true
    const html= DOM("html")
    const catmenu = DOM("#categoriesMenu")
    const topbar = DOM("#top-bar")
    if(DOM("#category-icon").css("display")!=="none") {
      setopenedCategory(category)
      html.css({"overflow":"visible"})
      catmenu.animate({
        transform: `translateY(${-catmenu.height("c")}px)`
      },300,"ease-out",()=>{return isRunning.current=false})
      html.animate({
        scrollTop: DOM("#tasks").offsetTop - topbar.height("cpb","bottom")
      }, 300); 
    } else {
      html.animate({
        scrollTop: DOM("#tasks").offsetTop - topbar.height("cpb","bottom")
      }, 300); 
      setopenedCategory(category)
      return isRunning.current=false
    }
  }

  const openUpdateCategory = (category, e) => {
    e.stopPropagation()
    if(nulled(categories)) return
    categories.map((xcategory) => {
      if (xcategory !== category) return
      setchosenUpdateCategory(category)
      setupdateCategoryIsOpen(true)
    })
  }
  useUpdateEffect(()=>{   
    if(updateCategoryIsOpen && !updateCategoryAlertIsOpen){
      const w = DOM(window)
      const container = DOM("#uc-cp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${-container.width("cpbm","left")}px)`
        },0,()=>{
          container.animate({transform:"translateX(0)"},300)
        })   
      }
      else if(!closeAllPopups.current){
        container.animate({
          transform: `translateY(${container.height("cpbm","bottom")}px)`
        },0,()=>{
          container.animate({transform:"translateY(0)"},300)
        })
      }
    } 
    else if(updateCategoryIsOpen && updateCategoryAlertIsOpen)
      setupdateCategoryAlertIsOpen(false)
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[updateCategoryIsOpen])

  const closeUpdateCategory = () => {
    const container = DOM("#uc-cp-container")
    const w = DOM(window)
    w.outerWidth>w.outerHeight
    if(w.outerWidth>w.outerHeight){//landscape
      container.animate({
        transform: `translateX(${-container.width("cbpm","left")}px)`
      },300,"ease-in",()=>{
        setchosenUpdateCategory([])
        setupdateCategoryIsOpen(false)
      })
    } else {
      container.animate({
        transform: `translateY(${container.height("cpbm","bottom")}px)`
      },300,"ease-in",()=>{
        setchosenUpdateCategory([])
        setupdateCategoryIsOpen(false)
      })
    } 
  }
  
  const openUpdateCategoryAlert = () => {
    setupdateCategoryIsOpen(false)
    setupdateCategoryAlertIsOpen(true)
  }
  useUpdateEffect(()=>{
    if(updateCategoryAlertIsOpen) {
      const element = DOM("#uca-pop-body > *")
      element.animate({
        transform: `translateX(${element.width("cpbm","right")}px)`
      },0,()=>{
        element.animate({transform:"translateX(0)"},300)
      })
    } 
    else if(!closeAllPopups.current) {
      const element = DOM("#uca-pop-body > *")
      element.animate({
        transform: `translateX(${-(element.width("cpbm","left"))}px)`
      },0,()=>{
        element.animate({transform:"translateX(0)"},300)
      })
    }
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[updateCategoryAlertIsOpen])

  const closeUpdateCategoryAlert = () => {
    const container = DOM("#uc-cp-container")
    const w = DOM(window)
    if(closeAllPopups.current) {
      container = DOM(".cp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${-container.width("cpbm","left")}px)`
        },300,"ease-in",()=>{
          setupdateCategoryAlertIsOpen(false)
          setupdateCategoryIsOpen(false)
          setchosenUpdateCategory([])
        })
      } else {
        container.animate({
          transform: `translateY(${container.height("cpbm","bottom")}px)`
        },300,"ease-in",()=>{
          setupdateCategoryAlertIsOpen(false)
          setupdateCategoryIsOpen(false)
          setchosenUpdateCategory([])
        })
      } 
    }
    else setupdateCategoryIsOpen(true)
  }

  //=task form
  const addTask = (e) => {
    if(nulled(addTaskName)){
      return DOM("#add-task_name").reportValidity
    }
    if(nulled(addTaskStartDate)){
      DOM("#add-start_date").setCustomValidity("")
      return DOM("#add-start_date").reportValidity
    }
    if(nulled(addTaskEndDate)){
      DOM("#add-end_date").setCustomValidity("")
      return DOM("#add-end_date").reportValidity
    }
    if(addTaskStartDate>=addTaskEndDate){
      DOM("#add-end_date").setCustomValidity("Start Date should be set before the End Date")
      return DOM("#add-end_date").reportValidity
    }
    if(nulled(addTaskDescription)){
      return DOM("#add-description").reportValidity
    }
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current = true
    // Create Category if None else Update the Category where task is
    if (nulled(categories)||nulled(openCategory)) {
      const newCategory = {id:1, category_name: "No Name"}
      setCategories([newCategory])
      setopenedCategory(newCategory)
    } else {
      setCategories([
        openedCategory,
        ...categories.filter((category)=>{return category!==openedCategory})
      ])
    }
    // Update Tasks by Order
    const start_date = new Date(addTaskStartDate).toJSON()
    const end_date = new Date(addTaskEndDate).toJSON()
    const currentdate = new Date()
    const date_status = CheckTimeStatus(currentdate, new Date(addTaskStartDate), new Date(addTaskEndDate))
    setTasks([// Order by asc end_dates, then recent
      ...tasks.filter(x=>{return (new Date(x.end_date)<new Date(end_date))}),
      {category_id: nulled(categories)||nulled(openedCategory)? 1:openedCategory.id,
      task_name: addTaskName,
      start_date: start_date,
      end_date: end_date,
      description: addTaskDescription,
      date_status: date_status,
      taskisfinished: 0,},
      ...tasks.filter(x=>{return (new Date(x.end_date)>=new Date(end_date))})
    ])
    closeAddTask()
    setaddTaskName([])
    setaddTaskStartDate([])
    setaddTaskEndDate([])
    setaddTaskDescription([])
    $.ajax({
      type: "POST",
      url: "/task/addtask",
      data: {
        task_name: addTaskName,
        start_date: LocalHTMLtoSQL(start_date),
        end_date: LocalHTMLtoSQL(end_date),
        description: addTaskDescription,
        date_status: date_status,
        category_id: openedCategory.id
      },
      success: (result) => {
        isRunning.current=false
        setCategories(result.categories)
        if (result.noCategory)
          setopenedCategory(result.categories[0])
        setTasks(val(result.tasks))
      },error: ()=>{return isRunning.current=false}
    })
  }

  const updateTask = (e) => {
    if(DOM("#update-task_name").val===""){
      return DOM("#update-task_name").reportValidity
    }
    if(DOM("#update-start_date").val===""){
      DOM("#update-start_date").setCustomValidity("")
      return DOM("#update-start_date").reportValidity
    }
    if(DOM("#update-end_date").val===""){
      DOM("#update-end_date").setCustomValidity("")
      return DOM("#update-end_date").reportValidity
    }
    if(DOM("#update-start_date").val>=DOM("#update-end_date").val){
      DOM("#update-end_date").setCustomValidity("Start Date should be set before the End Date")
      return DOM("#update-end_date").reportValidity
    }
    if(DOM("#update-description").val===""){
      return DOM("#update-description").reportValidity
    }
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current = true
    setCategories([
      ...categories.filter((category)=>{return category.id===chosenUpdateTask.category_id}),
      ...categories.filter((category)=>{return category.id!==chosenUpdateTask.category_id})
    ])
    // Check Changed Values
    const task_name = nulled(updateTaskName)? chosenUpdateTask.task_name:updateTaskName
    const start_date = nulled(updateTaskStartDate)? chosenUpdateTask.start_date:new Date(updateTaskStartDate).toJSON()
    const end_date = nulled(updateTaskEndDate)? chosenUpdateTask.end_date:new Date(updateTaskEndDate).toJSON()
    const description = nulled(updateTaskDescription)? chosenUpdateTask.description:updateTaskDescription
    const date_status = CheckTimeStatus(new Date(), new Date(start_date), new Date(end_date))
    setTasks([// Order by asc end_dates, desc id
      ...tasks.filter(x=>{return (new Date(x.end_date)<new Date(end_date))&&(x!==chosenUpdateTask)}),
      {category_id: chosenUpdateTask.category_id,
      task_name: task_name,
      start_date: start_date,
      end_date: end_date,
      description: description,
      date_status: date_status,
      taskisfinished: chosenUpdateTask.taskisfinished},
      ...tasks.filter(x=>{return (new Date(x.end_date)>=new Date(end_date))&&(x!==chosenUpdateTask)})
    ])
    closeUpdateTask()
    setupdateTaskName([])
    setupdateTaskStartDate([])
    setupdateTaskEndDate([])
    setupdateTaskDescription([])
    $.ajax({
      type: "POST",
      url: "/task/updatetask",
      data: {
        task_id: chosenUpdateTask.id,
        category_id: chosenUpdateTask.category_id,
        task_name: task_name,
        start_date: LocalHTMLtoSQL(start_date),
        end_date: LocalHTMLtoSQL(end_date),
        date_status: date_status,
        description: description
      },
      success: (result) => {
        isRunning.current=false
        setchosenUpdateTask(result.newtask)
        setCategories(result.categories)
        return setTasks(result.tasks)
      },error: ()=>{return isRunning.current=false}
    })
  }

  const checkTaskStatus = (e,task) => {
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current = true
    setCategories([
      ...categories.filter((category)=>{return category.id===task.category_id}),
      ...categories.filter((category)=>{return category.id!==task.category_id})
    ])
    // Update Tasks by Order
    setTasks([// Order by asc end_dates, desc id
      ...tasks.filter(x=>{return (new Date(x.end_date)<new Date(task.end_date))&&(x!==task)}),
      {category_id: task.category_id,
      task_name: task.task_name,
      start_date: task.start_date,
      end_date: task.end_date,
      description: task.description,
      date_status: task.date_status,
      taskisfinished: !task.taskisfinished,},
      ...tasks.filter(x=>{return (new Date(x.end_date)>=new Date(task.end_date))&&(x!==task)})
    ])
    $.ajax({
      type: "POST",
      url: "/task/changetaskcompletionstatus",
      data: {
        task_id: task.id
      },
      success: (result) => {
        isRunning.current=false
        setCategories(result.categories)
        setTasks(result.tasks)
        return settaskStatusIsChanging(true)
      },error: ()=>{return isRunning.current=false}
    })
  }

  const deleteTask = (e) => {
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current = true
    const category_id = categories.filter((category)=>{return chosenUpdateTask.category_id===category.id})
    setTasks(tasks.filter((task)=>{return task!==chosenUpdateTask}))
    closeAllPopups.current=true
    closeUpdateTaskAlert()
    closeUpdateTask()
    $.ajax({
      type: "POST",
      url: "/task/deletetask",
      data: {
        task_id: chosenUpdateTask.id,
        category_id: category_id
      },
      success: (result) => {
        isRunning.current=false
        setCategories(result.categories)
        return setTasks(result.tasks)
      },error: ()=>{return isRunning.current=false}
    })
  }

  const deleteAllFinishedTasks = (e) => {
    e.preventDefault()
    if(isRunning.current) return
    isRunning.current = true
    setTasks(tasks.filter((task)=>{return task.taskisfinished!==0}))
    closeAllPopups.current=true
    closedeleteAllFinishedTasksAlert()
    $.ajax({
      type: "POST",
      url: "/task/deleteallfinishedtask",
      success: (result) => {
        isRunning.current=false
        setCategories(result.categories)
        return setTasks(result.tasks)
      },error: ()=>{return isRunning.current=false}
    })
  }

  //=task live
  const openAddTask = () => {
    setaddTaskIsOpen(true)
  }
  useUpdateEffect(()=>{
    if(addTaskIsOpen){
      const w = DOM(window)
      const container = DOM("#at-tp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${container.width("cpbm","right")}px)`
        },0,()=>{
          container.animate({transform:"translateX(0)"},300)
        })
      } else {
        container.animate({
          transform: `translateY(${container.height("cpbm","bottom")}px)`
        },0,()=>{
          container.animate({transform:"translateX(0)"},300)
        })
      }
    }
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[addTaskIsOpen])

  const closeAddTask = () => {
    const container = DOM("#at-tp-container")
    const w = DOM(window)
    if(w.outerWidth>w.outerHeight){//landscape
      container.animate({
        transform: `translateX(${container.width("cpbm","right")}px)`
      },300,"ease-in",()=>{
        setaddTaskIsOpen(false)
      })
    } else {
      container.animate({
        transform: `translateY(${container.height("cpbm","bottom")}px)`
      },300,"ease-in",()=>{
        setaddTaskIsOpen(false)
      })
    } 
  }

  const openUpdateTask = (task, e) => {
    e.stopPropagation()
    if (nulled(tasks)||nulled(categories)) 
      return setopenUpdateTaskIsFromdeleteFinishedTasks(false)
    setchosenUpdateTask(task)
    setupdateTaskIsOpen(true)
  }
  useUpdateEffect(()=>{
    if(updateTaskIsOpen && !updateTaskAlertIsOpen){
      const w = DOM(window)
      const container = DOM("#ut-tp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${container.width("cpbm","right")}px)`
        },0,()=>{
          container.animate({transform:"translateX(0)"},300)
        })
      } else if(!closeAllPopups.current) {
        container.animate({
          transform: `translateY(${container.height("cpbm","bottom")}px)`
        },0,()=>{
          container.animate({transform:"translateY(0)"},300)
        })
      }
    } else if(updateTaskIsOpen && updateTaskAlertIsOpen)
      setupdateTaskAlertIsOpen(false)
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[updateTaskIsOpen])

  const closeUpdateTask = () => {
    const container = DOM("#ut-tp-container")
    const w = DOM(window)
    if(w.outerWidth>w.outerHeight){//landscape
      container.animate({
        transform: `translateX(${container.width("cpbm","right")}px)`
      },300,"ease-in",()=>{
        setupdateTaskIsOpen(false)
        setchosenUpdateTask([])
      })
    } else {
      container.animate({
        transform: `translateY(${container.height("cpbm","bottom")}px)`
      },300,"ease-in",()=>{
        setupdateTaskIsOpen(false)
        setchosenUpdateTask([])
      })
    } 
  }

  const openUpdateTaskAlert = () => {
    setupdateTaskIsOpen(false)
    setupdateTaskAlertIsOpen(true)
  }
  useUpdateEffect(()=>{
    if(updateTaskAlertIsOpen){
      const element = DOM("#uta-pop-body > *")
      element.animate({
        transform: `translateX(${element.width("cpbm","right")}px)`
      },0,()=>{
        element.animate({transform:"translateX(0)"},300)
      })
    } else if(!closeAllPopups.current) {
      const element = DOM("#uta-pop-body > *")
      element.animate({
        transform: `translateX(${-element.width("cpbm","left")}px)`
      },0,()=>{
        element.animate({transform:"translateX(0)"},300)
      })
    }
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[updateTaskAlertIsOpen])

  const closeUpdateTaskAlert = () => {
    const container = DOM("#ut-tp-container")
    const w = DOM(window)
    if(closeAllPopups.current){
      container = DOM(".tp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${container.width("cpmb","right")}px)`
        },300,"ease-in",()=>{
          setupdateTaskAlertIsOpen(false)
          setupdateTaskIsOpen(false)
          setchosenUpdateTask([])
        })
      } else {
        container.animate({
          transform: `translateY(${container.height("cpbm","bottom")}px)`
        },300,"ease-in",()=>{
          setupdateTaskAlertIsOpen(false)
          setupdateTaskIsOpen(false)
          setchosenUpdateTask([])
        })
      } 
    } else setupdateTaskIsOpen(true)
  }

  const opendeleteAllFinishedTasks = (e) => {
    e.stopPropagation();
    setdeleteAllFinishedTasksIsOpen(true)
  }
  useUpdateEffect(()=>{
    if(deleteAllFinishedTasksIsOpen && !deleteAllFinishedTasksAlertIsOpen){
      const w = DOM(window)
      const container = DOM("#daft-tp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${container.width("cpbm","right")}px)`
        },0,()=>{
          container.animate({transform: "translateX(0)"},300)
        })
      } else {
        container.animate({
          transform: `translateY(${container.height("cpmb","bottom")}px)`
        },0,()=>{
          container.animate({transform: "translateY(0)"},300)
        })
      }
    } else if(deleteAllFinishedTasksIsOpen && deleteAllFinishedTasksAlertIsOpen)
      setdeleteAllFinishedTasksAlertIsOpen(false)
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[deleteAllFinishedTasksIsOpen])

  const closedeleteAllFinishedTasks = () => {
    if(openUpdateTaskIsFromdeleteFinishedTasks) 
      setopenUpdateTaskIsFromdeleteFinishedTasks(false)
    const container = DOM("#daft-tp-container")
    const w = DOM(window)
    if(w.outerWidth>w.outerHeight){//landscape
      container.animate({
        transform: `translateX(${container.width("cpbm","right")}px)`
      },300,"ease-in",()=>{
        setdeleteAllFinishedTasksIsOpen(false)
      })
    } else {
     container.animate({
        transform: `translateY(${container.height("cpbm","bottom")}px)`
      },300,"ease-in",()=>{
        setdeleteAllFinishedTasksIsOpen(false)
      })
    } 
  }

  const opendeleteAllFinishedTasksAlert = () => {
    if(nulled(categories)||nulled(tasks)) return alert("There are no Tasks Available to Delete.")
    else if(tasks.filter((task)=>task.taskisfinished===1).length===0) return alert("There are no tasks that have been Finished.")
    else {
      setdeleteAllFinishedTasksIsOpen(false)
      setdeleteAllFinishedTasksAlertIsOpen(true)
    }
  }
  useUpdateEffect(()=>{
    if(deleteAllFinishedTasksAlertIsOpen){
      const element = DOM("#dafta-pop-body>* , #pop-body>*")
      element.animate({
        transform: `translateX(${element.width("cpbm","right")}px)`
      },0,()=>{
        element.animate({transform: "translateX(0)"},300)
      })
    } else if(!closeAllPopups.current){
      const element = DOM("#dafta-pop-body>* , #pop-body>*")
      element.animate({
        transform: `translateX(${-element.width("cpbm","left")}+"px)`
      },0,()=>{
        element.animate({transform: "translateX(0)"},300)
      })
    }
    // Close All Popups
    if(closeAllPopups.current) closeAllPopups.current=false
  },[deleteAllFinishedTasksAlertIsOpen])

  const closedeleteAllFinishedTasksAlert = () => {
    const container = DOM("#daft-tp-container")
    const w = DOM(window)
    if(closeAllPopups.current){
      container = DOM(".tp-container")
      if(w.outerWidth>w.outerHeight){//landscape
        container.animate({
          transform: `translateX(${container.width("cpbm","right")}px)`
        },300,"ease-in",()=>{
          setdeleteAllFinishedTasksAlertIsOpen(false)
          setdeleteAllFinishedTasksIsOpen(false)
        })
      } else {
        container.animate({
          transform: `translateY(${container.height("cpbm","bottom")}+"px)`
        },300,"ease-in",()=>{
          setdeleteAllFinishedTasksAlertIsOpen(false)
          setdeleteAllFinishedTasksIsOpen(false)
        })
      } 
    }
    else setdeleteAllFinishedTasksIsOpen(true)
  }

  const openUpdateTaskFromdeleteFinishedTasks = (task, e) => {
    setdeleteAllFinishedTasksIsOpen(false)
    setopenUpdateTaskIsFromdeleteFinishedTasks(true)
    openUpdateTask(task, e)
  }

  //=animation
  const scrollup = () => {
    const html= DOM("html")
    html.animate({
      scrollTop: (DOM("#dashboard").offsetTop - (DOM("#top-bar").height("cpb")))+"px"
    }, 300);    
  }
  const categoryMenuIcon = () => {
    if (!isRunning.current) {
      isRunning.current=true
      const html = DOM("html")
      const catmenu = DOM("#categoriesMenu")
      if(catmenu.css("transform") !== "matrix(1, 0, 0, 1, 0, 0)") {//check if translateY is 0
        html.css("overflow","hidden")
        catmenu.animate({
          transform: `translateY(${-catmenu.height("c")}px)`
        })
        catmenu.animate({
            transform: "translateY(0)"
          },300,"ease-out",() => {
            return isRunning.current=false
          })
      } else {
        html.css("overflow","visible")
        catmenu.animate({
          transform: `translateY(${-catmenu.height("c")}px)`
        },300,"ease-in",() => {
          catmenu
          return isRunning.current=false
        })
      }
    }
  }
  //=event listeners
  useEffect(()=>{
    if (typeof window !== "undefined") {
      const win = DOM(window)
      const html= DOM("html")
      var oldWinWidth = win.innerWidth
      var newWinWidth = oldWinWidth
      win.on("scroll",() => {
        const dashboardHeight = DOM("#dashboard").height()
        const goupicon = DOM("#go-up")
        if(html.scrollTop > dashboardHeight && goupicon.css("opacity")==="0") 
          return goupicon.show.animate({opacity: "1"},300)
        else if(html.scrollTop < dashboardHeight && goupicon.css("opacity")==="1") 
          return goupicon.animate({opacity:"0"},()=>{
            goupicon.hide
          })
      })
      //Fix Categories menu after resize
      win.on("resize", () => {
        const catmenu = DOM("#categoriesMenu")
        const catupPopup = DOM("#uc-cp-container")
        const inputs = [DOM("#add-category_name"),DOM("#update-category_name")]
        newWinWidth = win.innerWidth
        // Check if Categories Menu is Below in Small Screen or in Use
        const catIsActive = 
          (catmenu.css("transform")==="matrix(1, 0, 0, 1, 0, 0)" && catmenu.width("cpbm")===html.outerWidth)
        const catIsInuse = 
          typeof catupPopup!=="undefined"||
          inputs.some(input=>{
            if(typeof input==="undefined") return false
            else return input.isActive || !nulled(input.val)
          })
        if(win.innerWidth>=785) {
          oldWinWidth=newWinWidth
          catmenu.animate({transform: "translateY(0)"})
          return html.css("overflow","hidden")
        } else if(oldWinWidth>785 && !catIsInuse) {
          oldWinWidth=newWinWidth
          catmenu.animate({transform: `translateY(${-catmenu.height("c")}px)`})
          return html.css("overflow","visible")
        } else if(catIsActive||catIsInuse){
          catmenu.animate({transform: "translateY(0)"})
          html.css("overflow","hidden")
        } else {
          catmenu.animate({transform: `translateY(${-catmenu.height("c")}px)`})
          return html.css("overflow","visible")
        }
      })
      // Change Categories Scroll Max Height
      const catul = DOM("#categoriesul")
      win.on("load", () => {
        return catul.css({"maxHeight": win.outerHeight-catul.offsetTop+"px"})
      })

      win.on("resize", () => {
        return catul.css({"maxHeight": win.outerHeight-catul.offsetTop+"px"})
      }) 
    }
  },[])

  return (
    <>
      <Head>
        <title>GoForIt</title>
      </Head>
      <div className="page">
        <nav className="side-bar">
          <div className="container">
            <img className="logo" src="/icons/favicon.ico" alt="logo" />
            <img onClick={() => {categoryMenuIcon()}} id="category-icon" className="cur-point category-icon" src="/icons/hamburger.svg" alt="categories menu small screen" />
            <img onClick={() => {setaddTaskIsOpen(true)}} className="cur-point logout-icon icon" src="/icons/add task white.svg" alt="add task" />
            <img onClick={() => {setdeleteAllFinishedTasksIsOpen(true)}} className="cur-point logout-icon icon" src="/icons/trash white.svg" alt="delete all finished tasks" />
            <img onClick={e => {logout(e)}} className="icon logout-icon cur-point" src="/icons/logout white.svg" alt="logout"/>
          </div>
        </nav>
        <div className="fixed-top-bar">
          <div className="top-bar-container">
            <nav id="top-bar" className="top-bar">
              <h1>GoForIt</h1>
              <h5>
                {nulled(data.username)? "" : "Hello, "+data.username}
              </h5>
            </nav>
          </div>
        </div>
          <div id="categoriesMenu" className="categories">
            <div className="cur-def add-category">
              <h3>Categories</h3>
              <div className="icon-container-dark">
                <img className="cur-point" onClick={e => {addCategory(e)}} src="/icons/add button black.svg" alt="add category" />
              </div>
            </div>
              <input 
                id="add-category_name"
                value={addCategoryName}
                onChange={e=>setaddCategoryName(e.target.value)} 
                onKeyDown={e => {e.key === "Enter" && addCategory(e)}} placeholder="Add Category" maxLength="35" type="text" required />
            <ul id="categoriesul">
              {nulled(categories) ? (
                <li className="category-empty">
                  <img src="/icons/empty.svg" alt="empty category" />
                  <p>...Whew Empty...</p>
                </li>
              ) : (
                categories.map((category, idx) => {
                  return (
                    <li
                      key={idx}
                      className={"category cur-point " + (openedCategory === category? "category-selected": "")}
                      onClick={() => {
                        openCategory(category)
                      }}
                    >
                      <h5 className="cur-point break-word" type="text">
                        {category.category_name}⠀
                      </h5>
                      <div className="cur-point category-settings" onClick={e => {openUpdateCategory(category, e)}}>
                        <img src="/icons/settings black.svg" alt="category settings" />
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
          <div className="main-contents">
            <div id="tasks" className="tasks">
              <div className="ts-header">
                {nulled(categories) ? (
                  <h3>Tasks</h3>
                ) : (
                  <h3 className="break-word">Tasks: {val(openedCategory.category_name)}</h3>
                )}
                <div className="icon-container-dark">
                  <img className="cur-point" onClick={openAddTask} src="/icons/add button black.svg" alt="add task" />
                </div>
              </div>
              <ul>
                {nulled(categories) || (tasks.filter((task)=>task.category_id===openedCategory.id).length===0)? (
                  <li className="category-empty">
                    <img src="/icons/empty.svg" alt="empty task" />
                    <p>...Whew Empty...</p>
                  </li>
                ) : (
                  tasks.map((task) => {
                    return openedCategory.id === task.category_id ? (
                      <li className={"task "+task.date_status+(task.taskisfinished ? " task-finished" : "")} 
                        key={task.id}>
                        <div className="cur-def ts-title">
                          <div className="cur-def ts-title-1">
                            {taskStatusIsChanging? null: 
                              <input 
                                key={task.id} 
                                defaultChecked={task.taskisfinished} 
                                onChange={e=>checkTaskStatus(e,task)}
                                className="cur-point ts-checkbox" type="checkbox" 
                              />
                            }
                            <h5 className="cur-def ts-name break-word">{task.task_name}</h5>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                            <img src="/icons/settings black.svg" alt="task settings" />
                          </div>
                        </div>
                        <div className="cur-def ts-description">
                          <p className="break-word">{task.description}</p>
                        </div>
                        <div className="ts-date-container">
                          <div className="ts-date">
                            <p>
                              {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                            </p>
                            <p>
                              {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ) : null
                  })
                )}
              </ul>
            </div>
            {/* {{!-- Dashboard --}} */}
            <div id="dashboard" className="dashboard">
              <div className="ts-header">
                <h3>Dashboard</h3>
                <div className="icon-container-dark">
                  <img onClick={e=>opendeleteAllFinishedTasks(e)} className="cur-point trash-icon" src="/icons/trash black.svg" alt="delete finished tasks" />
                </div>
              </div>
              <h5>Missed Tasks</h5>
              <ul className="dashboardul">
                {nulled(tasks)
                  ? null
                  : tasks.map((task, idx) => {
                      return task.date_status === "Missed" ? (
                        <li
                          key={idx}
                          className={
                            "task " +
                            task.date_status +
                            (task.taskisfinished ? " task-finished" : "")
                          }
                        >
                          <div className="ts-title">
                            <div className="ts-title-1">
                              {taskStatusIsChanging? null: 
                                <input 
                                  key={task.id} 
                                  defaultChecked={task.taskisfinished} 
                                  onChange={e=>checkTaskStatus(e,task)}
                                  className="cur-point ts-checkbox" type="checkbox" 
                                />
                              }
                              <h5 className="cur-def ts-name break-word">
                                {task.task_name}
                              </h5>
                            </div>
                            <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                              <img src="/icons/settings black.svg" alt="task settings" />
                            </div>
                          </div>
                          <div className="cur-def ts-description">
                            <p className="break-word">{task.description}</p>
                          </div>
                          <div className="ts-date-container">
                            <div className="ts-date">
                              <p>
                                {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                              </p>
                              <p>
                                {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ) : null
                    })}
              </ul>

              <h5>Ongoing Tasks</h5>
              <ul className="dashboardul">
                {nulled(tasks)
                  ? null
                  : tasks.map((task, idx) => {
                      return task.date_status === "Ongoing" ? (
                        <li key={idx} className={"task "+task.date_status+(task.taskisfinished? " task-finished":"")}>
                          <div className="ts-title">
                            <div className="ts-title-1">
                              {taskStatusIsChanging? null: 
                                <input 
                                  key={task.id} 
                                  defaultChecked={task.taskisfinished} 
                                  onChange={e=>checkTaskStatus(e,task)}
                                  className="cur-point ts-checkbox" type="checkbox" 
                                />
                              }
                              <h5 className="cur-def ts-name break-word">
                                {task.task_name}
                              </h5>
                            </div>
                            <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                              <img src="/icons/settings black.svg" alt="task settings" />
                            </div>
                          </div>
                          <div className="cur-def ts-description">
                            <p className="break-word">{task.description}</p>
                          </div>
                          <div className="ts-date-container">
                            <div className="ts-date">
                              <p>
                                {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                              </p>
                              <p>
                                {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ) : null
                    })}
              </ul>

              <h5>Tasks Soon</h5>
              <ul className="dashboardul">
                {nulled(tasks)
                  ? null
                  : tasks.map((task, idx) => {
                      return task.date_status === "Soon" ? (
                        <li key={idx} className={"task "+task.date_status+(task.taskisfinished? " task-finished":"")}>
                          <div className="ts-title">
                            <div className="ts-title-1">
                              {taskStatusIsChanging? null: 
                                <input 
                                  key={task.id} 
                                  defaultChecked={task.taskisfinished} 
                                  onChange={e=>checkTaskStatus(e,task)}
                                  className="cur-point ts-checkbox" type="checkbox" 
                                />
                              }
                              <h5 className="cur-def ts-name break-word">
                                {task.task_name}
                              </h5>
                            </div>
                            <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                              <img src="/icons/settings black.svg" alt="task settings" />
                            </div>
                          </div>
                          <div className="cur-def ts-description">
                            <p className="break-word">{task.description}</p>
                          </div>
                          <div className="ts-date-container">
                            <div className="ts-date">
                              <p>
                                {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                              </p>
                              <p>
                                {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ) : null
                    })}
              </ul>
            </div>
          </div>
      </div>

      {(!updateCategoryIsOpen && !updateCategoryAlertIsOpen) || nulled(chosenUpdateCategory) ? null : (
        <dialog onMouseDown={e=>{
          e.stopPropagation()
          closeAllPopups.current=true
          updateCategoryIsOpen?closeUpdateCategory():closeUpdateCategoryAlert()
          }} className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} id="uc-cp-container" className="cp-container">
            <div className="pop-header">
              <h3 className="cur-def">{"Edit Category ("+chosenUpdateCategory.category_name+")"}</h3>
              <div onClick={e=>{
                e.stopPropagation()
                closeAllPopups.current=true
                updateCategoryIsOpen?closeUpdateCategory():closeUpdateCategoryAlert()
                }} className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            {!updateCategoryAlertIsOpen ? (
            <>
              <div id="uca-pop-body" className="pop-body">
                <div>
                  <label htmlFor="update-category_name">Category Name</label>
                  <input 
                    onChange={e=>{setupdateCategoryName(e.target.value)}}
                    onKeyDown={e => {e.key === "Enter" && updateCategory(e)}} 
                    defaultValue={chosenUpdateCategory.category_name} id="update-category_name" type="text" placeholder="New Category Name" maxLength="35" required />
                </div>
              </div>
              <div className="pop-btns">
                <button onClick={openUpdateCategoryAlert} className="cur-point pop-btn-delete">Delete</button>
                <button onClick={e=>{updateCategory(e)}}     
                className="cur-point pop-btn-save">Save</button>
              </div>
            </>
            ) : (
            <>
              <div id="uca-pop-body" className="pop-body">
                <h5>
                  Are you sure you want to delete the category 
                  <span style={{ color: "#bd0303" }}>
                  {" "+chosenUpdateCategory.category_name}</span>
                  ? This will permanently
                  <span style={{ color: "#bd0303" }}> delete </span>
                  the tasks that it contains.
                </h5>
              </div>
              <div className="pop-btns">
                <button onClick={e=>{
                  e.stopPropagation()
                  closeUpdateCategoryAlert(false)
                }} className="cur-point pop-btn-cancel">Cancel</button>
                <button onClick={e=>{deleteCategory(e)}}className="cur-point pop-btn-delete">Delete</button>
              </div>
            </>
              )
            }
          </div>
        </dialog>
      )}

      {!addTaskIsOpen ? null : (
        <dialog 
          onMouseDown={closeAddTask} className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} id="at-tp-container" className="tp-container">
            <div className="pop-header">
              <h3>Add Task</h3>
              <div onClick={closeAddTask} className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            <div id="pop-body" className="pop-body">
              <div>
                <label htmlFor="add-task_name">Task Name</label>
                <input 
                  onChange={e=>setaddTaskName(e.target.value)}
                  value={addTaskName}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} 
                  maxLength="40" type="text" id="add-task_name" placeholder="Task Name" required />
              </div>
              <div>
                <label htmlFor="add-start_date">Start Date</label>
                <input 
                  onChange={e=>setaddTaskStartDate(e.target.value)}
                  value={addTaskStartDate}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} type="datetime-local" id="add-start_date" required />
              </div>
              <div>
                <label htmlFor="add-end_date">End Date</label>
                <input 
                  onChange={e=>setaddTaskEndDate(e.target.value)}
                  value={addTaskEndDate}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} type="datetime-local" id="add-end_date" required />
              </div>
              <div>
                <label htmlFor="add-description">Description</label>
                <textarea 
                  onChange={e=>setaddTaskDescription(e.target.value)}   
                  value={addTaskDescription}
                  id="add-description" rows="10" placeholder="Task Description" required >
                </textarea>
              </div>
            </div>
            <div className="pop-btns">
              <button onClick={e=>addTask(e)} className="cur-point pop-btn-save" >
                Add Task
              </button>
            </div>
          </div>
        </dialog>
      )}

      {!updateTaskIsOpen && !updateTaskAlertIsOpen ? null : (
        <dialog onMouseDown={(e)=>{
        e.stopPropagation()
        closeAllPopups.current=true
        if(openUpdateTaskIsFromdeleteFinishedTasks){
          if(updateTaskIsOpen){
            setopenUpdateTaskIsFromdeleteFinishedTasks()
            closeUpdateTask()
            opendeleteAllFinishedTasks(e)
          } else closeUpdateTaskAlert()
        } else updateTaskIsOpen?closeUpdateTask():closeUpdateTaskAlert()
        }} className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} id="ut-tp-container" className="tp-container">
            <div className="pop-header">
              <h3 className="cur-def">{"Edit Task ("+chosenUpdateTask.task_name+")"}</h3>
              <div onClick={(e)=>{
                e.stopPropagation()
                closeAllPopups.current=true
                if(openUpdateTaskIsFromdeleteFinishedTasks){
                  if(updateTaskIsOpen){
                    setopenUpdateTaskIsFromdeleteFinishedTasks()
                    closeUpdateTask()
                    opendeleteAllFinishedTasks(e)
                  } else closeUpdateTaskAlert()
                } else updateTaskIsOpen?closeUpdateTask():closeUpdateTaskAlert()
                }}
                className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            {!updateTaskAlertIsOpen ? (
            <>
              <div id="uta-pop-body" className="pop-body">
                <div>
                  <div>
                    <label htmlFor="update-task_name">Task Name</label>
                    <input 
                    onChange={e=>setupdateTaskName(e.target.value)}
                    defaultValue={chosenUpdateTask.task_name}
                    onKeyDown={e => {
                      if(e.key === "Enter"){
                        if(openUpdateTaskIsFromdeleteFinishedTasks){
                          setopenUpdateTaskIsFromdeleteFinishedTasks()
                          updateTask(e)
                          opendeleteAllFinishedTasks(e)
                        } else 
                          updateTask(e)
                        }
                      }}
                    maxLength="40" id="update-task_name" placeholder="Task Name" type="text" required />
                  </div>
                  <div>
                    <label htmlFor="start_date">Start Date</label>
                    {taskDateStatusIsChanging? null: 
                      <input 
                      onChange={e=>setupdateTaskStartDate(e.target.value)}
                      defaultValue={UTCSQLtoLocalHTML(chosenUpdateTask.start_date)}
                      onKeyDown={e => {
                      if(e.key === "Enter"){
                        if(openUpdateTaskIsFromdeleteFinishedTasks){
                          setopenUpdateTaskIsFromdeleteFinishedTasks()
                          updateTask(e)
                          opendeleteAllFinishedTasks(e)
                        } else 
                          updateTask(e)
                        }
                      }}
                      id="update-start_date" 
                      type="datetime-local" 
                      required />
                    }
                  </div>
                  <div>
                    <label htmlFor="end_date">End Date</label>
                    {taskDateStatusIsChanging? null: 
                      <input 
                      onChange={e=>setupdateTaskEndDate(e.target.value)}
                      defaultValue={UTCSQLtoLocalHTML(chosenUpdateTask.end_date)} 
                      onKeyDown={e => {
                      if(e.key === "Enter"){
                        if(openUpdateTaskIsFromdeleteFinishedTasks){
                          setopenUpdateTaskIsFromdeleteFinishedTasks()
                          updateTask(e)
                          opendeleteAllFinishedTasks(e)
                        } else 
                          updateTask(e)
                        }
                      }}
                      id="update-end_date" 
                      type="datetime-local" 
                      required />
                    }
                  </div>
                  <div>
                    <label htmlFor="update-description">Description</label>
                    <textarea 
                      onChange={e=>setupdateTaskDescription(e.target.value)}
                      defaultValue={chosenUpdateTask.description}
                      id="update-description" placeholder="Task Description" rows="10" required >
                    </textarea>
                  </div>
                </div>
              </div>
              <div className="pop-btns">
                <button onClick={openUpdateTaskAlert} className="cur-point pop-btn-delete">Delete</button>
                <button onClick={e=>{
                if(openUpdateTaskIsFromdeleteFinishedTasks){
                  setopenUpdateTaskIsFromdeleteFinishedTasks()
                  updateTask(e)
                  opendeleteAllFinishedTasks(e)
                } else 
                  updateTask(e)
                }}     
                className="cur-point pop-btn-save">Save</button>
              </div>
            </>
            ) : (
            <>
              <div id="uta-pop-body" className="pop-body">
                <h5 className="cur-def">
                  Are you sure you want to delete the task named
                  <span style={{ color: "#bd0303" }}> 
                    {" "+chosenUpdateTask.task_name} 
                  </span>
                  ? This will permanently
                  <span style={{ color: "#bd0303" }}> delete </span>
                  the item.
                </h5>
              </div>
              <div className="pop-btns">
                <button onClick={e=>{
                  e.stopPropagation()
                  updateTaskIsOpen?closeUpdateTask():closeUpdateTaskAlert()
                }} className="cur-point pop-btn-cancel">Go Back</button>
                <button onClick={e=>{
                if(openUpdateTaskIsFromdeleteFinishedTasks){
                  setopenUpdateTaskIsFromdeleteFinishedTasks()
                  deleteTask(e)
                  opendeleteAllFinishedTasks(e)
                } else 
                  deleteTask(e)
                }}
                className="cur-point pop-btn-delete">Delete</button>
              </div>
            </>
              )
            }
          </div>
        </dialog>
      )}

      {!deleteAllFinishedTasksIsOpen && !deleteAllFinishedTasksAlertIsOpen? null : (  
        <dialog 
        onMouseDown={e=>{
          e.stopPropagation()
          closeAllPopups.current=true
          deleteAllFinishedTasksIsOpen?
            closedeleteAllFinishedTasks() :
            closedeleteAllFinishedTasksAlert()
        }} className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} id="daft-tp-container" className="tp-container">
            <div className="pop-header">
              <h3 className="cur-def">Finished Tasks</h3>
              <div 
              onClick={e=>{
                e.stopPropagation()
                closeAllPopups.current=true
                deleteAllFinishedTasksIsOpen?
                  closedeleteAllFinishedTasks() :
                  closedeleteAllFinishedTasksAlert()
              }} className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            {!deleteAllFinishedTasksAlertIsOpen ? (
            <>
              <div id="pop-body" className="pop-body">
                <ul>
                  {nulled(categories) || (tasks.filter((task)=>task.taskisfinished===1).length===0)? (
                    <li className="category-empty">
                      <img src="/icons/empty.svg" alt="empty task" />
                      <p>...There are no tasks Finished...</p>
                    </li>
                  ) : (
                    tasks.map((task) => {
                      return task.taskisfinished === 1 ? (
                        <li className={"task "+task.date_status+(task.taskisfinished ? " task-finished" : "")} 
                          key={task.id}>
                          <div className="cur-def ts-title">
                            <div className="cur-def ts-title-1">
                              {taskStatusIsChanging? null: 
                                <input 
                                  key={task.id} 
                                  defaultChecked={task.taskisfinished} 
                                  onChange={e=>checkTaskStatus(e,task)}
                                  className="cur-point ts-checkbox" type="checkbox" 
                                />
                              }
                              <h5 className="cur-def ts-name break-word">{task.task_name}</h5>
                            </div>
                            <div key={task.id} onClick={e=>openUpdateTaskFromdeleteFinishedTasks(task,e)} className="cur-point task-settings" >
                              <img src="/icons/settings black.svg" alt="task settings" />
                            </div>
                          </div>
                          <div className="cur-def ts-description">
                            <p className="break-word">{task.description}</p>
                          </div>
                          <div className="ts-date-container">
                            <div className="ts-date">
                              <p>
                                {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                              </p>
                              <p>
                                {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ) : null
                    })
                  )}
                </ul>
              </div>
              <div className="pop-btns">
                <button onClick={opendeleteAllFinishedTasksAlert} className="cur-point pop-btn-delete">Delete</button>
                <button onClick={e=>{
                  e.stopPropagation()
                  closedeleteAllFinishedTasks()
                }} className="cur-point pop-btn-cancel">Cancel</button>
              </div>
            </>
            ) : (
            <>
              <div id="dafta-pop-body" className="pop-body">
                <h5 className="cur-def">
                  Are you sure you want to delete all of your finished tasks? This will permanently
                  <span style={{ color: "#bd0303" }}> delete </span>
                  the all of the selected items.
                </h5>
              </div>
              <div className="pop-btns">
                <button onClick={e=>{
                  e.stopPropagation()
                  closedeleteAllFinishedTasksAlert()
                }} className="cur-point pop-btn-cancel">Go Back</button>
                <button onClick={e=>deleteAllFinishedTasks(e)} className="cur-point pop-btn-delete">Delete</button>
              </div>
            </>
              )
            }
          </div>
        </dialog>  
      )}
    <div id="go-up" className="goup-icon">
      <div className="icon-container-black">
        <img onClick={() => {scrollup()}}  src="/icons/scroll up white.svg" alt="scroll up" />
      </div>
    </div>
    </>
  )
}