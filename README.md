# Social Club API Prueba Práctica

Este es un proyecto de Nest.js Prueba Práctica

## **Tabla de Contenidos**

- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [Ejecución de Pruebas](#ejecución-de-pruebas)
  - [Pruebas Unitarias](#pruebas-unitarias)
  - [Pruebas con Postman](#pruebas-con-postman)
- [Colecciones de Postman](#colecciones-de-postman)

## **Prerrequisitos**

- **Node.js** versión 14.x o superior
- **npm** versión 6.x o superior

Puedes verificar tu versión de Node.js y npm ejecutando:

```bash
node -v
npm -v
```

## **Instalación**

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/dcsm8/social-club.git
   cd social-club
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

## **Ejecución de la Aplicación**

1. **Iniciar la aplicación**

   ```bash
   npm run start
   ```

   La aplicación se ejecutará en `http://localhost:3000`.

2. **Verificar la ejecución**

   Puedes acceder a `http://localhost:3000` en tu navegador o utilizar herramientas como Postman para interactuar con la API.

## **Ejecución de Pruebas**

### **Pruebas Unitarias**

Para ejecutar las pruebas unitarias de los servicios y controladores, utiliza:

```bash
npm run test
```

Esto ejecutará todas las pruebas definidas en el proyecto utilizando Jest.

### **Pruebas con Postman**

#### **Importar la Colección y el Entorno**

1. **Abrir Postman**

2. **Importar la Colección**

   - Navega a la pestaña **Import** en Postman.
   - Selecciona **Upload Files** y busca el archivo `Social Club.postman_collection.json` ubicado en la carpeta `collections` del proyecto.

3. **Importar el Entorno**

   - En la pestaña **Import**, selecciona nuevamente **Upload Files** y busca el archivo `Social Club Environment.postman_environment.json` en la carpeta `collections`.

#### **Ejecutar las Pruebas**

1. **Seleccionar el Entorno**

   - En Postman, asegúrate de que el entorno `Social Club Environment` esté seleccionado.

2. **Ejecutar la Colección**

   - Navega a la colección `Social Club`.
   - Haz clic en el botón **Run** para abrir el **Collection Runner**.
   - Verifica que el entorno seleccionado sea `Social Club Environment`.
   - Haz clic en **Start Run** para ejecutar todas las solicitudes.

## **Colecciones de Postman**

Las colecciones y el entorno de Postman se encuentran en la carpeta `collections` del proyecto:

- `collections/Social Club.postman_collection.json`
- `collections/Social Club Environment.postman_environment.json`

Estas incluyen todas las solicitudes necesarias para probar la API según los requerimientos del proyecto.

- **Migrations**

  - No se utilizan migraciones en este proyecto. Las tablas se generan automáticamente a partir de las entidades definidas.
