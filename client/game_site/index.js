const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin"),
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"),
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on port: ${PORT}`));