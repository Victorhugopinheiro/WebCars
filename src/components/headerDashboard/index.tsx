import { Link } from "react-router-dom"
import {auth} from "../../services/firebaseconnection"
import { signOut } from "firebase/auth"

export function HeaderDashboard () {
    function logout () {
        signOut(auth)
    }

    return(
        <div className=" flex bg-red-700 w-full text-white gap-4 items-center mb-3 px-2 rounded-md">
            <Link to={"/dashboard"}>Dashboard</Link>
            <Link to={"/new"}>cadastrar carro</Link>
            <button className="p-2 ml-auto " onClick={logout}>Sair da conta</button>

        </div>
    )
}