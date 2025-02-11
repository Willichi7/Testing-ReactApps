import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Blogform from './components/Blogform'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(showBlog => {
      console.log(showBlog)
      setBlogs(showBlog)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = (blogObject) => {
   
  //  blogFormRef.current.toggeleVisibility()
    blogService
      .create(blogObject)
      .then(response => {
        setBlogs(blogs.concat(response.data))
        setMessage(`Added ${blogObject.title}`)
        setType('success')
      
      })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception.message)
      setMessage('Wrong credentials')
      setType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
  }


   const handleIncreaseLike = (id) => {
      const blog = blogs.find((n) => n.id === id);
      const newLikes = { ...blog, likes: blog.likes + 1, user: blog.user.id };
      blogService
        .update(id, newLikes)
        .then((response) => {
          setBlogs(blogs.map((blog) => (blog.id !== id ? blog : { ...response.data, user: blog.user })));
        })
        .catch((error) => {
          console.log('Error updating likes: ', error);
        });
    };

  const loginForm = () => {
    return (
      <Togglable  buttonLabel = 'login'>
      <Notification message={message} type={type} />
      <LoginForm 
      handleSubmit={handleLogin}
      handleUsernamechange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    </Togglable>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel = 'create' ref = {blogFormRef}>
        <Blogform createBlog={addBlog}/>
      </Togglable>
      
    )
    
  }

  

  return (
    <div>
      {user === null ? loginForm() :
        <div>
          <h2>blogs</h2>
          <Notification message={message} type={type} />
          <p>{user.name} logged-in</p><button type='button' onClick={handleLogout}>logout</button>
          {blogForm()}
          
          <Blog blogs={blogs}  setBlogs={setBlogs} handleLike={handleIncreaseLike}/>
        </div>
      }
    </div>
  )
}

export default App
