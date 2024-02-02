# Luchadores 💪

* Author: *Jesus Gonzalo Machaca Hancco* (**jsusmachaca**)

**Language**
* [Español](./README.es.md)
* English

> [!IMPORTANT]
> API for the "Luchadores platform", a open source project designed to **help people with neoplastic diseases (cancer)**

## Functions ✅
- [x] User Registration.
- [x] User authentication.
- [x] Social media.
- [x] Publications for the community.
- [x] Medical prescription record.
- [ ] Personalized alerts when taking any medication.


# API EndPoints 🌐

## Auth and profile information EndPoints 👤
- **GET [BASE_URL/api/user]()**
- **POST [BASE_URL/api/user/register]()**  
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
- **POST [BASE_URL/api/user/login]()**  
  body: 
  ```json
  {
      "username": "your_username",
      "password": "your_password"
  }
  ```
- **POST [BASE_URL/api/user/add-profile]()** *with token*  
  optionals fields:
  ```json
  {
      "description": "your_description",
      "profile_image": "your_profile_photo"
  }
  ```
- **PUT [BASE_URL/api/user/edit-profile]()** *with token*  
  optionals fields:
  ```json
  {
      "description": "your_description",
      "profile_image": "your_profile_photo"
  }
  ```


## Social Media EndPoints 🧑‍🤝‍🧑🧑‍🤝‍🧑
- **GET [BASE_URL/api/posts]()**
- **GET [BASE_URL/api/posts/user]()** *with token*
- **GET [BASE_URL/api/posts/post?id=*id*]()**
- **DELETE [BASE_URL/api/posts/delete?id=*id*]()** *with token*
- **POST [BASE_URL/api/posts/publish]()** *with token*  
  optionals fields:
  ```json
  {
      "post": "your post",
      "post_image": "file"
  }
  ```

## Recipes EndPoints 🗒️
- **GET [BASE_URL/api/recipe/medicines]()** *with token*
- **DELETE [BASE_URL/api/recipe/del]()** *with token*
- **POST [BASE_URL/api/recipe/create]()** *with token*  
  body:
  ```json
  {
    "start_date": "timedate",
    "end_date": "timedate"
  }
  ```
- **POST [BASE_URL/api/recipes/add]()** *with token*  
  body:
  ```json
  {
    "medicine_name": "your medicine name",
    "amount": int,
    "hours": int
  }
  ```


# Execution ✅

### create database:
mysql:
```sql
SOURCE ./database/mysql/luchadores.sql
```
postgresql:
```sql
\i ./database/postgres/luchadores.sql
```
install dependences and execute server (with pnpm):
```sh
pnpm install
pnpm run dev
```

# PROJECT STRUCTURE

## Database: 
![dbstructure](./images/schema.png)

## Directorys Structure:
![dirstructure](./images/tree1.png)
### Description:

- **config:** Holds important configuration files, including settings for database connection, CORS sources, token creation and validation, and date/time settings.
- **controllers:** Contains controllers responsible for handling validations, authentication, user registration, and creating new records in the database.
- **middlewares:** Contains middlewares handling CORS and multer services for managing multimedia files (multipart/form-data).
- **models:** Houses models responsible for defining the structure and interactions with the database.
- **public:** Used for storing multimedia files.
- **routes:** Contains application routes responsible for serving the controllers.
- **schemas:** Holds validation schemes that describe the structure and validation rules for the database.
- **index.js:** The main file responsible for constructing and executing the project.