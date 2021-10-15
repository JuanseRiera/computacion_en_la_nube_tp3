## COMPUTACIÓN EN LA NUBE

### TP3 - JUAN SEGUNDO RIERA - 43774

### Pasos:

Ejecutar el comando "docker network create awslocal"

docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local:1.15.0 -jar DynamoDBLocal.jar -sharedDb

Entrar en el pryecto e instalar las dependecias con npm i
node crearTabla.js
sam local start-api --docker-network awslocal

#### GET

    GET /envios/pendientes
    Host: localhost:3000

#### POST

    POST /envios
    Host: localhost:3000
    Content-Type: application/json
    {
        "destino": "Mendoza",
        "email": "rierajuanse@gmail.com"
    }

#### PUT

    PUT /envios/{idEnvio}/entregado
    Host: localhost:3000
