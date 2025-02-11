const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./test_helper');

describe('Blog up', () => {
   beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3004/api/testing/reset');
      await request.post('http://localhost:3004/api/users', {
         data: {
            username: 'Bella',
            name: 'BellaLeon',
            password: 'Willichi7!',
         },
      });
      await page.goto('http://localhost:5173');
   });

   test('Login form is shown', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click();
   });

   describe('Login', () => {
      test('succeeds with correct credentials', async ({ page }) => {
         await page.getByRole('button', { name: 'login' }).click();
         await page.getByTestId('username').fill('Bella');
         await page.getByTestId('password').fill('Willichi7!');

         await page.getByRole('button', { name: 'login' }).click();

         await expect(page.getByText('BellaLeon logged-in')).toBeVisible();
         await expect(page.getByText('logout')).toBeVisible();
      });

      test('fails with wrong credentials', async ({ page }) => {
         await loginWith(page, 'Bella', 'wrong')
         
         const errorDiv = await page.locator('.error');
         await expect(errorDiv).toContainText('Wrong credentials');
         await expect(errorDiv).toHaveCSS('border-style', 'solid');
         await expect(errorDiv).toHaveCSS('color', 'rgb(114, 28, 36)');
         await expect(page.getByText('Wrong credentials')).toBeVisible();

         await expect(page.getByText('BellaLeon logged-in')).not.toBeVisible();
      });
   });

   describe('when logged in', () => {
      beforeEach(async ({ page }) => {
         await loginWith(page, 'Bella', 'Willichi7!')
         await expect(page.getByText('BellaLeon logged-in')).toBeVisible();
        
      });

      test('a new blog can be created', async ({ page }) => {

         await createBlog(page, 'Test Blog', 'Test Author', 'http://testblog.com')
         await expect(page.getByText('view')).toBeVisible();
         await expect(page.getByText('Test Blog')).toBeVisible();
      });
      
      test('a blog can be liked', async ({ page }) => {
         await createBlog(page, 'Test Blog', 'Test Author', 'http://testblog.com')   
         await expect(page.getByText('view')).toBeVisible();
         await expect(page.getByText('Test Blog')).toBeVisible();

         await page.getByRole('button', { name: 'view' }).click();
         await page.getByRole('button', { name: 'like' }).click();

         await expect(page.getByText('Likes: 1')).toBeVisible();
      });

      test('the user who added the blog can delete it', async ({ page }) => {
        await createBlog(page, 'Delete Blog', 'Test Author', 'http://testblog.com')

         await expect(page.getByText('view')).toBeVisible();
         await expect(page.getByText('Delete Blog')).toBeVisible();

         page.on('dialog', async dialog => {
         await dialog.accept();
         });

         await page.getByRole('button', { name: 'view' }).click();
         await page.getByRole('button', { name: 'remove' }).click();

         await expect(page.getByText('Delete Blog')).not.toBeVisible();
      });

      test('only the user who added the blog sees the delete button', async ({ page }) => {
         await createBlog(page, 'Test Blog', 'Test Author', 'http://testblog.com')

         await expect(page.getByText('view')).toBeVisible();
-         await expect(page.getByText('Test Blog')).toBeVisible();

         await page.getByRole('button', { name: 'logout' }).click();
         await expect(page.getByRole('button', { name: 'login' })).toBeVisible();

         // login as another user
         await loginWith(page, 'AnotherUser', 'Willichi7!')

         await expect(page.getByText('view')).toBeVisible();

         await page.getByRole('button', { name: 'view' }).click();
         await expect(page.getByText('remove')).not.toBeVisible();
      });
 
     
      test('Blogs are ordered according to likes', async ({ page }) => {
         await createBlog(page, 'First Blog', 'First Author', 'http://firstblog.com')
         await expect(page.locator('text=First Blog')).toBeVisible()

         // Create second blog
         await createBlog(page, 'Second Blog', 'Second Author', 'http://secondblog.com')
         await expect(page.locator('text=Second Blog')).toBeVisible()

         // Like the first blog twice
         await page.click('text=view', { nth: 0 })
         await page.click('text=like')
         await page.click('text=like')
         await expect(page.getByText('Likes: 2')).toBeVisible()

         // Like the second blog once
         await page.click('text=view', { nth: 1 })
         await page.click('text=like')
         await expect(page.getByText('Likes: 1')).toBeVisible()

         // Check the order of blogs
         const blogs = await page.locator('.blog').allTextContents()
         expect(blogs).toHaveLength(2)
         expect(blogs[0]).toContain('First Blog')
         expect(blogs[1]).toContain('Second Blog')
      });
   });
});
