import { QplData } from './IQplData';

const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser');
const rawJsonData = require("./qpl-data.json");

const port = 3080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const error = (status, msg) => {
    const err = new Error(msg);
    (err as any).status = status;
    return err;
};

// #region GET /api/v1/qpl?offset={offset}&pageSize={pageSize}

app.get('/api/v1/qpl', (req, res) => {
    
    const offsetVal = parseInt(req.query.offset, 10);
    const pageSizeVal = parseInt(req.query.pageSize, 10);

    if (offsetVal == null && pageSizeVal == null) {
        // Return the full list of data
        res.json(rawJsonData);
        return;
    }

    const strifigied = JSON.stringify(rawJsonData);
    const tempQplData: QplData[] = JSON.parse(strifigied);
    const tempData = [];

    for (let i = offsetVal; i < offsetVal + pageSizeVal; i++) {
        tempData.push(tempQplData[i]);
    }

    res.json(tempData);
});

// #endregion

app.get('/', (req, res) =>  {
    res.send('Server works.')
});

// Middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ error: err.message });
});

// Custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use((req, res) => {
    res.status(404);
    res.send({ error: 'Improper request. No data found.' });
});

if (!module.parent) {
    app.listen(port, () => {
        console.log(`Server listening on port::${port}`);
    });
}
