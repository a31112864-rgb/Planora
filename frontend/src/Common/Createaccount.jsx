import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function Createaccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Submit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });
  
       const data = await response.json();
  
      if (data.message == "User sign up successful!") {
        toast.success("Sign in Successful!");
      } 
      if (data.message=="User sign up failed.") {
        toast.error("Invalid Email or Password!");
      }
  
    } catch (error) {
        console.error(error);
        toast.error("Server connection failed!");
      }
  };
  return (
    <div >
      <Toaster/>
      <div className='fixed w-80 h-100 bg-white border-red-500 rounded-md border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' style={{padding: '10px 0px 0px 10px'}}>
        <h3 className='text-black text-[25px] font-semibold'>Sign Up</h3>
        <form onSubmit={Submit} className='flex flex-col'>
          <label htmlFor='Username'>Username:</label>
          <input
          style={{padding: '0px 0px 0px 5px'}}
          id='Username'
          type='Text'
          value={username}
          placeholder='Write your name here'
          onChange={(e) => setUsername(e.target.value)}
          />
          <br/>
          <label htmlFor='Email'>Email:</label>
          <input
          style={{padding: '0px 0px 0px 5px'}}
          id='Email'
          value={email}
          type='Email'
          placeholder='Write your email here'
          onChange={(e) => setEmail(e.target.value)}
          />
          <br/>
          <label htmlFor='Password'>Password:</label>
          <input
          style={{padding: '0px 0px 0px 5px'}}
          id='Password'
          value={password}
          type='Password'
          placeholder='Write your Password here'
          onChange={(e) => setPassword(e.target.value)}
          />
          <br/>
          <br/>
          <button type='submit' className='cursor-pointer mt-auto mb-2 flex justify-center items-center rounded-md text-black font-semibold w-20 h-10 bg-yellow-500 active:bg-yellow-600'>Sign up</button>
        </form>
      </div>
    </div>
  )
}
