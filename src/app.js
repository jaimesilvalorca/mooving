import express from "express";
import http from 'http';
import logger from 'morgan';
import cors from 'cors'
import mongoose from "mongoose"
import MongoClient from "./config/config.js"
import userRoutes from './routes/userRoutes.js'
import passport from 'passport';
import passportConfig from './config/passportConfig.js';




const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000;

let client = new MongoClient()
mongoose.set('strictQuery', false)


app.use(passport.initialize());
passportConfig(passport);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors())
app.disable('x-powered-by')
app.set('port',port);

app.use('/api/users',userRoutes)

try {
    client.connect();
    server.listen(3000, function(){
        console.log('Server Up')
        console.log(`http://localhost:${port}/`)
    })
    
} catch (error) {
    console.log(error)
}


app.get('/',(req,res) =>{
    res.send('Ruta Raiz')
})

app.get('/test',(req,res) =>{
    res.send('Ruta test')
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})

export default app