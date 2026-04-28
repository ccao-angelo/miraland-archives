# Web Development Final Project - *Miraland Archives*

Submitted by: **Chau Cao**

This web app: **is a billingual, interactive guide and lore hub inspired by the game Ngôi Sao Thời Trang (Miracle Nikki). Users can seamlessly share and discover Arena guides, item lore, and styling competition entries in a gorgeous, glassmorphism-styled environment.**

Time spent: **21.5** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL *(Note: Upgraded to direct local file uploads via Supabase Storage)*
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
- [ ] Users can customize the interface
- [x] Users can add more characterics to their posts
  - Users can set flags such as "Question" or "Opinion" while creating a post *(Implemented as "Categories" and "The 7 Nations" flags)*
  - Users can filter posts by flags on the home feed *(Implemented via Nation filtering)*
  - Users can upload images directly from their local machine as an image file *(Implemented via Supabase Storage Buckets)*
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] The entire app dynamically toggles between English and Vietnamese, including database content filtering (e.g., ignoring Vietnamese accents in the search bar).
* [x] Implemented a high-end, responsive frosted-glass UI with custom CSS animations, hover states, and a custom SVG injected "Magic Star" cursor.
* [x] The UI reacts to user data. Selecting specific "Stylist Arena" themes dynamically renders custom backgrounds and attributes for that specific level.
* [x] Replaced default browser alerts with animated, CSS-driven sliding toast notifications for editing, deleting, and creating posts.
* [x] Implemented `loading="lazy"` on all user-uploaded images to prevent network bottlenecking on the Home Feed.

## Video Walkthrough

Here's a walkthrough of implemented user stories:

https://github.com/user-attachments/assets/c9a3fe5f-dd6b-409f-9b5b-dedd88dfe955

GIF created with [ScreenToGif](https://www.screentogif.com/) for Windows

## Notes

* **File Uploads in React:** Encountered a bug where `e.target.files` returns an array, causing the file validation to crash until explicitly targeting ``.
* **CORS & Hotlink Protection:** Attempted to use dynamic image URLs from Fandom/Wikia for the background banners, but learned about CORS blocking and hotlink protection, requiring the images to be locally hosted in a Supabase Storage Bucket.
* **CSS Layouts:** Navigating the quirks of Flexbox `gap` properties and ensuring the navigation bar remained responsive and stacked gracefully on mobile devices without breaking the Glassmorphism blur effects.

## License

    Copyright [2026] [Chau Cao]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
