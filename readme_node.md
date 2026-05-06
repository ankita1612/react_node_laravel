npm init -y

npm install cors dotenv express express-validator helmet mongoose @types/cors @types/dotenv @types/helmet @types/mongoose

npm i express-rate-limit

///npm install bcrypt @types/bcrypt

npm install cookie-parser @types/cookie-parser // if refresh token then only

npm install jsonwebtoken @types/jsonwebtoken

npm install multer @types/multer

npm install typescript ts-node @types/node @types/express

npx tsc --init

copy tsconfig.json

create .env file

To Run typescript in dev
+++++++++++++++++++++++++++++++++++++
npx ts-node-dev src/server.ts

Notes : npx ts-node-dev runs your TypeScript Node app directly and restarts it automatically when files change — perfect for development, never for production.

++++++++++++++++++++++++++++++
in production
++++++++++++++++++++
1)To make build : npx tsc
2)it create dist folder in root
3)node dist/server.js to run application
