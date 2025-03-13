import React from 'react'
import Header from '../components/Header'
import SignupSignIn from '../components/SignupSignIn'
function Signup() {
  return (
    <div>
      <Header/>
      <div className="wrapper">
      <SignupSignIn />
      </div>
    </div>
  )
}

export default Signup
