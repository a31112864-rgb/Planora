import React from 'react'
import "./Navbar.css"
import { NavLink } from 'react-router-dom'
export default function Navbar() {
  return (
    <div className='main min-w-[14vw] max-w-[15vw]'>
        <div style={{padding: '0 0 0 15px'}}>
            <h2 className='text-white text-[30px] font-semibold'>Planora</h2>
        </div>
        <ul>
            <li className='hover:bg-gray-800'><NavLink to={'/'} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}> <i className="fa-solid fa-house"></i> Home</NavLink></li>
            <li className='hover:bg-gray-800'><NavLink to={'/projects'} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}> <i className="fa-regular fa-folder-closed"></i> Projects</NavLink></li>
            <li className='hover:bg-gray-800'><NavLink to={'/tasks'} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}> <i className="fa-regular fa-file"></i> Tasks</NavLink></li>
            <li className='hover:bg-gray-800'><NavLink to={'/team'} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}> <i className="fa-solid fa-users"></i> Team</NavLink></li>
            <li className='hover:bg-gray-800'><NavLink to={'/reports'} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}> <i className="fa-solid fa-chart-column"></i> Reports</NavLink></li>
        </ul>
    </div>
  )
}
