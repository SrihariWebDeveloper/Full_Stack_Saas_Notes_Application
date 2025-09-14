import React, { useContext } from 'react'
import { NotesContext } from '../Context/Context.jsx'
import {useNavigate} from "react-router-dom"

const NavBar = () => {
  const {token} = useContext(NotesContext);
  const navigate = useNavigate();
  return (
    <div className='flex flex-row justify-between items-center bg-blue-100 p-4'>
      <div className="text-2xl font-bold mt-2" onClick={()=>navigate('/')}>
        <h2 className='cursor-pointer'>Notes.App</h2>
      </div>
      <div className="">
        {token?<div className='bg-blue-300 text-black p-2 rounded' onClick={()=>navigate('/login')}>
          <button type='click' className="cursor-pointer">Create Account</button>
        </div>:<div className='flex flex-row justify-between items-center gap-2'>
          <div className="border p-2 px-4 rounded-full  hover:bg-amber-300">
            <p className='cursor-pointer'>Creads <span>3</span></p>
          </div>
          <div className='border p-2 px-4 rounded-full'>
          <h2 className='mt-0.5 cursor-pointer'>S</h2>
          </div>
          </div>}
      </div>
    </div>
  )
}

export default NavBar
