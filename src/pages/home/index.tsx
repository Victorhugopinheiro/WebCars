import { useState, useEffect } from "react"
import { Container } from "../../components/container"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "../../services/firebaseconnection"
import { Link } from "react-router-dom"


export interface Cars {
    id: string
    city: string
    created: string
    description: string
    image: ImageProps[]
    km: string | number
    model: string
    name: string
    price: string | number
    uid: string
    user: string
    whatsapp: string
    year: string


}



interface ImageProps {
    name: string
    uid: string
    url: string
}

export function Home() {

    const [car, setCar] = useState<Cars[]>([])

    const [idImage, setIdImage] = useState<string[]>([])

    const [input, setInput] = useState("")


    useEffect(() => {      

        getItems()

    }, [])

    function getImg (id: string){
        setIdImage((item) => [...item, id])
    }

    function getItems() {
        const colecao = collection(db, "cars")

        const ordem = query(colecao, orderBy("created", "desc"))

        getDocs(ordem)
            .then((snapshot) => {


                let listaItem = [] as Cars[]

                snapshot.forEach((doc) => {
                    listaItem.push(
                        {
                            id: doc.id,
                            created: doc.data().created,
                            description: doc.data().description,
                            image: doc.data().image,
                            km: doc.data().km,
                            model: doc.data().model,
                            name: doc.data().name,
                            price: doc.data().price,
                            uid: doc.data().uid,
                            user: doc.data().user,
                            whatsapp: doc.data().whatsapp,
                            year: doc.data().year,
                            city: doc.data().city


                        }
                    )

                })

                console.log(listaItem)

                setCar(listaItem)



            })
            .catch((e) => {
                console.log(e)
            })
    }


    async function findItem () {
        if(input === ""){
            getItems()
            return
        }

        setCar([])
        setIdImage([])

        const q = query(collection(db, "cars"), where("name", ">=", input.toUpperCase()), where("name", "<=", input.toUpperCase() + "\uf8ff") )

        const findItem = await getDocs(q)

        let listaItem = [] as Cars[]

        findItem.forEach((doc) => {
            listaItem.push({
                id: doc.id,
                created: doc.data().created,
                description: doc.data().description,
                image: doc.data().image,
                km: doc.data().km,
                model: doc.data().model,
                name: doc.data().name,
                price: doc.data().price,
                uid: doc.data().uid,
                user: doc.data().user,
                whatsapp: doc.data().whatsapp,
                year: doc.data().year,
                city: doc.data().city
            })
          })
      
         setCar(listaItem);
        

    }





    return (
        <Container>
            <section className="bg-red w-full max-w-3xl mx-auto flex justify-center items-center gap-3 rounded-lg p-4 my-4 ">
                <input onChange={(e) => setInput(e.target.value)} className="border-2 w-full h-10 rounded-lg  " placeholder="Nome do Carro..." />

                <button onClick={findItem} className="bg-red-600 p-1 px-2 rounded-lg">Buscar</button>
            </section>

            <h1 className="text-center text-xl font-bold mb-4">Carros novos e usados</h1>


            <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {car.map((item) => (
                    <Link key={item.id} to={`/car/${item.id}`}>
                        <section key={item.id} className="w-full flex flex-col border-b-2 border-gray-300 ">
                        <div className="bg-slate-300 h-72 w-full" style={{display: idImage.includes(item.id) ? "none" : "block"}}>

                        </div>
                        <img className="w-full max-h-72  mb-2 " style={{display: idImage.includes(item.id) ? "block" : "none"}} src={item.image[0].url} onLoad={() => getImg(item.id)} />

                        <span className="font-medium mb-2">{item.name}</span>

                        <div className="flex flex-col gap-6">
                            <span className="">Ano: {item.year} | {item.km} km</span>

                            <strong className=" mb-1">{item.price.toLocaleString("pt-BR", {
                                style:"currency",
                                currency:"BRL"
                            })}</strong>
                        </div>

                    </section>
                    </Link>
                ))}






            </main>

        </Container>

    )
}