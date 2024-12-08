import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Cars } from "../home"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../services/firebaseconnection"
import { Container } from "../../components/container"
import { FaWhatsapp } from "react-icons/fa"
import { Swiper, SwiperSlide } from 'swiper/react'

export function Car() {
    const [car, setCar] = useState<Cars>()
    const [pagination, setPagination] = useState<number>(2)

    const { id } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        async function getItem() {
            if (!id) { return }

            const locItem = doc(db, "cars", id)
            getDoc(locItem)
                .then((snapshot) => {
                    if (!snapshot.data()) {
                        navigate("/")
                    }

                    setCar({
                        id: snapshot.id,
                        city: snapshot.data()?.city,
                        created: snapshot.data()?.created,
                        description: snapshot.data()?.description,
                        image: snapshot.data()?.image,
                        km: snapshot.data()?.km,
                        price: snapshot.data()?.price,
                        uid: snapshot.data()?.uid,
                        user: snapshot.data()?.user,
                        name: snapshot.data()?.name,
                        model: snapshot.data()?.model,
                        whatsapp: snapshot.data()?.whatsapp,
                        year: snapshot.data()?.year,
                    })

                })
            console.log(car)

        }

        getItem()

    }, [])

    useEffect(() => {

        function getResize() {
            if (window.innerWidth < 720 || car?.image.length === 1) {
                setPagination(1)

            } else {
                setPagination(2)
            }


        }


        window.addEventListener("resize", getResize)

        return () => {
            window.removeEventListener("resize", getResize)
        }

        getResize()

    }, [])



    return (
        <Container>

            {car && (
                <Swiper
                    slidesPerView={pagination}
                    pagination={{ clickable: true }}
                    navigation

                >
                    {car?.image.map((imagem) => (
                        <SwiperSlide>
                            <img className="w-full h-96 object-cover" src={imagem.url} />
                        </SwiperSlide>
                    ))}


                </Swiper>
            )}

            {car && (
                <main className="w-full py-2 flex flex-col gap-4 bg-slate-200 p-4 rounded-md ">
                    <div className="flex flex-col sm:flex-row justify-between ">
                        <h1 className="font-medium text-2xl ">{car.city}</h1>
                        <h1>R${car.price}</h1>
                    </div>
                    <p className="">{car.model}</p>

                    <div className="flex gap-6 ">
                        <div className="flex flex-col ">
                            <p>Cidade</p>
                            <strong>{car.city}</strong>
                        </div>

                        <div className="border-r-2 border-gray-300  ">

                        </div>

                        <div className="flex flex-col ">
                            <p>Km</p>
                            <strong>{car.km}</strong>
                        </div>
                    </div>

                    <div className="">
                        <p>Ano</p>
                        <strong>{car.year}</strong>
                    </div>

                    <div className="">
                        <strong>Descrição</strong>
                        <p>{car.description}</p>
                    </div>

                    <div className="">
                        <strong>Telefone/WhatsApp</strong>
                        <p>{car.whatsapp}</p>
                    </div>

                    <a href={`https://api.whatsapp.com/send?phone=${car.whatsapp}&text=Olá vi esse ${car.name} no WebCars e fique interessado(a)`} className="flex gap-2 bg-green-600 w-full h-10 rounded-md justify-center items-center shadow-md">
                        <p className="text-white font-medium">Conversar com vendedor</p>
                        {<FaWhatsapp color="white" size={26} />}
                    </a>
                </main>
            )}
        </Container>
    )
}