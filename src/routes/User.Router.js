// const {CustomRouter} = require('./CustomRouter');

// class UserRouter extends CustomRouter {
//     initialize(){

//         this.get('/userpolicies', ["PUBLIC"], (req,res)=>{
//             res.sendSuccess(`Hi you've reached Custom & User Router`)
//         })

//         this.post('/userpolicies', ["PUBLIC"], (req, res)=>{
//             const {first_name, last_name} = req.body;
//             if(!first_name || !last_name) return res.sendUserError('invalid parameters')

//             res.sendSuccess('User created successfully')
//         })

//         this.get('/publicroute', ["PUBLIC"], (req,res)=>{
//             res.sendSuccess(`Hi you'r in`)
//         })

//         this.get('/privateaccess', ["USER", "ADMIN"], (req,res)=>{
//             res.sendSuccess(`You have access for this`)
//         })

//         this.get('/adminonly', ["ADMIN"], (req,res)=>{
//             res.sendSuccess(`Access only for admin`)
//         })
//     }
// }

// module.exports = UserRouter;
