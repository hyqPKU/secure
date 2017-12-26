## 使用
```shell
npm install
npm start
```

## 数据交互
### 后台->前端
```javascript
    {
        "img0":"valid/game/img0"
        "img1":"valid/game/img1"
        "img2":"test/game/img2"
        ...
    }
```
传入数据是这样约定的
- 0~4tag一致，0~2来自valid，3~4来自test
- 5~9tag一致，5~7来自valid，8~9来自test
- 10~14tag一致，10~12来自valid，13~14来自test
 

### 前端->后台
```javascript
    {
        "img0":["Group1","test/tag1/output1_1.jpg"],
        "img1":["Group1","test/tag1/output1_1.jpg"],
        "img2":["Group1","test/tag1/output1_1.jpg"],
        "img3":["Group1","test/tag1/output1_1.jpg"],
        "img4":["Group1","test/tag1/output1_1.jpg"],
        "img5":["Group0","test/tag1/output1_1.jpg"],
        "img6":["Group0","test/tag1/output1_1.jpg"],
        "img7":["Group0","test/tag1/output1_1.jpg"],
        "img8":["Group0","test/tag1/output1_1.jpg"],
        "img9":["Group0","test/tag1/output1_1.jpg"],
        "img10":["Group2","test/tag1/output1_1.jpg"],
        "img11":["Group2","test/tag1/output1_1.jpg"],
        "img12":["Group2","test/tag1/output1_1.jpg"],
        "img13":["Group2","test/tag1/output1_1.jpg"],
        "img14":["Group2","test/tag1/output1_1.jpg"]
    }
```

### test.json
```javascript
    {
        "statistics":[总数，成功次数]
        "test/game/img2": [总数,成功次数]
        ...
    }
```