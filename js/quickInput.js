function init(){
	var pageId = "#quickInput ";
	var data = {
		funcNo:'1002',
		dataType:"4dictionary"
	}
	var plData = new Array();
	request(data,function(r){ // 初始化两个下拉框
		if(r.error_no == "0"){
			var rdata = r.data;
			for(var i = 0 ; i <rdata.length; i++){
				var one =  rdata[i];
				
				var isContain = contain(plData,one["pl_no"]);
				if(isContain!=null){
					var oneAp =	{
							id:one["id"],
							apName:one["ap_name"]
						}
					isContain.array.push(oneAp);
				}else{
					var o = {
						plNo:one["pl_no"],
						plName:one["pl_name"],
						array:[{
							id:one["id"],
							apName:one["ap_name"]
						}]
					}
					plData.push(o);
				}
			}
			addLineObject();
			addLineAction();
		}else{
			console.log("请求结果失败")
		}
	},function(){console.log("网络错误，请求失败")});
	
	function addLineObject(){
		var html =  $(pageId + " #templateObject").html();
		$(pageId + " #selectObject").append(html);
		
		var divs =  $(pageId+"#selectObject div");
		var lastOne =divs[divs.length-1];
		var lastpl =$(lastOne).find("input")[0];
		var lastap =$(lastOne).find("input")[1];
		var lastadd = $(lastOne).find("a")[0];
		var lastremove = $(lastOne).find("a")[1];
		
		$(lastpl).combobox({
	        data:plData,
	        valueField:'plNo',
	        textField:'plName',
	        editable:false,
	        onSelect:function(e){
	        	console.log(e.array);
	        	$(lastap).removeAttr("disabled");
		        $(lastap).combobox({
			        data:e.array,
			        valueField:'id',
			        textField:'apName',
			        editable:false
				})
	        }
		})
		
		$(lastadd).linkbutton({
		  	iconCls: 'icon-add'
		}).bind("click",function(){
			addLineObject();
		})
		$(lastremove).linkbutton({
		  	iconCls: 'icon-remove'
		}).bind("click",function(){
			$(this).parent("div").remove();
		})
	}
	var actionDic = [{actionNo:1,actionName:'添加事件'},
	{actionNo:2,actionName:'出栏'}
	];
	var eventDic = [
	{event_no:1,event_name:"发情中"},
	{event_no:2,event_name:"受精"},
	{event_no:3,event_name:"妊检未知"},
	{event_no:4,event_name:"妊检未孕"},
	{event_no:5,event_name:"妊检怀孕"},
	{event_no:6,event_name:"产仔"},
	{event_no:7,event_name:"断奶"}
	];/*{
			1:"发情中",
			2:"受精",
			3:"妊检未知",
			4:"妊检未孕",
			5:"妊检怀孕",
			6:'产仔',
			7:"断奶"
		};*/
	function addLineAction(){
		var html =  $(pageId + " #templateAction").html();
		$(pageId + " #selectAction").append(html);
		
		var divs =  $(pageId+"#selectAction div");
		var lastOne =divs[divs.length-1];
		var lastAction =$(lastOne).find("input")[0];
		var lastInput = $(lastOne).find("input")[1];
		var lastadd = $(lastOne).find("a")[0];
		var lastremove = $(lastOne).find("a")[1];
		
		$(lastAction).combobox({
	        data:actionDic,
	        valueField:'actionNo',
	        textField:'actionName',
	        editable:false,
	        onSelect:function(e){
	        	console.log(e);
	        	var value = e.actionNo;
	        	 if(value == 1){
	        	 	$(lastInput).removeAttr("disabled");
	        		$(lastInput).combobox({
			        data:eventDic,
			        valueField:'event_no',
			        textField:'event_name',
			        editable:false
					})
	        	 }else if(value ==2){
	        	 	$(lastInput).combobox({
				        data:[],
				        valueField:'event_no',
				        textField:'event_name',
				        editable:false
					})
	        	 }
	        	
	        }
		})
		$(lastadd).linkbutton({
		  	iconCls: 'icon-add'
		}).bind("click",function(){
			addLineAction();
		})
		$(lastremove).linkbutton({
		  	iconCls: 'icon-remove'
		}).bind("click",function(){
			$(this).parent("div").remove();
		})
	}
	$( pageId+ " #submit").click(function(){
		var objects =  $(pageId+"#selectObject").find("div");
		var actions = $(pageId+"#selectAction").find("div");
		var oArray = []; // 选择的对象的数组
		for (var i = 0 ; i<objects.length ;i++) {// 每一行的选择的对象
			var one = $(objects[i]);
			var plno = one.find(".value").eq(0).combobox("getValue");
			if(plno == "")continue;
			var apid = one.find(".value").eq(1);
			apid = apid.combobox("getValue");
			if(apid == '')continue;
			var no_in_apartment =  one.find(".value").eq(2).val();
			if(no_in_apartment == '')continue;
			var oneValue = {apid:apid,no_in_apartment:no_in_apartment};
			oArray.push(oneValue);
		}
		if(oArray.length == 0){
			$.messager.alert("error","请选择执行对象");
			return;			
		}
		var aArray = [];
		for (var i = 0 ; i < actions.length ; i++) {
			var one = $(actions[i]);
			var actionid =  one.find(".value").eq(0).combobox("getValue");
			if(actionid == "")continue;
			var actionValue = one.find(".value").eq(1).combobox("getValue");
			if(actionValue  == '' && actionid == 1)continue;
			var oneValue = {actionid:actionid,actionValue:actionValue};
			aArray.push(oneValue);
		}
		if(aArray.length == 0){
			$.messager.alert("error","请选择执行操作");
			return;			
		}
		var t1 =JSON.stringify(oArray) ;
		var t2 =JSON.stringify(aArray) ;;
		var requestData = {
			funcNo:"1009",
			objects:t1,
			actions:t2
		}
		request(requestData,function(r){
			if(r.error_no == '0'){
				$.messager.alert("success","执行成功");
				reloadContent();
			}else{
				$.messager.alert("error",r.error_info);
			}
		},function(){
			$.messager.alert("error","网络错误");
		});
	});
}
function contain(a , plNo){
	for(var i = 0 ; i< a.length ; i++){
		var one = a[i];
		if(one["plNo"] == plNo){
			return one;
		}
	}
	return null;
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
