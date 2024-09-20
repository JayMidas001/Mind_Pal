const cors = require("cors")
const express = require("express")

require("./config/db")

const app = express()
const userRouter =require("./routers/userRouter")
const therapistRouter = require("./routers/therapistRouters")
const appointmentRouter = require("./routers/appoinmetRouter")

app.use(express.json())
app.use(cors({ origin: "*"}));
app.use('/uploads',express.static('uploads'))

app.use("/api/v1/user", userRouter)
app.use("/api/v1/therapist", therapistRouter)
app.use("/api/v1/appointment", appointmentRouter)

const PORT = process.env.PORT || 1111

app.get(`/`, )

app.listen(PORT, ()=>{
    console.log(`server is listening to PORT: ${PORT}`)
})
