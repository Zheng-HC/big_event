
let layer = layui.layer
let form = layui.form


// 1. 获取文章列表，初始化表格
let q = {
    pagenum: 1, // 默认请求第一页数据
    pagesize: 2, // 每页展示两条数据
    cate_id: '', // 文章分类的id
    state: '', // 文章的状态
}
function initTable() {
    $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message)
            }

            // 如果数据是空的，就放假数据
            if (res.data.length === 0) {
                res.data = [
                    {
                        "Id": 1,
                        "title": "abab",
                        "pub_date": "2020-01-03 12:19:57.690",
                        "state": "已发布",
                        "cate_name": "最新"
                    },
                    {
                        "Id": 2,
                        "title": "666",
                        "pub_date": "2020-01-03 12:20:19.817",
                        "state": "草稿",
                        "cate_name": "股市"
                    }
                ]
            }
            // 遍历数据，拼接结构
            let artStr = ''
            res.data.forEach(item => {
                artStr += `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.cate_name}</td>
                    <td>${item.pub_date}</td>
                    <td>${item.state}</td>
                    <td>
                    <button type="button" class="layui-btn layui-btn-xs">编辑</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>
                    </td>
                </tr>
                `
            })
            // 渲染页面
            document.querySelector('tbody').innerHTML = artStr
        }
    })
}
initTable()

// 2. 获取分类列表，渲染下拉框
function initCate (){
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            console.log(res);
            // 拼接结构
            let artList = '<option value="">所有分类</option>'
            res.data.forEach(function (item) {
                artList += `
                <option value="${item.Id}">${item.name}</option>
                `
            });
            // 渲染结构
            document.querySelector('[name=cate_id]').innerHTML = artList
            // 再次渲染layui组件，否则结构不会被渲染
            form.render()
        }
    })
}
initCate()

// 3. 筛选按钮 提交事件
document.querySelector('#form_search').onsubmit = function(e){
    e.preventDefault()
    // 获取下拉框的value值，赋值给表单参数，然后重新渲染表格
    const cate_id = document.querySelector('[name=cate_id]').value
    const state = document.querySelector('[name=state]').value
    q.cate_id = cate_id
    q.state = state
    console.log(q);
    // 重新渲染表格
    initTable()
}
