# URL Shortener

A simple URL shortener application built with React.js, Node.js, Express.js, and MongoDB.


## Introduction

This project is a URL shortener service where users can shorten long URLs and manage their shortened URLs. The application consists of a backend server with Express.js and a frontend interface built with React.js.

## Features

- Shorten long URLs
- View and manage shortened URLs
- User authentication with JWT
- Secure token handling and CORS configuration

## Technologies Used

- **Frontend:** React.js, Axios, Vite
- **Backend:** Node.js, Express.js, MongoDB, JWT
- **Build Tool:** Vite
- **Loader:** `react-loader-spinner`

## API Endpoints

### Authentication

#### Register

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "Registration successful"
    }
    ```

#### Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Login a user and set a JWT token in the cookies.
- **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "Login successful"
    }
    ```

#### Forgot password



- **URL:** `/api/auth/forgot-password`
- **Method:** `POST`
- **Description:** Send a password reset link to the user's email.
- **Request Body:**
    ```json
    {
      "email": "user@example.com"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "Password reset link sent"
    }
    ```
#### Reset password

- **URL:** `/api/auth/reset-password`
- **Method:** `POST`
- **Description:** Reset the user's password using the reset token sent in the email.
- **Request Body:**
    ```json
    {
      "password": "newpassword",
      "resetToken": "reset-token"
    }
    ```
- **Response:**
    ```json
    {
      "msg": "Password reset successful"
    }
    ```

### URL Management

#### Create Short URL

- **URL:** `/api/url/shorten`
- **Method:** `POST`
- **Description:** Create a short URL from a long URL.
- **Request Headers:**
    - `x-auth-token`: JWT token obtained from login
- **Request Body:**
    ```json
    {
      "longUrl": "https://www.example.com"
    }
    ```
- **Response:**
    ```json
    {
      "shortUrl": "http://short.ly/abc123"
    }
    ```

#### Get URLs

- **URL:** `/api/url/urls`
- **Method:** `GET`
- **Description:** Retrieve all URLs created by the authenticated user.
- **Request Headers:**
    - `x-auth-token`: JWT token obtained from login
- **Response:**
    ```json
    [
      {
        "longUrl": "https://www.example.com",
        "shortUrl": "http://short.ly/abc123",
        "urlCode": "abc123"
      },
      ...
    ]
    ```

## Environment Variables

Create a `.env` file in the root of your backend project and add the following variables:

# Base URL of your deployed backend application
BASE_URL=https://urlshortener-backend-e965.onrender.com

# Client URL of your deployed frontend application
CLIENT_URL=https://incandescent-otter-95ca8c.netlify.app
