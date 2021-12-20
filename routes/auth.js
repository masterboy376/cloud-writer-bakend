const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    obj={
        name: 'auth',
        sucess: true,
    }
    res.json(obj);
});

module.exports = router;