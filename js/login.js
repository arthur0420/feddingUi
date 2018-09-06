$(function($) {
	
	$("#save").click(function(){
		var username = $("#username").val();
		var psw = $("#password").val();
		if(username == ""){
			$("#username").focus();
			$.messager.alert("提示","请填写用户名");
			return ;
		}
		if(psw == ""){
			$("#psw").focus();
			$.messager.alert("提示","请填写密码");
			return ;
		}
		var data = {
			username:username,
			password:psw,
			funcNo:"1017"
		};
		request(data,function(r){
			if(r.error_no == '0'){
				var rdata =  r.data[0];
				setSessionStorage("userData",rdata);
				window.location.href = 'index.html';
				console.log(rdata);
			}else{
				$.messager.alert("error",r.error_info);
			}
			
		},function(){
			$.messager.alert("error","网络错误");
		})
	})
	
	$("#password").keydown(function(e){
		if(e.keyCode == 13){
			$("#save").click();
		}
	})
});