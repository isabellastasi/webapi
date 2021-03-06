const { MongoClient, ObjectId} = require("mongodb");
async function connect() {
    if (global.db) return global.db;
    const conn = await MongoClient.connect("mongodb://localhost:27017", { useUnifiedTopology: true });
    if (!conn) return new Error("Can't connect");
    global.db = await conn.db("workshop");
    return global.db
}


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000 //porta padrão


app.use(bodyParser
    .urlencoded({ extended: true }));
app.use(bodyParser.json());

//definindo as rotas
const router = express.Router();
router.get('/clientes/:id?', async function (req, res, next) {
    try {
        const db = await connect();
        if(req.params.id)
        res.json(await db.collection("customers").findOne({_id: new ObjectId(req.params.id)}))
        else
            res.json(await db.collection("customers").find().toArray())
    }
    catch (ex) {
        console.log(ex);
        res.status(400).json({ erro: `${ex}` })
    }
})

router.post('/clientes', async function(req, res, next){
    try{
        const customer = req.body;
        const db = await connect();
        res.json(await db.collection("customers").insertOne(customer));
    }
    catch(ex){
        console.log(ex);
        res.status(400).json({erro:`${ex}`});
    }
})

router.put('/clientes/:id', async function(req, res, next){
    try{
        const customer = req.body;
        const db = await connect();
        res.json(await db.collection("customers").update({_id: new ObjectId(req.params.id)},{$set: customer}));        
    } catch(ex){
        console.log(ex);
        res.status(400).json({erro:`${ex}`})
    }
})
router.patch('/clientes/:id', async function(req, res, next){
    try{
        const customer = req.body;
        const db = await connect();
        const id = {_id: new ObjectId(req.params.id)};
        res.json(await db.collection("customers").updateOne(id, {$set:customer}));
    }catch(ex){
        console.log(ex);
        res.status(400).json({erro:`${ex}`})
    }
})

router.delete('/clientes/:id', async function(req, res, next){
    try{
        const db = await connect();
        res.json(await db.collection("customers").deleteOne({_id: new ObjectId(req.params.id)}));
    }catch(ex){
        console.log(ex);
        res.status(400).json({erro: `${ex}`})
    }   
})
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!')