import React from 'react'
import Navbar from '../Common/Navbar'
import './home.css'
import Homemain from '../Common/home-main'
export default function Home() {
  return (
    <div className='main'>
        <Navbar/>
        <Homemain/>
    </div>
  )
}
