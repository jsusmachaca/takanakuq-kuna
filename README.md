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
### Community EndPonts
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


# Execution

create database:
```sql
SOURCE ./database/luchadores.sql
```
install dependences and execute server:
```sh
npm install
npm run dev
```