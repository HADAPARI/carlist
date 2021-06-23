import React, { useState } from 'react'
import { Navbar, Button, Image, Spinner } from 'react-bootstrap'
import { BoxArrowLeft, BoxArrowInRight } from 'react-bootstrap-icons'
import { useDispatch, useSelector } from "react-redux"
import { logOut } from './Function'
import LogInModal from './LogInModal'
import SignInModal from './SignInModal'
import ToastNotif from './ToastNotif'
import logo from '../assets/img/car.png'

const NavigBar = () => {
    //Pour afficher le modale de connexion
    const handleShowLogIn = useDispatch()

    // prendre l'etat de connexion
    const connectedState = useSelector(state => state.connected)

    const connected = useDispatch()
    const ShowToastNotif = useDispatch()

    // se deconnecter
    const disconnect = () => {
        setShowAwait(true)
        logOut().then(()=>{
            connected({type: "connected", value: false})
            ShowToastNotif({type: "toastNotif", value: "show",title:"Déconnexion",msg:"Vous êtes déconnectés"})
            setShowAwait(false)
        })
    }

    const [ShowAwait, setShowAwait] = useState(false)

    return (
        <>
            <Navbar fixed="top" bg="dark" variant="dark" className="justify-content-between">
                <Navbar.Brand href="/" className="d-flex">
                    <Image src={logo} className="logo mr-2"/>
                    <h2 className="mb-0 d-none d-sm-block">Voiture Occasion</h2>
                </Navbar.Brand>
                <div>
                    {!connectedState? 
                        <Button variant="dark" onClick={() => handleShowLogIn({type: "logIn", value: "show"})}>
                            <BoxArrowInRight className="mr-2"/>
                            Se connecter
                        </Button>:
                        <Button variant="dark" onClick={disconnect}>
                            <BoxArrowLeft className="mr-2"/>
                            {ShowAwait?<Spinner animation="border" />:"Se déconnecter"}
                        </Button>
                    }
                </div>
            </Navbar>
            <LogInModal/>
            <SignInModal/>
            <ToastNotif/>
        </>
    )
}

export default NavigBar
