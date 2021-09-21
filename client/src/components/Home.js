import React,{useState,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import M from "materialize-css"
import validator from "validator"
import { UserContext } from '../App'

const Home = () => {

    const history = useHistory()
    const [showSignUp,setShowSignUp] = useState(false)
    const {state,dispatch1} = useContext(UserContext)

    const SignUp = () => {

        const [name,setName] = useState("")
        const [email,setEmail] = useState("")
        const [password,setPassword] = useState("")
        const [confirmPassword,setConfirmPassword] = useState("")

        const postDetails = () => {
            if(validator.isEmail(email)===false){
                M.toast({html:'invalid email',classes:"red"})
                return
            }
            if(password !== confirmPassword){
                M.toast({html:'passwords do not match',classes:"red"})
                return 
            }
            fetch("/signup",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            .then(res=>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html:data.error,classes:"red"})
                }
                else{
                    M.toast({html:data.message,classes:"green"})
                    setShowSignUp(false)
                }
            }).catch(err=>{
                console.log(err)
            })
        }

        return (
        <div style={{backgroundColor:"white",marginTop:"20%",marginLeft:"20%",maxWidth:"500px",height:"500px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <h2 style={{textAlign:"center"}}>Sign Up</h2>
                    <input
                    style={{marginTop:"15%",marginLeft:"20%",width:"300px"}}
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                    />
                    <input
                    style={{marginLeft:"20%",width:"300px"}}
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <input
                    style={{marginLeft:"20%",width:"300px"}}
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <input
                    style={{marginBottom:"20%",marginLeft:"20%",width:"300px"}}
                    type="password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    />
                    <button style={{marginBottom:"10%",width:"200px",marginLeft:"30%"}} onClick={()=>{postDetails()}}>
                    Sign Up
                    </button>
                </div> 
        )
    }

    const SignIn = () => {

        const [email,setEmail] = useState("")
        const [password,setPassword] = useState("")

        const postData = () => {
            if(validator.isEmail(email)===false){
                M.toast({html:'invalid email',classes:"red"})
                return
            }
            fetch("/signin",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email,
                    password
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"red"})
                    return
                }
                if(data){
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch1({type:"USER",payload: data.user})
                    history.push("/mainpage")
                    M.toast({html:"successfully signed in",classes:"green"})
                }
            })
        }

        return (
        <div style={{backgroundColor:"white",marginTop:"20%",marginLeft:"20%",maxWidth:"500px",height:"500px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <h2 style={{textAlign:"center"}}>Sign in</h2>
                    <input
                    style={{marginTop:"15%",marginLeft:"20%",width:"300px"}}
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <input
                    style={{marginBottom:"20%",marginLeft:"20%",width:"300px"}}
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <button style={{marginBottom:"10%",width:"200px",marginLeft:"30%"}} onClick={()=>{postData()}}>
                    Sign In
                    </button>
                    <p style={{textAlign:"center"}}>Don't have an account <span style={{cursor:"pointer",color:"blue"}} onClick={()=>{setShowSignUp(true)}}>Sign Up</span></p>
                </div>
        )
    }

    return ( 
        <div style={{display:"flex",height:"100%"}}>
            <div style={{backgroundColor:"red",width:"100%",height:"837px"}}>
                <div style={{marginLeft:"40%",marginTop:"40%",display:"flex",flexDirection:"column"}}>
                    <button style={{width:"150px",height:"100px",marginBottom:"8px"}} onClick={()=>{setShowSignUp(true)}}>Sign Up</button>
                    <button style={{width:"150px",height:"100px"}} onClick={()=>{setShowSignUp(false)}}>Sign In</button>
                </div>
            </div>
            <div style={{backgroundColor:"black",width:"100%"}}>
                {showSignUp ? 
                <SignUp/>
                : 
                <SignIn/>
                }
            </div>
            </div>
    );
}
 
export default Home;