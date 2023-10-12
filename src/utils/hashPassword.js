import bycript from 'bcrypt'

export const createHash = password =>{
    return bycript.hashSync(password,bycript.genSaltSync(10))
}