import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.svg'
import { FiUser, FiLogIn } from 'react-icons/fi'
import { useContext } from 'react'
import { ContextAuth } from '../../contexts/contestAuth'

export function Header() {

    const { user, loadingPage, itemsUser } = useContext(ContextAuth)


    return (
        <div className='w-full flex items-center justify-center h-16 mb-6 bg-slate-100 drop-shadow'>
            <header className='flex w-full max-w-7xl items-center  justify-between px-4'>
                <Link to={"/"}><img src={Logo} /></Link>



                <div className='flex gap-2 items-center'>
                    {itemsUser && (
                        <span>{itemsUser.name}</span>
                    )}
                    {!loadingPage && user && (
                        <Link to={"/dashboard"}> <div className='rounded-full border-2 p-1 border-gray-900'><FiUser size={22} /></div> </Link>
                    )}

                    {!loadingPage && !user && (
                        <Link to={"/login"}> <div className='rounded-full border-2 p-1 border-gray-900'><FiLogIn size={22} /></div> </Link>
                    )}
                    
                </div>
            </header>



        </div>
    )
}