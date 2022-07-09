import {
    query,
    getDocs,
    collection,
    where,
    doc,
    setDoc,
} from "firebase/firestore";

import './Scheduler.css';
import Nav from "../../Components/Nav/Nav";
import { db } from "../../firebase.js";
import IconButton from '@mui/material/IconButton';

import LogoutIcon from '@mui/icons-material/Logout';
import {
    useNavigate
} from "react-router-dom";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Checkbox from '@mui/material/Checkbox';
import { v4 as uuid } from 'uuid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';


const Scheduler = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editTime, setEditTime] = useState("");
    //const [value, setValue] = useState("");
    const [tasksList, setTasksList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openEditView, setOpenEditView] = useState(false);

    const handleLogout = () => {
        navigate('/');
        localStorage.clear();
    }


    const aU = JSON.parse(localStorage.getItem('authUser'));

    const getName = async () => {

        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setName(doc.data().firstName + " " + doc.data().lastName);
        });
    }
    getName();

    const updateDate = async (d) => {
        setDate(d);
        setSelectedTask(null);
        retrieveTasks(d);
    }

    const retrieveTasks = async (d) => {
        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        const taskDate = d.toDateString();
        let tempArr = [];
        querySnapshot.forEach((doc) => {
            tempArr = doc.data().tasks;
        });
        let finalArr = [];
        tempArr.forEach((i) => {
            if (i.date === taskDate) {
                let [t, modifier] = i.time.split(" ");
                let [hours, minutes, seconds] = t.split(":");
                let newTime = hours + ":" + minutes + " " + modifier;
                i.time = newTime;
                finalArr.push(i);
            }
        })

        finalArr.forEach((t) => {
            let newTime = convertTime12to24(t.time);
            t.time = newTime;
        })

        if (finalArr.length !== 0) {
            finalArr.sort(compareTime)
            finalArr.forEach((t) => {
                let newTime = convertTime24to12(t.time);
                t.time = newTime;
            })
        }

        setTasksList(finalArr);
    }

    function compareTime(a, b) {
        if (a.time < b.time) {
            return -1;
        }
        if (a.time > b.time) {
            return 1;
        }
        if (a.time === b.time) {
            if (calcAlphabet(a.title) < calcAlphabet(b.title)) {
                return -1;
            }
            if (calcAlphabet(a.title) > calcAlphabet(b.title)) {
                return 1;
            }
        }
    }

    const openForm = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(false);
        const taskDate = date.toDateString();

        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {

            let taskMap = d.data().tasks;
            let taskArray = [...taskMap, { time: time.substring(time.toLocaleString().indexOf(",") + 1).trim(), title: title, description: description, date: taskDate, completed: false, id: uuid() }]

            await setDoc(doc(db, "users", aU.uid), {
                uid: aU.uid,
                firstName: d.data().firstName,
                lastName: d.data().lastName,
                authProvider: "local",
                email: aU.email,
                tasks: taskArray,
            });
        });
        retrieveTasks(date);

    }

    useEffect(() => {
        retrieveTasks(date);
    }, [])

    const convertTime12to24 = (tM) => {
        const [time, modifier] = tM.split(' ');

        let [hours, minutes, seconds] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === "AM" && hours !== '00') {
            return `0${hours}:${minutes}`;
        }

        return `${hours}:${minutes}`;
    }

    const convertTime24to12 = (tM) => {
        const [h, m] = tM.split(":");
        let hours = (parseInt(h) + 11) % 12 + 1;
        let modifier = parseInt(h) >= 12 ? 'PM' : 'AM';
        return hours.toString() + ":" + m + " " + modifier;
    }



    const handleCheck = async (e) => {
        const taskDate = date.toDateString();

        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {

            let taskMap = d.data().tasks;
            let taskToChange = null;
            let completedValue = null;
            for (let i = 0; i < taskMap.length; i++) {
                if (taskMap[i].id === e.target.dataset.id) {
                    taskToChange = taskMap[i];
                    completedValue = taskMap[i].completed;
                    taskMap.splice(i, 1);
                    break;
                }
            }
            taskToChange.completed = !e.target.checked;
            taskMap.push(taskToChange);

            await setDoc(doc(db, "users", aU.uid), {
                uid: aU.uid,
                firstName: d.data().firstName,
                lastName: d.data().lastName,
                authProvider: "local",
                email: aU.email,
                tasks: taskMap,
            }).then(() => {
                retrieveTasks(date);
            })
        });

    }

    const viewMoreInfo = async (e) => {
        console.log(e.target);
        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        let tempArr = [];
        querySnapshot.forEach((doc) => {
            tempArr = doc.data().tasks;
        });
        tempArr.forEach((t) => {
            if (t.id === e.target.dataset.id) {
                setSelectedTask(t);
                setEditTitle(t.title);
                setEditDescription(t.description);
                console.log(t.time);
                let newTime = getCurrentDate() + ", " + t.time;
                setEditTime(newTime);
            }
        })

    }

    function calcAlphabet(str) {
        let total = 0;
        str = str.replace(" ", "");
        for (let letter in str.toLowerCase()) {
            total += str.charCodeAt(letter) - 96
        }
        return total;
    }

    const editTask = () =>{
        setOpenEditView(true);
    }

    const handleEditTaskClose = () =>{
        setOpenEditView(false);
    }

     const getCurrentDate = () => {
         const t = new Date();
         const date = ('0' + t.getDate()).slice(-2);
         const month = ('0' + (t.getMonth() + 1)).slice(-2);
         const year = t.getFullYear();
         return `${date}/${month}/${year}`;
     }
 
     const handleEdit = async (e) => {
        e.preventDefault();
        setOpenEditView(false);
        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {

            let taskMap = d.data().tasks;
            let taskToChange = null;
            //let completedValue = null;
            for (let i = 0; i < taskMap.length; i++) {
                if (taskMap[i].id === selectedTask.id) {
                    taskToChange = taskMap[i];
                    //completedValue = taskMap[i].completed;
                    taskMap.splice(i, 1);
                    break;
                }
            }
            taskToChange.time = editTime.substring(editTime.toLocaleString().indexOf(",") + 1).trim();
            taskToChange.title = editTitle;
            taskToChange.description = editDescription;
            console.log(taskMap);
            taskMap.push(taskToChange);

            await setDoc(doc(db, "users", aU.uid), {
                uid: aU.uid,
                firstName: d.data().firstName,
                lastName: d.data().lastName,
                authProvider: "local",
                email: aU.email,
                tasks: taskMap,
            }).then(() => {
                retrieveTasks(date);
            })
        });

     }

     const deleteTask = async () => {
        setOpenEditView(false);
        const q = query(collection(db, "users"), where("email", "==", aU.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (d) => {

            let taskMap = d.data().tasks;
            let taskToDelete = null;
          
            for (let i = 0; i < taskMap.length; i++) {
                if (taskMap[i].id === selectedTask.id) {
                    taskToDelete = taskMap[i];             
                    taskMap.splice(i, 1);
                    break;
                }
            }
    
            await setDoc(doc(db, "users", aU.uid), {
                uid: aU.uid,
                firstName: d.data().firstName,
                lastName: d.data().lastName,
                authProvider: "local",
                email: aU.email,
                tasks: taskMap,
            }).then(() => {
                setSelectedTask(null);
                retrieveTasks(date);
            })
        });
     }


    return (
        <div className="scheduler">
            <div className="nav">
                <Nav />
                <div className="nameDiv">
                    <p>{name}</p>
                    <IconButton onClick={handleLogout}><LogoutIcon style={{ color: '#EEA835' }} /></IconButton>
                </div>
            </div>
            <div className="schedulerContent">
                <div className="schedulerColumn">
                    <Calendar className='calendarGrid' onChange={updateDate} value={date} />
                    <h2 className="starredTasks">Categories</h2>
                </div>
                <div className="schedulerColumn">
                    <div className="topText">
                        <div className="topLeftText">
                            <h2>Schedule For: </h2>
                            <p className="currentDate">{date.toDateString()}</p>
                        </div>
                        <div className="topRightText">
                            <IconButton onClick={openForm} style={{
                                backgroundColor: '#EEA835',
                                borderRadius: '10px', padding: '15px'
                            }}><AddIcon style={{ color: 'white' }} /></IconButton>
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle style={{ fontWeight: '900', margin: '0', paddingBottom: '5px' }}>Add a New Task</DialogTitle>
                                <DialogContent>
                                    <DialogContentText style={{ marginBottom: '20px' }}>
                                        To add a new task, fill out the fields below.
                                    </DialogContentText>
                                    <form onSubmit={handleSubmit} id="addTaskForm">
                                        <TextField style={{ margin: '0', marginBottom: '15px' }}
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="title"
                                            label="Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                        />
                                        <TextField style={{ margin: '0', marginBottom: '15px' }}
                                            autoFocus
                                            required
                                            multiline
                                            maxRows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            margin="dense"
                                            id="description"
                                            label="Description"
                                            type="text"
                                            fullWidth

                                            variant="outlined"
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker

                                                label="Time"
                                                required

                                                value={time}
                                                onChange={(newTime) => {
                                                    setTime(newTime.toLocaleString());

                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>



                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} style={{ color: '#EEA835' }}>Cancel</Button>
                                    <Button type="submit" form="addTaskForm" style={{ color: '#EEA835' }}>Add</Button>
                                </DialogActions>
                            </Dialog>
                        </div>

                    </div>
                    <div className="taskList">
                        {tasksList.length === 0 ? <p className="emptyTasks">You have no tasks planned for this day</p> :
                            tasksList.map((task) => {
                                let [tempTime, modifier] = task.time.split(" ");
                                let [hours, minutes, seconds] = tempTime.split(":");
                                let newTime = `${hours}:${minutes} ${modifier}`;
                                return <div key={task.id} className="task" data-id={task.id} onClick={viewMoreInfo}>
                                    <div className="taskInfo" data-id={task.id}>
                                        <p className="taskTitle" data-id={task.id}>{task.title}</p>
                                        <p className="taskDate" data-id={task.id}>{newTime}</p>
                                    </div>
                                    <div className="box" style={{ width: '300px' }} data-id={task.id}></div>
                                    <Checkbox
                                        sx={{

                                            '&.Mui-checked': {
                                                color: "black",
                                            },
                                        }}
                                        inputProps={
                                            { 'data-id': task.id }}
                                        onChange={(e) => {
                                            handleCheck(e);
                                        }}
                                        checked={task.completed}
                                    />
                                </div>
                            })}

                    </div>

                </div>
                <div className="schedulerColumn">
                    <div className="viewTaskDetails">
                        {!selectedTask ? <p className="noTask">No task currently selected. Click on a task to view more info.</p> :
                            <div className="editTask">
                                <p className="taskName">{selectedTask.title}</p>
                                <p className="taskDesc">Description: {selectedTask.description}</p>
                                <div className="taskTimeDiv">
                                    <AccessTimeIcon style={{ color: "#EEA835" }} />
                                    <p className="taskTime">{selectedTask.time}</p>
                                </div>
                                <div className="taskDateDiv">
                                    <EventIcon style={{ color: "#EEA835" }} />
                                    <p className="taskDate">{selectedTask.date}</p>
                                </div>
                                <button className="edit" onClick={editTask}>Edit Task</button>
                                <button className="delete" onClick={deleteTask}>Delete Task</button>
                                <Dialog open={openEditView} onClose={handleEditTaskClose}>
                                <DialogTitle style={{ fontWeight: '900', margin: '0', paddingBottom: '5px' }}>Edit Task</DialogTitle>
                                <DialogContent>
                                    <DialogContentText style={{ marginBottom: '20px' }}>
                                        To edit a task, change the desired fields below.
                                    </DialogContentText>
                                    <form onSubmit={handleEdit} id="editTaskForm">
                                        <TextField style={{ margin: '0', marginBottom: '15px' }}
                                            autoFocus
                                            required
                                            margin="dense"
                                            id="title"
                                            label="Title"
                                            defaultValue={selectedTask.title}
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                        />
                                        <TextField style={{ margin: '0', marginBottom: '15px' }}
                                            autoFocus
                                            required
                                            multiline
                                            maxRows={4}
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            margin="dense"
                                            id="description"
                                            label="Description"
                                            type="text"
                                            fullWidth

                                            variant="outlined"
                                        />
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <TimePicker

                                                label="Time"
                                                required

                                                value={editTime}
                                                onChange={(newTime) => {
                                                    //console.log(newTime.toLocaleString());
                                                    setEditTime(newTime.toLocaleString());

                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleEditTaskClose} style={{ color: '#EEA835' }}>Cancel</Button>
                                    <Button type="submit" form="editTaskForm" style={{ color: '#EEA835' }}>Edit</Button>
                                </DialogActions>
                            </Dialog>
                             
                            </div>}
                    </div>
                </div>

            </div>


        </div >
    );
}

export default Scheduler;