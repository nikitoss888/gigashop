import {ValidationError as SequelizeValidationError} from "sequelize";
import ApiError from "../errors/ApiError";
import path from "path";

export default class Controller {
    exceptionHandle(e: unknown): ApiError {
        if (e instanceof SequelizeValidationError) {
            return ApiError.badRequest(e.name, e.errors);
        }
        if (e instanceof Error) {
            return ApiError.internal(e.name);
        }
        if (e instanceof ApiError) {
            return e;
        }
        return ApiError.internal("Помилка обробки запиту");
    }

    // Delete file from static folder
    deleteFile(dir: string, file: string) {
        const fs = require('fs');

        fs.unlink(path.resolve('../static', dir, file), (err: unknown) => {
            if (err) {
                console.error(err);
            }
        });
    }
}