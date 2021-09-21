import Message from '../Message/Message';
import './chatBox.css'
import React,{useState,useEffect,useContext,useRef} from 'react'
import { useHistory,useParams } from 'react-router-dom';
import {UserContext} from '../../App'



const ChatBox = () => {

    const [message,setMessage] = useState("")
    const [messages,setMessages] = useState([])
    const [hasImage,setHasImage] = useState(false)

    const {state,dispatch1} = useContext(UserContext)
    const {convId,dispatch2} = useContext(UserContext)

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
      }, [messages]);

    const createMessage = () => {
        fetch("/createMessage",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                conversationId:convId._id,
                text:message,
                senderId:state._id
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    useEffect(() => {
        {convId && 
            fetch(`/message/${convId._id}`,{
                headers:{
                    "authorization":"Bearer "+localStorage.getItem("jwt")
                }
            })
            .then(res=>res.json())
            .then(result=>{
                setMessages(result.message)
            })
            .catch(err=>{
                console.log(err)
            })}
    }, [convId,messages])

    const today = new Date()
    const date = today.toLocaleDateString()
    
    return (
        <>{convId ?
        <>
            <div className="topBar">
                <div className="topBarWrap">
                    <img src={convId && convId.profilePic} alt="img" className="chatWithImg" />
                    <span className="chatWithName">{convId && convId.currentUser}</span>
                    
                </div>
                <div className="date">{date}</div>
            </div>
            <div className="messageSection">
                {messages && messages.map(message=>{
                    return (
                        <div ref={messagesEndRef} key={message._id}>
                            <Message text={message.text} own={message.sender !== state._id?true:false} time={message.createdAt}/>
                        </div>
                    )
                })}
            </div>
            <div className="inuptSection">
                <div className="inputSectionWrapper">
                    <textarea className="pHolder" placeholder="write a message..." value={message} onChange={(e)=>{
                        setMessage(e.target.value)
                    }}/>
                    <button className="button" onClick={()=>{createMessage()
                    setMessage("")
                    }}>Send Message</button>
                </div>
            </div>
        </>:<div style={{textAlign:"center"}}><h5 style={{color:"grey",fontWeight:"800",fontSize:"100px"}}>OPEN CONVERSATION TO START CHATTING</h5></div>}</>
    );
}
 
export default ChatBox;