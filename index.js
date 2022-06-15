const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

morgan.token("body", (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
)

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
]

app.get("", (req, res) => {
    res.send("<h1>Phonebook Back End</h1>")
})

app.get("/info", (req, res) => {
    const number = persons.length
    const today = new Date().toString()
    res.send(`
        <div>
            <p>Phonebook has info for ${number} people</p>
            <p>${today}</p>
        </div>
    `)
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find((person) => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post("/api/persons", (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing",
        })
    } else if (
        persons.some((person) => person.name.toLowerCase() === body.name)
    ) {
        return res.status(400).json({
            error: "name must be unique",
        })
    } else {
        const newPerson = {
            id: Math.floor(Math.random() * 10000),
            name: body.name,
            number: body.number,
        }
        persons = persons.concat(newPerson)
        res.status(200).json(newPerson)
    }
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter((person) => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
