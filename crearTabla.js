var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "2345",
    secretAccessKey: "2345",
  },
});

var dynamodb = new AWS.DynamoDB();

var tableParams = {
  TableName: "Envio",
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S",
    },
    {
      AttributeName: "pendiente",
      AttributeType: "S",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: "EnviosPendientesIndex",
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "pendiente",
          KeyType: "RANGE",
        },
      ],
      Projection: {
        ProjectionType: "ALL",
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
};
dynamodb.createTable(tableParams, function (err, data) {
  if (err) {
    console.error("Error al crear tabla", JSON.stringify(err));
  } else {
    console.log("Tabla creada correctamente");
  }
});
