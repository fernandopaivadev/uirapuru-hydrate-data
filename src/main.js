import fs from 'fs'
import { createInterface } from 'readline'

const input = createInterface({
    input: process.stdin,
    output: process.stdout
})

input.question('Digite o caminho do arquivo a ser tratado: ', answer => {
    fs.readFile(answer, (err, data) => {
        if (err) {
            console.log(err.message)
            return null
        }

        const dataLines = data.toString().split('\n')

        const dataObjects = dataLines.map(line => {
            if (line.length > 1) {
                return JSON.parse(line)
            }
        })

        dataObjects.forEach(dataObject => {
            if (dataObject) {
                const rtc = new Date(dataObject.rtc)
                const timestamp = `${
                    rtc.getDate()
                }/${
                    rtc.getMonth() + 1
                }/${
                    rtc.getFullYear()
                } ${
                    rtc.getHours()
                }:${
                    rtc.getMinutes()
                }`

                delete dataObject.rtc
                delete dataObject.store
                dataObject.timestamp = timestamp
            }
        })

        const messages = dataObjects.filter(dataObject => dataObject)
        
        messages.forEach(message => {
            const line = `${message.v1},${message.i1},${message.timestamp}\n`
            fs.appendFileSync('result.csv', line, () => {})
        })

        console.log('CONCLUÍDO')
        process.exit()
    })
})