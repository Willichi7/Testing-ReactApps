import React, {  useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types';

const Togglable = React.forwardRef((props:{children, buttonLabel}, refs) => {
   const [visible, setVisible] = useState(false);

   const hideWhenVisibile = {display: visible ? 'none' : ''}
   const showWhenVisible = {display: visible ? '' : 'none'}

   const toggeleVisibility = () => {
      setVisible(!visible)
   }
   
   useImperativeHandle(refs, () => {
      toggeleVisibility
   })
  return (
    <div>
      <div style={hideWhenVisibile}>
         <button onClick={toggeleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
         {props.children}
         <button onClick={toggeleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'
Togglable.propTypes = {
   buttonLabel : PropTypes.string.isRequired
}


export default Togglable