import Head from "next/head"
import Router from "next/router"
import $ from "jquery"

import { useState, useEffect, useRef } from "react"
import useUpdateEffect from "./render script/useUpdateEffect"
import useEffectInterval from "./render script/useEffectInterval"
import useUpdateEffectInterval from "./render script/useUpdateEffectInterval"

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
    const [deleteFinishedTasksIsOpen, setdeleteFinishedTasksIsOpen] = useState(false)
    const [deleteFinishedTasksAlertIsOpen, setdeleteFinishedTasksAlertIsOpen] = useState(false)
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
  const currentTimezoneOffset = useRef(new Date().getTimezoneOffset())
    //helper functions
    const Nulled = (v) => {return typeof v === "undefined" ? true : v === null ? true : v.length === 0}
    const totalSize = (v,position) => {return (
      ((position==="Left"||position==="Right")?v.width():v.height())+
      (Nulled(v.css("margin"+position))?0:parseFloat(v.css("margin"+position)))+
      (Nulled(v.css("padding"+position))?0:parseFloat(v.css("padding"+position)))+
      (Nulled(v.css("border"+position))?0:parseFloat(v.css("border"+position)))
    )}
    const val = (v) => {return Nulled(v)?[]:v}

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
    if(Nulled(tasks)) return
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
    if (Nulled(tasks)) return
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
    if (!isRunning.current) {
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
  }

  //=category form
  const addCategory = (e) => {
    e.preventDefault()
    if(Nulled(addCategoryName)) return $("#add-category_name").get(0).reportValidity()
    if (!isRunning.current) {
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
  }

  const updateCategory = (e) => {
    e.preventDefault()
    if(Nulled(updateCategoryName)) return $("#update-category_name").get(0).reportValidity()
    if (!isRunning.current) {
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
  }

  const deleteCategory = (e) => {
    e.preventDefault()
    if (!isRunning.current) {
      isRunning.current=true
      closeUpdateCategoryAlert()
      closeUpdateCategory()
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
          if(Nulled(result.categories)) return setopenedCategory([])
          else if(openedCategory === chosenUpdateCategory)
            setopenedCategory(result.categories[0])
          setTasks(result.tasks)
          return setCategories(result.categories)
        },error: ()=>{return isRunning.current=false}
      })
    }
  }
  
  //=category live
  const openCategory = (category) => {
    if (!isRunning.current) {
      isRunning.current=true
      const catmenu = $("#categoriesMenu")
      if($("#category-icon").css("display")!=="none") {
        setopenedCategory(category)
        $("body").css({"overflow":"visible"})
        catmenu.animate({
          top: "-=" + catmenu.css("height"),
        },100,() => {
          catmenu.hide(() => {
            $("#tasks")[0].scrollIntoView()
            const scrolledY = window.scrollY
            if(scrolledY) window.scroll(0, scrolledY - $("#top-bar").height())
            return isRunning.current=false
          })
        })
      } else {
        setopenedCategory(category)
        return isRunning.current=false
      }
    }
  }

  const openUpdateCategory = (category, e) => {
    e.stopPropagation()
    if (Nulled(categories)) return
    categories.map((xcategory) => {
      if (xcategory !== category) return
      setchosenUpdateCategory(category)
      setupdateCategoryIsOpen(true)
    })
  }
  useUpdateEffect(()=>{
    const container = $(".cp-container")
    if(updateCategoryIsOpen && !updateCategoryAlertIsOpen){
      if($("html").width()>$("html").height()){//landscape
        container.css({
          "left":-(totalSize(container,"Left"))
        })
        container.show().animate({"left":0},250,"swing")
      }
      else {
        container.css({
          "bottom":-(totalSize(container,"Bottom"))
        })
        container.show().animate({"bottom":0},250,"swing")
      }
    } else if(updateCategoryIsOpen && updateCategoryAlertIsOpen){
      setupdateCategoryAlertIsOpen(false)
    }
  },[updateCategoryIsOpen])

  const closeUpdateCategory = () => {
    const container = $(".cp-container")
    if($("html").width()>$("html").height()){//landscape
      container.animate({
        "left":-(totalSize(container,"Left"))
      },250,"swing",()=>{
        container.hide()
        setchosenUpdateCategory([])
        setupdateCategoryIsOpen(false)
      })
    } else {
      container.animate({
        "bottom":-(totalSize(container,"Bottom"))
      },250,"swing",()=>{
        container.hide()
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
    const contained = $(".pop-body")
    const element = $(".pop-body > *")
    if(updateCategoryAlertIsOpen){
      contained.css({
        "overflow":"hidden"
      })
      element.animate({
        "right":-(totalSize(element,"Right"))
      },0)
      element.show().animate({
        "right":0
      },250,"swing",()=>{
        contained.css({
          "overflow":"auto"
        })
      })
    } else {
      contained.css({
        "overflow":"hidden"
      })
      element.animate({
        "left":-(totalSize(element,"Left"))
      },0)
      element.show().animate({
        "left":0
      },250,"swing",()=>{
        contained.css({
          "overflow":"auto"
        })
      })
    }
  },[updateCategoryAlertIsOpen])

  const closeUpdateCategoryAlert = () => {
    setupdateCategoryIsOpen(true)
  }

  //=task form
  const addTask = (e) => {
    if(Nulled(addTaskName)){
      return $("#add-task_name").get(0).reportValidity()
    }
    if(Nulled(addTaskStartDate)){
      $("#add-start_date").get(0).setCustomValidity("")
      return $("#add-start_date").get(0).reportValidity()
    }
    if(Nulled(addTaskEndDate)){
      $("#add-end_date").get(0).setCustomValidity("")
      return $("#add-end_date").get(0).reportValidity()
    }
    if(Nulled(addTaskDescription)){
      return $("#add-description").get(0).reportValidity()
    }
    if(addTaskStartDate>=addTaskEndDate){
      $("#add-end_date").get(0).setCustomValidity("Start Date should be set before the End Date")
      return $("#add-end_date").get(0).reportValidity()
    }
    e.preventDefault()
    if (!isRunning.current) {
      isRunning.current=true
      // Create Category if None else Update the Category where task is
      if (Nulled(categories)||Nulled(openCategory)) {
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
        {category_id: Nulled(categories)||Nulled(openedCategory)? 1:openedCategory.id,
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
  }

  const updateTask = (e) => {
    if($("#update-task_name").val()===""){
      return $("#update-task_name").get(0).reportValidity()
    }
    if($("#update-start_date").val()===""){
      $("#update-start_date").get(0).setCustomValidity("")
      return $("#update-start_date").get(0).reportValidity()
    }
    if($("#update-end_date").val()===""){
      $("#update-end_date").get(0).setCustomValidity("")
      return $("#update-end_date").get(0).reportValidity()
    }
    if($("#update-description").val()===""){
      return $("#update-description").get(0).reportValidity()
    }
    if($("#update-start_date").val()>=$("#update-end_date").val()){
      $("#update-end_date").get(0).setCustomValidity("Start Date should be set before the End Date")
      return $("#update-end_date").get(0).reportValidity()
    }
    e.preventDefault()
    if (!isRunning.current) {      
      isRunning.current=true
      setCategories([
        ...categories.filter((category)=>{return category.id===chosenUpdateTask.category_id}),
        ...categories.filter((category)=>{return category.id!==chosenUpdateTask.category_id})
      ])
      // Check Changed Values
      const task_name = Nulled(updateTaskName)? chosenUpdateTask.task_name:updateTaskName
      const start_date = Nulled(updateTaskStartDate)? chosenUpdateTask.start_date:new Date(updateTaskStartDate).toJSON()
      const end_date = Nulled(updateTaskEndDate)? chosenUpdateTask.end_date:new Date(updateTaskEndDate).toJSON()
      const description = Nulled(updateTaskDescription)? chosenUpdateTask.description:updateTaskDescription
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
  }

  const checkTaskStatus = (e,task) => {
    e.preventDefault()
    if (!isRunning.current) {
      isRunning.current=true
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
  }

  const deleteTask = (e) => {
    e.preventDefault()
    if (!isRunning.current) {
      isRunning.current=true
      const category_id = categories.filter((category)=>{return chosenUpdateTask.category_id===category.id})
      setTasks(tasks.filter((task)=>{return task!==chosenUpdateTask}))
      closeUpdateTaskAlert()
      closeUpdateTask()
      // setchosenUpdateTask([])
      $.ajax({
        type: "POST",
        url: "/task/deletetask",
        data: {
          task_id: chosenUpdateTask.id,
          category_id: category_id
        },
        success: (result) => {
          isRunning.current=false
          console.log(result.tasks)
          setCategories(result.categories)
          return setTasks(result.tasks)
        },error: ()=>{return isRunning.current=false}
      })
    }
  }
  useUpdateEffect(()=>{
    console.log(chosenUpdateTask)
  },[chosenUpdateTask])

  const deleteAllFinishedTasks = (e) => {
    e.preventDefault()
    if (!isRunning.current) {
      isRunning.current=true
      setTasks(tasks.filter((task)=>{return task.taskisfinished!==0}))
      closedeleteAllFinishedTasksAlert()
      closedeleteAllFinishedTasks()
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
  }

  //=task live
  const openAddTask = () => {
    setaddTaskIsOpen(true)
  }
  useUpdateEffect(()=>{
    const container = $(".tp-container")
    if(addTaskIsOpen){
      if($("html").width()>$("html").height()){//landscape
        container.css({
          "right":-(totalSize(container,"Right"))
        })
        container.show().animate({"right":0},250,"swing")
      }
      else {
        container.css({
          "bottom":-(totalSize(container,"Bottom"))
        })
        container.show().animate({"bottom":0},250,"swing")
      }
    }
  },[addTaskIsOpen])

  const closeAddTask = () => {
    const container = $(".tp-container")
    if($("html").width()>$("html").height()){//landscape
      container.animate({
        "right":-(totalSize(container,"Right"))
      },250,"swing",()=>{
        container.hide()
        setaddTaskIsOpen(false)
      })
    } else {
      container.animate({
        "bottom":-(totalSize(container,"Bottom"))
      },250,"swing",()=>{
        container.hide()
        setaddTaskIsOpen(false)
      })
    } 
  }

  const openUpdateTask = (task, e) => {
    e.stopPropagation()
    if (Nulled(tasks)||Nulled(categories)) return setopenUpdateTaskIsFromdeleteFinishedTasks(false)
    setchosenUpdateTask(task)
    setupdateTaskIsOpen(true)
  }
  useUpdateEffect(()=>{
    const container = $(".tp-container")
    if(updateTaskIsOpen && !updateTaskAlertIsOpen){
      if($("html").width()>$("html").height()){//landscape
        container.css({
          "right":-(totalSize(container,"Right"))
        })
        container.show().animate({"right":0},250,"swing")
      }
      else {
        container.css({
          "bottom":-(totalSize(container,"Bottom"))
        })
        container.show().animate({"bottom":0},250,"swing")
      }
    } else if(updateTaskIsOpen && updateTaskAlertIsOpen){
      setupdateTaskAlertIsOpen(false)
    }
  },[updateTaskIsOpen])

  const closeUpdateTask = () => {
    const container = $(".tp-container")
    if($("html").width()>$("html").height()){//landscape
      container.animate({
        "right":-(totalSize(container,"Right"))
      },250,"swing",()=>{
        container.hide()
        setupdateTaskIsOpen(false)
        setchosenUpdateTask([])
      })
    } else {
      container.animate({
        "bottom":-(totalSize(container,"Bottom"))
      },250,"swing",()=>{
        container.hide()
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
    const contained = $(".pop-body")
    const element = $(".pop-body > *")
    if(updateTaskAlertIsOpen){
      contained.css({
        "overflow":"hidden"
      })
      element.animate({
        "right":-(totalSize(element,"Right"))
      },0)
      element.show().animate({
        "right":0
      },250,"swing",()=>{
        contained.css({
          "overflow":"auto"
        })
      })
    } else {
      contained.css({
        "overflow":"hidden"
      })
      element.animate({
        "left":-(totalSize(element,"Left"))
      },0)
      element.show().animate({
        "left":0
      },250,"swing",()=>{
        contained.css({
          "overflow":"auto"
        })
      })
    }
  },[updateTaskAlertIsOpen])

  const closeUpdateTaskAlert = () => {
    setupdateTaskIsOpen(true)
  }

  const opendeleteFinishedTasks = () => {
    setdeleteFinishedTasksIsOpen(true)
  }
  useUpdateEffect(()=>{
    const container = $(".tp-container")
    if(deleteFinishedTasksIsOpen && !deleteFinishedTasksAlertIsOpen){
      if($("html").width()>$("html").height()){//landscape
        container.css({
          "right":-(totalSize(container,"Right"))
        })
        container.show().animate({"right":0},250,"swing")
      }
      else {
        container.css({
          "bottom":-(totalSize(container,"Bottom"))
        })
        container.show().animate({"bottom":0},250,"swing")
      }
    } else if(deleteFinishedTasksIsOpen && deleteFinishedTasksAlertIsOpen){
      setdeleteFinishedTasksAlertIsOpen(false)
    }
  },[deleteFinishedTasksIsOpen])

  const closedeleteAllFinishedTasks = () => {
    if(openUpdateTaskIsFromdeleteFinishedTasks) 
      setopenUpdateTaskIsFromdeleteFinishedTasks(false)
    const container = $(".tp-container")
    if($("html").width()>$("html").height()){//landscape
      container.animate({
        "right":-(totalSize(container,"Right"))
      },250,"swing",()=>{
        container.hide()
        setdeleteFinishedTasksIsOpen(false)
      })
    } else {
      container.animate({
        "bottom":-(totalSize(container,"Bottom"))
      },250,"swing",()=>{
        container.hide()
        setdeleteFinishedTasksIsOpen(false)
      })
    } 
  }

  const opendeleteFinishedTasksAlert = () => {
    setdeleteFinishedTasksIsOpen(false)
    setdeleteFinishedTasksAlertIsOpen(true)
  }
  useUpdateEffect(()=>{
    const contained = $(".pop-body")
    const element = $(".pop-body > *")
    if(deleteFinishedTasksAlertIsOpen){
      contained.css({
        "overflow":"hidden"
      })
      element.animate({
        "right":-(totalSize(element,"Right"))
      },0)
      element.show().animate({
        "right":0
      },250,"swing",()=>{
        contained.css({
          "overflow":"auto"
        })
      })
    } else {
      contained.css({
        "overflow":"hidden"
      })
      element.animate({
        "left":-(totalSize(element,"Left"))
      },0)
      element.show().animate({
        "left":0
      },250,"swing",()=>{
        contained.css({
          "overflow":"auto"
        })
      })
    }
  },[deleteFinishedTasksAlertIsOpen])

  const closedeleteAllFinishedTasksAlert = () => {
    setdeleteFinishedTasksIsOpen(true)
  }

  const openUpdateTaskFromdeleteFinishedTasks = (task, e) => {
    setdeleteFinishedTasksIsOpen(false)
    setopenUpdateTaskIsFromdeleteFinishedTasks(true)
    openUpdateTask(task, e)
  }

  //=animation
  const scrollup = () => {
    $("html, body").animate({
        scrollTop: $("#dashboard").offset().top - ($("#top-bar").height())
    }, 250, "swing");    
  }
  const categoryMenuIcon = () => {
    if (!isRunning.current) {
      isRunning.current=true
      const catmenu = $("#categoriesMenu")
      if(catmenu.css("display") === "none") {
        $('body').css({"overflow":"hidden"})
        catmenu.css({top: -catmenu.height()})// return on top
        catmenu.show().animate({
          top: "+=" + catmenu.height(),
        },250,"swing",() => {
          return isRunning.current=false
        })
      } else {
        $('body').css('overflow','visible')
        catmenu.animate({
          top: "-=" + catmenu.height(),
        },250,"swing",() => {
          catmenu.hide(() => {
            return isRunning.current=false
          })
        })
      }
    }
  }
  //=event listeners
  useEffect(()=>{
    if (typeof window !== "undefined") {
      $(window).on("scroll",() => {
        const dashboardHeight = $("#dashboard").height()
        const goupicon = $("#go-up")
        console.log($("html").scrollTop() > dashboardHeight)
        if($("html").scrollTop() > dashboardHeight && goupicon.css("opacity")==="0") 
          goupicon.show().fadeTo(250,1,"swing")
        else if($("html").scrollTop() < dashboardHeight && goupicon.css("opacity")==="1") 
          goupicon.fadeTo(250,0,"swing",()=>goupicon.hide())
      })
      //Fix Categories menu after resize
      $(window).on("resize", () => {
        const catmenu = $("#categoriesMenu")
        const cataddinput = $("#add-category_name")
        const catupdateinput = $("#update-category_name")
        const catIsActive = 
          cataddinput.is(":focus") || 
          catupdateinput.is(":focus") ||
          !Nulled(cataddinput.val()) ||
          !Nulled(catupdateinput.val())
        if($("body").width()>=785) 
          catmenu.css("top","").show()
        else if(catIsActive && $("body").width()<785) return
        else catmenu.css("top",-catmenu.height()).hide()
      })
      // Change Categories Scroll Max Height
      $(window).on("load", () => {
        return $("#categoriesul").css({"maxHeight":$("body").height() - 136 + "px"})
      })

      $(window).on("resize", () => {
        return $("#categoriesul").css({"maxHeight":$("body").height() - 136 + "px"})
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
            <img onClick={e => {logout(e)}} className="icon logout-icon cur-point" src="/icons/logout white.svg" alt="logout"/>
          </div>
        </nav>
        <div className="fixed-top-bar">
          <div className="top-bar-container">
            <nav id="top-bar" className="top-bar">
              <h1>GoForIt</h1>
              <h5>
                {Nulled(data.username)? "" : "Hello, "+data.username}
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
              {Nulled(categories) ? (
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
                {Nulled(categories) ? (
                  <h3>Tasks</h3>
                ) : (
                  <h3 className="break-word">Tasks: {val(openedCategory.category_name)}</h3>
                )}
                <div className="icon-container-dark">
                  <img className="cur-point" onClick={openAddTask} src="/icons/add button black.svg" alt="add task" />
                </div>
              </div>
              <ul>
                {Nulled(categories) || (tasks.filter((task)=>task.category_id===openedCategory.id).length===0)? (
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
                            <h5 className="cur-def ts-name break-word">⠀{task.task_name}</h5>
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
                  <img onClick={opendeleteFinishedTasks} className="cur-point trash-icon" src="/icons/trash black.svg" alt="delete finished tasks" />
                </div>
              </div>
              <h5>Missed Tasks</h5>
              <ul className="dashboardul">
                {Nulled(tasks)
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
                                ⠀{task.task_name}
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
                {Nulled(tasks)
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
                                ⠀{task.task_name}
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
                {Nulled(tasks)
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
                                ⠀{task.task_name}
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

      {(!updateCategoryIsOpen && !updateCategoryAlertIsOpen) || Nulled(chosenUpdateCategory) ? null : (
        <dialog onMouseDown={updateCategoryIsOpen?closeUpdateCategory:closeUpdateCategoryAlert} id="TPS" className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} className="cp-container">
            <div className="pop-header">
              <h3 className="cur-def">{"Edit Category ("+chosenUpdateCategory.category_name+")"}</h3>
              <div onClick={updateCategoryIsOpen?closeUpdateCategory:closeUpdateCategoryAlert} className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            {!updateCategoryAlertIsOpen ? (
            <>
              <div className="pop-body">
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
              <div className="pop-body">
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
                <button onClick={closeUpdateCategoryAlert} className="cur-point pop-btn-cancel">Cancel</button>
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
          onMouseDown={closeAddTask}
          id="ATP" className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} className="tp-container">
            <div className="pop-header">
              <h3>Add Task</h3>
              <div onClick={closeAddTask} className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            <div className="pop-body">
              <div>
                <label htmlFor="add-task_name">Task Name</label>
                <input 
                  onChange={e=>setaddTaskName(e.target.value)}
                  value={addTaskName}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} type="text" id="add-task_name" placeholder="Task Name" required />
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
        <dialog onMouseDown={()=>{
        if(openUpdateTaskIsFromdeleteFinishedTasks){
          if(updateTaskIsOpen){
            setopenUpdateTaskIsFromdeleteFinishedTasks(false)
            closeUpdateTask()
            opendeleteFinishedTasks()
          } else closeUpdateTaskAlert()
        } else updateTaskIsOpen?closeUpdateTask():closeUpdateTaskAlert()
        }}
        id="TPS" className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} className="tp-container">
            <div className="pop-header">
              <h3 className="cur-def">{"Edit Task ("+chosenUpdateTask.task_name+")"}</h3>
              <div onClick={()=>{
                if(openUpdateTaskIsFromdeleteFinishedTasks){
                  if(updateTaskIsOpen){
                    setopenUpdateTaskIsFromdeleteFinishedTasks(false)
                    closeUpdateTask()
                    opendeleteFinishedTasks()
                  } else closeUpdateTaskAlert()
                } else updateTaskIsOpen?closeUpdateTask():closeUpdateTaskAlert()
                }}
                className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            {!updateTaskAlertIsOpen ? (
            <>
              <div id="updateTask" className="pop-body">
                <div>
                  <label htmlFor="update-task_name">Task Name</label>
                  <input 
                  onChange={e=>setupdateTaskName(e.target.value)}
                  defaultValue={chosenUpdateTask.task_name}
                  onKeyDown={e => {
                    if(e.key === "Enter"){
                      if(openUpdateTaskIsFromdeleteFinishedTasks){
                        setopenUpdateTaskIsFromdeleteFinishedTasks(false)
                        updateTask(e)
                        opendeleteFinishedTasks()
                      } else 
                        updateTask(e)
                      }
                    }}
                  id="update-task_name" placeholder="Task Name" type="text" required />
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
                        setopenUpdateTaskIsFromdeleteFinishedTasks(false)
                        updateTask(e)
                        opendeleteFinishedTasks()
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
                        setopenUpdateTaskIsFromdeleteFinishedTasks(false)
                        updateTask(e)
                        opendeleteFinishedTasks()
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
              <div className="pop-btns">
                <button onClick={openUpdateTaskAlert} className="cur-point pop-btn-delete">Delete</button>
                <button onClick={e=>{
                if(openUpdateTaskIsFromdeleteFinishedTasks){
                  setopenUpdateTaskIsFromdeleteFinishedTasks(false)
                  updateTask(e)
                  opendeleteFinishedTasks()
                } else 
                  updateTask(e)
                }}     
                className="cur-point pop-btn-save">Save</button>
              </div>
            </>
            ) : (
            <>
              <div className="pop-body">
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
                <button onClick={closeUpdateTaskAlert} className="cur-point pop-btn-cancel">Cancel</button>
                <button onClick={e=>{
                if(openUpdateTaskIsFromdeleteFinishedTasks){
                  setopenUpdateTaskIsFromdeleteFinishedTasks(false)
                  deleteTask(e)
                  opendeleteFinishedTasks()
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

      {!deleteFinishedTasksIsOpen && !deleteFinishedTasksAlertIsOpen? null : (  
        <dialog 
        onMouseDown={deleteFinishedTasksIsOpen?closedeleteAllFinishedTasks:closedeleteAllFinishedTasksAlert}
        id="TPS" className="add-edit-popup">
          <div onMouseDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} className="tp-container">
            <div className="pop-header">
              <h3 className="cur-def">Finished Tasks</h3>
              <div onClick={closedeleteAllFinishedTasks} className="cur-point xclose-pop">
                <img src="/icons/xclose-black.svg" alt="close add task popup" />
              </div>
            </div>
            {!deleteFinishedTasksAlertIsOpen ? (
            <>
              <div className="pop-body">
                <ul>
                  {Nulled(categories) || (tasks.filter((task)=>task.taskisfinished===1).length===0)? (
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
                              <h5 className="cur-def ts-name break-word">⠀{task.task_name}</h5>
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
                <button onClick={closedeleteAllFinishedTasks} className="cur-point pop-btn-cancel">Cancel</button>
                <button onClick={opendeleteFinishedTasksAlert} className="cur-point pop-btn-delete">Delete</button>
              </div>
            </>
            ) : (
            <>
              <div className="pop-body">
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
                <button onClick={e=>deleteAllFinishedTasks(e)} className="cur-point pop-btn-delete">Delete</button>
                <button onClick={closedeleteAllFinishedTasksAlert} className="cur-point pop-btn-cancel">Go Back</button>
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