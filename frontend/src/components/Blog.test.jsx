import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect, test, vi } from "vitest";
import Blogform from "./Blogform";

test('renders blog title but not URL or likes by default', () => {
   const blogs = [
      {
         id: 1,
         title: 'This is a new title',
         author: 'Liam Will',
         url: 'http://example.com',
         likes: 5,
         user: { name: "Test User" } 
      }
   ];

   const { container } = render(<Blog blogs={blogs} setBlogs={() => {}} />);
   const blogDiv = container.querySelector('.blog');

   // Check if the title is visible
   expect(blogDiv).toHaveTextContent('This is a new title');

   // Author, URL, and likes should be hidden initially
   expect(container).not.toHaveTextContent('Liam Will');
   expect(container).not.toHaveTextContent('http://example.com');
   expect(container).not.toHaveTextContent('5');
});

test('shows  URL, and likes after clicking view button', async () => {
   const blogs = [
      {
         id: 1,
         title: 'This is a new title',
         author: 'Liam Will',
         url: 'http://example.com',
         likes: 5,
         user: { name: "Test User" }
      }
   ];

   const { container } = render(<Blog blogs={blogs} setBlogs={() => {}} />);
   const user = userEvent.setup()
   
   //click the view button to reveal details
   const button = screen.getByText('view')
   await user.click(button)

   expect(container).toHaveTextContent("Liam Will")
   expect(container).toHaveTextContent('http://example.com');
   expect(container).toHaveTextContent('Likes: 5');
});

test('calls the eventhandler twice when the like button is clicked twice', async () => {
   const blogs = [
      {
         id: 1,
         title: 'This is a new title',
         author: 'Liam Will',
         url: 'http://example.com',
         likes: 5,
         user: {id: 123,  name: "Test User" }
      }
   ];

   const mockHandler = vi.fn();

   render(<Blog blogs={blogs} setBlogs = {() => {}} handleLike={mockHandler} />);

   const user = userEvent.setup();
   const viewButton = screen.getByText('view');
   await user.click(viewButton);
   
   const likeButton = screen.getByText('like');
   await user.click(likeButton);
   await user.click(likeButton);

   expect(mockHandler).toHaveBeenCalledTimes(2);
});

test('<BlogForm/> calls the event handler for a new blog', async () => {
   const createBlog = vi.fn();
   const user = userEvent.setup();

   render(<Blogform createBlog={createBlog}/>);

   const inputs = screen.getAllByRole('textbox');
   const createButton = screen.getByText('create');

   await user.type(inputs[0], 'testing a new blog title');
   await user.type(inputs[1], 'testing a new blog author');
   await user.type(inputs[2], 'http://example.com');
   await user.click(createButton);

   expect(createBlog).toHaveBeenCalledTimes(1);
   expect(createBlog).toHaveBeenCalledWith({
      title: 'testing a new blog title',
      author: 'testing a new blog author',
      url: 'http://example.com'
   });
});

