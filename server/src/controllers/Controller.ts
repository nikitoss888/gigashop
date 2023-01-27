import {ValidationError as SequelizeValidationError} from "sequelize";
import ApiError from "../errors/ApiError";

export default class Controller {
    static exceptionHandle(e: unknown): ApiError {
        if (e instanceof SequelizeValidationError) {
            return ApiError.badRequest(e.name, e.errors);
        }
        return ApiError.internal("Помилка обробки запиту");
    }
}