import { Home } from './pages/home'
import { Car } from './pages/car'
import { Dashboard } from './pages/dashboard'
import { New } from './pages/dashboard/new'
import { Login } from './pages/login'
import { Register } from './pages/register'
import { Layout } from './components/layout'
import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import { Private } from './route/private'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[

      { element:<Home/>,
        path:'/'
      },
      { element:<Car/>,
        path:'/car/:id'
      },
      { element:<Private><Dashboard/></Private>,
        path:'/dashboard'
      },
      { element:<Private><New/></Private>,
        path:'/new'
      }




    ]
  },
  { element:<Login/>,
    path:'/login'
  },
  { element:<Register/>,
    path:'/register'
  }
])

export {router}
