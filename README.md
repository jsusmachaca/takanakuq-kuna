# Luchadores

* Author: *Jesus Gonzalo Machaca Hancco* (**jsusmachaca**)


> [!IMPORTANT]
> API for Luchadores Platform, a opensource project designed to **help people with neoplastic diseases (cancer)**

## Functions ✔️
- [x] User Registration.
- [x] User authentication.
- [x] Community center.
- [x] Publications for the community.
- [x] Medical prescription record.
- [x] Personalized alerts when taking any medication.


## API EndPoints

### Auth EndPoints
- **GET [/api/user]()**
- **POST [/api/user/register]()**  
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
- **POST [/api/user/login]()**  
  body: 
  ```json
  {
      "username": "your_username",
      "password": "your_password"
  }
  ```
- **POST [/api/user/add-profile]()** *with token*  
  optionals fields:
  ```json
  {
      "description": "your_description",
      "profile_image": "your_profile_photo"
  }
  ```
- **PUT [/api/user/edit-profile]()** *with token*  
  optionals fields:
  ```json
  {
      "description": "your_description",
      "profile_image": "your_profile_photo"
  }
  ```


### Community EndPoints
- **GET [/api/posts]()**
- **GET [/api/posts/user]()** *with token*
- **GET [/api/posts/post?id=*id*]()**
- **DELETE [/api/posts/delete?id=*id*]()** *with token*
- **POST [/api/posts/publish]()** *with token*  
  optionals fields:
  ```json
  {
      "post": "your post",
      "image": "file"
  }
  ```

### Recipes EndPoints
- **GET [/api/recipe/medicines]()** *with token*
- **DELETE [/api/recipe/del]()** *with token*
- **POST [/api/recipe/create]()** *with token*  
  body:
  ```json
  {
    "start_date": "timedate",
    "end_date": "timedate"
  }
  ```
- **POST [/api/recipes/add]()** *with token*  
  body:
  ```json
  {
    "medicine_name": "your medicine name",
    "amount": int,
    "hours": int
  }
  ```


# Execution

### create database:
mysql:
```sql
SOURCE ./database/mysql/luchadores.sql
```
postgresql
```sql
\i ./database/postgres/luchadores.sql
```
install dependences and execute server (with pnpm):
```sh
pnpm install
pnpm run dev
```