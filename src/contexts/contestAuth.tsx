import { createContext, ReactNode, useState, useEffect } from "react";
import { auth } from "../services/firebaseconnection"
import { onAuthStateChanged } from "firebase/auth";

interface AuthProps {
    user: boolean
    loadingPage: boolean
    itemsUser: UserProps | null
    handleUser: ({name, email, uid}:UserProps) => void;
    
}

interface ChildrenProps {
    children: ReactNode
}

interface UserProps {
    uid: string
    email: string | null
    name: string | null
}

export const ContextAuth = createContext({} as AuthProps)

function ContextProvider({ children }: ChildrenProps) {

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log("Entrou na função")
            if (user) {
                const itemData = {
                    uid: user.uid,
                    email: user?.email,
                    name: user?.displayName
                    

                }
                setUser(itemData)
                setUserItems(itemData)
                setLoadingPage(false)
            }

            else {
                setUser(null)
                setLoadingPage(false)
                setUserItems(null)
            }

        })

        return () => {
            console.log("saiuuuuu")
            unsub()
        }

    }, [])


    const [userItems, setUserItems] = useState<UserProps | null > (null)
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingPage, setLoadingPage] = useState(true)


    function handleUser ({name,email,  uid}:UserProps){
        setUser({
            name,
            email,
            uid
        })

        console.log(setUser)
    }

    return (
        <ContextAuth.Provider value={{ user: !!user, loadingPage: loadingPage, itemsUser: userItems, handleUser }}>
            {children}
        </ContextAuth.Provider>

    )
}

export default ContextProvider
