import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import fs from 'fs'

const __dirname = path.resolve()
const app = express()
export const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})

app.use(express.static(path.resolve(__dirname, 'public')))

const usersPath = path.resolve(__dirname, 'public', 'src', 'users.json')

app.post('', bodyParser.json(), (req, res) => {
        switch (req.headers['task']) {
            case 'users-list':
                fs.readFile(usersPath, 'utf8', (err, data) => {
                    res.send(data)
                })
                break
            case 'new-user':
                fs.readFile(usersPath, "utf8", (error, data) => {
                        if (!data) {
                            data = '[]'
                        }
                        data = JSON.parse(data)
                        data.push(req.body)
                        data = JSON.stringify(data)
                        fs.writeFile(usersPath, data, (error) => {
                            if (error) throw error
                        })
                    }
                )
                res.end()
                break
            default:
                res.end()
        }
    }
)









