import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        succes: false,
        msg: "Demasiadas peticiones, por favor intente de nuevo mas tarde o 15 minutos"
    }

})

export default limiter;