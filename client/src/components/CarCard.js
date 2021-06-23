import { useEffect } from 'react'
import { useState } from 'react'
import { Card, Form } from 'react-bootstrap'
import { ChatLeftText } from 'react-bootstrap-icons'
import { getCommentCount, getCommentList, getUserId } from './Function'
import io from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'

const CarCard = ({data}) => {
    const [ShowComment, setShowComment] = useState(false)
    const [CommentCount, setCommentCount] = useState(0)
    const [CommentList, setCommentList] = useState([])
    const [socket, setsocket] = useState("")

    useEffect(() => {
        getCommentCount(data.id).then(res=>{
            setCommentCount(res)
        })
        // connexion au socket
        setsocket(io.connect("http://localhost:7000")) 

        getCommentList(data.id).then(res=>{
            setCommentList(res)
        })
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        socket !== "" && socket.on("comment" + data.id ,value => {
            setCommentList(state => [...state,value])
            getCommentCount(data.id).then(res=>{
                setCommentCount(res)
            })
        })
        // eslint-disable-next-line
    }, [socket])

    const commentData = {
        senderId:"",
        carId:data.id,
        content:""
    }

    const [CommentData, setCommentData] = useState(commentData)

    const toggleComment = () => {
        setShowComment(state => !state)
        !connectedState && handleShowLogIn({type: "logIn", value: "show"})
    }

    const handleChange = (e) => {
        setCommentData({...CommentData,content:e.target.value})
    }

    const sendComment = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            socket.emit("comment",CommentData)
            setCommentData(commentData)
        }
    }

    const connectedState = useSelector(state => state.connected)

    //Pour afficher le modale de connexion
    const handleShowLogIn = useDispatch()

    useEffect(() => {
        connectedState && getUserId().then(res=>{
            setCommentData({...CommentData,senderId:res})
        })
        // eslint-disable-next-line
    }, [connectedState])

    

    return (
        <Card className="my-3 car-card hover-shadow">
            <Card.Img variant="top" src={"http://localhost:7000/" + data.fileName} className="w-100" />
            <Card.Body>
                <Card.Title className="mb-0 font-weight-bold">{data.mark + " " + data.model}</Card.Title>
                <Card.Text className="font-weight-bold text-muted">{data.description}</Card.Text>
                <Card.Text>{data.engine + " / " + data.kilometer + " km / " + data.year + " / " + data.gearbox}</Card.Text>
                <Card.Text className="font-weight-bold mb-0">Prix: <span className="text-info">{data.price} Euro</span></Card.Text>
                <div>
                    <ChatLeftText className="cursor-pointer mr-2" onClick={toggleComment}/>
                    {CommentCount} commentaire{CommentCount>1?"s":""}
                </div>
                <Form className={"mt-2 px-2 " + (ShowComment?"":"d-none")}>
                    <div className="comment-render mb-1">
                        {connectedState && CommentList.map((item,index)=>
                            <div className="d-flex my-1">
                                <div key={index} className="bg-secondary text-white rounded py-1 px-3">
                                    {item.content}
                                </div>
                            </div>
                        )}
                    </div>           
                    {connectedState && <Form.Control as="textarea" placeholder="ecrivez un commentaire" onKeyPress={sendComment} rows={1} value={CommentData.content} onChange={handleChange} className="mb-2 comment-content" />}
                </Form>
            </Card.Body>
        </Card>
    )
}

export default CarCard
