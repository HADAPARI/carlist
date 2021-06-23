import { useDispatch, useSelector } from "react-redux"
import { Modal, Button, Form, Spinner } from "react-bootstrap"
import { useEffect, useState } from "react"
import { Eye, EyeSlash } from "react-bootstrap-icons"
import { logIn } from "./Function"

const LogInModal = () => {
    
    //Pour afficher ou fermer le modale de connexion
    const logInState = useSelector(state => state.logIn)
    const handleClose = useDispatch()
    
    //Pour afficher le modale d'inscription
    const handleShowSignIn = useDispatch()
    const ShowSignIN = () => {
        handleClose({type: "logIn", value: "hide"})
        handleShowSignIn({type: "signIn", value: "show"})
    }

    //etat des champs
    const fieldIsInvalid = {
        email:false,
        password:false
    }

    const [FieldIsInvalid, setFieldIsInvalid] = useState(fieldIsInvalid)

    const connected = useDispatch()
    const ShowToastNotif = useDispatch()

    // se connecter
    const Connexion = (e) => {
        e.preventDefault()
        setShowAwait(true)
        logIn(LogInData).then(res=>{
            if(res === "success") {
                // changer l'etat de connexion
                connected({type: "connected", value: true})
                setShowAwait(false)
                ShowToastNotif({type: "toastNotif", value: "show",title:"Connexion",msg:"Vous êtes connectés"})
                handleClose({type: "logIn", value: "hide"})
            }
        })
    }

    // varifier les champs
    const VerifyField = () => {
        setLogInData(state => ({
            email:state.email.trim(),
            password:state.password.trim()
        }))
        
        setFieldIsInvalid(state => ({
            email:LogInData.email.trim().length < 7?true:false,
            password:LogInData.password.trim().length < 7?true:false
        }))
    }

    //donnée de connexion
    const logInData = {
        email:"",
        password:""
    }

    const [LogInData, setLogInData] = useState(logInData)

    const handleChange = (e) => {
        const {name,value} = e.target
        setFieldIsInvalid({...FieldIsInvalid,[name]:false})
        setLogInData({...LogInData,[name]:value})
    }

    //pour afficher ou cacher le mot de passe
    const [ShowPassword, setShowPassword] = useState(false)
    
    //reinitialiser les champs et ses états quand le modale se ferme
    useEffect(() => {
        if(!logInState){
            setFieldIsInvalid(fieldIsInvalid)
            setLogInData(logInData)
            setShowPassword(false)
            setShowAwait(false)
        } 
        // eslint-disable-next-line
    }, [logInState])
    
    const [ShowAwait, setShowAwait] = useState(false)

    return (
        <Modal show={logInState} onHide={() => handleClose({type: "logIn", value: "hide"})} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Connectez-vous</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={Connexion}>
                    <Form.Group className="mt-3 mx-3">
                        <Form.Control isInvalid={FieldIsInvalid.email} minLength={5} placeholder="email" name="email" value={LogInData.email} onChange={handleChange} required className="py-4"/>
                    </Form.Group>
                    <Form.Group className="mx-3 position-relative">
                        <Form.Control isInvalid={FieldIsInvalid.password} minLength={7} maxLength={20} type={ShowPassword?"text":"password"} placeholder="mot de passe" name="password" value={LogInData.password} onChange={handleChange} required className="py-4"/>
                        <div className="position-absolute top-0 right-0 px-2 h-100 d-flex align-items-center">
                            {(ShowPassword)?
                                <EyeSlash className="cursor-pointer"  onClick={()=>setShowPassword(false)}/>:
                                <Eye className="cursor-pointer" onClick={()=>setShowPassword(true)}/> 
                            }
                        </div>
                    </Form.Group>
                    <Form.Group className="d-flex mt-4 justify-content-center">
                        <Button type="submit" variant="primary" onClick={VerifyField} className="w-50 py-2">{ShowAwait?<Spinner animation="border" />:"Se connecter"}</Button>
                    </Form.Group>
                    <Form.Group className="d-flex mt-4 justify-content-center">
                    <Button variant="success" className="w-50 py-2" onClick={ShowSignIN}>Créer un compte</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default LogInModal
