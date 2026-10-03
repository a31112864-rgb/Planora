import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <div className='main min-w-[14vw] max-w-[15vw]'>
        <div style={{padding: '0 0 0 15px'}}>
            <h2 className='text-white text-[30px] font-semibold'>Planora</h2>
        </div>
        <ul>
            <li><Link to={'/'}> <i className="fa-solid fa-house"></i> Home</Link></li>
            <li><Link to={'/projects'}> <i className="fa-regular fa-folder-closed"></i> Projects</Link></li>
            <li><Link to={'/tasks'}> <i className="fa-regular fa-file"></i> Tasks</Link></li>
            <li><Link to={'/team'}> <i className="fa-solid fa-users"></i> Team</Link></li>
            <li><Link to={'/reports'}> <i className="fa-solid fa-chart-column"></i> Reports</Link></li>
        </ul>
    </div>
  )
}
