require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/people")

const unknownEndpoint = (req, res) => {
    res.status(404).end()
}

const errorHandler = (error, req, res, next) => {
    console.error(error)
    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

morgan.token("body", (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
)

app.get("", (req, res) => {
    res.send("<h1>Phonebook Back End</h1>")
})

app.get("/info", (req, res) => {
    Person.count({}).then((count) => {
        const today = new Date().toString()
        res.send(`
        <div>
            <p>Phonebook has info for ${count} people</p>
            <p>${today}</p>
        </div>
    `)
    })
})

app.get("/api/persons", (req, res) => {
    Person.find({}).then((people) => {
        res.json(people)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            res.json(person)
        })
        .catch((error) => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing",
        })
    } else {
        const newPerson = new Person({
            name: body.name,
            number: body.number,
        })
        newPerson
            .save()
            .then((savedPerson) => {
                res.status(200).json(savedPerson)
            })
            .catch((error) => next(error))
    }
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body
    const newPerson = {
        name: body.name,
        number: body.number,
    }
    Person.findOneAndUpdate(req.params.id, newPerson, {
        new: true,
        runValidators: true,
    })
        .then((updatedPerson) => {
            res.json(updatedPerson)
        })
        .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res) => {
    Person.findOneAndRemove(req.params.id).then((result) => {
        res.status(204).end()
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
