import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface FormProps {
    placeholder: string
    name:string
    type:string
    register: UseFormRegister<any>
    error?: string
    rules?: RegisterOptions 
}

export function Input ({placeholder, name, type, register, rules, error}:FormProps) {
    return(
        <div>
            <input className="w-full border-2 rounded-md h-11 px-2 " placeholder={placeholder} type={type}
            {...register(name,rules)}
            id={name}
            />
            {error && <p className="my-1 text-red-800">{error}</p>}
        </div>
    )
}