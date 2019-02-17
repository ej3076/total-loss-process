'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
// TODO: Make this strictly only accept CORS from the web service address.
app.use(cors());

app.use('/claims', require('./routes/claims'));
app.use('/keys', require('./routes/keys'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
