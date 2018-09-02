function init(){
	
	var pageId = "#cells ";
	var pageData =  getSessionStorage("toCellsPage");
	var id = pageData["id"];
	var plName = pageData["pl_name"];
	var apName =  pageData["ap_name"];
	var data = {
		funcNo:'1003',
		apartmentId:id
	}
	var editIndex ;
	request(data,function(r){
		if(r.error_no == '0'){
			var rdata = r.data;
			console.log(rdata);
			for(var i = 0 ; i < rdata.length ;i++){
				var one = rdata[i];
				var have = one.have_animal;
				var switchh =  one["switch"];
				var have_animal_cn = have == '0' ? "无":'有';
				var switch_cn = one["switch"]=='0'?"关":"开";
				if(have == '0' ){
					rdata[i] = {no_in_apartment:one.no_in_apartment,id:one.id,have_animal_cn:have_animal_cn};
					continue;
				}else if(switchh == '0'){
					rdata[i] = {no_in_apartment:one.no_in_apartment,id:one.id,have_animal_cn:have_animal_cn,switch_cn:switch_cn};
					continue;
				}
				one["have_animal_cn"] = have_animal_cn;
				one["switch_cn"] = switch_cn;
				one["fedRate"] = ((one.fedPercent *  one.wfwac / 100).toFixed(0))/10+ "/"+ one.wfwac/10;
			}
			$(pageId+' #table').datagrid({
				title:plName + "-" + apName,
				data:rdata,
				singleSelect:true,
				onDblClickRow:function(rowIndex,rowData){
					//TODO 去动物详情页面
					setSessionStorage("toCellDetailPage",rowData);
					contentChange("cellDetail",plName + "-" + apName+"-"+rowData.no_in_apartment+"栏");
			   },
				columns:[[
					{field:'id',hidden:'true'},
					{field:'no_in_apartment',title:'栏内序号',width:100},
					{field:'have_animal_cn',title:'是否有动物',width:100},
					{field:'schedule_name',title:'饲喂计划',width:200},
					{field:"days",title:"天数",width:200},
					{field:"fedRate",title:"已饲喂/总量（当日，千克）",width:200},
					{field:"skip_time",title:"跳过",width:200,editor:'numberbox'},
					{field:"offset",title:"百分比",width:200,editor:'numberbox'},
					{field:"switch_cn",title:"饲喂开关",width:200,editor:{type:'checkbox',options:{on:'开',off:'关'}}},
					{field:'action',title:'Action',width:200,align:'center',
						formatter:function(value,row,index){
								var s = '<a href="#" onclick="saverow(this)">Save</a> ';
								var c = '<a href="#" onclick="cancelrow(this)">Cancel</a>';
								var e = '<a href="#" onclick="editrow(this)">Edit</a> ';
								return e+s+c;
						}
					}
			    ]]
			});
		}
	},function(){console.log("请求失败")});
}
function getRowIndex(target){
			var tr = $(target).closest('tr.datagrid-row');
			return parseInt(tr.attr('datagrid-row-index'));
		}
function editrow(target){
	$('#cells #table').datagrid('beginEdit', getRowIndex(target));
}
function saverow(target){
	// request to update the modification. 
	$('#cells #table').datagrid('endEdit', getRowIndex(target));
 	var selectData = $('#cells #table').datagrid("getSelected");
	var skip_time = selectData["skip_time"];
	var offset = selectData['offset'];
	var switchh = selectData['switch_cn'] == '关'? 0:1;
	var id = selectData['id'];
	var param= {
		funcNo:1004,
		id:id,
		skip_time:skip_time,
		offset:offset,
		switch:switchh
	}
	request(param,function(r){
		if(r.error_no == '0'){
			$('#cells #table').datagrid('endEdit', getRowIndex(target));
//			$.messager.alert("success","成功");
		}else{
			$.messager.alert("error",r.error_info);
			$('#cells #table').datagrid('cancelEdit', getRowIndex(target));
		}
	},function(){
		$.messager.alert("error","请求失败请重试");
		$('#cells #table').datagrid('cancelEdit', getRowIndex(target));
	});
}
function cancelrow(target){
	$('#cells #table').datagrid('cancelEdit', getRowIndex(target));
}

function destroy(){
}
$(document).ready(function(){
	rigthPageOb.init = init;
	rigthPageOb.destroy = destroy;
});
