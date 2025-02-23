const express = require('express');
const {connection} = require('./connections');
const transitionRoute = require('./routes/transitionRoutes')
const cors = require("cors");
const app = express();
const PORT = 8000

connection()
app.use(cors());

app.use(express.json())


app.use('/',transitionRoute)









app.listen(PORT,()=>console.log(`Server Started at Port ${PORT}`))