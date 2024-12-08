import { ReactNode, useContext } from "react"
import { ContextAuth } from "../contexts/contestAuth"
import { Navigate } from "react-router-dom"

interface ChildrenProps {
    children: ReactNode
}

export function Private ({children}: ChildrenProps) {

    const {user, loadingPage} = useContext(ContextAuth)

    if(loadingPage) {
        return <div></div>
    }

    if(!user){
        return <Navigate to={"/login"}/>
    }


    return children
}
    