# README

## Instalación

Para usar esta aplicación, necesitarás tener instaladas las siguientes dependencias:

- `mongodb`: El controlador de MongoDB para Node.js.
- `jsonwebtoken`: Una librería para generar y verificar JSON Web Tokens.
- `bcrypt`: Una librería para hashear contraseñas.

Puedes instalar estas dependencias ejecutando el siguiente comando en el directorio de tu proyecto:

```
npm install mongodb jsonwebtoken bcrypt
```

Adicionalmente, necesitarás configurar las siguientes variables de entorno:

- `MONGO_URI`: La cadena de conexión para tu base de datos MongoDB.
- `JWT_SECRET`: La clave secreta utilizada para firmar y verificar JSON Web Tokens.
- `DB_NAME`: El nombre de tu base de datos MongoDB.

## Uso

Esta aplicación proporciona tres funcionalidades principales:

1. **Inicio de sesión**: El archivo `login.js` maneja el proceso de inicio de sesión. Espera una solicitud `POST` con `email` y `password` en el cuerpo de la solicitud. Si las credenciales son válidas, devuelve un JSON Web Token.

Ejemplo de solicitud:

```
POST /api/user/login
  {
  "email": "example@email.com",
  "password": "mypassword"
}
```

Ejemplo de respuesta:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWY1ZjQyMTIzNDU2Nzg5MCIsImlhdCI6MTYxNjc4OTAxMiwiZXhwIjoxNjE2Nzg5NjEyfQ.abcdefghijklmnopqrstuvwxyz"
}
```

2. **Perfil**: El archivo `profile.js` maneja la gestión del perfil de usuario. Espera una solicitud `GET` para recuperar la información del perfil del usuario, y una solicitud `PUT` para actualizar el nombre, edad y contraseña del usuario.

Ejemplo de solicitud GET:
```
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWY1ZjQyMTIzNDU2Nzg5MCIsImlhdCI6MTYxNjc4OTAxMiwiZXhwIjoxNjE2Nzg5NjEyfQ.abcdefghijklmnopqrstuvwxyz
```

Ejemplo de respuesta GET:
```
{
  "user": {
    "_id": "605f5f4212345678901",
    "name": "John Doe",
    "age": 30,
    "email": "example@email.com"
  }
}
```
Ejemplo de solicitud PUT:

```
PUT /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWY1ZjQyMTIzNDU2Nzg5MCIsImlhdCI6MTYxNjc4OTAxMiwiZXhwIjoxNjE2Nzg5NjEyfQ.abcdefghijklmnopqrstuvwxyz
{
  "name": "Jane Doe",
  "age": 35,
  "password": "newpassword"
}
```
Ejemplo de respuesta PUT:
```
{
  "message": "Perfil actualizado correctamente"
}
```
3. **Registro**: El archivo `register.js` maneja el registro de usuarios. Espera una solicitud `POST` con `name`, `age`, `email` y `password` en el cuerpo de la solicitud.

Ejemplo de solicitud:

```
POST /api/register
{
  "name": "John Doe",
  "age": 30,
  "email": "example@email.com",
  "password": "mypassword"
}
```
Ejemplo de respuesta:
```
{
  "message": "Usuario registrado exitosamente"
}
```

## API

La aplicación expone los siguientes endpoints de la API:

- `POST /api/user/login`: Maneja el inicio de sesión del usuario y devuelve un JSON Web Token.
- `GET /api/user/profile`: Recupera la información del perfil del usuario.
- `PUT /api/user/profile`: Actualiza la información del perfil del usuario.
- `POST /api/user/register`: Maneja el registro de usuarios.

## Link al despliegue de la API en Vercel
```
https://final-project-pi-black.vercel.app/
```
