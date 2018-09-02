function init(){
	var pageId = "#constants ";
	
	var constants = getSessionStorage("constants");
	if(!constants){
		getConstants();
	}else{
		initialize(constants);
	}
	function initialize(constantsArray){
		for (var i = 0 ; i < constantsArray.length; i++) {
			var one = constantsArray[i];
			$(pageId + " #"+one["enname"]).val(one["days"]);
			if(one["switch"]!='' && one["switch"]!=null){
				var che = $(pageId + " #"+one["enname"]).parents("tr").find(":checkbox");
				if(one["switch"] == '1'){
					che.attr("checked","checked");
				}else{
					che.removeAttr("checked");
				}
			}
		}
	}
	function getConstants(){
		var data = {
			funcNo:'1005'
		}
		request(data,function(r){
			if(r.error_no == '0'){
				var rdata = r.data;
				constants = rdata;
				initialize(constants);
				setSessionStorage("constants",constants);
			}
		},function(){console.log("请求失败")});
	}
	
	//-----------------------事件
	$(pageId +" input").blur(function(e){
		var name = $(this).attr("name") ;
		var data ={
			funcNo:'1010'
		}
		//request
		if(name){
			var switchh = $(this).prop("checked");
			switchh = switchh ? "1":"0"
			data["enname"] = name;
			data["switchh"] = switchh;
		}else{
			name = $(this).attr("id");
			var days = $(this).val();
			if(days == '')return;
			days = replace(days);
			data["enname"] = name;
			data["days"] = days;
		}
		request(data,function(r){
			if(r.error_no=="0"){}else{
				$.messager.alert("error",r.error_info);
			}
			getConstants();
		},function(){$.messager.alert("error","网络错误")})
		console.log(data);
	})
	function replace(text){
		if(text.match(/[^0-9]/ig)!=null){
			text=text.replace(/[^0-9]/ig,"");
			var afterText = replace(text);
			return afterText;
		}else{
			return text;
		}
	}
}

/*
 * 	1.	发情中
	2.	受精
	3.	妊检未知
	4.	妊检未孕
	5.	妊检怀孕
	6.	产仔
	7.	断奶
 */
function destroy(){
}
$(document).ready(function(){
	rigthPageOb.init = init;
	rigthPageOb.destroy = destroy;
});
