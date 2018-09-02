function init(){
	var pageId = "#panel";
	var data = {
		funcNo:'1001'
	}
	request(data,function(r){
		console.log(r);
		if(r.error_no == '0'){
			var rdata = r.data;
			$(pageId+' #table').datagrid({
				title:"日志",
				data:rdata,
				singleSelect:true,
				columns:[[
					{field:'id',title:'id',width:100},
					{field:'level',title:'level',width:100},
					{field:'remark',title:'remark',width:200},
					{field:"date",title:"date",width:200}
			    ]]
			});
		}
	},function(){console.log("error")});
}
$(document).ready(function(){
	rigthPageOb.init = init;
});
