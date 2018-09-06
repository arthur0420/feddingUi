function init(){
	var pageId = "#modifyPsw ";
	var username = "";
	var userData = getSessionStorage("userData");
	username = userData["username"];
	console.log(username);
	$("#mps").click(function(){
		var oldPsw = $(pageId+"#oldPsw").val();
		var newPsw = $(pageId+"#newPsw").val();
		var confirmPsw =$(pageId+"#confirmPsw").val();
		if(oldPsw == '' || newPsw ==''|| confirmPsw == ''){
			return;
		}
		if(newPsw == confirmPsw){
			var data = {
				funcNo:'1022',
				username:username,
				psw:newPsw,
				oldpsw:oldPsw
			}
			request(data,function(r){
				if(r.error_no == '0'){
					$.messager.alert("success","修改成功");
					reloadContent();
				}else{
					$.messager.alert("error",r.error_info);
				}
			},function(){
				$.messager.alert("error","网络错误")
			})
			
		}else{
			$.messager.alert("error","两次输入不一致，请重新输出");
		}
	})
}
$(document).ready(function(){
	rigthPageOb.init = init;
});
