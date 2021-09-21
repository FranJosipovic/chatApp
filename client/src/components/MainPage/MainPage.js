import React,{useState,useEffect,useRef,useContext} from 'react'
import ChatBox from '../ChatBox/ChatBox';
import Conversation from '../Conversation/Conversation';
import './mainPage.css'



const MainPage = () => {

    
    

    return ( 
        <>
        <div className="mainPage">
            <div className="converstions">
            <Conversation/>
            </div>
            <div className="chatBox">
                <ChatBox/>
            </div>
        </div>
        </>
     );
}
 
export default MainPage;