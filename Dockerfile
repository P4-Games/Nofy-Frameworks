# Usa la imagen de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de tu proyecto al contenedor
COPY . .

# Compila tu proyecto Next.js
RUN npm run build

# Expone el puerto en el que tu aplicación Next.js se ejecutará (por defecto es 3000)
EXPOSE 3000

# Comando para iniciar tu aplicación Next.js
CMD ["npm", "start"]