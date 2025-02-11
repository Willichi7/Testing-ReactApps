import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = newToken => {
   token =  `Bearer ${newToken}`
}
const getAll = async () => {
   const response = await axios.get(baseUrl)
   return response.data
}


const create = newBlogs => {
   const config = {
      headers : {Authorization: token}
   }
   return axios.post(baseUrl, newBlogs, config)
   
}

const update = async (id, newBlogs) => {
   return await axios.put(`${baseUrl}/${id}`, newBlogs)
   
}

const doDelete = async (id) => {
   const config = {
      headers : {Authorization: token}
   }
   return await axios.delete(`${baseUrl}/${id}`, config)
}

export default {
   getAll, create, update, setToken, doDelete
}