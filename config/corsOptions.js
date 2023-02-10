const allowedOrigings = require("./allowedOrigins");

const corsOptions = {
    origin: 'https://dbcheck-api.onrender.com',
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;