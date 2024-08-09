# Proyecto Angular 18 con Server Side Rendering (SSR)

Este proyecto es una aplicación Angular versión 18 que incluye funcionalidades de Server Side Rendering (SSR) para mejorar el rendimiento y la optimización en motores de búsqueda. Además, se ha implementado una arquitectura de puertos y adaptadores (también conocida como arquitectura hexagonal) para mejorar la mantenibilidad y escalabilidad del código.

```bash
project/
├── dist/                   
├── public/         # Public folder for assets
│   │   ├── images/         
├── src/                    
│   ├── app/
│   │   ├── components/     
│   │   │   │   ├── header/
│   │   │   │   ├── modal/ 
│   │   │   │   ├── paginator/ 
│   │   │   │   ├── tooltip/      
│   │   ├── modules/     
│   │   │   │   ├── products/
│   │   │   │   │   │   ├── application/        # Usecases for application
│   │   │   │   │   │   ├── domain/             # Models and ports 
│   │   │   │   │   │   ├── infrastructure/     # Adapters and services
│   │   ├── pages/     
│   │   │   │   ├── add-product/
│   │   │   │   ├── products/
│   │   ├── validators/     # Validators for dates and form errors
│   ├── environments/       # Environments variables           
```

## Requisitos previos

Antes de instalar y ejecutar la aplicación, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) versión 20.x o superior
- [npm](https://www.npmjs.com/) versión 10.x o superior

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/camilovp01/devsu.git
   ```

2. **Navega al directorio del proyecto:**

   ```bash
   cd devsu
   ```

3. **Instala las dependencias:**

   ```bash
   npm install
   ```

## Ejecución en desarrollo

Para ejecutar la aplicación localmente en modo de desarrollo, usa el siguiente comando:

```bash
npm run start
```

Esto iniciará un servidor en modo de desarrollo con renderizado del lado del servidor. Puedes acceder a la aplicación en [http://localhost:4200](http://localhost:4200).

## Construcción para producción

Para construir la aplicación para producción, ejecuta:

```bash
npm run build
```

Esto generará los archivos necesarios para el SSR en la carpeta `dist`.

Para iniciar el servidor de producción:

```bash
npm run serve:ssr:devsuFront
```

## Cobertura de Pruebas en Jest

Para ejecutar las pruebas y generar un informe de cobertura, utiliza el siguiente comando:

```bash
npm run test:coverage
```

El informe de cobertura se generará en la carpeta `coverage` dentro del proyecto.

![Cobertura de Pruebas](https://github.com/camilovp01/devsu/blob/main/public/images/coverage-report.png)

