/**
 * Created by apple on 2017/5/16.
 */

//这个admin.js将会在admin.jade的文件中被引用

$.ajaxSetup({
    xhrFields: {withCredentials: true},
    error: function(xhr, status, error) {
        $('.alert').removeClass('hidden');
        $('.alert').html("Status: " + status + ", error: " + error);
    }
});

var findTr = function(event) {
    var target = event.srcElement || event.target;
    var $target = $(target);
    var $tr =  $target.parents('tr');
    return $tr;
};

var delete_blog = function(event) {
    var $tr = findTr(event);
    var id = $tr.data('id');
    alert("删除 id为:  "+id+"的博客");
    $.ajax({
        url: '/api/post/' + id,
        type: 'DELETE',
        success: function(data, status, xhr) {
            $('.alert').addClass('hidden');
            $tr.remove();
        }
    })
};

var update_blog = function(event) {
    var $tr = findTr(event);
    $tr.find('button').attr('disabled', 'disabled');
    var data = {
        published: $tr.hasClass('unpublished')
    };
    var id = $tr.attr('data-id');
    alert("修改ID:  "+id +"的博客的发布状态");
    $.ajax({
        url: '/api/post/' + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({article: data}),
        success: function(dataResponse, status, xhr) {
            $tr.find('button').removeAttr('disabled');
            $('.alert').addClass('hidden');
            if (data.published) {
                $tr.removeClass('unpublished').find('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-pause');
            } else {
                $tr.addClass('unpublished').find('.glyphicon-pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
            }
        }
    })
};

$(document).ready(function(){
    //找到admin这个div，下面的tbody
    var $element = $('.admin tbody');
    //将remove和update的click时间，注册到button, 但是为 xxxx-remove(会模糊的检索DOM中的这个class名为这个的)
    // 找的html对象就是这个对象
    // <button type="button" class="btn btn-danger btn-sm glyphicon-remove">
    // 注册到remove这个
    $element.on('click', 'button.glyphicon-remove', delete_blog);
    // 和上面的操作类似
    $element.on('click', 'button.glyphicon-play', update_blog);
})