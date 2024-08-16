/**
 * 1. 先分页从接口请求所有的数据，10万条数据，再分页处理，转成excel,需要117s
 * 2. 接口一次返回10万条数据，再分页处理，转成excel,需要163毫秒
 */

this.onmessage = async (e) => {
  console.log(e.data)
  // const data = await getData(e.data.total, e.data.size)
  const data = await getData2(e.data.total)
  mp(data.length, e.data.size, data)
}

// 模拟请求分页数据
function request (size, step) {
  const arr = []
  for (let i = 0; i < size; i++) {
    arr.push(`${[(i + 1) + (size * (step - 1)), '姓名333' + i, '上海市徐汇区天钥桥南路0000号' + i, '11111111111'].join()}\n`)
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr)
    }, 500)
  })
} 

// 一次请求所有数据
function requestAll (total) {
  const arr = []
  for (let i = 0; i < total; i++) {
    arr.push(`${[i+1, '姓名333' + i+1, '上海市徐汇区天钥桥南路0000号' + i+1, '11111111111'].join()}\n`)
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr)
    }, 500)
  })
} 

// 请求到所有的分页数据
function getData (total, size) {
  const arr = []
  const result = []
  const step = Math.ceil(total/size)
  return new Promise((resolve) => {
    for (let i = 1; i <= step; i++) { 
      arr.push(request(size, i))
    }
    Promise.all(arr).then((res) => {
      res.forEach(item => {
        result.push(...item)
      })
      console.log('result',result)
      resolve(result)
    })
  })
}

// 一次请求到所有的数据
function getData2 (total) {
  return requestAll(total)
}

// 添加每页的数据
function setPage (size, step, val) {
  const arr = []
  for (let i = 0; i < size; i++) {
    const index = (i + 1) + (size * (step - 1))
    arr.push(val[index-1])
  }
  return new Promise((resolve) => {
      resolve(arr)
  })
} 

async function mp (total, size, val) {
  // 分页
  const step = Math.ceil(total/size)
  const arr = [`${['id', '姓名', '地址', '手机号'].join()}\n`]
  console.time('导出时间')
  // 分页处理数据
  for (let i = 1; i <= step; i++) {
    await new Promise(async (resolve) => {
      // 处理每一页的数据
      const data = await setPage(size, step, val)
      data.forEach(element => {
        arr.push(element)
      })
      resolve(true)
    })
    console.log(99)
  }
  const blob = new Blob([String.fromCharCode(0Xfeff), ...arr], {
    type: 'text/plain;charset=utf-8'
  })
  this.postMessage(blob)
  console.timeEnd('导出时间')
}