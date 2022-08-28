// 第一个任务，设置表单的校验规则
/* 
    form.verify({
        规则：function(){}
        规则：[....., '错误提示']
    })
    1. 密码长度规则pwd
    2. 新旧密码不能一样的规则samePwd
    3. 确认密码的规则rePwd
*/
layui.form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function(value){
        if(value === document.querySelector('[name=oldPwd').value){
            return '新密码不能和旧密码相同！'
        }
    },
    rePwd: function(value){
        if(value !== document.querySelector('[name=newPwd').value){
            return '两次输入密码不一致！'
        }
    }
})


// 第二个，监听表单提交，发送数据到服务器
document.querySelector('.layui-form').addEventListener('submit', function(e){
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: {
            oldPwd: document.querySelector('[name=oldPwd]').value,
            newPwd: document.querySelector('[name=newPwd]').value
        },
        success: function(res){
            console.log(res);
            if(res.status !== 0){
                return layui.layer.msg('修改密码失败！'+ res.message)
            }
            layui.layer.msg('修改密码成功！')
        }
    })
})

