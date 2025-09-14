import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-60">
        <h2 className='text-2xl'>Create Your <span className='text-4xl font-bold'> Notes</span> and Start Your <span className='text-4xl font-bold'> Organization</span></h2>
        <div className="mt-4">
          <div className='bg-blue-300 text-black p-2 text-xl rounded' onClick={()=>navigate('/login')}>
          <button type='click' className="cursor-pointer">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
