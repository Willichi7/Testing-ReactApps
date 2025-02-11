import React, { useState } from 'react';
import blogService from '../services/blogs';


const Blog = ({ blogs, setBlogs, handleLike }) => {
  const [visibleBlog, setVisibleBlog] = useState(null);

  const toggleDetails = (id) => {
    setVisibleBlog(visibleBlog === id ? null : id);
  };



  const handleRemoveBlog = (id) => {
    const blog = blogs.find(n => n.id === id)
    if(window.confirm(`Remove ${blog.title}`)){
      blogService
      .doDelete(id)
      .then(response => {
        setBlogs(blogs.filter(n => n.id !== id))
      }).catch((exception) => {
        console.log(exception.message)
      })
    }
   
  }

  return (
    <div className='blog'>
      {blogs
      .slice()// avoid mutation
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <div key={blog.id}>
          <p >
            {blog.title}
            <button onClick={() => toggleDetails(blog.id)}>
              {visibleBlog === blog.id ? 'hide' : 'view'}
            </button>
          </p>
          {visibleBlog === blog.id && (
            <div>
              <p>Url: {blog.url}</p>
              <p>
                Likes: {blog.likes}{' '}
                <button onClick={() => handleLike(blog.id)}>like</button>
              </p>
              <p>Author: {blog.author}</p>
              <p>Name: {blog.user.name}</p>
              <button onClick={() => handleRemoveBlog(blog.id)}>remove</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Blog;
