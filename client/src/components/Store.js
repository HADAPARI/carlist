import { combineReducers } from 'redux'

// store connexion
const logInStore = (state = false, action) => {
    if(action.type === "logIn"){ 
        switch (action.value) {
            case "hide" : state = false
                break
            case "show" : state = true
                break
            default     : 
                break
        }
    }
    return state
}

// store inscription
const signInStore = (state = false, action) => {
    if(action.type === "signIn"){
        switch (action.value) {
            case "hide" : state = false
                break
            case "show" : state = true
                break
            default     : 
                break
        }
    }
    return state
}

// store etat de connexion
const connectedStore = (state = false, action) => {
    if(action.type === "connected"){
        state = action.value
    }
    return state
}

// store toast notification
const toastNotifStore = (state = {show:false}, action) => {
    if(action.type === "toastNotif"){
        switch (action.value) {
            case "hide" : state = {show:false}
                break
            case "show" : state = {show:true,title:action.title,msg:action.msg}
                break
            default     : 
                break
        }
    }
    return state
}

const Store = combineReducers({
    logIn: logInStore,
    signIn: signInStore,
    connected: connectedStore,
    toastNotif: toastNotifStore,
})

export default Store
