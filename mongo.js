const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("Please provide password")
    process.exit(1)
}

const password =
    process.argv[2] !== "password" ? process.argv[2] : "J2dueFqEisB6i7nu"

const url = `mongodb+srv://noledge0120:${password}@yycluster.znspblz.mongodb.net/yyphonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const newPerson = new Person({ name, number })
    newPerson.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then((people) => {
        console.log("phonebook:")
        people.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
