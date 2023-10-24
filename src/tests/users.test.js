import chai from 'chai'
import chaiHttp from 'chai-http'
//import supertest from 'supertest'
import app from '../app.js'
import UserModel from '../models/usersModel.js'

const expect = chai.expect
chai.use(chaiHttp)

describe('Prueba de Api Users Route', () => {
      it('Prueba de obtención de todos los usuarios de la base de datos', (done)=>{
        chai.request(app)
        .get("/api/users")
        .end((error,res)=>{
            expect(res).to.have.status(200)
            done()
        })
      }
      )
      it('Prueba de creación de usuarios', (done)=>{
        chai.request(app)
        .post("/api/users/create")
        .send({
          "name":"nametest",
          "lastname":"lastnametest",
          "email": "test@test.cl",
          "phone": "1234567",
          "password":"test"
        })
        .end((error,res)=>{
          expect(res).to.have.status(201)
          done()
        })
      })
      it('Prueba de Login', (done)=>{
        chai.request(app)
        .post("/api/users/login")
        .send({
          "email": "test@test.cl",
          "password":"test"
        })
        .end((error,res)=>{
          expect(res).to.have.status(200)
          done()
        })
      })
      after(async()=>{
        await UserModel.deleteOne({email:"test@test.cl"})
      })    
    })  

