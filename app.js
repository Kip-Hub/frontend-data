const express = require('express');
const port = process.env.PORT || 1900;
const app = express();

app.use(express.static('static'));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});