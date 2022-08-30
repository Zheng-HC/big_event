/* 
    需求：
    1. 初始化表格：发送get请求，获得列表数据，并将其渲染到表格中
    2. 添加类别：点击按钮，在弹出层中输入表单项，然后将数据发送到服务器，并重新渲染表格
*/

let layer = layui.layer
let form = layui.form

// 1. 初始化表格
function initArtList() {
    // GET请求
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // 拼接结构
            let artList = ''
            res.data.forEach(function (item) {
                artList += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                        <button type="button" class="layui-btn layui-btn-xs"
                        data-id="${item.Id}"
                        id="btn-edit">编辑</button>
                        <button type="button" class="layui-btn layui-btn-danger layui-btn-xs"
                        data-id="${item.Id}"
                        id="btn-delete">删除</button>
                    </td>
                </tr>
                `
            });
            // 渲染结构
            document.querySelector('tbody').innerHTML = artList
        }
    })
}
initArtList()

// 2. 添加类别
document.querySelector('#btn_add').onclick = function () {
    // 设置弹出层
    const indexAdd = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加类别',
        content: document.querySelector('#script_add').innerHTML
    })
    // 由于表单是弹出层新加的，需要使用事件委托的方式绑定事件
    document.querySelector('body').addEventListener('submit', function (e) {
        if (e.target.id === 'form_add') {
            e.preventDefault()
            // 发送ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        layer.msg('新增文章失败！')
                    } else {
                        initArtList()
                        layer.msg('新增文章成功！')
                    }
                    layer.close(indexAdd)
                }
            })
        }
    })
}

// 3. 修改文章分类
// 将点击事件委托给tbody
let indexEdit = null
document.querySelector('tbody').addEventListener('click', function (e) {
    // 修改按钮点击事件
    if (e.target.id === 'btn-edit') {
        // 设置弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改类别',
            content: document.querySelector('#script_edit').innerHTML
        })
        // 根据id获取数据，填充表单
        const id = e.target.getAttribute("data-id")
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res);
                form.val('form_edit', res.data)
            }
        })
    }

    // 删除按钮点击事件
    if (e.target.id === 'btn-delete') {
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax请求，删除文章
            const id = e.target.getAttribute("data-id")
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    console.log(res);
                    if(res.status !== 0){
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    initArtList()
                }
            })

            layer.close(index);
        })
    }
})

// 监听修改分类的表单提交事件
document.querySelector('body').addEventListener('submit', function (e) {
    if (e.target.id === 'form_edit') {
        e.preventDefault()
        // 发送ajax请求 删除文章
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新文章失败！')
                }
                layer.msg('更新文章成功！')
                layer.close(indexEdit)
                initArtList()
            }
        })
    }
})


