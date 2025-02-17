# MindfulSpace

MindfulSpace is a Next.js application designed to provide users with a variety of online courses in a mindful and engaging environment. The platform allows users to browse, enroll, and manage courses, while administrators can create and manage course content and user accounts.

## Features

### User Features
- **Course Catalog**: Users can browse a wide range of courses, each with detailed descriptions, instructor information, and pricing.
- **Search and Filter**: Users can search for courses by title or instructor and filter results based on categories such as "Newest" and "Oldest."
- **Course Details**: Each course has a dedicated page that includes video content, descriptions, and instructor details.
- **Purchase Courses**: Users can purchase courses that require payment, payement gateway is coming soon through stripe but currently it is made via WhatsApp for support.
- **Responsive Design**: The application is designed to be accessible on various devices, including desktops, tablets, and mobile phones.

### Admin Features
- **Course Management**: Admins can create, edit, and delete courses, including uploading videos and images.
- **User Management**: Admins can view, edit, and delete user accounts, as well as manage user permissions.
- **Protected Routes**: Admin routes are protected, ensuring that only authorized users can access sensitive functionalities.

## API Requests

### Authentication
- **Login**: 
  - **Endpoint**: `POST /api/auth/login`
  - **Request Body**: 
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
  - **Response**: Returns user data and a JWT token for authentication.

- **Get Current User**: 
  - **Endpoint**: `GET /api/auth/me`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: Returns the authenticated user's information.

### Courses
- **Get All Courses**: 
  - **Endpoint**: `GET /api/courses`
  - **Response**: Returns a list of public courses with access information.

- **Get Course by ID**: 
  - **Endpoint**: `GET /api/courses/[id]`
  - **Response**: Returns detailed information about a specific course, including access permissions.

- **Create Course**: 
  - **Endpoint**: `POST /api/courses`
  - **Request Body**: 
    ```json
    {
      "title": "Course Title",
      "description": "Course Description",
      "image": "image_url",
      "instructorName": "Instructor Name",
      "privacy": "public",
      "videos": [],
      "price": 0
    }
    ```
  - **Response**: Returns the created course data.

- **Update Course**: 
  - **Endpoint**: `PATCH /api/courses/[id]`
  - **Request Body**: 
    ```json
    {
      "title": "Updated Course Title",
      "description": "Updated Description",
      "privacy": "private",
      "price": 50
    }
    ```
  - **Response**: Returns the updated course data.

- **Delete Course**: 
  - **Endpoint**: `DELETE /api/courses/[id]`
  - **Response**: Returns a success message upon deletion.

### Users
- **Get All Users**: 
  - **Endpoint**: `GET /api/users`
  - **Response**: Returns a list of users with pagination.

- **Update User**: 
  - **Endpoint**: `PATCH /api/users/[id]`
  - **Request Body**: 
    ```json
    {
      "name": "Updated User Name",
      "permissions": ["admin", "user"],
      "accessibleCourses": ["courseId1", "courseId2"]
    }
    ```
  - **Response**: Returns the updated user data.

- **Delete User**: 
  - **Endpoint**: `DELETE /api/users/[id]`
  - **Response**: Returns a success message upon deletion.

### File Uploads
- **Upload Image**: 
  - **Endpoint**: `POST /api/upload`
  - **Request Body**: Form data containing the image file.
  - **Response**: Returns the URL of the uploaded image.

- **Upload Video**: 
  - **Endpoint**: `POST /api/videos/upload`
  - **Request Body**: Form data containing the video file.
  - **Response**: Returns the URL of the uploaded video.

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mindfulspace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env.local` file:
   ```plaintext
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

For more information about Next.js, visit the [Next.js Documentation](https://nextjs.org/docs).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
