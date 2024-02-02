# Luchadores 💪

* Autor: *Jesus Gonzalo Machaca Hancco* (**jsusmachaca**)

**Idioma**
* Español
* [English](./README.md)

> [!IMPORTANT]
> API para la "plataforma Luchadores", un proyecto de código abierto diseñado para **ayudar a personas con enfermedades neoplásicas (cáncer)**

## Functions ✅
- [x] Registro de usuario.
- [x] Autenticacion de usuario.
- [x] Red social.
- [x] Publicaciones para la comunidad..
- [x] Registro de recetas médicas.
- [ ] Alertas personalizadas al tomar cualquier medicamento..


# Puntos finales de API 🌐

## Puntos finales de autenticación y información del perfil 👤
- **GET [BASE_URL/api/user]()**
- **POST [BASE_URL/api/user/register]()**  
  cuerpo: 
  ```json
  {
    "username": "tu_nombre_de_usuario",
    "password": "tu_contraseña",
    "confirm_password": "tu_contraseña",
    "first_name": "Tu nombre",
    "last_name": "Tu apellido",
    "email": "tu_correo@email.com"
  }
  ```
- **POST [BASE_URL/api/user/login]()**  
  cuerpo: 
  ```json
  {
    "username": "tu_nombre_de_usuario",
    "password": "tu_contraseña"
  }
  ```
- **POST [BASE_URL/api/user/add-profile]()** *con token*  
  campos opcionales:
  ```json
  {
    "description": "tu_descripción",
    "profile_image": "tu_foto_de_perfil"
  }
  ```
- **PUT [BASE_URL/api/user/edit-profile]()** *con token*  
  campos opcionales:
  ```json
  {
    "description": "tu_descripción",
    "profile_image": "tu_foto_de_perfil"
  }
  ```


## Puntos finales de redes sociales 🧑‍🤝‍🧑🧑‍🤝‍🧑
- **GET [BASE_URL/api/posts]()**
- **GET [BASE_URL/api/posts/user]()** *con token*
- **GET [BASE_URL/api/posts/post?id=*id*]()**
- **DELETE [BASE_URL/api/posts/delete?id=*id*]()** *con token*
- **POST [BASE_URL/api/posts/publish]()** *con token*  
  campos opcionales:
  ```json
  {
      "post": "tu publicación",
      "post_image": "archivo"
  }
  ```

## Puntos finales de recetas 🗒️
- **GET [BASE_URL/api/recipe/medicines]()** *con token*
- **DELETE [BASE_URL/api/recipe/del]()** *con token*
- **POST [BASE_URL/api/recipe/create]()** *con token*  
  cuerpo:
  ```json
  {
    "start_date": "timedate",
    "end_date": "timedate"
  }
  ```
- **POST [BASE_URL/api/recipes/add]()** *con token*  
  cuerpo:
  ```json
  {
    "medicine_name": "nombre de tu medicamento",
    "amount": int,
    "hours": int
  }
  ```


# Ejecución ✅

### creación de la base de datos:
mysql:
```sql
SOURCE ./database/mysql/luchadores.sql
```
postgresql:
```sql
\i ./database/postgres/luchadores.sql
```
instala las dependencias y ejecuta el servidor (con pnpm):
```sh
pnpm install
pnpm run dev
```