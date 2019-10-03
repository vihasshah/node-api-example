const express = require('express');
const expressJoi = require('express-joi');
// mongo
const DB = require('./db')

const app = express();
const Joi = expressJoi.Joi;

const conn = DB.getConnection()


const port = process.env.PORT || 3000

app.listen(port,() => {
    console.log(`Listening at ${port}...`)
})

let schema = {
    name:Joi.string().required()
}

let putSchema = {
    id:Joi.number().required(),
    name:Joi.string().required()
}

app.use(express.json())


//==================================================================================================================
// DB operations
//==================================================================================================================


const getGenres = (id = false) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM genres ${id ? 'WHERE id='+id : '' }`,(err,genres) => {
            if(err){
                return reject(err)
            }
            resolve(genres)
        })
    })   
}

/**
 * shape of data:
 *  {
 *      name:String
 *  }
 *  
 *  in res:
 *  {
 *      fieldCount: 0,
 *      affectedRows: 1,
 *      insertId: 3,
 *      serverStatus: 2,
 *      warningCount: 0,
 *      message: '',
 *      protocol41: true,
 *      changedRows: 0 
    }
 */
const addGenres = (data) => {
    return new Promise((resolve,reject) => {
        conn.query(`INSERT INTO genres VALUES(null,'${data.name}')`,(err,res) => {
            if(err){
                return reject(err)
            }
            resolve({
                status: res.affectedRows === 1
            })
        })
    })
}

const updateGenres = (data) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE genres SET name = '${data.name}' WHERE id='${data.id}'`,(err,res) => {
            if(err){
                return reject(err)
            }
            resolve({
                status: res.affectedRows === 1
            })
        })
    })
}

const deleteGenres = (data) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE genres SET name = '${data.name}' WHERE id='${data.id}'`,(err,res) => {
            if(err){
                return reject(err)
            }
            resolve({
                status: res.affectedRows === 1
            })
        })
    })
}

//==================================================================================================================
// Endpoints
//==================================================================================================================


//get all
app.get('/api/genres',(req,res)=>{
    getGenres()
    .then(genres => {
        res.send(genres)
    })
    .catch(err => {
        res.send(err)
    })
})


//get single
app.get('/api/genres/:id',(req,res)=>{
    let id = parseInt(req.params.id)
    let genre = genres.find((genre) => genre.id === id)
    if(!genre){
        res.status(404).send("Invalid ID")
        return;
    }
    getGenres(id)
        .then(genres => {
            res.send(genres)
        })
        .catch(err => {
            res.send(err)
        })
})


app.post('/api/genres',(req,res)=>{
    let body = req.body
    
    let validationErr = Joi.validate(body,schema)
    if(validationErr){
        res.status(400).send({message:validationErr.message})
        return;
    }
    addGenres(body)
        .then((apiRes) => {
            res.send(apiRes)
        })
        .catch((err) => {
            res.send(err)
        })
})


app.put('/api/genres',(req,res)=>{
    let body = req.body
    
    let validationErr = Joi.validate(body,putSchema)
    if(validationErr){
        res.status(400).send({message:validationErr.message})
        return;
    }
    updateGenres(body)
        .then((apiRes) => {
            res.send(apiRes)
        })
        .catch((err) => {
            res.send(err)
        })
})


app.delete('/api/genres/:id',(req,res)=>{
    let id = parseInt(req.params.id)
    let genre = genres.find((genre) => genre.id === id)
    if(!genre){
        res.status(404).send({
            message:'Already deleted'
        })
        return;
    }
    deleteGenres(body)
        .then((apiRes) => {
            res.send(apiRes)
        })
        .catch((err) => {
            res.send(err)
        })
})
