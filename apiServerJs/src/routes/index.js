const express = require('express');
const router  = express.Router();
const pool = require('../database');
router.get('/',async(req,res)=>{
    const listaUsuarios = await pool.query('select * from usuarios');
    res.send(listaUsuarios);
});

module.exports = router;