// const { Router } = require("express")

// const router = Router();

// //%C3 = tilde
// //%20 = espacio
// router.get('/:word([a-z0-9%C3%A1%20]+)', (req, res)=>{
//     res.send({word:req.word})
// })

// router.param('word', (req, res, next, word)=>{

//     //console.log('WORD', word)
//     req.word = word;
//     next()
// })
// router.get('*', (req, res)=>{
//     res.status(404).send({status:'error', error:'Cannot access the word'})
// })


// module.exports = {
//     dictionaryRouter
// }