const AWS = require("aws-sdk");
const createId = require("hash-generator");

const handler = async (event) => {
  const dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10",
    endpoint: "http://dynamodb:8000",
    region: "us-west-2",
    credentials: {
      accessKeyId: "2345",
      secretAccessKey: "2345",
    },
  });

  const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: "2012-08-10",
    service: dynamodb,
  });

  //GET
  if (event.path === "/envios/pendientes" && event.httpMethod === "GET") {
    let params = {
      TableName: "Envio",
      IndexName: "EnviosPendientesIndex",
    };

    let response;
    await docClient
      .scan(params, function (err, data) {
        if (err) {
          response = { body: "Error", statusCode: 400 };
        } else {
          if (data.Items.length > 0) {
            response = { body: data.Items, statusCode: 200 };
          } else {
            response = {
              body: "No hay registros",
              statusCode: 200,
            };
          }
        }
      })
      .promise();

    return response;
  }

  //POST
  else if (event.path === "/envios" && event.httpMethod === "POST") {
    if (event.body == null) {
      return { body: "Debe enviar datos correctamente", statusCode: 400 };
    }
    let body = JSON.parse(event.body);
    if (body.destino === null || typeof body.destino !== "string") {
      return { body: "Envie un destino válido", statusCode: 400 };
    } else if (body.email === null || typeof body.email !== "string") {
      return { body: "Envie un email válido", statusCode: 400 };
    }
    let params = {
      TableName: "Envio",
      Item: {
        id: createId(10),
        fechaAlta: new Date().toString(),
        destino: body.destino,
        email: body.email,
        pendiente: new Date().toString(),
      },
    };
    let response;
    await docClient
      .put(params, function (err, data) {
        if (err) {
          response = {
            body: "Se produjo un error,vuelva a intentarlo más tarde",
            statusCode: 400,
          };
        } else {
          response = { body: params.Item, statusCode: 200 };
        }
      })
      .promise();

    return response;
  }

  //PUT
  else if (event.path === `/envios/${event.pathParameters.idEnvio}/entregado`) {
    let params = {
      TableName: "Envio",
      Key: {
        id: event.pathParameters.idEnvio,
      },
      UpdateExpression: "REMOVE pendiente",
      ConditionExpression: "attribute_exists(pendiente)",
      ReturnValues: "ALL_NEW",
    };

    let response;
    await docClient
      .update(params, function (err, data) {
        if (err) {
          response = {
            body: "Se produjo un error,vuelva a intentarlo má tarde",
            statusCode: 400,
          };
        } else {
          if (Object.keys(data.Attributes).length === 1) {
            response = { body: `No se encontro el envio`, statusCode: 200 };
          } else {
            response = { body: data.Attributes, statusCode: 200 };
          }
        }
      })
      .promise();
    return response;
  } else {
    return { body: "Ruta inválida", statusCode: 400 };
  }
};

exports.handler = handler;
