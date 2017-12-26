// 从数组中随机选择n个返回
function randomArray(array, n) {
    if (array.length < n) { return }
    var rst = []
    while (rst.length < n) {
        let i = Math.floor(Math.random() * array.length)
        if (array[i] == null) { continue }
        rst.push(array[i])
        array[i] = null
    }
    return rst
}

module.exports = {
    randomArray,
}