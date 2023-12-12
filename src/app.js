import express from "express";
import http from 'http';
import logger from 'morgan';
import cors from 'cors'
import mongoose from "mongoose"
import MongoClient from "./config/config.js"
import userRoutes from './routes/userRoutes.js'
import passport from 'passport';
import passportConfig from './config/passportConfig.js';
import driverRoutes from './routes/driverRouter.js'
import handlebars from "express-handlebars";
import passwordRouter from "./routes/passwordRouter.js"
import tripRouter from './routes/tripRouter.js'
import termsRouter from './routes/termsAndConditions.js'




const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000;

let client = new MongoClient()
mongoose.set('strictQuery', false)

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


passportConfig(passport);
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cors())
app.disable('x-powered-by')
app.set('port',port);

app.use('/api/users',userRoutes)
app.use('/api/drivers',driverRoutes)
app.use('/reset-password',passwordRouter)
app.use('/api/trips',tripRouter)
app.use('/api/terms',termsRouter)

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