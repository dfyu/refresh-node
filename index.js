#!/usr/bin/env node
const fs = require("fs")
const arg = require("arg")
const path = require("path")
const child_process = require("child_process")
let args
let filename
try {
    args = arg({
        "-d": String
    })
    filename = args["_"]
} catch (err) {
    console.log(err.message)
    process.exit(0)
}

if (args || filename.length) {
    let argsd = args["-d"]
    filename.map(file => {
        let filepath = path.resolve(__dirname, file)
        let process = load(filepath)
        fs.watchFile(filepath, () => process.refresh())
        if (argsd) {
            let filepath = path.resolve(__dirname, argsd)
            fs.watch(filepath, () => process.refresh())
        }
    })
}

function load (filename) {
    let process = child_process.fork(filename)
    return {
        refresh: () => {
            process.kill("SIGKILL")
            process = child_process.fork(filename)
            console.log("refresh")
        }
    }
}
