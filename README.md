# README API PRACTICA NODE

## Iniciar aplicación modo develop:
* npm run dev

## Iniciar la aplicación en modo normal o producción
* npm run prod

## Iniciar base de datos de mongoDB
* ./bin/mongod --dbpath ./data/db --directoryperdb

## Inicializar la base de datos (limpiar bd y cargar anuncios.json con datos de anuncios)
* npm run initDB

## API Métodos

### Lista de todos los anuncios
http://localhost:3000/apiv1/anuncios

### Parámetros:
  
  * limit: number. Limita el número de resultados retornados.
  * start: number. Para paginado, indica el número de registros que se salta
  * sort: string, ordena por el campo de anuncio indicado
  * tag: string, Muestra los anuncios que tengan el tag indicado
  * venta: boolean, valor true para listar los anuncios de venta, valor false para los que son de busqueda
  * nombre: string, busca los anuncios por el nombre, si coinciden los primeros cácteres también lista
  * precio: si ponemos un precio nos mostrara los que coincidan con el, si indicamos -50 nos lista los de
  menor a 50, si indicamos 50- mostrara los mayores a ese precio y si indicamos 50-100 mostrara los que 
  se encuentren estre ese rango de valores.

  * Ejemplo:
  http://localhost:3000/apiv1/anuncios?tag=mobile&venta=false&nombre=ip&precio=50-&start=0&limit=2&sort=precio
### Lista de los tags
http://localhost:3000/apiv1/anuncios/tags  

### Vista del listado de todos los anuncios utiliza los mismos parámetros que en el caso anterior
http://localhost:3000


  * Ejemplo:
  http://localhost:3000?tag=mobile&venta=false&nombre=ip&precio=50-&start=0&limit=2&sort=precio

### Iniciar eslint
*npm run lint