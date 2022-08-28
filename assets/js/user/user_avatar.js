// cropper裁剪效果
// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}
// 1.3 创建裁剪区域
$image.cropper(options)

// 给按钮绑定事件
document.querySelector('#selectImgBtn').onclick = function () {
    document.querySelector('#file').click()
}

/* 获取上传的文件
    文件类型表单发生change事件时，事件对象包含target属性，target中包含一个files伪数组，我们上传的文件就保存在其中。
*/
document.querySelector('#file').onchange = function (e) {
    // console.log(e);
    // console.log(e.target.files[0]);

    // 替换裁剪区中的图片
    let imageFile = e.target.files[0]
    // 注意，e.target.files[0] 获取到的不是文件地址，必须通过方法创建地址
    let imageUrl = URL.createObjectURL(imageFile)
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', imageUrl)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
}

// 确定头像，将 图片转为base64 格式的字符串
document.querySelector('#confirmImg').onclick = function(){
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')// 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {avatar: dataURL},
        success: function(res){
            console.log(res)
            if(res.status !== 0){
                console.log('发送数据失败');
            }
            // 发送成功，调用父页面的方法刷新用户头像
            window.parent.getUserInfo()
        }
    })
}

/* 
    更换头像功能：
    1. cropper组件的使用 快速搭建模块
    2. 如何实现文件的上传：通过点击按钮，模仿文件选择的点击事件
    3. 如何将上传的文件放到裁剪区：监听表单的change事件，通过事件对象拿到文件：e.target.files[0]，使用cropper内置方法放入裁剪区
    4. 裁剪完成，如何上传：点击按钮，在事件回调中发送POST请求
*/