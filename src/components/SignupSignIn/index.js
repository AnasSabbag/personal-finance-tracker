import React, { useState } from 'react';
import "./style.css";
import Input from '../input';
import Button from '../Buttons';
import { toast } from 'react-toastify';
import {  createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth,db} from "../../firebase"
import { useNavigate } from 'react-router-dom';
import {doc,setDoc,getDoc} from "firebase/firestore";


function SignupSignIn() {
  
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmedPassword,setConfirmedPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [loginForm,setLoginForm]=useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  function SignupWithEmail(){
    setLoading(true);
    if(name !=="" && email !== "" && password !==" " && password === confirmedPassword){
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
          
          
          toast.success("user created");
          createDoc(user);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmedPassword("");
          setLoading(false);
          

      })
      .catch((error) => {
        
        const errorMessage = error.message;
        
        toast.error(errorMessage);
        
      });
    }else{
      
      toast.error("all fields are mandatory");
      setLoading(false);
    }
      
  }
  async function createDoc(user) {
    if (!user) return;
    setLoading(true);
    const userRef = doc(db, "user", user.uid);
    const userData = await getDoc(userRef);
  
    if (!userData.exists()) { // Create doc only if it does NOT exist
      try {
        await setDoc(userRef, {
          name: user.displayName? user.displayName: name, // Use a default name
          email: user.email || "", // Ensure email is defined
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
  
        toast.success("Document created successfully!");
        setLoading(false);
      } catch (e) {
        toast.error(`Error creating document: ${e.message}`);
        setLoading(false);
      }
    } else {
      setLoading(false);      
    }
  }
  function LoginWithEmailAndPassword(){
    setLoading(true);
    if(email !== "" && password !==" " ){
      
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        console.log(user);
        setLoading(false);
        navigate("/dashboard")
        toast.success("user login successfully!");
        
      })
      .catch((error) => {
        
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
      
    }else{
      toast.error("all fields are mandatory");
      setLoading(false);
    }
  }

  function googleAuth(){
    setLoading(true)
    try {
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      createDoc(user);
      toast.success("user authenticated!!");
      setLoading(false)
      navigate("/dashboard");
    }).catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      const errorMessage = error.message;
      
      toast.error(errorMessage);
      setLoading(false)
    });
    } catch (error) {
      toast.error(error.message);
    }


  }

  return (
    <>
      {loginForm ? (
        <div className="login-wrapper">
        <h2 className="title">
          Login on <span style={{color:"var(--theme)"}}>Financely.</span>  
        </h2>
        <form>
          <Input label={"Email"} type={"email"} state={email} setState={setEmail} placeholder={"johnDoe@gmail.com"} />
          <Input label={"Password"} type={"password"} state={password} setState={setPassword} placeholder={"Example@123"} />
          
          <Button text={loading?"loading...":"Login using email password"} disabled={loading} onClick={LoginWithEmailAndPassword}  />
          <p style={{textAlign:'center',margin:0}}>or</p>
          <Button text={loading?"loading...":"Login using Google"} blue={true} disabled={loading} onClick={googleAuth} />

          <p className="login-para" onClick={()=>{
            setLoginForm(!loginForm);
          }} >Don't have account click here to sign in</p>
        </form>
      </div>

      ):(
        <div className="signup-wrapper">
        <h2 className="title">
          Sign Up on <span style={{color:"var(--theme)"}}>Financely.</span>  
        </h2>
        <form>
          <Input label={"Full Name"} type={"text"} state={name} setState={setName} placeholder={"John Doe"} />
          <Input label={"Email"} type={"email"} state={email} setState={setEmail} placeholder={"johnDoe@gmail.com"} />
          <Input label={"Password"} type={"password"} state={password} setState={setPassword} placeholder={"Example@123"} />
          <Input label={"Confirmed Password"} type={"password"} state={confirmedPassword} setState={setConfirmedPassword} placeholder={"Example@123"} />
          
          <Button text={loading?"loading...":"Signup using email password"} disabled={loading} onClick={SignupWithEmail}  />
          <p style={{textAlign:'center',margin:0}}>or</p>
          <Button text={loading?"loading...":"Signup using Google"} blue={true} disabled={loading} onClick={googleAuth} />
          
          <p className="login-para" onClick={()=>{
            setLoginForm(!loginForm);
          }} > Already have an account? click here to Login in </p>

        </form>
      </div>
      )}
    
    </>
    
  )
}

export default SignupSignIn;
