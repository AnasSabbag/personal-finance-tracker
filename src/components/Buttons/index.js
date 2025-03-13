import React from 'react'
import "./style.css"
function Button({text,onClick,blue,disabled}) {
 
  return (  
    
    <div className={blue?"btn btn-blue":"btn"} disabled={disabled} onClick={onClick}>
      {text}
    </div>
  )
}

export default Button
