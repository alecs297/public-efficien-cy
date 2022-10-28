export class HTTPError {
    constructor (status, custom_message) {
        this.status = status;
        this.custom_message = custom_message;
    }
}

export class ErrorHandler {
    constructor (app) {
        app.use(async (ctx, next) => {
            try {
                await next();
            } catch (error) {
                ctx.body = {
                    message: error.custom_message || "Internal Server Error"
                }
                ctx.status = error.status || error.statusCode || 500

                if (!(error instanceof HTTPError)) console.error(error);
            }
        })
    }
}