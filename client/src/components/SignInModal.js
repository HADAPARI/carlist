import { useDispatch, useSelector } from "react-redux"
import { Modal, Button, Form } from "react-bootstrap"
import { useEffect, useState } from "react"
import { Eye, EyeSlash } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import { setUser } from "./Function"

const SignInModal = () => {
    //Pour afficher ou fermer le modale de connexion
    const signInState = useSelector(state => state.signIn)
    const handleClose = useDispatch()

    //Pour afficher le modale de connexion
    const handleShowLogIn = useDispatch()
    const ShowLogIn = (e) => {
        e.preventDefault()
        handleClose({type: "signIn", value: "hide"})
        handleShowLogIn({type: "logIn", value: "show"})
    }

    //etat des champs
    const fieldIsInvalid = {
        name:false,
        email:false,
        password:false,
        confirmPassword:false
    }

    const [FieldIsInvalid, setFieldIsInvalid] = useState(fieldIsInvalid)

    const connected = useDispatch()
    const ShowToastNotif = useDispatch()

    const SignIn = (e) => {
        e.preventDefault()
        setUser(SignInData).then((res)=>{
            if(res === "success") {
                // changer l'etat de connexion
                connected({type: "connected", value: true})
                ShowToastNotif({type: "toastNotif", value: "show",title:"Inscription",msg:"Inscription réussi, vous êtes connéctés"})
                handleClose({type: "signIn", value: "hide"})
            }
        })
    }

    // verifier les champs
    const VerifyField = () => {
        setSignInData(state => ({
            name:state.name.trim(),
            email:state.email.trim(),
            password:state.password.trim(),
            confirmPassword:state.confirmPassword.trim()
        }))
        
        setFieldIsInvalid(state => ({
            name:SignInData.name.trim()===""?true:false,
            email:SignInData.email.trim()===""?true:false,
            password:(SignInData.password.trim().length < 7?true:false),
            confirmPassword:(SignInData.confirmPassword.trim().length < 7?true:false) || (SignInData.password.trim()===SignInData.confirmPassword.trim()?false:true)
        }))
    }

    //donnée de connexion
    const signInData = {
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    }

    const [SignInData, setSignInData] = useState(signInData)

    const handleChange = (e) => {
        const {name,value} = e.target
        setFieldIsInvalid({...FieldIsInvalid,[name]:false})
        setSignInData({...SignInData,[name]:value})
    }

    //pour afficher ou cacher le mot de passe
    const [ShowPassword, setShowPassword] = useState(false)
    const [ShowConfirmPassword, setShowConfirmPassword] = useState(false)

    //reinitialiser les champs et ses états quand le modale se ferme
    useEffect(() => {
        if(!signInState){
            setFieldIsInvalid(fieldIsInvalid)
            setSignInData(signInData)
            setShowPassword(false)
            setShowConfirmPassword(false)
        } 
        // eslint-disable-next-line
    }, [signInState])

    return (
        <Modal show={signInState} onHide={() => handleClose({type: "signIn", value: "hide"})} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Inscrivez-vous</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={SignIn}>
                    <Form.Group className="mt-3 mx-3">
                        <Form.Control isInvalid={FieldIsInvalid.name}  minLength={3} maxLength={20} placeholder="name" name="name" value={SignInData.name} onChange={handleChange} required className="py-4"/>
                    </Form.Group>
                    <Form.Group className="mt-3 mx-3">
                        <Form.Control isInvalid={FieldIsInvalid.email} minLength={5} placeholder="email" name="email" value={SignInData.email} onChange={handleChange} required className="py-4"/>
                    </Form.Group>  
                    <Form.Group className="mx-3 position-relative">
                        <Form.Control isInvalid={FieldIsInvalid.password} minLength={7} maxLength={20} type={ShowPassword?"text":"password"} placeholder="mot de passe" name="password" value={SignInData.password} onChange={handleChange} required className="py-4"/>
                        <div className="position-absolute top-0 right-0 px-2 h-100 d-flex align-items-center">
                            {(ShowPassword)?
                                <EyeSlash className="cursor-pointer"  onClick={()=>setShowPassword(false)}/>:
                                <Eye className="cursor-pointer" onClick={()=>setShowPassword(true)}/> 
                            }
                        </div>
                    </Form.Group>
                    <Form.Group className="mx-3 position-relative">
                        <Form.Control isInvalid={FieldIsInvalid.confirmPassword} minLength={7} maxLength={20} type={ShowConfirmPassword?"text":"password"} placeholder="confirmer mot de passe" name="confirmPassword" value={SignInData.confirmPassword} onChange={handleChange} required className="py-4"/>
                        <div className="position-absolute top-0 right-0 px-2 h-100 d-flex align-items-center">
                            {(ShowConfirmPassword)?
                                <EyeSlash className="cursor-pointer"  onClick={()=>setShowConfirmPassword(false)}/>:
                                <Eye className="cursor-pointer" onClick={()=>setShowConfirmPassword(true)}/> 
                            }
                        </div>
                    </Form.Group>
                    <Form.Group className="d-flex mt-4 justify-content-center">
                        <Button type="submit" variant="primary" onClick={VerifyField} className="w-50 py-2">S'inscrire</Button>
                    </Form.Group>
                    <Form.Group className="d-flex mt-4 justify-content-center">
                        <Link to="" onClick={ShowLogIn}>Vous avez déjà un compte?</Link>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default SignInModal
