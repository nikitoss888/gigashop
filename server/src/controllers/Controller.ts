import {ValidationError as SequelizeValidationError} from "sequelize";
import ApiError from "../errors/ApiError";
import path from "path";

export default class Controller {
    protected exceptionHandle(e: unknown): ApiError {
        if (e instanceof SequelizeValidationError) {
            return ApiError.badRequest(e.name, e.errors);
        }
        else if (e instanceof ApiError) {
            return e;
        }
        else if (e instanceof Error) {
            return ApiError.internal(e.name);
        }
        else return ApiError.internal("Помилка обробки запиту");
    }

    // Delete file from static folder
    protected deleteFile(dir: string, file: string) {
        const fs = require('fs');

        fs.unlink(path.resolve('../static', dir, file), (err: unknown) => {
            if (err) {
                console.error(err);
            }
        });
    }

    protected parseDate(date: string | undefined): Date | undefined {
        if (!date) return undefined;
        return new Date(date);
    }

    protected parseNumber(number: string | undefined): number | undefined {
        if (!number) return undefined;
        return Number(number);
    }

    protected parseBoolean(boolean: boolean | string | number | undefined): boolean | undefined {
        if (boolean === undefined) return undefined;
        if (!boolean) return false;
        return [true, 'true', 'True', 'on', 'yes', '1', 1].includes(boolean);
    }
}