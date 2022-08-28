// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象options
$.ajaxPrefilter(function (options) {
    // 设置接口根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 按需 配置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 统一设置未登录权限
    // 无论成功与否，都会执行complete函数
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
            //阻止跳转
            location.href = '/login.html'
        }
    }
})