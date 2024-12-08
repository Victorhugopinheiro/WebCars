import { Container } from "../../components/container"
import { HeaderDashboard } from "../../components/headerDashboard"
import { useState, useEffect, useContext } from "react"
import { collection, where, getDocs, query, doc, deleteDoc } from "firebase/firestore"
import { db, storage } from "../../services/firebaseconnection"
import { ContextAuth } from "../../contexts/contestAuth"
import { FiTrash } from "react-icons/fi"

import { deleteObject } from "firebase/storage"
import { ref } from "firebase/storage"
import toast from "react-hot-toast"

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

export function Dashboard() {
    const [car, setCar] = useState<Cars[]>([])

    const [idImage, setIdImage] = useState<string[]>([])


    const { itemsUser } = useContext(ContextAuth)

    useEffect(() => {
        function getItems() {
            const away = collection(db, "cars")

            const findItem = query(away, where("uid", "==", itemsUser?.uid))

            getDocs(findItem)
                .then((item) => {

                    let listaItem = [] as Cars[]

                    item.forEach((doc) => {
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

                    setCar(listaItem)



                })
                .catch((e) => {
                    console.log(e)
                })

        }

        getItems()

    }, [])

    function getImg(id: string) {
        setIdImage((item) => [...item, id])
    }

    async function deteItem(item: Cars) {
        const findDoc = doc(db, "cars", item.id)
        await deleteDoc(findDoc)


        item.image.map(async (imagem) => {
            const locImg = `images/${imagem.uid}/${imagem.name}`
            const referencia = ref(storage, locImg)

            try {

                await deleteObject(referencia)
                setCar(car.filter((prod) => prod.id !== item.id))
                toast.success("Item deletado")
            }
            catch {
                console.log("Erro no dashboard")
            }





        })


        setCar(car.filter((item) => item.id !== item.id))
    }






    return (
        
            <Container>
                <HeaderDashboard />

                <main className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {car.map((item) => (
                        <section key={item.id} className="w-full relative ">
                            <button onClick={() => deteItem(item)} className="absolute w-10 h-10 bg-white rounded-full flex justify-center items-center right-2 top-1">
                                {<FiTrash size={26} />}
                            </button>
                            <img className="w-full max-h-72 rounded-md" src={item.image[0].url}
                                onLoad={() => getImg(item.id)}
                                style={{ display: idImage.includes(item.id) ? "block" : "none" }}
                            />

                            <strong className="mb-2">{item.name}</strong>

                            <p className="mb-4">Ano: {item.year} | {item.km} km </p>

                            <p className="font-bold">{item.price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            }
                            )}</p>
                            <div className="w-full h-px my-1 bg-slate-300 "></div>
                            <p>{item.city}</p>
                        </section>
                    ))}

                </main>
            </Container>
        
    )
}