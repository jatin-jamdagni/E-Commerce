import swaggerAutogen from "swagger-autogen";

const doc = {
  info:{
    title: "Auth Service API",
    description: "Authentication and Authorization Service",
    version:"1.0.0",
  },
  host: "localhost:6001/api",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/auth.router.ts"]

swaggerAutogen(outputFile, endpointsFiles, doc);
