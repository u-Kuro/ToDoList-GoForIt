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
    const [deleteFinishedTasksAlertIsOpen, setdeleteFinishedTasksAlertIsOpen] = useState(false)

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
    const Nulled = (v) => {
      return typeof v === "undefined" ? true : v === null ? true : v.length === 0
    }
    const El = (id)=>{return document.getElementById(id)}
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
      // console.log(new Date(), UTCtoLocal(task.start_date), UTCtoLocal(task.end_date))
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
      $.ajax({
        type: "GET",
        url: "/auth/logout",
        success: () => {
          Router.push("/login", undefined, { shallow: true })
          return isRunning.current=false
        },error: ()=>{return isRunning.current.current=false}
      })
    }
  }

  //=category form
  const addCategory = (e) => {
    e.preventDefault()
    if(Nulled(addCategoryName)) return El("add-category_name").reportValidity()
    if (!isRunning.current) {
      isRunning.current=true
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
          setaddCategoryName([])
          setCategories(result.categories)
          setopenedCategory(result.categories[0])
          return isRunning.current=false
        },error: ()=>{return isRunning.current=false}
      })
    }
  }

  const updateCategory = (e) => {
    e.preventDefault()
    if(Nulled(updateCategoryName)) return El("update-category_name").reportValidity()
    if (!isRunning.current) {
      isRunning.current=true
      setCategories([{
        category_name: updateCategoryName,
        ...categories
      }])
      setupdateCategoryIsOpen(false)
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
      setupdateCategoryIsOpen(false)
      setupdateCategoryAlertIsOpen(false)
      if(openedCategory === chosenUpdateCategory)
        setopenedCategory(val(categories[0]))
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
          return setCategories(result.categories)
        },error: ()=>{return isRunning.current=false}
      })
    }
  }
  
  //=category live
  const openCategory = (category) => {
    if (!isRunning.current) {
      isRunning.current=true
      if ($("#categoriesMenu").css("position") == "fixed"){
        setopenedCategory(category)
        if ($("#categoriesMenu").css("display") == "none") {
        $("#categoriesMenu").css({
          top: "-" + $("#categoriesMenu").css("height"),
        })
        $("#categoriesMenu").show().animate({
          top: "+=" + $("#categoriesMenu").css("height"),
        },100,() => {
          return isRunning.current=false
        })
        } else {
          $("#categoriesMenu").animate({
            top: "-=" + $("#categoriesMenu").css("height"),
          },100,() => {
            $("#categoriesMenu").hide(() => {
              return isRunning.current=false
            })
          })
        }
      } else {
        setopenedCategory(category)
        return isRunning.current=false
      }
    }
  }

  const openUpdateCategory = (id, e) => {
    e.stopPropagation()
    if (Nulled(categories)) return
    categories.map((category) => {
      if (category.id !== id) return
      setchosenUpdateCategory(category)
      setupdateCategoryIsOpen(true)
    })
  }

  const closeUpdateCategory = () => {
    setchosenUpdateCategory([])
    setupdateCategoryIsOpen(false)
  }

  const openUpdateCategoryAlert = () => {
    setupdateCategoryIsOpen(false)
    setupdateCategoryAlertIsOpen(true)
  }

  const closeUpdateCategoryAlert = () => {
    setupdateCategoryIsOpen(true)
    setupdateCategoryAlertIsOpen(false)
  }

  //=task form
  const addTask = (e) => {
    if(Nulled(addTaskName)){
      return El("add-task_name").reportValidity()
    }
    if(Nulled(addTaskStartDate)){
      El("add-start_date").setCustomValidity("")
      return El("add-start_date").reportValidity()
    }
    if(Nulled(addTaskEndDate)){
      El("add-end_date").setCustomValidity("")
      return El("add-end_date").reportValidity()
    }
    if(Nulled(addTaskDescription)){
      return El("add-description").reportValidity()
    }
    if(addTaskStartDate>=addTaskEndDate){
      El("add-end_date").setCustomValidity("Start Date should be set before the End Date")
      return El("add-end_date").reportValidity()
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
      setaddTaskIsOpen(false)
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
    if(El("update-task_name").value===""){
      return El("update-task_name").reportValidity()
    }
    if(El("update-start_date").value===""){
      El("update-start_date").setCustomValidity("")
      return El("update-start_date").reportValidity()
    }
    if(El("update-end_date").value===""){
      El("update-end_date").setCustomValidity("")
      return El("update-end_date").reportValidity()
    }
    if(El("update-description").value===""){
      return El("update-description").reportValidity()
    }
    if(El("update-start_date").value>=El("update-end_date").value){
      El("update-end_date").setCustomValidity("Start Date should be set before the End Date")
      return El("update-end_date").reportValidity()
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
      setupdateTaskIsOpen(false)
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

  useUpdateEffect(()=>{
    console.log(tasks)
  },[tasks])

  // useUpdateEffect(()=>{
  //   console.log(categories)
  // },[categories])

  const checkTaskStatus = (e,task) => {
    e.preventDefault()
    console.log(task)
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
      setTasks(tasks.filter((task)=>{return task!==chosenUpdateTask}))
      setupdateTaskIsOpen(false)
      setupdateTaskAlertIsOpen(false)
      setchosenUpdateTask([])
      $.ajax({
        type: "POST",
        url: "/task/deletetask",
        data: {
          task_id: chosenUpdateTask.id,
          category_id: openedCategory.id
        },
        success: (result) => {
          setupdateTaskIsOpen(false)
          setupdateTaskAlertIsOpen(false)
          setchosenUpdateTask([])
          isRunning.current=false
          setCategories(result.categories)
          return setTasks(result.tasks)
        },error: ()=>{return isRunning.current=false}
      })
    }
  }

  const deleteAllFinishedTasks = (e) => {
    e.preventDefault()
    if (!isRunning.current) {
      isRunning.current=true
      setTasks(tasks.filter((task)=>{return task.taskisfinished!==0}))
      setdeleteFinishedTasksAlertIsOpen(false)
      $.ajax({
        type: "POST",
        url: "/task/deleteallfinishedtask",
        success: (result) => {
          setdeleteFinishedTasksAlertIsOpen(false)
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

  const closeAddTask = () => {
    setaddTaskIsOpen(false)
  }

  const openUpdateTask = (task, e) => {
    e.stopPropagation()
    if (Nulled(tasks)||Nulled(categories)) return
    setchosenUpdateTask(task)
    setupdateTaskIsOpen(true)
  }

  const closeUpdateTask = () => {
    setchosenUpdateTask([])
    setupdateTaskIsOpen(false)
  }

  const openUpdateTaskAlert = () => {
    setupdateTaskIsOpen(false)
    setupdateTaskAlertIsOpen(true)
  }

  const closeUpdateTaskAlert = () => {
    setupdateTaskIsOpen(true)
    setupdateTaskAlertIsOpen(false)
  }

  //=animation
  const categoryMenuIcon = () => {
    if (!isRunning.current) {
      isRunning.current=true
      if ($("#categoriesMenu").css("display") == "none") {
        $("#categoriesMenu").css({
          top: "-" + $("#categoriesMenu").css("height"),
        })
        $("#categoriesMenu").show().animate({
          top: "+=" + $("#categoriesMenu").css("height"),
        },300,() => {
          return isRunning.current=false
        })
      } else {
        $("#categoriesMenu").animate({
          top: "-=" + $("#categoriesMenu").css("height"),
        },300,() => {
          $("#categoriesMenu").hide(() => {
            return isRunning.current=false
          })
        })
      }
    }
  }

  return (
    <div>
      <Head>
        <title>GoForIt</title>
      </Head>
      <nav className="side-bar">
        <div className="container">
          <img className="logo" src="/icons/favicon.ico" alt="logo" />
          <img onClick={() => {categoryMenuIcon()}} id="category-icon" className="cur-point category-icon" src="/icons/hamburger.png" alt="categories menu small screen" />
          <img onClick={e => {logout(e)}} className="icon logout-icon cur-point" src="/icons/logout white.png" alt="logout"/>
        </div>
      </nav>
      <div className="fixed-top-bar">
        <div className="top-bar-container">
          <nav className="top-bar">
            <h1>GoForIt</h1>
            <h3>
              ⠀{Nulled(data.username)? "" : "Hello, "+data.username}
            </h3>
          </nav>
        </div>
      </div>
      <section className="home-contents">
        <div id="categoriesMenu" className="categories">
          <h2>Categories</h2>
          <div className="cur-def add-category">
            <img className="cur-point" onClick={e => {addCategory(e)}} src="/icons/add button green.png" alt="add category" />
            <input 
              id="add-category_name"
              value={addCategoryName}
              onChange={e=>setaddCategoryName(e.target.value)} 
              onKeyDown={e => {e.key === "Enter" && addCategory(e)}} placeholder="Add Category" maxLength="35" type="text" required />
          </div>
          <ul id="categoriesul">
            {Nulled(categories) ? (
              <li className="category-empty">
                <img src="/icons/empty.png" alt="empty category" />
                <h5>...Whew Empty...</h5>
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
                    <h5 className="cur-point" type="text">
                      {category.category_name}⠀
                    </h5>
                    <div className="cur-point category-settings" onClick={e => {openUpdateCategory(category.id, e)}}>
                      <img src="/icons/three dots black.png" alt="category settings" />
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>
        <div id="main-contents" className="main-contents">
          <div className="tasks">
            <div className="ts-header">
              {Nulled(categories) ? (
                <h2>Tasks</h2>
              ) : (
                <h2>Tasks: {val(openedCategory.category_name)}</h2>
              )}
              <img className="cur-point" onClick={openAddTask} src="/icons/add button green.png" alt="add task" />
            </div>
            <ul>
              {Nulled(categories) || Nulled(tasks) ? (
                <li className="category-empty">
                  <img src="/icons/empty.png" alt="empty task" />
                  <h5>...Whew Empty...</h5>
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
                          <h3 className="cur-def ts-name">⠀{task.task_name}</h3>
                        </div>
                        <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                          <img src="/icons/three dots black.png" alt="task settings" />
                        </div>
                      </div>
                      <div className="cur-def ts-description">
                        <h5>{task.description}</h5>
                      </div>
                      <div className="ts-date-container">
                        <div className="ts-date">
                          <h5>
                            {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                          </h5>
                          <h5>
                            {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                          </h5>
                        </div>
                      </div>
                    </li>
                  ) : null
                })
              )}
            </ul>
          </div>
          {/* {{!-- Dashboard --}} */}
          <div className="dashboard">
            <div className="ts-header">
              <h2>Dashboard</h2>
              <img onClick={e=>setdeleteFinishedTasksAlertIsOpen(true)} className="cur-point trash-icon" src="/icons/trash green.png" alt="delete finished tasks" />
            </div>
            <h4>Missed Tasks</h4>
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
                            <h3 className="cur-def ts-name">
                              ⠀{task.task_name}
                            </h3>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                            <img src="/icons/three dots black.png" alt="task settings" />
                          </div>
                        </div>
                        <div className="cur-def ts-description">
                          <h5>{task.description}</h5>
                        </div>
                        <div className="ts-date-container">
                          <div className="ts-date">
                            <h5>
                              {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                            </h5>
                            <h5>
                              {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                            </h5>
                          </div>
                        </div>
                      </li>
                    ) : null
                  })}
            </ul>

            <h4>Ongoing Tasks</h4>
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
                            <h3 className="cur-def ts-name">
                              ⠀{task.task_name}
                            </h3>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                            <img src="/icons/three dots black.png" alt="task settings" />
                          </div>
                        </div>
                        <div className="cur-def ts-description">
                          <h5>{task.description}</h5>
                        </div>
                        <div className="ts-date-container">
                          <div className="ts-date">
                            <h5>
                              {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                            </h5>
                            <h5>
                              {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                            </h5>
                          </div>
                        </div>
                      </li>
                    ) : null
                  })}
            </ul>

            <h4>Tasks Soon</h4>
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
                            <h3 className="cur-def ts-name">
                              ⠀{task.task_name}
                            </h3>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task, e)} className="cur-point task-settings" >
                            <img src="/icons/three dots black.png" alt="task settings" />
                          </div>
                        </div>
                        <div className="cur-def ts-description">
                          <h5>{task.description}</h5>
                        </div>
                        <div className="ts-date-container">
                          <div className="ts-date">
                            <h5>
                              {"⠀Start: "+UTCSQLtoLocal(task.start_date)}
                            </h5>
                            <h5>
                              {"⠀End: "+UTCSQLtoLocal(task.end_date)}
                            </h5>
                          </div>
                        </div>
                      </li>
                    ) : null
                  })}
            </ul>
          </div>
        </div>
      </section>

      {!updateCategoryIsOpen || Nulled(chosenUpdateCategory) ? null : (
        <dialog id="CSP" className="category-settings-popup">
          <div id="CSPcontainer" className="cs-container">
            <div className="cs-header">
              <h2>Edit Category</h2>
              <div onClick={closeUpdateCategory} className="cur-point xclose-csp">
                <img src="/icons/xclose black.png" alt="close settings" />
              </div>
            </div>
            <div>
              <input 
                onChange={e=>{setupdateCategoryName(e.target.value)}}
                onKeyDown={e => {e.key === "Enter" && updateCategory(e)}} 
                defaultValue={chosenUpdateCategory.category_name} id="update-category_name" type="text" placeholder="New Category Name" maxLength="35" required />
            </div>
            <div className="cs-btns">
              <button onClick={openUpdateCategoryAlert} className="cur-point red-btn">
                Delete
              </button>
              <button onClick={e => {updateCategory(e)}} className="cur-point green-btn">
                Save
              </button>
            </div>
          </div>
        </dialog>
      )}

      {!updateCategoryAlertIsOpen || Nulled(chosenUpdateCategory) ? null : (
        <dialog className="csp-alert">
          <div className="cspa-container">
            <div className="cspa-header">
              <h5>
                Are you sure you want to delete the category 
                <span style={{ color: "#bd0303" }}>
                {" "+chosenUpdateCategory.category_name}</span>
                ? This will permanently
                <span style={{ color: "#bd0303" }}> delete </span>
                the tasks that it contains.
              </h5>
            </div>
            <div className="cspa-btns">
              <button onClick={closeUpdateCategoryAlert} className="cur-point cancel-btn">
                Cancel
              </button>
              <button onClick={e => {deleteCategory(e)}} className="cur-point delete-btn">
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}

      {!addTaskIsOpen ? null : (
        <dialog id="ATP" className="add-task-popup">
          <div className="atp-container">
            <div className="atp-header">
              <h2>Add Task</h2>
              <div onClick={closeAddTask} className="cur-point xclose-atp">
                <img src="/icons/xclose black.png" alt="close add task popup" />
              </div>
            </div>
            <div className="atp-form">
              <div className="atpf-1">
                <input 
                  onChange={e=>setaddTaskName(e.target.value)}
                  value={addTaskName}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} type="text" id="add-task_name" placeholder="Task Name" required />
              </div>
              <div className="atpf-2">
                <label htmlFor="add-start_date">Start Date</label>
                <input 
                  onChange={e=>setaddTaskStartDate(e.target.value)}
                  value={addTaskStartDate}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} type="datetime-local" id="add-start_date" required />
              </div>
              <div className="atpf-3">
                <label htmlFor="add-end_date">End Date</label>
                <input 
                  onChange={e=>setaddTaskEndDate(e.target.value)}
                  value={addTaskEndDate}
                  onKeyDown={e => {e.key === "Enter" && addTask(e)}} type="datetime-local" id="add-end_date" required />
              </div>
              <div className="atpf-4">
                <textarea 
                  onChange={e=>setaddTaskDescription(e.target.value)}   
                  value={addTaskDescription}
                  id="add-description" rows="5" placeholder="Task Description" required >
                </textarea>
              </div>
              <div className="atp-btns">
                <button onClick={e=>addTask(e)} className="cur-point atp-btn" >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

      {!updateTaskIsOpen ? null : (
        <dialog id="TPS" className="add-task-popup">
          <div className="atp-container">
            <div className="atp-header">
              <h2 className="cur-def">Edit Task</h2>
              <div onClick={closeUpdateTask} className="cur-point xclose-atp">
                <img src="/icons/xclose black.png" alt="close add task popup" />
              </div>
            </div>
            <div id="updateTask" className="atp-form">
              <div className="atpf-1">
                <input 
                onChange={e=>setupdateTaskName(e.target.value)}
                defaultValue={chosenUpdateTask.task_name}
                onKeyDown={e => {e.key === "Enter" && updateTask(e)}} id="update-task_name" placeholder="Task Name" type="text" required />
              </div>
              <div className="atpf-2">
                <label htmlFor="start_date">Start Date</label>
                {taskDateStatusIsChanging? null: 
                  <input 
                  onChange={e=>setupdateTaskStartDate(e.target.value)}
                  defaultValue={UTCSQLtoLocalHTML(chosenUpdateTask.start_date)}
                  onKeyDown={e => {e.key === "Enter" && updateTask(e)}}
                  id="update-start_date" 
                  type="datetime-local" 
                  required />
                }
              </div>
              <div className="atpf-3">
                <label htmlFor="end_date">End Date</label>
                {taskDateStatusIsChanging? null: 
                  <input 
                  onChange={e=>setupdateTaskEndDate(e.target.value)}
                  defaultValue={UTCSQLtoLocalHTML(chosenUpdateTask.end_date)} 
                  onKeyDown={e => {e.key === "Enter" && updateTask(e)}}
                  id="update-end_date" 
                  type="datetime-local" 
                  required />
                }
              </div>
              <div className="atpf-4">
                <textarea 
                  onChange={e=>setupdateTaskDescription(e.target.value)}
                  defaultValue={chosenUpdateTask.description}
                  id="update-description" placeholder="Task Description" rows="5" required >
                </textarea>
              </div>
            </div>
            <div className="tps-btns">
              <button onClick={openUpdateTaskAlert} className="cur-point tp-btn-delete" >
                Delete
              </button>
              <button onClick={e=>updateTask(e)} className="cur-point tp-btn-save" >
                Save
              </button>
            </div>
          </div>
        </dialog>
      )}

      {!updateTaskAlertIsOpen ? null : (
        <dialog className="csp-alert">
          <div className="cspa-container">
            <div className="cspa-header">
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
            <div className="cspa-btns">
              <button onClick={closeUpdateTaskAlert} className="cur-point cancel-btn">Cancel</button>
              <button onClick={e=>deleteTask(e)} className="cur-point delete-btn">Delete</button>
            </div>
          </div>
        </dialog>
      )}

      {!deleteFinishedTasksAlertIsOpen ? null : (  
        <section className="csp-alert">
          <div className="cspa-container">
            <div className="cspa-header">
              <h5 className="cur-def">
                Are you sure you want to delete
                <span style={{ color: "#bd0303" }}> All Finished Tasks</span>? This
                will permanently<span style={{ color: "#bd0303" }}> delete </span>
                all the finished items.
              </h5>
            </div>
            <div className="cspa-btns">
              <button onClick={e=>setdeleteFinishedTasksAlertIsOpen(false)} className="cur-point cancel-btn">
                Cancel
              </button>
              <button onClick={e=>deleteAllFinishedTasks(e)} className="cur-point delete-btn">
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

if (typeof window !== "undefined") {
  //Fix Categories menu after resize
  window.addEventListener("resize", function () {
    const catmenu = document.getElementById("categoriesMenu")
    const caticon = document.getElementById("category-icon")
    const cataddinput = document.getElementById("add-category_name")
    if (document.body.clientWidth >= 785) {
      caticon.style.display = "none"
      catmenu.style.removeProperty("width")
      catmenu.style.removeProperty("top")
      catmenu.style.removeProperty("right")
      catmenu.style.removeProperty("position")
      return (catmenu.style.display = "block")
    } else if (document.body.clientWidth < 785 && (cataddinput == document.activeElement || cataddinput.value !== "")) {
      catmenu.style.right = "0"
      catmenu.style.width = "calc(100% - 3em)"
      catmenu.style.position = "fixed"
      return (caticon.style.display = "flex")
    } else {
      catmenu.style.right = "0"
      catmenu.style.width = "calc(100% - 3em)"
      catmenu.style.display = "none"
      return (caticon.style.display = "flex")
    }
  })

  // Change Categories Scroll Max Height
  window.addEventListener("load", function () {
    return (document.getElementById("categoriesul").style.maxHeight = document.body.clientHeight - 162 + "px")
  })

  window.addEventListener("resize", function () {
    return (document.getElementById("categoriesul").style.maxHeight = document.body.clientHeight - 162 + "px")
  })
}
