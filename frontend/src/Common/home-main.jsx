import React, { useEffect, useState } from 'react'
import './home-main.css'
import { Link } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

export default function Homemain() {
    const [username, setUsername] = useState("")
    const [topButton, setTopButton] = useState(false);
    const [login, setLogin] = useState(false);
    const [checkbtn, setcheckbtn] = useState("All");
    const [task, setTask] = useState([]);
    const [project, setProject] = useState([]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sign_in = () => {
        setLogin(!login);
    };
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:8000/logout", {
                method: "POST",
                credentials: "include"
            });
            
            if (!response.ok) {
                throw new Error("Logout failed");
            }

            setTopButton(false);
            setUsername("");
            setLogin(false);

            toast.success("Logged out successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Could not log out");
        }
};
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/my-tasks",
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                const data = await response.json();
                console.log("API response:", data.tasks);
                setTask(data.tasks);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }, []);
    const filteredTasks = task.filter((Task) => {
        if (checkbtn === "All") {
            return true;
        }

        if (checkbtn === "Active") {
            return Task.status === "active";
        }

        if (checkbtn === "Pending") {
            return Task.status === "pending";
        }

        if (checkbtn === "Completed") {
            return Task.status === "completed";
        }

        return true;
    });

    const completeTask = async (taskId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/tasks/${taskId}/complete`,
                {
                method: "PATCH",
                credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            setTask((prevTasks) =>
                prevTasks.map((t) =>
                    t.id === taskId
                    ? { ...t, status: "completed" }
                    : t
                )
            );

            toast.success("Task completed!");
        } catch (error) {
            console.error(error);
            toast.error("Could not complete task");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/login_user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Login Successful!");
                setLogin(false);
                setTopButton(true);
            } else {
                toast.error(data.error || "Invalid Email or Password!");
            }

        } catch (error) {
            console.error(error);
            toast.error("Server connection failed!");
        }
    };

    useEffect(() => {
        fetch("http://localhost:8000/check-auth", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {
                setTopButton(true);
                setUsername(data.username || "");
            } else {
                setTopButton(false);
                setUsername("");
            }
        })
        .catch(error => {
            console.error("Auth check failed:", error);
            setTopButton(false);
        });
    }, [username]);

    useEffect(() => {
        const get_projects = () => {
            try{
                fetch("http://localhost:8000/projects", {
                    credentials: "include"
                })
                .then(res => res.json())
                .then(data => {
                    setProject(data.project);
                })
            } catch(error) {
                console.log(error);
            };
        }
        get_projects();
    }, [project])

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Monday of this week
    const startOfWeek = new Date(today);
    const day = (today.getDay() + 6) % 7;
    startOfWeek.setDate(today.getDate() - day);

    // Monday of next week
    const startOfNextWeek = new Date(startOfWeek);
    startOfNextWeek.setDate(startOfWeek.getDate() + 7);

    const deadlinesThisWeek = task.filter((t) => {
        if (!t.due_date || t.status === "completed") {
            return false;
        }

        const dueDate = new Date(t.due_date);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate >= today && dueDate < startOfNextWeek;
    }).length;

  return (
    <div id='whole'>
        <Toaster />
        <div id='upper-heading' className='gap-128'>
            <div id='Search' className='flex items-center gap-0.5'>
                <input id='search' type='text' placeholder='Search projects, tasks or people'/><button className='bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-800 size-9 rounded-md'><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            {
                topButton
                ?
                <div id='icon' className='flex items-center gap-4'>
                    <button className='cursor-pointer'><i class="fa-regular fa-bell"></i></button>
                    <button className='size-8 rounded-[50%] bg-blue-500 text-white'>
                        {username ? username.charAt(0).toUpperCase() : "?"}
                    </button>
                    <button className='cursor-pointer'><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
                :
                <div id='icon' className='flex items-center'>
                    <button className='cursor-pointer flex items-center justify-center bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold w-20 h-8 rounded-md' onClick={sign_in}>Sign In</button>
                </div>
            }
            {login && (
                <div className="loginCard fixed top-[20%] left-[40%] bg-white border-2 border-red-300 w-80 h-80 rounded-md">
                    <div className='flex justify-between'>
                        <h3 className='font-semibold text-black text-[30px]'>Sign In</h3><button onClick={sign_in} className='text-black cursor-pointer'><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='userEmail'>Email:</label>
                        <br/>
                        <input
                            className='border-black border-2'
                            style={{padding: `0px 0px 0px 5px`}}
                            id='userEmail'
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br/>
                        <br/>

                        <label htmlFor='userPassword'>Password:</label>
                        <br/>
                        <input
                            id='userPassword'
                            style={{padding: `0px 0px 0px 5px`}}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='border-2 border-black'
                        />
                        <br/>
                        <br/>

                        <button type="submit" className='bg-yellow-500 cursor-pointer text-black font-medium w-20 h-10 rounded-md flex items-center justify-center active:bg-yellow-600'>
                            Sign In
                        </button>
                        <br/>
                        <p className='text-black'>Do you want to create an account?Click on <Link to={'/Createaccount'}><p className='text-blue-600 inline'>create account.</p></Link></p>
                    </form>
                </div>
            )}
        </div>
        <div id='main'>
            <h1 className='text-[35px] font-semibold'>Hey, lets achieve together!</h1>
            <p className='text-gray-600'>Here's what's happening with your pojects today.</p>
            <div className="cards flex flex-wrap gap-4">
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-blue-700 text-[25px] bg-blue-200 size-10'><i className="fa-regular fa-folder-closed"></i></div>
                    <p className='text-gray-600 font-medium'>Total Projects</p>
                    <p className='font-semibold text-[40px]'>{project ? project.length : "0"}</p>
                    <p className='text-gray-500' style={{'marginTop': 'auto', 'marginBottom': '15px'}}>{project.filter(p => p.status === "active").length} active ·{" "}{project.filter(p => p.status === "completed").length} completed</p>
                </div>
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-white text-[23px] bg-green-700 size-10'><i className="fa-solid fa-check"></i></div>
                    <p className='text-gray-600 font-medium'>Total Tasks</p>
                    <p className='font-semibold text-[40px]'>{task.length}</p>
                    <p className='text-gray-500 text-[15px]'>{task.filter((t) => {t.status == "pending"}).length} pending .  {task.filter((t) => {t.status == "completed"}).length} completed</p>
                </div>
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-blue-700 text-[25px] bg-blue-200 size-10'><i className="fa-solid fa-users"></i></div>
                    <p className='text-gray-600 font-medium'>Team Members</p>
                    <p className='font-semibold text-[40px]'>3</p>
                    <p className='text-gray-500'>total members</p>
                </div>
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-orange-500 text-[25px] bg-green-200 size-10'><i className="fa-solid fa-clock-rotate-left"></i></div>
                    <p className='text-gray-600 font-medium'>Upcoming Deadlines</p>
                    <p className='font-semibold text-[40px]'>{deadlinesThisWeek}</p>
                    <p className='text-gray-500'>This week</p>
                </div>
            </div>
            <div>
                <div className='taskList w-211 bg-white rounded-md' style={{'margin': '20px 0 10px 0px'}}>
                    <div className='top flex items-center justify-between' style={{"padding": "0 10px"}}>
                        <h3 className='text-[20px] font-bold'>My Tasks</h3>
                        <h5 className='text-blue-700 font-medium'>view all</h5>
                    </div>
                    <div className='btn flex w-full h-13 gap-6' style={{'margin': '10px 0 0px 0'}}>
                        <button className={`cursor-pointer flex items-center justify-center w-14 h-10 font-medium rounded-md ${checkbtn === "All" ? "bg-blue-800 text-white" : "bg-white text-blue-500"}`} onClick={() => setcheckbtn("All")}>All</button>
                        <button className={`cursor-pointer flex items-center justify-center w-14 h-10 font-medium rounded-md ${checkbtn === "Active" ? "bg-blue-800 text-white" : "bg-white text-blue-500"}`}  onClick={() => setcheckbtn("Active")}>Active</button>
                        <button className={`cursor-pointer flex items-center justify-center w-auto h-10 font-medium rounded-md ${checkbtn === "Completed" ? "bg-blue-800 text-white" : "bg-white text-blue-500"}`} style={{'padding': "0 5px"}}  onClick={() => setcheckbtn("Completed")}>Competed</button>
                        <button className={`cursor-pointer flex items-center justify-center w-auto h-10 font-medium rounded-md ${checkbtn === "Pending" ? "bg-blue-800 text-white" : "bg-white text-blue-500"}`} style={{'padding': "0 5px"}}  onClick={() => setcheckbtn("Pending")}>Pending</button>
                    </div>
                    <div className='w-full flex items-center min-h-14' style={{'padding': '0 10px'}}>
                        <ul className="flex flex-col w-[98%] gap-3">
                            <li className="flex items-center rounded-md gap-24 w-full p-4 bg-indigo-50 h-9" style={{'paddingLeft': '5px'}}>
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <input
                                        type="checkbox"
                                        checked={task.status === "completed"}
                                        className="size-4 shrink-0 cursor-pointer accent-blue-600"
                                        />
                                        
                                        <span
                                        className={`min-w-0 line-clamp-2 wrap-break-word text-sm font-medium`}
                                        >
                                            Task
                                        </span>
                                    </div>
                                    <span className=' text-sm font-medium' style={{'padding': '6px'}}>
                                        Project
                                    </span>
                                    <span className="text-sm font-medium" style={{'padding': '6px'}}>
                                        Due_date
                                    </span>
                                    <span className="text-sm font-medium" style={{'padding': '6px'}}>
                                        Status
                                    </span>
                                    <span className="text-sm font-medium" style={{'marginLeft': 'auto', 'marginRight': '0px', 'padding': '5px'}}>
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </span>

                            </li>
                            {filteredTasks.slice(0,6).map((task) => (
                                <li
                                style={{'paddingLeft': '5px'}}
                                key={task.id}
                                className="flex items-center gap-24 w-full p-4"
                                >
                                    {/* Task name and checkbox */}
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <input
                                        type="checkbox"
                                        checked={task.status === "completed"}
                                        onChange={() => completeTask(task.id)}
                                        className="size-4 shrink-0 cursor-pointer accent-blue-600"
                                        />
                                        
                                        <span
                                        title={task.name}
                                        className={`min-w-0 line-clamp-2 wrap-break-word text-sm ${
                                            task.status === "completed"
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                        }`}
                                        >
                                            {task.name}
                                        </span>
                                    </div>

                                    <span className='bg-blue-100 text-xs text-blue-700 font-medium px-3 py-1 rounded-full'>
                                        {task.project_name}
                                    </span>
                                    
                                    {/* Due date */}
                                    <span className="text-sm text-gray-500">
                                        {task.due_date
                                        ? new Date(task.due_date).toLocaleDateString()
                                        : "No due date"}
                                    </span>
                                    
                                    {/* Status */}
                                    <span
                                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                                        task.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : task.status === "active"
                                        ? "bg-blue-100 text-blue-700"
                                        : task.status === "pending"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                    >
                                        {task.status}
                                    </span>
                                    <span className='text-black text-md' style={{'marginLeft': 'auto','padding': '5px', 'marginRight': '0px'}}>
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='projects bg-black' style={{'marginTop': '20px'}}>

            </div>

        </div>
    </div>
    )
}
