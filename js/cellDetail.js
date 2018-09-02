function init(){
	
	var pageId = "#cellDetail ";
	var pageData =  getSessionStorage("toCellDetailPage");
	var id = pageData['id'];
//	console.log(pageData);
	var constants = getSessionStorage("constants");
	if(!constants){
		var data = {
			funcNo:'1005'
		}
		request(data,function(r){
			if(r.error_no == '0'){
				var rdata = r.data;
				constants = rdata;
				setSessionStorage("constants",constants);
			}
		},function(){console.log("请求失败")});
	}
	getEvent(id);
	function getEvent(pid){
		var data = {
			funcNo:'1006',
			id:pid
		};
		request(data,function(r){
//			console.log(r);
			if(r.error_no == '0'){
				var rdata =  r.data;
				if(rdata.length>0){
					nextEvent(rdata[0]);
				}
				$(pageId+' #table').datagrid({
				title:"事件列表",
				data:rdata,
				singleSelect:true,
				columns:[[
					{field:'id',hidden:'true'},
					{field:'event_no',title:'事件',width:100,formatter:function(value,row,index){
						var value = dic(value);
						return value;
					}},
					{field:'date',title:'日期',width:200},
					{field:'executor',title:'执行者',width:200},
					{field:"boar",title:"公猪",width:100},
					{field:"result",title:"结果",width:300}
			    ]]
			});
				
			}else{
				$.messager.alert("error",r.error_info);
			}
		},function(){
			$.messager.alert("error","请求失败请重试");
		})
	}
	function dic(key){
		var map = {
			1:"发情中",
			2:"受精",
			3:"妊检未知",
			4:"妊检未孕",
			5:"妊检怀孕",
			6:'产仔',
			7:"断奶"
		};
		return map[key];
	}
	function nextEvent(lastEvent){
		var key = lastEvent.event_no;
		var lastDate = lastEvent.date;
		var eventName = "-";
		var predictDays = 0;
		if(key == '1'){
			var cycle =  getConstant("cycle");// 发情周期
			var days = cycle.days;
			var gapDay = betweenDate(lastDate);
			days =  days - gapDay;
			if(days <0) days =0;
			days = days.toFixed(0) ;
			eventName = "下一次发情";
			predictDays = days;
		}else
		if(key == '2'){
			var gestation =  getConstant("gestation");// 妊娠时间。
			var days = gestation.days;
			var gapDay = betweenDate(lastDate);
			days =  days - gapDay;
			if(days <0) days =0;
			days = days.toFixed(0) ;
			eventName = "预计产仔";
			predictDays = days;
		}else
		if(key == '6'){
			var weaning =  getConstant("weaning");// 妊娠时间。
			var days = weaning.days;
			var gapDay = betweenDate(lastDate);
			days =  days - gapDay;
			if(days <0) days =0;
			days = days.toFixed(0) ;
			eventName = "预计断奶";
			predictDays = days;
		}
		
		$(pageId + " #eventName").html(eventName);
		$(pageId + " #predictDays").html(predictDays);
	}
	function getConstant(key){ // 常量值
		for(var i = 0 ; i< constants.length; i++){
			var one = constants[i];
			if(one.enname == key){
				return one;
			}
		}
		return null;
	}
	function betweenDate(d){ //事件日期和当前日期的差。
		var theD = new Date(d);
		var theM = theD.getTime();
		var nowM = new Date().getTime();
		var gapDay =  (nowM - theM)/(24 * 60 *60 *1000);
		return gapDay;
	}
	
	var aawWindowFlag = true;
	$(pageId + "#addAnimal").click(function(e){
		$("#aaw input").val("");
		$("#aaw").window('open');
		if(aawWindowFlag){
			initAaw();
			aawWindowFlag = false;
		}
	})
	$("#aaw #cancel").click(function(e){
		$("#aaw").window('close');
	})
	
}
function initAaw(){
	var eventDic = [{
		event_no:1,
		event_name:"发情中"
	}]
	$("#aaw #event_no").combobox({
	        data:eventDic,
	        valueField:'event_no',
	        textField:'event_name',
	        editable:false
	})
	$("#aaw #save").click(function(e){
		var event_no =  $("#aaw #event_no").combobox("getValue");
		var boar = $("#aaw #boar ").val();
		var eventDate = $("#aaw #eventDate ").datebox("getValue");
		var executor = $("#aaw #executor ").val();
		var result = $("#aaw #result ").val();
		var pageData =  getSessionStorage("toCellDetailPage");
		var id = pageData['id'];
//		console.log(event_no+":"+boar+":"+eventDate+":"+result+":"+executor+":::"+id);
		
		if(event_no == ""){
			$.messager.alert("error","请选择事件");
		}
		if(eventDate == ""){
			$.messager.alert("error","请选择日期");
		}
		
		var data = {
			funcNo:'1007',
			id:id,
			event_no:event_no,
			boar:boar,
			eventDate:eventDate,
			result:result,
			executor:executor
		};
		
		request(data,function(e){
			$.messager.alert("success","添加事件成功");
			reloadContent();
		},function(){
			$.messager.alert("error","添加事件失败");
		})
	})
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
	$("#aaw").window("close");
	$("#aaw").remove();
}
$(document).ready(function(){
	rigthPageOb.init = init;
	rigthPageOb.destroy = destroy;
});
