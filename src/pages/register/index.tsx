import { Container } from "../../components/container";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg"
import { Input } from "../../components/input";
import {useForm} from "react-hook-form"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import {auth} from "../../services/firebaseconnection"
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useEffect, useContext } from "react";
import { ContextAuth } from "../../contexts/contestAuth";





const schema = z.object({
    name: z.string().min(8,"Digite seu nome compelto"),
    email: z.string().email("Digite um email valido").min(1,"O campo de senha é obrigatório"),
    password: z.string().min(8,"O campo senha precisa de pelo menos 8 caracteres")
})

type FormData = z.infer<typeof schema>


export function Register () {
    const {handleUser} = useContext(ContextAuth)

    const navigate = useNavigate()

    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    async function getForm (data:FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then( async (user) => {
            console.log(user)
            console.log(user.user)
            await updateProfile(user.user,{
                displayName: data.name
            })
            
            handleUser({
                name: data.name,
                email:data.email,
                uid: user.user.uid
            })

            console.log("cadastrado com sucesso")
            navigate("/dashboard", {replace: true})

        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        function logout () {
            
            signOut(auth)
        }

        logout()
    }, [])

    return(
        <Container>
            <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
                <Link className="w-full max-w-sm" to={"/"}>
                    <img className="w-full" src={Logo}/>
                </Link>
                
                <form className="bg-white w-full max-w-xl " onSubmit={handleSubmit(getForm)}>

                    <div className="mb-3">
                    <Input placeholder="Digite seu nome completo " type="text" name="name"
                    error={errors.name?.message} register={register} 
                    />
                    </div>
                    
                    <div className="mb-3">
                    <Input placeholder="Digite o Email " type="email" name="email"
                    error={errors.email?.message} register={register} 
                    />
                    </div>

                    <div className="mb-3">
                    <Input placeholder="Digite a sua senha " type="password" name="password"
                    error={errors.password?.message} register={register} 
                    />
                    </div>

                    

                    <button className="bg-slate-950 text-white font-medium w-full p-2 rounded hover:scale-105 transition-all">Acessar</button>
                    

                </form>

            </div>

        </Container>
    )
}