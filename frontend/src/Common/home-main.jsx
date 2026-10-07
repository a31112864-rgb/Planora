import React, { useEffect, useState } from 'react'
import './home-main.css'
import { Link } from 'react-router';

export default function Homemain() {
    const [topButton, setTopButton] = useState(false);
    const [login, setLogin] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sign_in = () => {
        setLogin(!login);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Email:", email);
        console.log("Password:", password);
    };

    useEffect(() => {
        fetch("http://localhost:8000/check-auth", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {
                console.log("User is logged in");
                setTopButton(true);
            } else {
                console.log("Not logged in");
                setTopButton(false);
            }
        })
        .catch(error => {
            console.error("Auth check failed:", error);
            setTopButton(false);
        });
    }, []);

  return (
    <div id='whole'>
        <div id='upper-heading' className='gap-128'>
            <div id='Search' className='flex items-center gap-0.5'>
                <input id='search' type='text' placeholder='Search projects, tasks or people'/><button className='bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-800 size-9 rounded-md'><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            {
                topButton
                ?
                <div id='icon' className='flex items-center gap-4'>
                    <button className='cursor-pointer'><i class="fa-regular fa-bell"></i></button>
                    <button className='size-8 cursor-pointer rounded-[50%] bg-blue-500 text-white hover:bg-blue-700'>
                        A
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
                    <p className='font-semibold text-[40px]'>5</p>
                    <p className='text-gray-500'>2 active . 1 completed</p>
                </div>
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-white text-[23px] bg-green-700 size-10'><i className="fa-solid fa-check"></i></div>
                    <p className='text-gray-600 font-medium'>Total Tasks</p>
                    <p className='font-semibold text-[40px]'>12</p>
                    <p className='text-gray-500 text-[15px]'>10 pending . 2 completed</p>
                </div>
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-blue-700 text-[25px] bg-blue-200 size-10'><i className="fa-solid fa-users"></i></div>
                    <p className='text-gray-600 font-medium'>Team Members</p>
                    <p className='font-semibold text-[40px]'>3</p>
                    <p className='text-gray-500'>2 online . 1 offline</p>
                </div>
                <div className="card w-50 h-44 flex flex-col rounded-md gap-0.5">
                    <div className='flex items-center justify-center rounded-[50%] text-orange-500 text-[25px] bg-green-200 size-10'><i className="fa-solid fa-clock-rotate-left"></i></div>
                    <p className='text-gray-600 font-medium'>Upcoming Deadlines</p>
                    <p className='font-semibold text-[40px]'>2</p>
                    <p className='text-gray-500'>This week</p>
                </div>
            </div>
            <div className='taskList pl-2'>
                
            </div>

        </div>
    </div>
    
  )
}
