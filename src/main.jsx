import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/home.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About_us from './pages/about us.jsx'
import Courses from './pages/courses.jsx'
import Blog from './pages/Blog.jsx'

let all_routes = createBrowserRouter(
  [
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/about',
      element:<About_us/>
    },
    {
      path:'/courses',
      element:<Courses/>
    },
    {
      path:'/blog',
      element:<Blog/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={all_routes}/>
  </StrictMode>,
)
