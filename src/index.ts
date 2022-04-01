import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {pagination} from "typeorm-pagination";
import * as cors from 'cors';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(pagination);
    app.use(cors())
    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route,cors(), (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
    

    // start express server
    app.listen(3001);


    console.log("Express server has started on port 3000. Open http://localhost:3001/users to see results");

}).catch(error => console.log(error));
