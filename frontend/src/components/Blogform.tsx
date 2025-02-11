import React, { useState } from 'react'

const Blogform = ({createBlog}) => {
   const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = () => {
   createBlog({
      title: title,
      author: author,
      url: url
   })
   setAuthor('')
   setTitle('')
   setUrl('')
  }
  return (
   <div>
   <h2>Create New</h2>
   <form onSubmit={addBlog}>
     <div>
       title:
       <input data-testid ='title' type="text" value={title} name='title' onChange={({target}) => setTitle(target.value)} placeholder='title'/>
     </div>
     <div>
       author:
       <input data-testid ='author' type="text" value={author} name='author' onChange={({target}) => setAuthor(target.value)} placeholder='author'/>
     </div>
     <div>
       url:
       <input  data-testid ='url' type="text" value={url} name='url' onChange={({target}) => setUrl(target.value)} placeholder='url'/>
     </div>
     <button  data-testid = 'create-blog' type='submit'>Create</button>
   </form>
 </div>
  )
}

export default Blogform