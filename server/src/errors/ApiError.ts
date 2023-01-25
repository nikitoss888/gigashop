class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
        this.status = status;
    }

    static badRequest(message: string = 'Помилка в запиті') {
        return new ApiError(400, message);
    }

    static unauthorized(message: string = 'Неавторизований запит') {
        return new ApiError(401, message);
    }

    static forbidden(message: string = 'Доступ заборонено') {
        return new ApiError(403, message);
    }

    static notFound(message: string = 'Сторінка не знайдена') {
        return new ApiError(404, message);
    }

    static internal(message: string = 'Внутрішня помилка сервера') {
        return new ApiError(500, message);
    }

    static serviceUnavailable(message: string = 'Сервіс недоступний') {
        return new ApiError(503, message);
    }
}

export default ApiError;