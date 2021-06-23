require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{cors:{origin: "http://localhost:3000"}})
const PORT = process.env.PORT || 4455
const db = require('./dbconfig')
const helmet = require('helmet')


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({createParentPath:true}))
app.use(cookieParser())
app.use(helmet())
app.use(express.static("public"))

// pour ajouter du sel au hashage de mot de passe
const saltRounds = 10

// token pour l'authentification
const Token = {
    access: {
        secretKey: "access_token_29m8v11468hls5i647bzcaq708v5o071lark526p",
        expiresIn: 3600 // 1h = 3600s
    },
    refresh: {
        secretKey: "refresh_token_bg2e6qk295w644nh0vjjn1ugk1z1fnu6y44d553o",
        expiresIn: 604800 // 7jours
    } 
}

// pour creer un id aléatoir
const Random = (long,caseSensitivity) => {
    let tmp = ""
    const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    
    for (let index = 0; index < long; index++) {
        const charOrNumber = Math.floor(Math.random() * (1 - 0 + 1) ) + 0
        const caseType = Math.floor(Math.random() * (1 - 0 + 1) ) + 0
        let char = (charOrNumber === 0)? alphabet[(Math.floor(Math.random() * (25 - 0 + 1) ) + 0)] : Math.floor(Math.random() * 10)  
        caseSensitivity && charOrNumber === 0 && caseType === 1 && (char = char.toUpperCase())
        tmp += char  
    }
    
    return tmp
}

// creer un nouveau token
const getTokenXsrf = (id, tokenType) => {
    const xsrf = Random(255,false)
    const hash = bcrypt.hashSync(xsrf, saltRounds)
    const token = jwt.sign({id:id, xsrf:hash}, tokenType.secretKey, {expiresIn: tokenType.expiresIn})
    return {token: token, xsrf: xsrf}
}

// authentifier l'utilisateur pour certaine action
const authTokenXsrf = (req,res,next) => {
    const {cookies,headers} = req
    if(!cookies || !cookies.refreshToken){ 
        req.headers.data = {id: null, state: "token missing", xsrf: null}
        next()
    }else if(!headers || !headers.xsrf){
        req.headers.data = {id: null, state: "xsrf missing", xsrf: null}
        next()
    }else{    
        try {
            if(cookies.accessToken){
                decode = jwt.verify(cookies.accessToken,Token.access.secretKey)
                decode1 = jwt.verify(cookies.refreshToken,Token.refresh.secretKey)
                const xsrf = JSON.parse((headers.xsrf))
                if(!bcrypt.compareSync(xsrf.accessXsrf, decode.xsrf)){
                    let error = new Error
                    error.name = "access token invalid"
                    throw error
                }else{
                    db.query(`SELECT name FROM user WHERE id="` + decode.id + `"`, (error,result) => {
                        if(result.length > 0){
                            req.headers.data = {id: decode.id, state: "access token valid", xsrf: null}
                            next()
                        }else{ 
                            req.headers.data = {id: null, state: "access token invalid", xsrf: null}
                            next()
                        }
                    })
                }
            } else {
                let error = new Error
                error.name = "access token missing"
                throw error
            }
        } catch (error) {
            if(error.name === "TokenExpiredError" || error.name === "access token missing" || error.name === "access token invalid"){
                try {       
                    decode = jwt.verify(cookies.refreshToken,Token.refresh.secretKey)
                    const xsrf = JSON.parse((headers.xsrf))
                    if(!bcrypt.compareSync(xsrf.refreshXsrf, decode.xsrf)){ 
                        const error = new Error
                        error.name = "refresh token invalid"
                        throw error
                    }else{
                        db.query(`SELECT name FROM user WHERE id="` + decode.id + `"`, (error,result) => {
                            if(result.length > 0){
                                const accessTokenXsrf = getTokenXsrf(decode.id,Token.access)
                                const refreshTokenXsrf = getTokenXsrf(decode.id,Token.refresh)
                                req.headers.data = {id: decode.id, state: "access token expired and renewed", xsrf: {accessXsrf: accessTokenXsrf.xsrf, refreshXsrf: refreshTokenXsrf.xsrf }}
                                res.cookie('accessToken', accessTokenXsrf.token, {
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: 'none',
                                    maxAge: (Token.access.expiresIn * 1000) // convert seconds to milliseconds
                                })
                            
                                res.cookie('refreshToken', refreshTokenXsrf.token, {
                                    httpOnly: true,
                                    secure: true,
                                    sameSite: 'none',
                                    maxAge: (Token.refresh.expiresIn * 1000)
                                })
                                next()
                            }else{ 
                                req.headers.data = {id: null, state: "refresh token invalid", xsrf: null}
                                next()
                            }
                        })
                    }
                } catch (err) {
                    req.headers.data = {id: null, state: "refresh token invalid", xsrf: null}
                    next()
                }
            }else{ 
                req.headers.data = {id: null, state: "token invalid", xsrf: null}
                next()
            }
        }
    }
}

io.on('connection', socket => {
    socket.on('comment', data => {
        let tmp = []
        let id = ""
        do {
            id = Random(100,false)
            db.query(`SELECT carId FROM comment where id="` + id + `"`, (error,result) => {
                tmp = result
            })
        } while (tmp.length > 0)

        db.query(`INSERT INTO comment (id,senderId,carId,content,createdAt,updatedAt) VALUES ("` + id + `","` + data.senderId + `","` + data.carId + `","` + data.content + `",NOW(),NOW())`, (error,result) => {
            if(!error){
                io.sockets.emit('comment' + data.carId,data)
            }
        }) 
    })
})

// enregistrer un utilisateur
app.post("/signIn",(req,res)=>{
    const {signInData} = req.body
    // creer un id et verifier s'il existe déjà
    let id = ""
    let tmp = []
    do {
        id = Random(40,false)
        db.query(`SELECT name FROM user where id="` + id + `"`, (error,result) => {
            tmp = result
        })
    } while (tmp.length > 0)

    // hasher le mot de passe pour plus de sécurité
    const hashPassword = bcrypt.hashSync(signInData.password, saltRounds)

    // inserer les informations de lutilisateur
    db.query(`INSERT INTO user (id,name,email,password,createdAt,updatedAt) VALUES ("` + id + `","` + signInData.name + `","` + signInData.email + `","` + hashPassword + `",NOW(),NOW())`, (error,result) => {
        if(!error){
            // creer un token de connexion et xsrf pour plus de sécurité
            const accessTokenXsrf = getTokenXsrf(id,Token.access)
            const refreshTokenXsrf = getTokenXsrf(id,Token.refresh)

            res.cookie('accessToken', accessTokenXsrf.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: (Token.access.expiresIn * 1000) // convertir seconde en milliseconde
            })
            
            res.cookie('refreshToken', refreshTokenXsrf.token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: (Token.refresh.expiresIn * 1000)
            })

            res.send({xsrf:{accessXsrf: accessTokenXsrf.xsrf, refreshXsrf: refreshTokenXsrf.xsrf},state:"success"})
        }else res.send({state:"failed"})
    }) 
})

// savoir si un utilisateur est connecté
app.post("/isConnected",authTokenXsrf,(req,res) => {
    const {headers} = req
    const data = headers.data
    const isConnected = (data.id)? true:false

    if(data.xsrf !== null){
        res.send({xsrf: {accessXsrf: data.xsrf.accessXsrf, refreshXsrf: data.xsrf.refreshXsrf}, isConnected: isConnected})
    }else res.send({isConnected: isConnected})
})

// se connecter
app.post("/logIn", (req,res) => {
    const {logInData} = req.body
    db.query(`SELECT id,password FROM user WHERE email="` + logInData.email + `"`, (error,result) => {
        if (result.length > 0) {
            // comparer le mot de passe avec celui dans la base
            if(bcrypt.compareSync(logInData.password, result[0].password)){
                const id = result[0].id
                // creer un token de connexion et xsrf pour plus de sécurité
                const accessTokenXsrf = getTokenXsrf(id,Token.access)
                const refreshTokenXsrf = getTokenXsrf(id,Token.refresh)

                res.cookie('accessToken', accessTokenXsrf.token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: (Token.access.expiresIn * 1000) // convertir seconde en milliseconde
                })
                
                res.cookie('refreshToken', refreshTokenXsrf.token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: (Token.refresh.expiresIn * 1000)
                })
                res.send({xsrf:{accessXsrf: accessTokenXsrf.xsrf, refreshXsrf: refreshTokenXsrf.xsrf},state:"success"})
            }else res.send({state:"failed"})
        }
    })
})

// se déconnecter
app.post("/logOut", authTokenXsrf, (req,res) => {
    const {headers} = req
    const data = headers.data
    if(data.id){
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.send()
    }
})

// savoir l'id de l'utilisteur connecté
app.post("/userId",authTokenXsrf,(req,res) => {
    const { data }= req.headers
    if(data.id !== null){
        if(data.xsrf !== null){
            res.send({xsrf: {accessXsrf: data.xsrf.accessXsrf, refreshXsrf: data.xsrf.refreshXsrf}, id:data.id})
        }else res.send({id:data.id})
    }
})

// liste des voiture
app.post("/carList",(req,res) => {
    db.query(`SELECT * FROM car`, (error,result) => {
        if (result.length > 0) {
            res.send(result)
        }
    })
})

// total commentaire sur une voiture
app.post("/commentCount",(req,res) => {
    const {carId} = req.body
    db.query(`SELECT COUNT(*) as total FROM comment WHERE carId=` + carId, (error,result) => { 
        res.send(result[0].total + "")
    })
})

// liste de commentaire
app.post("/commentList",(req,res) => {
    const {carId} = req.body
    db.query(`SELECT * FROM comment WHERE carId=` + carId, (error,result) => {
        res.send(result)
    })
})

// le nom de l'utilisateur 
app.post("/userName",(req,res) => {
    const {userId} = req.body
    db.query(`SELECT name FROM user WHERE id="` + userId + `"`, (error,result) => {
        res.send(result[0].name)
    })
})

server.listen(PORT,()=>console.info(`Server listen on port: ${PORT}`))