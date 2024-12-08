import { FiTrash, FiUpload } from "react-icons/fi";
import { Container } from "../../../components/container";
import { HeaderDashboard } from "../../../components/headerDashboard";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { ChangeEvent, useState } from "react";
import {v4 as uuidV4} from "uuid"
import { useContext } from "react";
import { ContextAuth } from "../../../contexts/contestAuth";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../services/firebaseconnection";
import { addDoc, collection} from "firebase/firestore";
import toast from "react-hot-toast";

const schema = z.object({
    name: z.string().min(1,"O campo nome é obrigatório"),
    model: z.string().min(1,"O modelo é obrigatório"),
    year: z.string().min(1,"O ano é obrigatório"),
    km: z.string().min(1,"Km é obrigatório"),
    whatsapp: z.string().min(1,"O número é obrigatório").refine((item) => /^(\d{10,11})$/.test(item), {
        message: "Número de telefone inválido"
    }),
    city: z.string().min(1,"A cidade é obrigatória"),
    price: z.string().min(1,"O preço é obrigatório"),
    description: z.string().min(1,"A descrição é obrigatória"),
})
    type PropsItems = z.infer<typeof schema>


    interface CarProps{
        name:string
        uid:string
        preview: string
        url:string

    }

export function New () {

    const {itemsUser} = useContext(ContextAuth)

    const {register, handleSubmit, formState: {errors}, reset} = useForm<PropsItems>({
        resolver: zodResolver(schema),
        mode:"onChange"
        

    })


    function submitItems (dados:PropsItems){
        

        if(imageCar.length === 0 ){
            return
        }


        const filterProps = imageCar.map((item) => {
            return{
                uid: item.uid,
                name: item.name,
                url: item.url
            }
        })

        addDoc(collection(db, "cars"), {
            name: dados.name.toUpperCase(),
            model: dados.model,
            whatsapp: dados.whatsapp,
            city: dados.city,
            year: dados.year,
            km: dados.km,
            price: dados.price,
            description: dados.description,
            created: new Date(),
            user: itemsUser?.name,
            uid: itemsUser?.uid,
            image: filterProps
        })
        .then(() => {
            reset()
            setImageCar([])
            console.log("Cadastrado com sucesso")
            toast.success("Carro cadastrado com sucesso")

        })
        .catch((e) => {
            console.log("Erro ao cadastrar")
            console.log(e)
            toast.error("Erro ao cadastrar seu carro")
        })
    }


    async function getImage(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0] ){
            const image = e.target.files[0]

            if(image.type === "image/jpeg" || image.type === "image/png")
                await addImage(image)
        }
            else{
                alert("Tipo de imagem invalido")
                return
            }

        
    }
    const [imageCar, setImageCar] = useState<CarProps[]>([])


    async function addImage (image: File) {

        if(!itemsUser?.uid){
            return
        }

        const uidUser = itemsUser?.uid
        const uidImage = uuidV4();

        const uploadRed = ref(storage, `images/${uidUser}/${uidImage}`)

        uploadBytes(uploadRed, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadUrl) => {
                console.log("image cadastrada", downloadUrl)
                toast.success("Imagem cadastrada")
                const imageItem = {
                    name: uidImage,
                    uid: uidUser,
                    preview: URL.createObjectURL(image),
                    url: downloadUrl,
                  }
        
                  setImageCar((item) => [...item, imageItem])
                  
            })
        })
    }

    
    async function deleteItem(item:CarProps) {


        const caminho = `images/${item.uid}/${item.name}`

        const imageRef = ref(storage, caminho)

        try{
            deleteObject(imageRef)
            toast.success("Item deletado")

            setImageCar(imageCar.filter((image) => image.url !== item.url ))
        }catch{
            console.log("Erro ao deletar item")
            toast.error("Erro ao deletar")
        }
    }

    


    return(
        <Container>
            <HeaderDashboard/>               
                <div className="mt-3 bg-white p-2 w-full flex flex-col items-center sm:flex-row mb-4 gap-2 rounded-md ">
                    <button className="w-48 border-2 border-gray-600 flex justify-center items-center cursor-pointer h-32">
                        <div className="absolute"><FiUpload size={30}/></div>

                        <div className=" cursor-pointer opacity-0"><input onChange={getImage} className=" cursor-pointer" type="file" accept="image/*"/></div>
                    </button> 

                    {imageCar.map((item) => (
                        

                        <div className="w-full h-32 relative flex justify-center items-center" key={item.name} > 

                        <button onClick={() => deleteItem(item)} className="absolute">{<FiTrash size={26}/>}</button>

                            <img className="w-full h-32 object-cover" src={item.preview}/>
                            

                        </div>
                    ))}       
                </div>



            <div className="w-full bg-white p-3 flex flex-col sm:flex-row items-center gap-2 rounded-md ">
                <form onSubmit={handleSubmit(submitItems)} className="w-full">
                    <div className="mb-4"> 
                        <p className="mb-1 font-medium">Nome do Carro</p>
                        <Input placeholder="Digite o nome " register={register} type="text" name="name" error={errors.name?.message}/>
                    </div>

                    <div className="mb-4"> 
                        <p className="mb-1 font-medium">Model</p>
                        <Input placeholder="Digite o nome " register={register} type="text" name="model" error={errors.model?.message}/>
                    </div>

                <div className="flex gap-3">

                    <div className="mb-4 w-full flex-auto"> 
                        <p className="mb-1 font-medium">Ano</p>
                        <Input placeholder="Digite o nome " register={register} type="text" name="year" error={errors.year?.message}/>
                    </div>

                    <div className="mb-4 w-full flex-auto"> 
                        <p className="mb-1 font-medium">Km rodados</p>
                        <Input placeholder="Digite o nome " register={register} type="text" name="km" error={errors.km?.message}/>
                    </div>

                </div>

                

                <div className="flex gap-3">

                    <div className="mb-4 w-full flex-auto">  
                        <p className="mb-1 font-medium">Telefone / WhatsApp</p>
                        <Input placeholder="Digite o nome " register={register} type="text" name="whatsapp" error={errors.whatsapp?.message}/>
                    </div>

                    <div className="mb-4 w-full flex-auto"> 
                        <p className="mb-1 font-medium">Cidade</p>
                        <Input placeholder="Digite o nome " register={register} type="text" name="city" error={errors.city?.message}/>
                    </div>

                </div>

                <div className="mb-4"> 
                    <p className="mb-1 font-medium">Preço</p>
                    <Input placeholder="Digite o nome " register={register} type="text" name="price" error={errors.price?.message}/>
                </div>

                <div className="mb-4"> 
                    <p className="mb-1 font-medium">Descrição</p>
                    <textarea className="border-2 w-full border-gray-300 h-24 rounded-md mb-1 " placeholder="Digite a descrição" 
                        {...register("description")} name="description" id="description"/>
                        {errors.description && (<p className="text-red-800">{errors.description?.message}</p>)}
                </div>


                <button type="submit" className="w-full bg-black text-white p-2 rounded-md">Cadastrar</button>
                    

                </form>
            </div>
        </Container>
    )
}