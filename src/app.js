import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import routes from './routes';
import './app/database';

require('dotenv').config();

class App{
    constructor(){
        this.app = express();
        this.middlewares();
        this.swagger();
        this.routes();
    }

    middlewares(){
        this.app.use(express.json());

        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE'); 
            res.header("Access-Control-Allow-Headers", 'X-PINGOTHER, Content-Type');
            this.app.use(cors());
            next();
        })       
    }

    swagger(){
      const port = process.env.SERVER_PORT
      const host = process.env.SERVER_HOST
      const options = {
          definition: {
              openapi: "3.0.0",
              info: {
                  title: "Library API",
                  version: "1.0.0",
                  description: "A simple Express Library API",
              },
              servers: [
                  {
                      url: `http://${host}:${port}`,
                  },
              ],
          },
          apis: ["./src/routes.js"],
      };
      const specs = swaggerJsDoc(options);
      this.app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    }
   
    routes(){
        this.app.use(routes);
    }
}

export default new App().app;
