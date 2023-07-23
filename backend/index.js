const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_DB)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
  });

app.use(require('./routes/user.routes'));
app.use(require('./routes/admin.routes'));
app.use( require('./routes/post.routes'));

const options = {
    definition : {
        openapi : '3.0.0',
        info : {
            title : 'assessment project',
            version : '1.0.0'
        },
        servers : [
            {
                url : 'http://localhost:8080/'
            }
        ] 
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// /**
//  * @swagger
//  * /:
//  *  get:
//  *      summary: This api is used tocheck whether app is running or not
//  *      description: This api is used tocheck whether app is running or not
//  *      responses:
//  *          200:
//  *              description: Totest get method
//  */

// app.use((req,res) => {
//     res.send("Welcome to our api");
// })



const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});