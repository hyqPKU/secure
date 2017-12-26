var utils = require('./utils')
var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('../dataset'))

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    let dirlist = utils.randomArray(fs.readdirSync("../dataset/valid/"), 3)
    let pairs = [
        ["../dataset/valid/"+dirlist[0], "valid/"+dirlist[0]+"/", 3],
        ["../dataset/test/"+dirlist[0], "test/"+dirlist[0]+"/", 2],
        ["../dataset/valid/"+dirlist[1], "valid/"+dirlist[1]+"/", 3],
        ["../dataset/test/"+dirlist[1], "test/"+dirlist[1]+"/", 2],
        ["../dataset/valid/"+dirlist[2], "valid/"+dirlist[2]+"/", 3],
        ["../dataset/test/"+dirlist[2], "test/"+dirlist[2]+"/", 2],
    ]
    var imgset = {}
    let index = 0
    for (let i = 0; i < pairs.length; i++) {
        let imglist = utils.randomArray(fs.readdirSync(pairs[i][0]), pairs[i][2])
        for (let j = 0; j < imglist.length; j++) {
            imgset["img" + index] = pairs[i][1]+imglist[j]
            index++
        }
    }
    console.log(imgset)
    
    res.render('index', imgset)
})

app.post('/result', (req, res) => {
    let response = req.body
    console.log(response)
    // let response = {
    //     "img0":["Group1","test/tag1/output1_1.jpg"],
    //     "img1":["Group1","test/tag1/output1_1.jpg"],
    //     "img2":["Group1","test/tag1/output1_1.jpg"],
    //     "img3":["Group1","test/tag1/output1_1.jpg"],
    //     "img4":["Group1","test/tag1/output1_1.jpg"],
    //     "img5":["Group0","test/tag1/output1_1.jpg"],
    //     "img6":["Group0","test/tag1/output1_1.jpg"],
    //     "img7":["Group0","test/tag1/output1_1.jpg"],
    //     "img8":["Group0","test/tag1/output1_1.jpg"],
    //     "img9":["Group0","test/tag1/output1_1.jpg"],
    //     "img10":["Group2","test/tag1/output1_1.jpg"],
    //     "img11":["Group2","test/tag1/output1_1.jpg"],
    //     "img12":["Group2","test/tag1/output1_1.jpg"],
    //     "img13":["Group2","test/tag1/output1_1.jpg"],
    //     "img14":["Group2","test/tag1/output1_1.jpg"]
    // }
    let success = true
    if (response["img0"][0] !== response["img1"][0]
     || response["img0"][0] !== response["img2"][0]) {
        success=false
    }
    if (response["img5"][0] !== response["img6"][0]
     || response["img5"][0] !== response["img7"][0]) {
        success=false
    }
    if (response["img10"][0] !== response["img11"][0]
     || response["img10"][0] !== response["img12"][0]) {
        success=false
    }
    let dataset_test = JSON.parse(fs.readFileSync("../dataset/test.json"))
    dataset_test['statistics'][0] += 1
    if (success) {
        dataset_test['statistics'][1] += 1
        let pairs = [
            ["img3", "img0"],
            ["img4", "img0"],
            ["img8", "img5"],
            ["img9", "img5"],
            ["img13", "img10"],
            ["img14", "img10"]
        ]
        for (let x = 0; x < pairs.length; x++) {
            let imgname = response[pairs[x][0]][1]
            let coll = [0, 0, 0]
            if (dataset_test[imgname] != null) {
                coll = dataset_test[imgname]
            }
            coll[0] += 1
            if (response[pairs[x][0]][0] === response[pairs[x][1]][0]) {
                coll[1] += 1
            }
            if (coll[0] < 100) {
                dataset_test[imgname] = coll
            } else if (coll[1]/coll[0] > 0.8) {
                delete dataset_test[imgname]
                fs.rename("../dataset/"+imgname,
                 "../dataset/"+imgname.replace("test", "valid"), () => {
                     console.log("Move one file from test to valid")
                })
                break //部署后需要删除这行
            } else {
                delete dataset_test[imgname]
                fs.unlink("../dataset/"+imgname, () => {})
                break //部署后需要删除这行
            }
        }
        console.log(dataset_test)
    }
    fs.writeFileSync("../dataset/test.json", JSON.stringify(dataset_test))
    res.send({"s":success})
})

var server = app.listen(8888, () => {
    let host = "127.0.0.1"
    let port = server.address().port

    console.log("Start at http://%s:%s", host, port)
})