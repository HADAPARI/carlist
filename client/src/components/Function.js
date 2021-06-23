import axios from "axios"
axios.defaults.baseURL = "http://localhost:7000"

export const setUser = async(data) => {
    const res = await axios.post("/signIn", {signInData:data}, { withCredentials: true })
    res.data.xsrf && localStorage.setItem("xsrf",JSON.stringify(res.data.xsrf))
    return res.data.state
}

export const logIn = async(data) => {
    const res = await axios.post("/logIn", {logInData:data}, { withCredentials: true })
    res.data.xsrf && localStorage.setItem("xsrf",JSON.stringify(res.data.xsrf))
    return res.data.state
}

export const logOut = async() => {
    const res = await axios.post("/logOut", "", { headers: { xsrf: localStorage.getItem("xsrf")} , withCredentials: true })
    localStorage.removeItem("xsrf")
    return res
}

export const isConnected = async() => {
    if(!localStorage.getItem("xsrf")) return false
    const res = await axios.post("/isConnected", "", { headers: { xsrf: localStorage.getItem("xsrf")} , withCredentials: true })
    res.data.xsrf && localStorage.setItem("xsrf",JSON.stringify(res.data.xsrf))
    return res.data.isConnected
}

export const getUserId = async() => {
    if(await !isConnected()) return
    const res = await axios.post("/userId", "", { headers: { xsrf: localStorage.getItem("xsrf")} , withCredentials: true })
    res.data.xsrf && localStorage.setItem("xsrf",JSON.stringify(res.data.xsrf))
    return res.data.id
}

export const getUserName = async(id = "") => {
    if(await !isConnected()) return
    let res = await axios.post("/userName", {userId:id}, { headers: { xsrf: localStorage.getItem("xsrf")} , withCredentials: true })
        res.data.xsrf && localStorage.setItem("xsrf",JSON.stringify(res.data.xsrf))
    return res.data
}

export const getCarList = async() => {
    const res = await axios.post("/carList")
    return res.data
}

export const getCommentCount = async(carId) => {
    const res = await axios.post("/commentCount",{carId:carId})
    return res.data
}

export const getCommentList = async(carId) => {
    if(await !isConnected()) return
    const res = await axios.post("/commentList", {carId:carId}, { headers: { xsrf: localStorage.getItem("xsrf")} , withCredentials: true })
    res.data.xsrf && localStorage.setItem("xsrf",JSON.stringify(res.data.xsrf))
    return res.data
}