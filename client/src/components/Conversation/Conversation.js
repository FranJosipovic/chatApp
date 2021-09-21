import React,{useState,useEffect, useContext,useRef} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
import './conversation.css'
import { Link,useHistory } from 'react-router-dom'
import {io} from 'socket.io-client'

const Conversation = ({}) => {

    
    const [search,setSearch] = useState("")
    const [userDetails,setUserDetails] = useState([])
    const [conversations,setConversations] = useState([]) 
    const [connectedUsers,setConnectedUsers] = useState([])
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    const[hasImage,setHasImage] = useState(false)

    const {state,dispatch1} = useContext(UserContext) 
    const {convId,dispatch2} = useContext(UserContext) 

    const history = useHistory()

    const searchModal = useRef(null)
    const searchModal2 = useRef(null)
    const socket = useRef()
    
    useEffect(()=>{
      socket.current = io("ws://localhost:8900")
    },[])

    useEffect(()=>{
        {state &&
        socket.current.emit("addUser",state._id)
        socket.current.on("getUsers",users=>{
          setConnectedUsers(users)
        })
    }
    },[state])

    useEffect(() => {
        M.Modal.init(searchModal.current)
        M.Modal.init(searchModal2.current)
        fetch("/myconversations",{
          headers:{
            "authorization":"Bearer "+localStorage.getItem("jwt")
          }
        })
        .then(res=>res.json())
        .then(result=>{
          setConversations(result.conversation)
        })
        .catch(err=>{
          console.log(err)
        })
    }, [])

    useEffect(() => {
      if(url){
          fetch("/updateprofilepic",{
              method:"put",
              headers:{
                  "Content-type":"application/json",
                  "authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  newPic:url
              })
          })
          .then(res => res.json())
          .then(result => {
              localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
              dispatch1({type:"UPDATEPIC",payload:result.pic})
          })
          .catch(err => {
              console.log(err)
          })
      }
  }, [url])

    const postDetails = () => {
      const data = new FormData()
      data.append("file",image)
      data.append("upload_preset","chatApp")
      data.append("cloud_name","fran123")
      fetch("https://api.cloudinary.com/v1_1/fran123/image/upload",{
          method : 'POST',
          body:data
      }).then(res=>res.json())
      .then(data=>{
          console.log(data.url)
          setUrl(data.url)
      })
      .catch(err=>console.log(err))
  }

    const fetchUser = (query) => {
        setSearch(query)
        fetch("/search-user",{
          method:"post",
          headers:{
            "Content-Type":"application/json",
            "authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            query
          })
        })
        .then(res=>res.json())
        .then(result =>{
          setUserDetails(result.user)
        })
      }

    const createConversation = (id) => {
        fetch("/create-conv",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                memberId:id
            })
        })
        .then(res=>res.json())
        .then(conversation=>{
            console.log(conversation)
        })
    }


    return ( 
    <>    
        <div className="search">
        <div style={{display:"flex",alignContent:"baseline"}}>
            {state && <img src={state.pic} alt="img" className="chatWithImg modal-trigger" data-target="modal2"/>}
            <h6 style={{fontSize:"24px",marginLeft:"12px"}}>{state && state.name}</h6>
        </div>
        <div>
            <i className="material-icons modal-trigger" data-target="modal1">search</i>
        </div>
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
        <div>
          {conversations && conversations.map(conv=>{
            const displayMember = conv.members.find(member => member.name !== state.name)
            console.log(displayMember)
            let ids = []
            connectedUsers.map(connectedUser => {
              ids.push(connectedUser.userId)
            })
            const isOnline = ids.includes(displayMember._id)
            return(
                <div className="conversationRoom" key={conv._id} onClick={()=>{
                  dispatch2({type:"CONVERSATION",payload:{_id:conv._id,currentUser:displayMember.name,profilePic:displayMember.pic}})
                  }}>
                  <img src={displayMember.pic} alt="img" className="chatWithImg" />
                  <span className="convName">{displayMember ? displayMember.name : "loading..."}</span>
                  <div className={isOnline?"online":"offline"}></div>
                </div>
            )
          })}
          </div>
          <div>
            <button style={{width:"100%",padding:"10px",backgroundColor:"red",color:"white",border:"none",borderRadius:"10px",cursor:"pointer",marginBottom:"0"}}
            onClick={
              ()=>{localStorage.clear()
              history.push("/")
              }
            }
            >Log out</button>
          </div>
        </div>

        <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
            <div className="modal-content">
            <input
                type="text"
                placeholder="search"
                value={search}
                onChange={(e)=>fetchUser(e.target.value)}
                />
                <ul className="collection" style={{display:"flex", color:"black",flexDirection:"column"}}>
                  {userDetails.map(item=>{
                    if(search === ''){
                      return null
                    }else{return(
                        <div className="searchDiv">    
                            <li key={item._id} className="collection-item">{item.name}</li>
                            <button style={{backgroundColor:"blue",color:"white",borderRadius:"10px",border:"0"}} onClick={()=>{createConversation(item._id)}}>Create conversation</button>
                        </div>
                    )}
                  })
                  }
                </ul>
            </div>
            <div className="modal-footer">
              <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch('')}}>Close</button>
            </div>
          </div>

        <div id="modal2" className="modal" ref={searchModal2} style={{color:"black"}}>
            <div className="modal-content">
              <div className="file-field input-field">
                  <div className="btn #42a5f5 blue lighten-1">
                      <span>update profile pic</span>
                      <input 
                      type="file"
                      onChange={(e)=>{setImage(e.target.files[0])}}
                      />
                  </div>
                  <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                  </div>
                  <button className="btn waves-effect waves-light #42a5f5 blue lighten-1 modal-close" style={{float:"right"}}
                  onClick={()=>{postDetails()}}>update pic</button>
              </div>
            </div>
            <div className="modal-footer">
              <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch('')}}>Close</button>
            </div>
          </div>
    </>    
    );
}
 
export default Conversation;