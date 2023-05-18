const fs = require("fs")
const path = require("path")

fs.readdir(path.join(__dirname, "handlers"), (err, files) => {
    if (err) return console.log(err)

    files.forEach(file => {
        require(path.join(__dirname, "handlers", file))
    })
})