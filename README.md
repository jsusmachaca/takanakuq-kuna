# Luchadores

* Author: *Jesus Gonzalo Machaca Hancco* (**jsusmachaca**)

## Project Description

> .[!IMPORTANT].
> API for Luchadores Platform, a opensource project designed to **help people with neoplastic diseases (canser)**

## Functions
* User Registration.
* User authentication.
* Community center.
* Publications for the community.
* Medical prescription record.
* Personalized alerts when taking any medication.


## API EndPoints

* User EndPoints
    * POST [/api/user/register]()  
        body: 
        ```json
        {
            "username": "your_username",
            "password": "your_password",
            "confirm_password": "your_password",
            "first_name": "Your First Name",
            "last_name": "Your Last Name",
            "email": "your@email.com"
        }
        ```
    * POST [/api/user/login]()  
    body: 
        ```json
        {
            "username": "your_username",
            "password": "your_password"
        }
        ```
* Posts EndPonts :rice_scene:
    * GET [/api/posts]()
    * GET [/api/posts/user]() *with token*
    * GET [/api/posts/post?id=*id*]()
    * POST [/api/posts/publish]() *with token*
    optionals fields:
        ```json
        {
            "post": "your post",
            "image": "file"
        }
        ```
    * DELETE [/api/posts/delete?id=*id*]() *with token*