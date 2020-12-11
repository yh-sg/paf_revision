//import from libs
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql2/promise")

//construct new express obj/sql
const app = express();
const insertTodo = `INSERT INTO 
    todo (name, dueDate, priority) 
    VALUES (?, ?, ?)`; 
const getTodo = `SELECT * FROM TODO`;
const getSubtodo = `SELECT * from findsubtodo WHERE id=?`
const insertSubTodo = `INSERT INTO subtodo (subname, subpriority, todo_id) VALUES (?, ?, ?)`
const updateSubTodo = `UPDATE SUBTODO
    SET subname=?,
    subpriority=?
    WHERE id=?;`
const deleteSubTodo = `DELETE FROM subtodo where id=?`

require('dotenv').config();

//Initialize all the relevant params for the express middleware
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(bodyParser.json({limit: '50mb'}))

const PORT = process.env.PORT;

//Create my sql connection pool, require to pass in all database credential
const pool = mysql.createPool({
    host: process.env.MYSQL_SERVER,
    port: process.env.MYSQL_SVR_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA,
    connectionLimit: process.env.MYSQL_CON_LIMIT,
});

const makeQuery = (sql, pool)=>{
    console.log(sql);
    return(async (args) => {
        const conn = await pool.getConnection();
        try{
            let results = await conn.query(sql,args||[])
            return results[0]
        }catch(err){
            console.log(err);
        }finally{
            conn.release();
        }
    })
}

const startApp = async(app,pool) => {
    const conn = await pool.getConnection(); 
    try{
        console.log("test database connection...");
        await conn.ping();
        conn.release();
        app.listen(PORT, ()=>{
            console.log("App is on port",PORT);
        })
    }catch(e){
        console.log(e);
    }
}

const findAllTodo = makeQuery(getTodo, pool)
const exeInsertTodo = makeQuery(insertTodo, pool);
const findSubTodo = makeQuery(getSubtodo, pool);
const exeInsertSubtodo = makeQuery(insertSubTodo, pool);
const updateToDo = makeQuery(updateSubTodo, pool);
const delSubtodo = makeQuery(deleteSubTodo, pool);

app.get(`/todo`, (req,res)=>{
    findAllTodo([]).then((results)=>{
        console.log(results);
        res.status(200).json({results});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

app.get(`/subtodo/:todoid`, (req,res)=>{
    const todoid = req.params.todoid;
    findSubTodo([todoid])
    .then((results)=>{
        console.log(results);
        if(results.length<0){
            console.log("Results not found!");
        }
        res.format({
            json:()=>{
                res.status(200).json({results});
            }
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

app.post(`/addtodo`, (req,res)=>{
    const bodyValue = req.body
    console.log(bodyValue);
    exeInsertTodo([req.body.name,req.body.dueDate,req.body.priority])
    .then((results)=>{
        res.status(200).json(results)
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

app.post(`/addsubtodo/:todoid`, (req,res)=>{
    const bodyValue = req.body
    console.log(bodyValue);
    exeInsertSubtodo([req.body.subname,req.body.subpriority,req.params.todoid])
    .then((results)=>{
        res.status(200).json(results)
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

app.put(`/update/:id`,(req,res)=>{
    const bodyValue = req.body;
    console.log(bodyValue);
    updateToDo([req.body.subname,req.body.subpriority,req.params.id])
    .then((results)=>{
        res.status(200).json(results)
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err)
    })
})

app.delete(`/delsubtodo/:id`,(req,res)=>{
    delSubtodo([req.params.id])
    .then(()=>{
        res.status(202)
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
})

app.use((req,res)=>{
    res.redirect('/');
})

startApp(app, pool)