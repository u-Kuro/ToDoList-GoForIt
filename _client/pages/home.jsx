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
  CheckTimeStatus,
  TimezoneOffset,
} from "../../helpers/time"

export default function Home() {
  //=initializations
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [clientTimezoneOffset, setclientTimezoneOffset] = useState(new Date().getTimezoneOffset())

  //=interactive
    //Category
    const [openedCategory, setopenedCategory] = useState('')
    const [chosenUpdateCategory, setchosenUpdateCategory] = useState([])
    const [updateCategoryIsOpen, setupdateCategoryIsOpen] = useState(false)
    const [updateCategoryAlertIsOpen, setupdateCategoryAlertIsOpen] = useState(false)
    //Task
    const [addTaskIsOpen, setaddTaskIsOpen] = useState(false)
    const [chosenUpdateTask, setchosenUpdateTask] = useState([])
    const [updateTaskIsOpen, setupdateTaskIsOpen] = useState(false)
    const [updateTaskAlertIsOpen, setupdateTaskAlertIsOpen] = useState(false)
    const [deleteFinishedTasksAlertIsOpen, setdeleteFinishedTasksAlertIsOpen] = useState(false)

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
  const [isRunning, setRunning] = useState(false)
  const currentTimezoneOffset = useRef(new Date().getTimezoneOffset())
    //helper functions
    const Nulled = (v) => {
      return typeof v === "undefined" ? true : v === null ? true : v.length === 0
    }
    const El = (id)=>{return document.getElementById(id)}

  //=first render
  useEffect(() => {
    $.ajax({
      type: "GET",
      url: "/auth/userdata",
      success: (result) => {
        if (!result.isAuth) {
          Router.push({
              haveAlert: result.haveAlert,
              message: "Unauthorized, Please Login first!",
            },"/login",{ shallow: true })
        }
        setData(result)
        Nulled(result.categories) ? null : setopenedCategory(result.categories[0].id)
        return
      },
    })
  }, [])

  //=Consequent renders
  useUpdateEffect(() => {
    setCategories(data.categories)
    setTasks(data.tasks)
  },[data])

  //=CheckDateStatus
  useUpdateEffectInterval(()=>{ 
    tasks.map((task)=>{
      var currentTaskDateStatus = CheckTimeStatus(new Date(new Date().toISOString()),new Date(new Date(task.start_date).toISOString()), new Date(new Date(task.end_date).toISOString()))
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
        if (task.id !== chosenUpdateTask.id) return
        setchosenUpdateTask(task)
      })
      resolve()
    }).then(()=>{
      settaskDateStatusIsChanging(true)
    })
    console.log("runned")
  },[clientTimezoneOffset])

  //=check live timezones
  useEffectInterval(()=>{
    if(currentTimezoneOffset.current!==new Date().getTimezoneOffset()){
      currentTimezoneOffset.current=new Date().getTimezoneOffset()
      setclientTimezoneOffset(currentTimezoneOffset.current)
    }
  },[],500)

  //=logout form
  const logout = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "GET",
        url: "/auth/logout",
        success: () => {
          Router.push("/login", undefined, { shallow: true })
          return setRunning(false)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  //=category form
  const addCategory = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "POST",
        url: "/category/addcategory",
        data: {
          category_name: El("add-category_name").value,
        },
        success: (result) => {
          El("add-category_name").value = "";
          setRunning(false)
          setopenedCategory(result.categories[0].id)
          return setCategories(result.categories)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  const updateCategory = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "POST",
        url: "/category/updatecategory",
        data: {
          category_name: El("update-category_name").value,
          category_id: chosenUpdateCategory.id,
        },
        success: (result) => {
          setupdateCategoryIsOpen(false)
          setRunning(false)
          setopenedCategory(result.categories[0].id)
          return setCategories(result.categories)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  const deleteCategory = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "POST",
        url: "/category/deletecategory",
        data: {
          category_id: chosenUpdateCategory.id,
        },
        success: (result) => {
          setupdateCategoryIsOpen(false)
          setupdateCategoryAlertIsOpen(false)
          setchosenUpdateCategory([])
          setRunning(false)
          if(Nulled(result.categories))
            setopenedCategory('')
          else if(openedCategory === chosenUpdateCategory.id)
            setopenedCategory(result.categories[0].id)
          return setCategories(result.categories)
        },error: ()=>{return setRunning(false)}
      })
    }
  }
  
  //=category live
  const openCategory = (id) => {
    setopenedCategory(id)
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
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      const clientOffset = TimezoneOffset()
      $.ajax({
        type: "POST",
        url: "/task/addtask",
        data: {
          task_name: El("add-task_name").value,
          start_date: El("add-start_date").value,
          end_date: El("add-end_date").value,
          current_date: (new Date()),
          description: El("add-description").value,
          category_id: openedCategory,
          ctz_offsethour: clientOffset[0],
          ctz_offsetmin: clientOffset[1]
        },
        success: (result) => {
          setaddTaskIsOpen(false)
          El("add-task_name").value = ""
          El("add-start_date").value = ""
          El("add-end_date").value = ""
          El("add-description").value = ""
          setRunning(false)
          if (!Nulled(result.message)) return alert(result.message)
          setCategories(result.categories)
          if (Nulled(result.tasks)) return setTasks([])
            setTasks(result.tasks)
          if (result.noCategory)
            setopenedCategory(result.categories[0].id)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  const updateTask = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      const TimeOffset = TimezoneOffset()
      $.ajax({
        type: "POST",
        url: "/task/updatetask",
        data: {
          task_id: chosenUpdateTask.id,
          category_id: openedCategory,
          task_name: El("update-task_name").value,
          start_date: El("update-start_date").value,
          end_date: El("update-end_date").value,
          current_date: (new Date()),
          description: El("update-description").value,
          ctz_offsethour: TimeOffset[0],
          ctz_offsetmin: TimeOffset[1]
        },
        success: (result) => {
          setRunning(false)
          setchosenUpdateTask(result.newtask)
          setupdateTaskIsOpen(false)
          setCategories(result.categories)
          return setTasks(result.tasks)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  const checkTaskStatus = (e,id) => {
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "POST",
        url: "/task/changetaskcompletionstatus",
        data: {
          task_id: id
        },
        success: (result) => {
          setRunning(false)
          setCategories(result.categories)
          setTasks(result.tasks)
          return settaskStatusIsChanging(true)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  const deleteTask = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "POST",
        url: "/task/deletetask",
        data: {
          task_id: chosenUpdateTask.id,
          category_id: openedCategory
        },
        success: (result) => {
          setupdateTaskIsOpen(false)
          setupdateTaskAlertIsOpen(false)
          setchosenUpdateTask([])
          setRunning(false)
          setCategories(result.categories)
          return setTasks(result.tasks)
        },error: ()=>{return setRunning(false)}
      })
    }
  }

  const deleteAllFinishedTasks = (e) => {
    e.preventDefault()
    if (!isRunning) {
      setRunning(true)
      $.ajax({
        type: "POST",
        url: "/task/deleteallfinishedtask",
        success: (result) => {
          setdeleteFinishedTasksAlertIsOpen(false)
          setRunning(false)
          setCategories(result.categories)
          return setTasks(result.tasks)
        },error: ()=>{return setRunning(false)}
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

  const openUpdateTask = (id, e) => {
    e.stopPropagation()
    if (Nulled(categories)) return
    tasks.map((task) => {
      if (task.id !== id) return
      setchosenUpdateTask(task)
      setupdateTaskIsOpen(true)
    })
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
    if (!isRunning) {
      setRunning(true)
      if ($("#categoriesMenu").css("display") == "none") {
        $("#categoriesMenu").css({
          top: "-" + $("#categoriesMenu").css("height"),
        })
        $("#categoriesMenu").show().animate({
          top: "+=" + $("#categoriesMenu").css("height"),
        },300,() => {
          return setRunning(false)
        })
      } else {
        $("#categoriesMenu").animate({
          top: "-=" + $("#categoriesMenu").css("height"),
        },300,() => {
          $("#categoriesMenu").hide(() => {
            return setRunning(false)
          })
        })
      }
    }
  }

  // const [chosenCategory, setchosenCategory] = useState(EmptynNull(data.categories)?  data.categories[0].id : null)
  // const [tasks, setTasks] = useState(EmptynNull(data.tasks)? data.tasks : [])

  // Add: when adding task with no category, alert no categories found
  return (
    <div>
      <Head>
        <title>GoForIt</title>
      </Head>
      <nav className="side-bar">
        <div className="container">
          <img className="logo" src="/icons/favicon.ico" alt="logo" />
          <img onClick={() => {categoryMenuIcon()}} id="category-icon" className="cur-point category-icon" src="/icons/hamburger.png" alt="categories menu small screen" />
          <img onClick={(e) => {logout(e)}} className="icon logout-icon cur-point" src="/icons/logout white.png" alt="logout"/>
        </div>
      </nav>
      <div className="fixed-top-bar">
        <div className="top-bar-container">
          <nav className="top-bar">
            <h1>GoForIt</h1>
            <h3>
              ⠀{Nulled(data.username) ? "" : "Hello, " + data.username}
            </h3>
          </nav>
        </div>
      </div>
      <section className="home-contents">
        <div id="categoriesMenu" className="categories">
          <h2>Categories</h2>
          <div className="cur-def add-category">
            <img className="cur-point" onClick={(e) => {addCategory(e)}} src="/icons/add button green.png" alt="add category" />
            <input id="add-category_name" type="text" onKeyPress={(e) => {e.key === "Enter" && addCategory(e)}} placeholder="Add Category" maxLength="35" required />
          </div>
          <ul id="categoriesul">
            {Nulled(categories) ? (
              <li className="category-empty">
                <img src="/icons/empty.png" alt="empty category" />
                <h5>...Whew Empty...</h5>
              </li>
            ) : (
              categories.map((category) => {
                return (
                  <li
                    key={category.id}
                    className={"category cur-point " + (openedCategory === category.id? "category-selected": "")}
                    onClick={() => {
                      openCategory(category.id)
                    }}
                  >
                    <h5 className="cur-point" type="text">
                      {category.category_name}⠀
                    </h5>
                    <div className="cur-point category-settings" onClick={(e) => {openUpdateCategory(category.id, e)}}>
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
                categories.map((category) => {
                  return openedCategory === category.id ? (
                    <h2>Tasks: {category.category_name}</h2>
                  ) : null
                })
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
                  return openedCategory === task.category_id ? (
                    <li
                      key={task.id}
                      className={
                        "task " +
                        task.date_status +
                        (task.taskisfinished ? " task-finished" : "")
                      }
                    >
                      <div className="cur-def ts-title">
                        <div className="cur-def ts-title-1">
                          {taskStatusIsChanging? null: 
                            <input 
                              key={task.id} 
                              defaultChecked={task.taskisfinished} 
                              onChange={(e)=>checkTaskStatus(e,task.id)}
                              className="cur-point ts-checkbox" type="checkbox" 
                            />
                          }
                          <h3 className="cur-def ts-name">⠀{task.task_name}</h3>
                        </div>
                        <div key={task.id} onClick={e=>openUpdateTask(task.id, e)} className="cur-point task-settings" >
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
                : tasks.map((task) => {
                    return task.date_status === "Missed" ? (
                      <li
                        key={task.id}
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
                                onChange={(e)=>checkTaskStatus(e,task.id)}
                                className="cur-point ts-checkbox" type="checkbox" 
                              />
                            }
                            <h3 className="cur-def ts-name">
                              ⠀{task.task_name}
                            </h3>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task.id, e)} className="cur-point task-settings" >
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
                : tasks.map((task) => {
                    return task.date_status === "Ongoing" ? (
                      <li key={task.id} className={"task "+task.date_status+(task.taskisfinished? " task-finished":"")}>
                        <div className="ts-title">
                          <div className="ts-title-1">
                            {taskStatusIsChanging? null: 
                              <input 
                                key={task.id} 
                                defaultChecked={task.taskisfinished} 
                                onChange={(e)=>checkTaskStatus(e,task.id)}
                                className="cur-point ts-checkbox" type="checkbox" 
                              />
                            }
                            <h3 className="cur-def ts-name">
                              ⠀{task.task_name}
                            </h3>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task.id, e)} className="cur-point task-settings" >
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
                : tasks.map((task) => {
                    return task.date_status === "Soon" ? (
                      <li key={task.id} className={"task "+task.date_status+(task.taskisfinished? " task-finished":"")}>
                        <div className="ts-title">
                          <div className="ts-title-1">
                            {taskStatusIsChanging? null: 
                              <input 
                                key={task.id} 
                                defaultChecked={task.taskisfinished} 
                                onChange={(e)=>checkTaskStatus(e,task.id)}
                                className="cur-point ts-checkbox" type="checkbox" 
                              />
                            }
                            <h3 className="cur-def ts-name">
                              ⠀{task.task_name}
                            </h3>
                          </div>
                          <div key={task.id} onClick={e=>openUpdateTask(task.id, e)} className="cur-point task-settings" >
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
              <input onKeyPress={(e) => {e.key === "Enter" && updateCategory(e)}} defaultValue={chosenUpdateCategory.category_name} id="update-category_name" type="text" placeholder="New Category Name" maxLength="35" required />
            </div>
            <div className="cs-btns">
              <button onClick={openUpdateCategoryAlert} className="cur-point red-btn">
                Delete
              </button>
              <button onClick={(e) => {updateCategory(e)}} className="cur-point green-btn">
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
              <button onClick={(e) => {deleteCategory(e)}} className="cur-point delete-btn">
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
            <div>
              <div className="atpf-1">
                <input type="text" id="add-task_name" placeholder="Task Name" required />
              </div>
              <div className="atpf-2">
                <label htmlFor="edit-start_date">Start Date</label>
                <input type="datetime-local" id="add-start_date" required />
              </div>
              <div className="atpf-3">
                <label htmlFor="edit-end_date">End Date</label>
                <input type="datetime-local" id="add-end_date" required />
              </div>
              <div className="atpf-4">
                <textarea id="add-description" rows="5" placeholder="Task Description" required ></textarea>
              </div>
              <div className="atp-btns">
                <button onClick={(e) => addTask(e)} className="cur-point atp-btn" >
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
                <input defaultValue={chosenUpdateTask.task_name} id="update-task_name" placeholder="Task Name" type="text" required />
              </div>
              <div className="atpf-2">
                <label htmlFor="start_date">Start Date</label>
                {taskDateStatusIsChanging? null: 
                  <input 
                  defaultValue={UTCSQLtoLocalHTML(chosenUpdateTask.start_date)} 
                  id="update-start_date" 
                  type="datetime-local" 
                  required />
                }
              </div>
              <div className="atpf-3">
                <label htmlFor="end_date">End Date</label>
                {taskDateStatusIsChanging? null: 
                  <input 
                  defaultValue={UTCSQLtoLocalHTML(chosenUpdateTask.end_date)} 
                  id="update-end_date" 
                  type="datetime-local" 
                  required />
                }
              </div>
              <div className="atpf-4">
                <textarea id="update-description" placeholder="Task Description" rows="5" required >
                  {chosenUpdateTask.description}
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
  window.addEventListener("resize", function (event) {
    const catmenu = document.getElementById("categoriesMenu")
    // const mainmenu = document.getElementById("main-contents")
    const caticon = document.getElementById("category-icon")
    if (document.body.clientWidth >= 785) {
      caticon.style.display = "none"
      catmenu.style.removeProperty("width")
      catmenu.style.removeProperty("right")
      catmenu.style.removeProperty("position")
      return (catmenu.style.display = "block")
    } else if (
      document.body.clientWidth < 785 &&
      catmenu.style.display == "block"
    ) {
      catmenu.style.right = "0"
      catmenu.style.width = "calc(100% - 3em)"
      catmenu.style.position = "fixed"
      return (caticon.style.display = "flex")
    } else {
      catmenu.style.right = "0"
      catmenu.style.width = "calc(100% - 3em)"
      catmenu.style.display = "none"
      caticon.style.display = "flex"
      return (catmenu.style.display = "none")
    }
  })

  // Change Categories Scroll Max Height
  window.addEventListener("load", function (event) {
    return (document.getElementById("categoriesul").style.maxHeight =
      document.body.clientHeight - 162 + "px")
  })

  window.addEventListener("resize", function (event) {
    return (document.getElementById("categoriesul").style.maxHeight =
      document.body.clientHeight - 162 + "px")
  })
}
