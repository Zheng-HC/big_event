let form_login = document.querySelector('#form_login')
let form_reg = document.querySelector('#form_reg')

// 登录/注册 切换功能
document.querySelector('#link_reg').onclick = function () {
    form_login.style.display = 'none'
    form_reg.style.display = 'block'
}
document.querySelector('#link_login').onclick = function () {
    form_login.style.display = 'block'
    form_reg.style.display = 'none'
}

// 给表单添加校验规则
let form = layui.form
let layer = layui.layer

form.verify({
    // pwd 校验密码是否合法
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，不能有空格'],
    // repwd 注册页面校验 两次密码是否一致
    repwd: function (value) {
        const password = document.querySelector('#form_reg [name=password]').value
        if (value !== password) {
            return '两次密码不一致！'
        }
    }
})

// 监听注册表单的提交事件，在事件回调中向接口发送数据
form_reg.addEventListener('submit', function (ev) {
    // 阻止表单默认提交
    ev.preventDefault()
    //获取表单内容
    const username = document.querySelector('#form_reg [name=username]').value
    const password = document.querySelector('#form_reg [name=password]').value

    const data = { username: username, password: password }
    // 利用jq发送post请求
    $.post('http://www.liulongbin.top:3007/api/reguser', data, function (res) {
        // 请求失败，直接返回信息
        if (res.status !== 0) {
            return console.log(res.message);
        }
        console.log(res);
        layer.msg('注册成功，快去登录吧！')
        // 注册成功后 页面跳转到登录界面
        // 模拟点击操作!
        document.querySelector('#link_login').onclick()
    })
})
// 监听登录表单提交事件 发送登录请求
form_login.addEventListener('submit', function (ev) {
    ev.preventDefault()
    //发起post请求
    $.ajax({
        url: 'http://www.liulongbin.top:3007/api/login',
        method: 'POST',
        data: $('#form_login').serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('登录成功！')
            // 登录成功，将token保存在本地
            localStorage.setItem('token', res.token)
            // 跳转到后台主页
            location.href = '/index.html'
        }
    })
})



//  接口根路径：http://www.liulongbin.top:3007

/* 
    login页面功能就算完成了，本页面用到的技术点：
    1. 利用元素的隐藏显示，实现登录/注册的切换
    2. 利用layui-verify，实现表单的自定义校验规则
    3. 监听表单的提交事件，获取表单数据，发送post请求
    4. 在登录成功的接口返回中，将token保存到localStorage中
    5. 登录成功，location.herf 跳转页面
*/