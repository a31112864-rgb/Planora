import React from 'react'
import './home-main.css'
export default function Homemain() {
  return (
    <div id='whole'>
        <div id='upper-heading' className='gap-140'>
            <div id='Search' className='flex items-center gap-0.5'>
                <input id='search' type='text' placeholder='Search projects, tasks or people'/><button className='bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-800 size-9 rounded-md'><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <div id='icon'>
                <button className='size-8 cursor-pointer rounded-[50%] bg-blue-500 text-white hover:bg-blue-700'>
                    AC
                </button>
            </div>
        </div>
        <div id='main'>
            <h1 className='text-[35px] font-semibold'>Good morning, Anjali!</h1>
        </div>
    </div>
    
  )
}
