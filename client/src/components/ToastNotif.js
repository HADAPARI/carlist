import {Toast} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const ToastNotif = () => {
    //Pour afficher ou fermer le modale de connexion
    const toastNotifState = useSelector(state => state.toastNotif)
    const handleClose = useDispatch()

    return (
        <Toast show={toastNotifState.show} onClose={() => handleClose({type: "toastNotif", value: "hide"})} delay={4000} autohide className="position-fixed toast-notif mr-1 bottom-0 right-0">
          <Toast.Header className="bg-dark text-white">
            <strong className="mr-auto">{toastNotifState.title}</strong>
          </Toast.Header>
          <Toast.Body >{toastNotifState.msg}</Toast.Body>
        </Toast>
    )
}

export default ToastNotif
