import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({handleSubmit, handleUsernamechange, handlePasswordChange, username, password  }) => {

  return (
   <div>
   <h2>Log in to application</h2>
   
   <form onSubmit={handleSubmit}>
     <div>
       username
       <input data-testid = 'username' type="text" value={username} name='username' onChange={handleUsernamechange} />
     </div>
     <div>
       password
       <input data-testid = 'password' type="password" value={password} name='password' onChange={handlePasswordChange} />
     </div>
     <button type='submit'>Login</button>
   </form>
 </div>
  )
}

LoginForm.prototype = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired, 
  handlePasswordChange:PropTypes.func.isRequired ,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}


export default LoginForm