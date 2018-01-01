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
    var imgset = {}
    let dirlist = utils.randomArray(fs.readdirSync("../dataset/valid/"), 3)
    for (let i = 0; i < dirlist.length; i++)
        imgset["tag"+i] = dirlist[i]
    let pairs = [
        ["../dataset/valid/"+dirlist[0], "valid/"+dirlist[0]+"/", 3],
        ["../dataset/test/"+dirlist[0], "test/"+dirlist[0]+"/", 2],
        ["../dataset/valid/"+dirlist[1], "valid/"+dirlist[1]+"/", 3],
        ["../dataset/test/"+dirlist[1], "test/"+dirlist[1]+"/", 2],
        ["../dataset/valid/"+dirlist[2], "valid/"+dirlist[2]+"/", 3],
        ["../dataset/test/"+dirlist[2], "test/"+dirlist[2]+"/", 2],
    ]
    let index = 0
    for (let i = 0; i < pairs.length; i++) {
        let filelist = fs.readdirSync(pairs[i][0])
        filelist.pop() //remove num file
        let imglist = utils.randomArray(filelist, pairs[i][2])
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
    let valid_pairs = [
        ["img0", "Group1"], ["img1", "Group1"], ["img2", "Group1"],
        ["img5", "Group2"], ["img6", "Group2"], ["img7", "Group2"],
        ["img10","Group3"], ["img11","Group3"], ["img12","Group3"]
    ]
    for (let i = 0; i < valid_pairs.length; i++) {
        if (response[valid_pairs[i][0]][0] !== valid_pairs[i][1])
            success = false
    }
    
    let dataset_test = JSON.parse(fs.readFileSync("../dataset/test.json"))
    dataset_test['statistics'][0] += 1

    if (success) {
        dataset_test['statistics'][1] += 1
    }
    let record_pairs = [
        ["img0", "Group1"], ["img1", "Group1"], ["img2", "Group1"], 
        ["img3", "Group1"], ["img4", "Group1"],
        ["img5", "Group2"], ["img6", "Group2"], ["img7", "Group2"],
        ["img8", "Group2"], ["img9", "Group2"],
        ["img10","Group3"], ["img11","Group3"], ["img12","Group3"],
        ["img13","Group3"], ["img14","Group3"]
    ]
    for (let i = 0; i < record_pairs.length; i++) {
        let imgname = response[record_pairs[i][0]][1]
        let coll = [0, 0]
        if (dataset_test[imgname] != null) {
            coll = dataset_test[imgname]
        }
        coll[0]++
        if (response[record_pairs[i][0]][0] === record_pairs[i][1]) {
            coll[1]++
        }
        dataset_test[imgname] = coll
    }
    // The following code was writen for untaged situation.
    // It's not used for now.
    if (false) { 
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
            let coll = [0, 0]
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

app.post('/statis', (req, res) => {
    let dataset_test = JSON.parse(fs.readFileSync("../dataset/test.json"))
    res.send({"total":dataset_test['statistics'][0],"success":dataset_test['statistics'][1]})
})

var server = app.listen(8888, () => {
    let host = "127.0.0.1"
    let port = server.address().port

    console.log("Start at http://%s:%s", host, port)
})