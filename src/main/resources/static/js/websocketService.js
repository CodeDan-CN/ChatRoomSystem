var toName;
var userAccount;
var ws;
$(document).ready(function (){



    $.ajax({
        url:"getUserAccount",
        type:"get",
        success:function (res){
            userAccount = res;
        },
        //关闭ajax的异步调用，变成同步调用
        async:false
    })
    //建立WebSocket连接
    ws = new WebSocket("ws://localhost:8848/hello");
    //绑定触发事件
    ws.onopen = function (res){
        //建立连接之后需要做什么事儿？
        //首先显示一下在线信息，因为我们知道虽然登录时会显示在线，但是有可能断线之后再次在线，那么就需要这里改变一下了
        $("#user_state").html("在&nbsp;&nbsp;线");
        $("#user_state").css("color","green");
        let toNameList = '';
        $.ajax({
            url:"getFriendList",
            type:"get",
            data:{
                userAccount: userAccount
            },
            success(res){
                toNameList = JSON.parse(res);
            },
            async:false
        })
        //先发送向信息服务器注册用户标识信息
        var upMessage = {"status":200,"resultBody":{"messageStatus":100,"fromName":userAccount,"toName":null,"message":null}};
        ws.send(JSON.stringify(upMessage));
        //准备把用户账号以及好友列表发送过去，以JSON对象的格式发送
        var json = {"status":210,"resultBody":{"messageStatus":401,"fromName":userAccount,"toName":toNameList,"message":null}};
        console.log(json);
        ws.send(JSON.stringify(json));
        // var json = {"status":100,"resultBody":{"fromName":userAccount,"toName":null,"message":null}};
        // ws.send(JSON.stringify(json));
    }

    ws.onmessage = function (res){
        var data = JSON.parse(res.data);
        if( data.status == 401 ){
            //其他人上线之后的处理
            var toAccount = data.resultBody.fromName;
            //首先复制出一个在线li出来
            //首先获取src属性，list_center_top_left的text，list_center_top_right的text，list_center_bottom_left的text，list_center_bottom_right的text
            var id = '#'+toAccount;
            var state =$(id).children(".list_center")
                .children(".list_center_top")
                .children(".list_center_top_center").text();
            if( state == "[离线]" ){
                var src = $(id).children(".list_photo").children("img").attr("src");
                console.log(src);
                var name = $(id).children(".list_center")
                    .children(".list_center_top")
                    .children(".list_center_top_left").text();
                console.log(name);
                var time = $(id).children(".list_center")
                    .children(".list_center_top")
                    .children(".list_center_top_right").text();
                console.log(time);
                var text = $(id).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_left").text();
                console.log(text);
                var number = $(id).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_right").text();
                console.log(number);
                var tempLi = "";
                if( number > 0 ){
                    tempLi = `<li id="${toAccount}" class="ul_list">
    <div class="list_photo">
        <img src="${src}" />
    </div>
    <div class="list_center">
        <div class="list_center_top">
            <div class="list_center_top_left">${name}</div>
            <div class="list_center_top_right">${time}</div>
            <div class="list_center_top_center">[在线]</div>
        </div>
        <div class="list_center_bottom">
            <div class="list_center_bottom_left">${text}</div>
            <div class="list_center_bottom_right">${number}</div>
        </div>
    </div>
</li>`
                }else{
                    tempLi = `<li id="${toAccount}" class="ul_list">
    <div class="list_photo">
        <img src="${src}" />
    </div>
    <div class="list_center">
        <div class="list_center_top">
            <div class="list_center_top_left">${name}</div>
            <div class="list_center_top_right">${time}</div>
            <div class="list_center_top_center">[在线]</div>
        </div>
        <div class="list_center_bottom">
            <div class="list_center_bottom_left">${text}</div>
            <div class="list_center_bottom_right" style="background-color: transparent">${number}</div>
        </div>
    </div>
</li>`
                }
                console.log(tempLi);
                $(id).remove();
                $("#user_online_list_ul").append(tempLi);
                var oldBody = sessionStorage.getItem("onlineList");
                if( oldBody != null ){
                    oldBody += tempLi;
                }else{
                    oldBody = tempLi;
                }
                sessionStorage.setItem("onlineList",oldBody);
            }
            //信息就不发了。换成ajax请求添加即可，在redis中添加在线好友即可
            $.ajax({
                url:"addOnlineFrined",
                type:"get",
                data:{
                    userAccount:userAccount,
                    friendAccount:toAccount,
                },
                success(res){
                    console.log("添加成功");
                }
            })

            // var data = {"status":401,"resultBody":{"fromName":userAccount,"toName":toAccount,"message":null}};
            // ws.send(JSON.stringify(data));
        }else if(data.status == 402){
            //其他人下线之后的处理
            var toAccount = data.resultBody.fromName;
            //首先复制出一个离线li出来
            //首先获取src属性，list_center_top_left的text，list_center_top_right的text，list_center_bottom_left的text，list_center_bottom_right的text
            var id = '#'+toAccount;
            var state =$(id).children(".list_center")
                .children(".list_center_top")
                .children(".list_center_top_center").text();
            if( state == "[在线]" ){
                var src = $(id).children(".list_photo").children("img").attr("src");
                console.log(src);
                var name = $(id).children(".list_center")
                    .children(".list_center_top")
                    .children(".list_center_top_left").text();
                console.log(name);
                var time = $(id).children(".list_center")
                    .children(".list_center_top")
                    .children(".list_center_top_right").text();
                console.log(time);
                var text = $(id).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_left").text();
                console.log(text);
                var number = $(id).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_right").text();
                console.log(number);
                var tempLi = "";
                if( number > 0 ){
                    tempLi = `<li id="${toAccount}" class="ul_list">
    <div class="list_photo">
        <img src="${src}" />
    </div>
    <div class="list_center">
        <div class="list_center_top">
            <div class="list_center_top_left">${name}</div>
            <div class="list_center_top_right">${time}</div>
            <div class="list_center_top_center" style="color: red;">[离线]</div>
        </div>
        <div class="list_center_bottom">
            <div class="list_center_bottom_left">${text}</div>
            <div class="list_center_bottom_right">${number}</div>
        </div>
    </div>
</li>`
                }else{
                    tempLi = `<li id="${toAccount}" class="ul_list">
    <div class="list_photo">
        <img src="${src}" />
    </div>
    <div class="list_center">
        <div class="list_center_top">
            <div class="list_center_top_left">${name}</div>
            <div class="list_center_top_right">${time}</div>
            <div class="list_center_top_center" style="color: red;">[离线]</div>
        </div>
        <div class="list_center_bottom">
            <div class="list_center_bottom_left">${text}</div>
            <div class="list_center_bottom_right" style="background-color: transparent">${number}</div>
        </div>
    </div>
</li>`
                }
                console.log(tempLi);
                $(id).remove();
                $("#user_offline_list_ul").append(tempLi);
                var oldBody = sessionStorage.getItem("offlineList");
                if( oldBody != null ){
                    oldBody += tempLi;
                }else{
                    oldBody = tempLi;
                }
                sessionStorage.setItem("offlineList",oldBody);
            }
            // var data = {"status":402,"resultBody":{"fromName":userAccount,"toName":toAccount,"message":null}};
            // ws.send(JSON.stringify(data));
            $.ajax({
                url:"deleteOnlineFriend",
                type:"get",
                data:{
                    userAccount:userAccount,
                    friendAccount:toAccount
                },
                success(res){

                }
            })
        }else if( data.status == 200 ){
            //说明有人发送信息过来了，此时就需要判断一下，当前聊天框是不是和信息发送方的
            //如果当前聊天框是和发送方一致的话，那么显示在聊天框外，还需要在列表中更新一下
            var id = '#'+toName;
            var uid = '#'+data.resultBody.fromName;
            var friendSrc = $(uid).children(".list_photo").children("img").attr("src");
            var messageData = `<li>
	<div class="chat_list_photo">
		<img src="${friendSrc}" style="width: 100%; height: 100%; border-radius: 50px;">
	</div>
	<div>
		<div class="chat_list_text" >${data.resultBody.message}</div>
	</div>
</li>`
            var now = new Date();
            var H = getRealTime(now.getHours());
            var i = getRealTime(now.getMinutes());
            var time = H+":"+i;
            if( toName == data.resultBody.fromName ){
                //先把要显示的内容拼起来
                //显示到聊天框中
                $(".chat_list").append(messageData);
                let chat_body = document.getElementById('chat_body');
                let height = chat_body.scrollHeight;
                chat_body.scrollTo(0,height);
                // $(".body_center_chat_result_body").scrollIntoView(false);
            }else{
                var number = $(uid).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_right").text();
                $(uid).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_right").text(parseInt(number) + 1);
                //改变样式
                $(uid).children(".list_center")
                    .children(".list_center_bottom")
                    .children(".list_center_bottom_right").css("background-color","red");
                $(this).parent().prepend($(this));
            }
            //待考虑逻辑
            var oldBody = sessionStorage.getItem(data.resultBody.fromName);
            if( oldBody == null ){
                $.ajax({
                    url:"getChatRecord",
                    type:"get",
                    data:{
                        "userAccount":data.resultBody.fromName
                    },
                    success:function (res){
                        var result = JSON.parse(res);
                        //处理一下JSON格式对象，即把其生成成html的聊天内容
                        var userSrc = $(".left_centent_user_left_photo").attr("src");
                        oldBody = "";
                        for(var record of result){
                            if( record.userAccount == userAccount ){
                                oldBody += `<li>
	<div class="chat_list_photo" style="float: right">
		<img src="${userSrc}" style="width: 100%; height: 100%; border-radius: 50px;">
	</div>
	<div>
		<div class="chat_list_text" style="float: right;background-color: #def3fd; ">${record.text}</div>
	</div>
</li>`
                            }else{
                                oldBody += `<li>
	<div class="chat_list_photo">
		<img src="${friendSrc}" style="width: 100%; height: 100%; border-radius: 50px;">
	</div>
	<div>
		<div class="chat_list_text" >${record.text}</div>
	</div>
</li>`
                            }
                        }
                    },
                    async:false
                })
            }
            var newBody = oldBody + messageData;
            sessionStorage.setItem(data.resultBody.fromName,newBody);
            //更新列表中的显示信息
            $(uid).children(".list_center")
                .children(".list_center_bottom")
                .children(".list_center_bottom_left").text(data.resultBody.message);
            //构造一下时间
            $(uid).children(".list_center")
                .children(".list_center_top")
                .children(".list_center_top_right").text(time);
        }else if( data.status == 301 ){
            var selectAccount =  data.resultBody.fromName;
            //通过ajax获取一下这个用户的信息
            var resultData = '';
            $.ajax({
                url:"getUserData",
                type:"get",
                data:{
                    "userAccount" : selectAccount
                },
                success:function (res){
                    resultData = JSON.parse(res);
                },
                async:false
            })
            //判断好友申请列表是不是显示状态
            //先把信息拼接成li
            var tempLi = '';
                tempLi = `<li id="friend${resultData.userAccount}">
    <div class="li_left">
        <img src="../img/${resultData.photo}" style="width: 100%; height: 100%;">
    </div>
    <div class="li_center">
        <span class="li_center_top">${resultData.name}(${resultData.userAccount})</span>
        <span class="li_center_bottom">${resultData.summary}</span>
    </div>
    <div class="li_right">
        <img src="../img/add.png" class="li_right_add_photo" data-account="${resultData.userAccount}" />
        <img src="../img/delete.png" class="li_right_delete_photo" data-account="${resultData.userAccount}"/>
    </div>
</li>`;
            //要看看这请求是否已经存在请求列表中，如果存在什么都不操作
            var flag = false;
            var liList = $(".center_friend_list_body_ul li");
            liList.each(function (){
                var tempAccount = $(this)
                    .children(".li_right")
                    .children(".li_right_add_photo").data("account");
                if( tempAccount == selectAccount ){
                    flag = true;
                }
            })
            if( !flag ){
                $(".center_friend_list_body_ul").append(tempLi);
                //进行聊天外表的好友申请处理
                var number = $(".right_head_number").text();
                $(".right_head_number").text(parseInt(number) + 1);
                $(".right_head_number").css("background-color","red");
                $(".right_head_number").css("color","white");
            }
        }else if( data.status == 302 ){
            //获取好友信息，进行拼接，放入到在线好友列表，通知其他用户在线
            var friendAccount = data.resultBody.fromName;
            //通过ajax获取一下这个用户的信息
            var user = '';
            $.ajax({
                url:"getUserData",
                type:"get",
                data:{
                    "userAccount" : friendAccount
                },
                success:function (res){
                    user = JSON.parse(res);
                },
                async:false
            })
            var userLi = `<li id="${user.userAccount}" class="ul_list">
    <div class="list_photo">
        <img src="../img/${user.photo}" />
    </div>
    <div class="list_center">
        <div class="list_center_top">
            <div class="list_center_top_left">${user.name}</div>
            <div class="list_center_top_right">${time}</div>
            <div class="list_center_top_center">[在线]</div>
        </div>
        <div class="list_center_bottom">
            <div class="list_center_bottom_left">${user.summary}</div>
            <div class="list_center_bottom_right" style="background-color: transparent">0</div>
        </div>
    </div>
</li>`;
            $("#user_online_list_ul").append(userLi);
            var oldBody = sessionStorage.getItem("onlineList");
            if (oldBody != null) {
                oldBody += userLi;
            } else {
                oldBody = userLi;
            }
            sessionStorage.setItem("onlineList", oldBody);
            //发送用户上线信息
            //准备把用户账号发送过去，以JSON对象的格式发送
            // var data = {
            //     "status": 220,
            //     "resultBody": {"messageStatus":401,"fromName": userAccount, "toName": friendAccount, "message": null}
            // };
            $.ajax({
                url:"addOnlineFrined",
                type:"get",
                data:{
                    userAccount:userAccount,
                    friendAccount:friendAccount,
                },
                success(res){
                    console.log("添加成功");
                }
            })
        }else if( data.status == 502 ){
            //删除当前好友列表中的好友
            var friendAccount = data.resultBody.fromName;
            var friendId = '#'+friendAccount;
            $(friendId).remove();
            //如果当前正在和这个好友聊天。则将聊天框隐藏
            var chatObjectAccount = $(".body_center_chat_result_top_right").attr("data-account");
            if( chatObjectAccount == friendAccount ){
                //说明是删除好友正在聊天
                $(".body_center_chat").css("display","none");
            }
            //发送其他用户下线消息
            // var sendMessage = {
            //     "status": 402,
            //     "resultBody": {"fromName": userAccount, "toName": friendAccount, "message": null}
            // };
            // ws.send(JSON.stringify(sendMessage));
            $.ajax({
                url:"deleteOnlineFriend",
                type:"get",
                data:{
                    userAccount:userAccount,
                    friendAccount:friendAccount
                },
                success(res){

                }
            })
        }else if( data.status == 120  ){
            if( ws.readyState == WebSocket.OPEN ){
                let sendPing = {
                    "status": 220,
                    "resultBody": {messageStatus:120,"fromName": userAccount, "toName": null, "message": null}
                };
                ws.send(JSON.stringify(sendPing));
                console.log("发送心跳包"+sendPing);
            }
        }
    }

    ws.onclose = function() {
        $("#user_state").html("离&nbsp;&nbsp;线");
        $("#user_state").css("color","red");
            let toNameList = '';
            $.ajax({
                url:"getFriendList",
                type:"get",
                data:{
                    userAccount: userAccount
                },
                success(res){
                    toNameList = JSON.parse(res);
                },
                async:false
            })
            // //准备把用户账号以及好友列表发送过去，以JSON对象的格式发送
            // var json = {"status":210,"resultBody":{"messageStatus":402,"fromName":userAccount,"toName":toNameList,"message":null}};
            // console.log(json);
            // ws.send(JSON.stringify(json));
            //通过ajax删除当前用户的好友列表以及在线信息
            $.ajax({
                url:"deleteUserFrinedList",
                type:"get",
                data:{
                    userAccount: userAccount
                },
                success(){

                }
            })
            // ws.close();
    }


    $(".left_head_down").click(function (){
        //判断网络情况
        if(ws.readyState == WebSocket.OPEN){
            let toNameList = '';
            $.ajax({
                url:"getFriendList",
                type:"get",
                data:{
                    userAccount: userAccount
                },
                success(res){
                    toNameList = JSON.parse(res);
                },
                async:false
            })
            //准备把用户账号以及好友列表发送过去，以JSON对象的格式发送
            var json = {"status":210,"resultBody":{"messageStatus":402,"fromName":userAccount,"toName":toNameList,"message":null}};
            console.log(json);
            ws.send(JSON.stringify(json));
            //通过ajax删除当前用户的好友列表以及在线信息
            $.ajax({
                url:"deleteUserFrinedList",
                type:"get",
                data:{
                    userAccount: userAccount
                },
                success(){

                }
            })
            ws.close();
        }else {
            alert("服务器连接失败，已自动下线")
        }
    });



    $(".chat_button").click(function (){
        //获取输入框内容
        var body = $("#inputBody").val();
        $("#inputBody").val("");
        var userSrc = $(".left_centent_user_left_photo").attr("src");
        //首先拼接出自己发送的内容到聊天框中
        var newMessage = `<li>
	<div class="chat_list_photo" style="float: right">
		<img src="${userSrc}" style="width: 100%; height: 100%; border-radius: 50px;">
	</div>
	<div>
		<div class="chat_list_text" style="float: right;background-color: #def3fd; ">${body}</div>
	</div>
</li>`
        $(".chat_list").append(newMessage);
        // $(".body_center_chat_result_body").scrollIntoView(false);

        var cachaData = sessionStorage.getItem(toName);
        var value = cachaData + newMessage;
        sessionStorage.setItem(toName,value);
        let chat_body = document.getElementById('chat_body');
        let height = chat_body.scrollHeight;
        chat_body.scrollTo(0,height);
        //更新一下和其的聊天列表中最后的信息
        var id = '#'+toName;
        $(id).children(".list_center")
            .children(".list_center_bottom")
            .children(".list_center_bottom_left").text(body);
        var now = new Date();
        var H = getRealTime(now.getHours());
        var i = getRealTime(now.getMinutes());
        var time = H+":"+i;
        $(id).children(".list_center")
            .children(".list_center_top")
            .children(".list_center_top_right").text(time);
        //发送给信息服务器，转发给指定的好友
        var sendMessage = {"status":220,"resultBody":{"messageStatus":200,"fromName":userAccount,"toName":toName,"message":body}};
        ws.send(JSON.stringify(sendMessage));
        $.ajax({
            url:"addChatRecord",
            type:"get",
            data:{
                userAccount:userAccount,
                friendAccount:toName,
                message:body
            },
            success(res){
                console.log("发送成功");
            }
        })
    })

    $(".list_ul").on("click",".ul_list",function (){
        var id = $(this).attr("id");
        toName = id;
        var name = $(this).children(".list_center")
            .children(".list_center_top")
            .children(".list_center_top_left").text();
        $(".body_center_chat_result_top_left").text(name);
        //设置一下自定义参数
        $(".body_center_chat_result_top_right").attr("data-account",id);
        var friendSrc = $(this).children(".list_photo").children("img").attr("src");
        var userSrc = $(".left_centent_user_left_photo").attr("src");
        $(".body_center_chat").css("display","block");
        //首先清空一下聊天区域
        $(".chat_list").html("");
        //然后查看缓存，缓存没有，那么就ajax去请求一下最近的聊天记录,反之有缓存，则直接从缓存中获取即可
        var cachaData = sessionStorage.getItem(id);
        if( cachaData == null ){
            $.ajax({
                url:"getChatRecord",
                type:"get",
                data:{
                    "userAccount":id
                },
                success:function (res){
                    var result = JSON.parse(res);
                    console.log(result);
                    //处理一下JSON格式对象，即把其生成成html的聊天内容
                    cachaData = "";
                    for(var record of result){
                        if( record.userAccount == userAccount ){
                            cachaData += `<li>
	<div class="chat_list_photo" style="float: right">
		<img src="${userSrc}" style="width: 100%; height: 100%; border-radius: 50px;">
	</div>
	<div>
		<div class="chat_list_text" style="float: right;background-color: #def3fd; ">${record.text}</div>
	</div>
</li>`
                        }else{
                            cachaData += `<li>
	<div class="chat_list_photo">
		<img src="${friendSrc}" style="width: 100%; height: 100%; border-radius: 50px;">
	</div>
	<div>
		<div class="chat_list_text" >${record.text}</div>
	</div>
</li>`
                        }
                    }
                },
                async:false
            })
        }
        //直接将缓存聊天记录进行渲染
        $(".chat_list").append(cachaData);
        sessionStorage.setItem(id,cachaData);
        $(this).children(".list_center")
            .children(".list_center_bottom")
            .children(".list_center_bottom_right").text("0");
        //改变样式
        $(this).children(".list_center")
            .children(".list_center_bottom")
            .children(".list_center_bottom_right").css("background-color","transparent");
        // $(".body_center_chat_result_body").scrollIntoView(false);
        let chat_body = document.getElementById('chat_body');
        let height = chat_body.scrollHeight;
        chat_body.scrollTo(0,height);
    })
    function getRealTime(str){
        if(str < 10){
            return '0'+str;
        }
        return str;
    }


    $(document).keydown(function(event) {
        if (event.keyCode == 13) {
            $('.chat_button').click();
        }
    });
})