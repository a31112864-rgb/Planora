import React from 'react'
import './home-main.css'
export default function Homemain() {
  return (
    <div id='whole'>
        <div id='upper-heading' className='gap-128'>
            <div id='Search' className='flex items-center gap-0.5'>
                <input id='search' type='text' placeholder='Search projects, tasks or people'/><button className='bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-800 size-9 rounded-md'><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div id='icon' className='flex items-center gap-4'>
                <button className='cursor-pointer'><i class="fa-regular fa-bell"></i></button>
                <button className='size-8 cursor-pointer rounded-[50%] bg-blue-500 text-white hover:bg-blue-700'>
                    A
                </button>
                <button className='cursor-pointer'><i class="fa-solid fa-ellipsis-vertical"></i></button>
                
            </div>
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
