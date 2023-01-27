class ApiError extends Error {
    status: number;
    errors: object[];

    constructor(status: number, message: string, errors: object[] = []) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.status = status;
        this.errors = errors;
    }

    static badRequest(message: string = 'Помилка в запиті', errors: any[] = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message: string = 'Неавторизований запит', errors: any[] = []) {
        return new ApiError(401, message, errors);
    }

    static forbidden(message: string = 'Доступ заборонено', errors: any[] = []) {
        return new ApiError(403, message, errors);
    }

    static notFound(message: string = 'Сторінка не знайдена', errors: any[] = []) {
        return new ApiError(404, message, errors);
    }

    static internal(message: string = 'Внутрішня помилка сервера', errors: any[] = []) {
        return new ApiError(500, message, errors);
    }

    static serviceUnavailable(message: string = 'Сервіс недоступний', errors: any[] = []) {
        return new ApiError(503, message, errors);
    }
}

export default ApiError;