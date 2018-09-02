function init(){
	var pageId = "#pasture ";
	var data = {
		funcNo:'1002',
		dataType:"detail"
	}
	request(data,function(r){
		if(r.error_no == '0'){
			var rdata = r.data;
			var animalGross = 0;
			for(var i = 0 ; i< rdata.length ; i++){
				var one  = rdata[i];
				one["delivery_fed"] = one.deliveryGross+"/"+one.animalGross;
				one["rate"] = one.fedGross+"/"+one.weightGross;
				animalGross+= one.animalGross;
			}
			$("#animalGross").html(animalGross);
			$(pageId+' #table').datagrid({
				title:"牧场概况",
				data:rdata,
				singleSelect:true,
				onDblClickRow:function(rowIndex,rowData){
					setSessionStorage("toCellsPage",rowData);
			    	contentChange("cells","动物列表");
			    	
			   },
				columns:[[
					{field:'id',hidden:'true'},
					{field:'pl_name',title:'产线',width:100},
					{field:'ap_name',title:'房间',width:100},
					{field:'delivery_fed',title:'已产仔/总量',width:200},
					{field:"addGross",title:"已增加",width:200},
					{field:"minus",title:"已减少",width:200},
					{field:"unableFeed",title:"无法饲喂",width:200},
					{field:"rate",title:"当前进度",width:200}
			    ]]
			});
		}
	},function(){console.log("请求失败")});
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
/*
 * 初始化 增加动物的窗口
 */
function initAaw(){
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
			console.log(plData);
			$("#aaw #pl").combobox({
		        data:plData,
		        valueField:'plNo',
		        textField:'plName',
		        editable:false,
		        onSelect:function(e){
		        	$("#aaw #ap").removeAttr("disabled");
			        $("#aaw #ap").combobox({
				        data:e.array,
				        valueField:'id',
				        textField:'apName',
				        editable:false
					})
		        }
		})
		}else{
			console.log("请求结果失败")
		}
	},function(){console.log("网络错误，请求失败")});
	
//	$("#aaw #noInApartment").keydown(function(r){
//		console.log(r.keyCode);
//		
//	});
	$("#aaw #save").click(function(e){
		//TODO 保存 增加一个动物
		var  pl = $("#aaw #pl").combobox("getValue");
		if(pl == ""){
			$.messager.alert("error","请选择产线");
		}
		var apId =  $("#aaw #ap").combobox("getValue");
		if(apId == ""){
			$.messager.alert("error","请选择产房");
		}
		var noInApartment = $("#aaw #noInApartment").val();
		if(noInApartment == ""){
			$.messager.alert("error","请选择栏位编号");
		}
		var eventDate = $("#aaw #eventDate").datebox("getValue");
		
		var initData = {
			funcNo:'1016',
			apId:apId,
			no:noInApartment,
			eventDate:eventDate
		};
		request(initData,function(r){
			if(r.error_no == '0'){
				$.messager.alert("success","添加成功");
			}else{
				$.messager.alert("error",r.error_info);
			}
		},function(){
			$.messager.alert("error","请求失败");
		});
		// 是否有动物，有的话提示不能添加。
		// 无动物，修改cell状态，并添加事件。
	})
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
function destroy(){
	$("#aaw").window("close");
	$("#aaw").remove();
}
$(document).ready(function(){
	rigthPageOb.init = init;
	rigthPageOb.destroy = destroy;
});
