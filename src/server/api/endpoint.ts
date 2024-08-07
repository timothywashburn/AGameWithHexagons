import fs from "fs";
import path from "path";
import {Request, Response} from "express";
import * as auth from "../controllers/authentication";

export const endpoints: Endpoint[] = [];

export abstract class Endpoint {
    abstract getParameters(): string[];

    abstract call(parameters: string[], authData: AuthData): Promise<string | object>;

    abstract requiresAuthentication(): boolean;

    getName(): string {
        return this.constructor.name.toLowerCase();
    }
}

fs.readdir(path.join(__dirname, 'endpoints'), (err, files) => {
    if (err) {
        console.error('Error reading endpoint files:', err);
        return;
    }

    files.forEach((file: string) => {
        if (!file.endsWith('.ts')) return;

        require(`./endpoints/${file}`);
    });
});

export async function handleEndpoint(req: Request, res: Response) {
    let endpoint = req.params.endpoint.toLowerCase();

    let found = endpoints.find((e) => e.getName() === endpoint);

    if (!found) {
        res.json({
            success: false,
            message: 'Endpoint not found'
        });
        return;
    }

    let authHeader = req.headers.authorization;

    let token = authHeader === undefined ? "" : req.headers.authorization!.split(' ')[1];
    let valid: boolean = found.requiresAuthentication() && token !== "" && await auth.validateUser(token, null);

    if (found.requiresAuthentication() && !valid) {
        reject(res, 'Unauthorized');
        return;
    }

    let parameters = found.getParameters();
    let paramValues: string[] = [];

    for (let param of parameters) {
        let queryValue = req.query[param];

        if (!queryValue) {
            reject(res, `Missing parameter: ${param}`);
            return;
        }

        paramValues.push(queryValue as string);
    }

    let response =  await found.call(paramValues, { token: token, valid: valid });


    if (typeof response === 'string') {
        res.redirect(response);
    } else {
        res.json(response);
    }

    function reject(res: Response, message: string) {
        res.json({
            success: false,
            message: message
        });
    }
}

export interface AuthData {
    token: string;
    valid: boolean;
}