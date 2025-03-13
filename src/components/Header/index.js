  import React, { useEffect } from 'react';
  import "./style.css" ;
  import {auth} from "../../firebase"
  import {useAuthState} from "react-firebase-hooks/auth";
  import { useNavigate } from 'react-router-dom';
  import { toast } from 'react-toastify';
  import { signOut } from 'firebase/auth';

  function Header() {
    const [user,loading]= useAuthState(auth);
    const navigate = useNavigate();
    useEffect(() => {
     if(user){
      navigate("/dashboard");
     }
     
    }, [user,loading])
    

    function logoutFnc(){
      
      try {
          signOut(auth)
          .then(()=>{
            toast.success("logout successfully");
            navigate("/")
          })
          .catch((e)=>{
            toast.error(e.message);    
          })

      } catch (error) {

        toast.error(error.message);
      }


    }
    return (
      <div className="navbar">
        <p className="logo">Financly.</p>
        {
          user&&(
            <p className="logo link" onClick={logoutFnc}>Logout</p>
        )}
        
      </div>
    );
  }
  
  export default Header;
  