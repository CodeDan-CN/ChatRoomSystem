$(document).ready(function(){
	$("#user_online_list").click(function(){
		var display = $("#user_online_list_ul").css("display");
		if( display == "block" ){
			$("#user_online_list_ul").css("display","none");
			$("#user_online_list").html("在线好友列表"+'&nbsp;&nbsp;'+"[关闭]")
		}else{
			$("#user_online_list_ul").css("display","block");
			$("#user_online_list").html("在线好友列表"+'&nbsp;&nbsp;'+"[展开]")
		}
	})
	$("#user_offline_list").click(function(){
		var display = $("#user_offline_list_ul").css("display");
		if( display == "block" ){
			$("#user_offline_list_ul").css("display","none");
			$("#user_offline_list").html("离线好友列表"+"&nbsp;&nbsp;"+"[关闭]")
		}else{
			$("#user_offline_list_ul").css("display","block");
			$("#user_offline_list").html("离线好友列表"+"&nbsp;&nbsp;"+"[展开]")
		}
	})
	$("#user_group_list").click(function (){
		let display = $("#user_group_list_ul").css("display");
		if( display == "block" ){
			$("#user_group_list_ul").css("display","none");
			$("#user_group_list").html("群聊列表"+"&nbsp;&nbsp;"+"[关闭]")
		}else{
			$("#user_group_list_ul").css("display","block");
			$("#user_group_list").html("群聊列表"+"&nbsp;&nbsp;"+"[展开]")
		}
	})
	$(".center_friend_list_head_close").click(function(){
		$(".center_friend_list").css("display","none");
	})
	$(".right_head_friend").click(function(){
		$(".center_friend_list").css("display","block");
	})
	$(".center_user_list_head_close").click(function(){
		$(".center_user_list").css("display","none");
	})

	//搜索用户的点击事件
	$(".right_head_button").click(function(){
		//清空
		$(".center_user_list_body_ul").html("");
		var liList = "";
		var inputText = $(".rigth_head_input").val();
		$.ajax({
			url:"getUser",
			type:"get",
			data:{
				"inputText" : inputText
			},
			success:function (res){
				var data = JSON.parse(res);
				console.log(data);
				for(var tempData of data){
					console.log(tempData)
					liList += `<li>
	<div class="li_left">
		<img src="../img/${tempData.photo}"  style="width: 100%; height: 100%;"/>
	</div>
	<div class="li_center">
		<span class="li_center_top">${tempData.name}(${tempData.userAccount})</span>
		<span class="li_center_bottom">${tempData.summary}</span>
	</div>
	<div class="li_right">
		<img src="../img/add.png" class="li_right_add_photo" data-account="${tempData.userAccount}" />
	</div>
</li>`
					console.log(liList);
				}
			},
			async:false
		})
		$(".center_user_list_body_ul").html(liList);
		$(".center_user_list").css("display","block");
	})

	//添加好友申请发送的点击事件
	$(".center_user_list_body_ul").on("click",".li_right_add_photo",function (){
		var sendFriend = $(this).attr("data-account");
		var sendFriendId = '#'+sendFriend;
		if( sendFriend == userAccount ){
			alert("请不要添加自己为好友哦~");
		}else if( $(sendFriendId).attr("id") == sendFriend ){
			alert("对方已经是您的好友啦~")
		}else{
			//向信息服务器发送好友添加申请301
			var sendMessage = {"status":220,"resultBody":{"messageStatus":301,"fromName":userAccount,"toName":sendFriend,"message":null}};
			if(ws.readyState == WebSocket.OPEN){
				ws.send(JSON.stringify(sendMessage));
				//发送完成之后，进行一些处理，提醒好友申请已发送
				$.ajax({
					url:"addFriendRequest",
					type:"get",
					data:{
						userAccount:userAccount,
						friendAccount:sendFriend
					},
					success(res){
						console.log("好友申请添加成功");
					}
				})
				alert("好友申请成功发送");
				$(this).css("display","none");
			}else{
				alert("好友申请发送失败");
			}
		}
	})

	$(".center_friend_list_body_ul").on("click",".li_right_add_photo",function (){
		//向信息服务器发送好友添加请求
		var sendAccount = $(this).attr("data-account");
		var sendId = '#'+sendAccount;
		if( !($(sendId).attr("id") == sendAccount )) {
			if (ws.readyState == WebSocket.OPEN) {
				//封装信息并发送
				var json = {"status":220,"resultBody":{"messageStatus":302,"fromName":userAccount,"toName":sendAccount,"message":null}};
				console.log("查看"+JSON.stringify(json));
				ws.send(JSON.stringify(json));
				//ajax进行好友表的添加以及申请表的删除操作
				$.ajax({
					url:"addFriendList",
					type:"get",
					data:{
						userAccount:userAccount,
						friendAccount:sendAccount
					},
					success(res){
						console.log("好友添加成功");
					}
				})

				//进行前端操作，首先判断添加好友是否为在线状态，在线则添加到在线列表中，反之添加在离线列表中
				var flag = false;
				$.ajax({
					url: "getStatus",
					type: "get",
					data: {
						"userAccount": sendAccount
					},
					success: function (res) {
						if (res == "true") {
							flag = true;
						}
					},
					async: false
				})
				//获取这个用户的信息
				var user = "";
				$.ajax({
					url: "getUserData",
					type: "get",
					data: {
						"userAccount": sendAccount
					},
					success: function (res) {
						user = JSON.parse(res);
					},
					async: false
				})
				//拼接出这个用户的列表li
				var userLi = "";
				var now = new Date();
				var H = getRealTime(now.getHours());
				var i = getRealTime(now.getMinutes());
				var time = H + ":" + i;
				if (flag) {
					//加入到在线列表
					userLi = `<li id="${user.userAccount}" class="ul_list">
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
					// 	"status": 220,
					// 	"resultBody": {"messageStatus":401,"fromName": userAccount, "toName": sendAccount, "message": null}
					// };
					// ws.send(JSON.stringify(data));
					$.ajax({
						url:"addOnlineFrined",
						type:"get",
						data:{
							userAccount:userAccount,
							friendAccount:sendAccount,
						},
						success(res){
							console.log("添加成功");
						}
					})
				} else {
					//加入到离线列表
					userLi = `<li id="${user.userAccount}" class="ul_list">
    <div class="list_photo">
        <img src="../img/${user.photo}" />
    </div>
    <div class="list_center">
        <div class="list_center_top">
            <div class="list_center_top_left">${user.name}</div>
            <div class="list_center_top_right">${time}</div>
            <div class="list_center_top_center" style="color: red;">[离线]</div>
        </div>
        <div class="list_center_bottom">
            <div class="list_center_bottom_left">${user.summary}</div>
            <div class="list_center_bottom_right" style="background-color: transparent">0</div>
        </div>
    </div>
</li>`;
					$("#user_offline_list_ul").append(userLi);
					var oldBody = sessionStorage.getItem("offlineList");
					if (oldBody != null) {
						oldBody += userLi;
					} else {
						oldBody = userLi;
					}
					sessionStorage.setItem("offlineList", oldBody);
				}
				//删除一下申请中的好友申请
				var deleteId = '#friend' + sendAccount;
				//调一下删除模式
				$(deleteId).remove();
				var number = $(".right_head_number").text();
				if( number > 1){
					$(".right_head_number").text(parseInt(number) - 1);
				}else{
					$(".right_head_number").text(0);
					$(".right_head_number").css("background-color","transparent");
					$(".right_head_number").css("color","transparent");
				}
				alert("好友添加成功，请查看您的好友列表");
			} else {
				alert("添加失败，请检查一下网络状态~")
			}
		}else{
			alert("对方已经是您的好友了");
		}
	})

	//删除好友添加
	$(".center_friend_list_body_ul").on("click",".li_right_delete_photo",function (){
		//获取好友申请列表的account
		var deleteAccount = $(this).attr("data-account");
		//进行删除，并且减少未读数量显示，数量如果小于等于0，则不动即可。
		var deleteId = '#friend'+deleteAccount;
		$(deleteId).remove();
		var number = $(".right_head_number").text();
		if( number > 1){
			$(".right_head_number").text(parseInt(number) - 1);
		}else{
			$(".right_head_number").text(0);
			$(".right_head_number").css("background-color","transparent");
			$(".right_head_number").css("color","transparent");
		}
		if(ws.readyState == WebSocket.OPEN){
			// var sendMessage = {
			// 	"status": 501,
			// 	"resultBody": {"fromName": userAccount, "toName": deleteAccount, "message": null}
			// };
			// ws.send(JSON.stringify(sendMessage));
			$.ajax({
				url:"deleteFriendRequest",
				type:"get",
				data:{
					userAccount:userAccount,
					friendAccount:deleteAccount
				},
				success(res){
					console.log("申请删除成功");
				}
			})
		}
	})
	//关闭个人消息
	$(".center_information_list").on("click",".center_information_list_head_close",function (){
		$(".center_information_list").css("display","none");
	})

	//显示个人消息
    $(".body_center_chat_result_top").on("click",".body_center_chat_result_top_right",function (){
        //进行页面显示以及内容ajax获取后拼接，并前端缓存
        var selectAccount =$(".body_center_chat_result_top_right").attr("data-account");
        //判读获取是否存在
		var informationId = 'information'+selectAccount;
		var informationData = sessionStorage.getItem(informationId);
		if( informationData != null ){
			$(".center_information_list").html("");
			$(".center_information_list").append(informationData);
		}else{
			var user = '';
			$.ajax({
				url: "getUserData",
				type: "get",
				data: {
					"userAccount": selectAccount
				},
				success: function (res) {
					user = JSON.parse(res);
				},
				async: false
			})
			//拼接出页面显示的信息页
			var sex = '';
			if(user.sex == "1"){
				sex = "男";
			}else{
				sex = "女";
			}
			var userInformation = `<div class="center_information_list_head">
	<span class="center_information_list_head_close"></span>
	<img src="./img/${user.photo}" class="center_information_list_head_photo" />
	<span class="center_information_list_head_name">${user.name}</span>
	<span class="center_information_list_head_summary">${user.summary}</span>
</div>
<div class="center_information_list_body">
	<div class="center_body_text_list">
		<span>账号&ensp;&ensp;${user.userAccount}</span>
		<span>昵称&ensp;&ensp;${user.name}</span>
		<span>性别&ensp;&ensp;${sex}</span>
	</div>
	<div class="center_information_delete_botton" data-account="${user.userAccount}">删&ensp;&ensp;除&ensp;&ensp;好&ensp;&ensp;友</div>
</div>`;
			//append到页面中
			$(".center_information_list").html("");
			$(".center_information_list").append(userInformation);
			//存入缓存
			sessionStorage.setItem(informationId,userInformation);
		}
		$(".center_information_list").css("display","block");
    })

	//删除好友
	$(".center_information_list").on("click",".center_information_delete_botton",function (){
		var sendAccount = $(this).attr("data-account");
		var deleteId = '#'+sendAccount;
		if( ws.readyState == WebSocket.OPEN ){
			var sendMessage = {
				"status": 220,
				"resultBody": {"messageStatus":502,"fromName": userAccount, "toName": sendAccount, "message": null}
			};
			ws.send(JSON.stringify(sendMessage));
			//用户删除ajax
			$.ajax({
				url:"deleteFriend",
				type:"get",
				data:{
					userAccount:userAccount,
					friendAccount:sendAccount
				},
				success(res){
					console.log("删除成功");
				}
			})
			//发送其他用户下线消息
			$.ajax({
				url:"deleteOnlineFriend",
				type:"get",
				data:{
					userAccount:userAccount,
					friendAccount:sendAccount
				},
				success(res){

				}
			})
			// sendMessage = {
			// 	"status": 402,
			// 	"resultBody": {"fromName": userAccount, "toName": sendAccount, "message": null}
			// };
			// ws.send(JSON.stringify(sendMessage));
			//删除一下样式
			$(deleteId).remove();
			$(".center_information_list").css("display","none");
			//判断一种情况，就是如果删除时，当前聊天页面是和删除对象一致的，那么一样none。反之不管
			var chatObjectAccount = $(".body_center_chat_result_top_right").attr("data-account");
			if( chatObjectAccount == sendAccount ){
				//说明是删除好友正在聊天
				$(".body_center_chat").css("display","none");
			}
			alert("删除成功");
		}else{
			alert("删除失败，请查看网络状态～");
		}
	})

	function getRealTime(str){
		if(str < 10){
			return '0'+str;
		}
		return str;
	}

})