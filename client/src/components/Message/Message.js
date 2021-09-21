import './message.css'
import React from 'react'
import {format} from 'timeago.js'

const Message = ({text,own,time}) => {
    return ( 
        <>
            <div className="messageWrapper">
                <div className={own?"iconTextOwn":"iconText"}>
                    <img className={own?"messageIconOwn":"messageIcon"} src="https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/1:1/w_741,h_741,c_limit/best-face-oil.png" alt="icon" />
                    <span className={own?"messageTextOwn":"messageText"}>{text}</span>
                </div>
                <div className={own?"dateOwn":"date"}>
                    <span className="sentDate">{format(time)}</span>
                </div>
            </div>
        </>
    );
}
 
export default Message;