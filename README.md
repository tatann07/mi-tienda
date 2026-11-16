# Mi Tienda (Next.js + Tailwind + MySQL2)

Panel que detecta automáticamente las tablas de tu base de datos y permite ver, agregar, modificar y borrar registros.

## 1. Instalar
```bash
npm install
```

## 2. Conectar tu base de datos
Edita `.env.local` con los datos de tu conexión de DBeaver (clic derecho en la conexión → Edit Connection):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_base
DB_SSL=false
```

## 3. Ejecutar
```bash
npm run dev
```
Abre http://localhost:3000

## 4. Subir a GitHub
```bash
git init
git add .
git commit -m "CRUD con Next.js y MySQL"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mi-tienda.git
git push -u origin main
```

## 5. Publicar (Vercel)
Importa el repo en vercel.com y agrega como Environment Variables las 6 variables de `.env.local`.
La base de datos debe estar en la nube (Aiven, TiDB Cloud, Railway...). Si pide SSL: `DB_SSL=true`.

Para cambiar el logo, reemplaza `public/logo.svg`.
