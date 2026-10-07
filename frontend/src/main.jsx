import { StrictMode } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Projects from './pages/Projects.jsx'
import Tasks from './pages/Tasks.jsx'
import Team from './pages/Team.jsx'
import Reports from './pages/Reports.jsx'
import Createaccount from './Common/Createaccount.jsx'

let all_routes = createBrowserRouter(
  [
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/projects',
      element:<Projects/>
    },
    {
      path:'/tasks',
      element:<Tasks/>
    },
    {
      path:'/team',
      element:<Team/>
    },
    {
      path:'/reports',
      element:<Reports/>
    },
    {
      path:'/createAccount',
      element:<Createaccount/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={all_routes}/>
  </StrictMode>,
)
