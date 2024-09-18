const express = require("express")

require("./config/db")
const cors = require(`cors`)
const app = express()
const userRouter =require("./routers/userRouter")
const therapistRouter = require("./routers/therapistRouters")
const appointmentRouter = require("./routers/appoinmetRouter")

app.use(express.json())
app.use(cors({ origin: "*"}));
app.use('/uploads',express.static('uploads'))
app.use("/api/v1/user", userRouter)
app.use("/api/v1/therapist", therapistRouter)
app.use("/api/v1/appointments", appointmentRouter)

const PORT = process.env.PORT || 1111

app.get("/", (req, res) => {
    res.send("Welcome to Mind Pal!");
  });
  

app.listen(PORT, ()=>{
    console.log(`server is listening to PORT: ${PORT}`)
})
