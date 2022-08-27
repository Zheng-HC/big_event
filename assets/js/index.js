// 1. 调用接口获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 3. 为权限接口设置请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if(res.status !== 0) return console.log(res)
            console.log('res：', res);
            renderUserInfo(res.data)
        }
    })
}
getUserInfo()

// 2. 渲染用户信息的函数
function renderUserInfo(user) {
    console.log('user:', user);
    //{id: 23930, username: '```', nickname: '', email: '', user_pic: null}

    // 渲染用户名，优先获取昵称
    const name = user.nickname || user.username
    document.querySelector('.welcome').innerHTML = `欢迎&nbsp;&nbsp;${name}`

    // 渲染用户头像 优先渲染图片头像
    console.log('user_pic:', user.user_pic);
    if (user.user_pic !== null) {
        //隐藏文字头像
        document.querySelectorAll('.text_avatar').forEach(function (item) {
            item.style.display = 'none'
        })
        //渲染图片头像
        document.querySelectorAll('.layui-nav-img').forEach(function (item) {
            item.src = user.user_pic
        })
    } else {
        // 渲染文字头像
        document.querySelectorAll('.text_avatar').forEach(function (item) {
            item.innerText = name[0].toUpperCase()
            item.style.display = 'inline-block'
        })
        // 隐藏图片头像
        document.querySelectorAll('.layui-nav-img').forEach(function (item) {
            item.style.display = 'none'
        })
    }
}

// 4. 设置退出功能：清除token，跳转登录页
document.querySelector('.logout').onclick = function () {
    // 弹出提示框
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        // 清除token
        localStorage.removeItem('token')
        // 跳转登录页
        location.href = '/login.html'

        layer.close(index);
    });
}
/* 
    5.设置未登录访问权限（在baseAPI中配置）
      在进入首页，调用接口获取基本信息的时候，对返回的身份验证结果进行判断，阻止页面跳转
*/

/* 
    首页用到的知识点：
    1. 对于需要权限的接口，要在请求头中配置一个Authorization参数
    2. 退出 和 未登录时的权限操作 要进行的操作：清空token，跳转页面
*/