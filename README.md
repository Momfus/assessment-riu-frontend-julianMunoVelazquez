# AssessmentRiuFrontendJulianMunozVelazquez

Realizado con Angular 20 para MinData. Solo es frontend (se simula con localstorage el DB). Se utilizara Angular Material

# Indicaciones

Se debe utilizar la última versión LTS de Angular y de cualquier librería que se use en el proyecto.

Desarrollar, utilizando Angular, una aplicación SPA que permita
hacer un mantenimiento de súper héroes:

**- Se deberá crear una serie de servicios que permitan:**
* Registrar un nuevo super heroe.
* Consultar todos los súper héroes.
* Consultar un único súper héroe por id.
* Consultar todos los súper héroes que contienen, en su nombre, el valor
de un parámetro enviado en la petición. Por ejemplo, si enviamos
“man” devolverá “Spiderman”, “Superman”, “Manolito el fuerte”, etc.
* Modificar un súper héroe.
* Eliminar un súper héroe.
* Test unitario de este servicio.

**- Se deberá crear un Componente que, a partir del servicio anterior:**
* Mostrará una lista paginada de héroes donde aparecerán botones de añadir,
editar y borrar.
* Encima de esta lista paginada, se mostrará un input para filtrar por el héroe
seleccionado.
* Al pulsar el botón de añadir se generará un formulario vacío con las
validaciones que se estimen oportunas. Después de dar de alta el nuevo
héroe se volverá a la lista paginada.
* Al pulsar el botón de edición se generará un formulario con los datos del
héroe seleccionado y se permitirá modificar su información. Una vez editado
se deberá volver a la lista paginada.
* Al pulsar el botón de borrar, se preguntará si se está seguro que se desea
borrar el héroe y, al confirmarlo, lo borrará.
* Test unitario de este componente.

## Puntos a tener en cuenta:
* La información de súper héroes se guardará dentro del servicio. (No hace falta
un backend).
* Se valorarán las soluciones propuestas para cada punto, el modelo de
datos y formato del código.
* La prueba se debe presentar en un repositorio de Git. Se sugiere ser ordenado
y descriptivos con los commits. Al momento de la entrega indicar el Repositorio.

## Puntos opcionales de mejora:
* Se puede utilizar Angular Material.
* Rutas y navegación de la página.
* Interceptor para mostrar un elemento “loading” mientras se realiza alguna
operación como “borrado” o “edición”.
* Directiva para que al crear o editar en la caja de texto del nombre del héroe, siempre se muestre en mayúscula.
* Comunicación entre componentes orientada a eventos.

## Se valora positifvamente:
* Cómo se construye el modelo de datos.
* Uso de programación reactiva.
* Código legible usando lambdas.

## Para correcr el proyecto

Instalar las dependencias:

```bash
npm install
```

Para arrancar el servidor local

```bash
ng serve
```

## Building

Para construir el proyecto

```bash
ng build
```

## Para correr los test
Para ejecutar las pruebas unitarias con Karma, se utiliza el siguiente comando:

```bash
ng test
```

# Dockerización de la Aplicación Angular Superheroes

## Comandos Rápidos

## Desarrollo
```bash
# Ejecutar en modo desarrollo
docker-compose --profile dev up --build

# Acceder a la aplicación
# http://localhost:4200
```

## Producción
```bash
# Ejecutar en modo producción
docker-compose --profile prod up --build

# Acceder a la aplicación
# http://localhost:80
```


## Comandos Docker 

### Build de la Imagen
```bash
# Build de producción
docker build -t superheroes-app .

# Build de desarrollo
docker build -f Dockerfile.dev -t superheroes-app-dev .
```

### Ejecutar Contenedor
```bash
# Producción
docker run -p 80:80 superheroes-app

# Desarrollo
docker run -p 4200:4200 -v $(pwd):/app superheroes-app-dev
```
