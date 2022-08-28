let form = layui.form
let layer = layui.layer

// 1.表单校验规则
form.verify({
    nickname: function (value) {
        if (value.length > 6) {
            return '昵称长度必须在1-6之间'
        }
    }
})

// 2.初始化用户表单
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            // 快速给表单赋值
            form.val("form_userinfo", res.data);
        }
    })
}
initUserInfo()

// 3.重置用户信息
document.querySelector('#btnReset').onclick = function(e){
    // 阻止默认事件
    e.preventDefault()
    // 重新赋值
    initUserInfo()
}

// 4.监听表单提交事件
document.querySelector('.layui-form').addEventListener('submit', function(e){
    // 阻止默认提交
    e.preventDefault()
    const id = document.querySelector('[name=id]').value
    const nickname = document.querySelector('[name=nickname]').value
    const email = document.querySelector('[name=email]').value
    // 将改好的数据发送到服务器
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: {id, nickname, email},
        success: function(res){
            if(res.status !== 0){
                layer.msg('更新用户信息失败！')
            }
            layer.msg('更新用户信息成功！')
            // 调用父页面方法，重新渲染用户信息
            window.parent.getUserInfo()
        }
    })
})
