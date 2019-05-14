$(function($) {
	
	$("#save").click(function(){
		var devices = $("#devices").val();
		var time = $("#time").val();
		if(devices == ""){
			$("#devices").focus();
			$.messager.alert("提示","请填写设备号");
			return ;
		}
		if(time == ""){
			$("#time").focus();
			$.messager.alert("提示","请填写时间");
			return ;
		}
		var data = {
			devices:devices,
			time:time,
			funcNo:"2002"
		};
		request(data,function(r){
			if(r.error_no == '0'){
				$.messager.alert("error",r.error_info);
			}else{
				$.messager.alert("error",r.error_info);
			}
		},function(){
			$.messager.alert("error","网络错误");
		})
	})
	
	$("#time").keydown(function(e){
		if(e.keyCode == 13){
			$("#save").click();
		}
	})
});