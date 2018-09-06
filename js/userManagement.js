function init(){
	var pageId = "#userManagement ";
	function initData(){
		var data = {
			funcNo:'1018'
		}
		request(data,function(r){
			console.log(r);
			if(r.error_no == '0'){
				var rdata = r.data;
				$(pageId+' #table').datagrid({
					data:rdata,
//					toolbar: '#umtt',
				toolbar: [{
						iconCls: 'icon-add',
						handler: function(){
							$("#addUserW").window("open");
							initAddW();
						}
					},'-',{
						iconCls: 'icon-reload',
						handler: function(){
							var line =$(pageId+' #table').datagrid("getSelected");
							if(line == null){
								$.messager.alert("提示",'请先选中一行')
							}
							var username = line["username"];
							$.messager.confirm('确认', '将重置'+username+"的密码", function(r){
								if (r){
									var resetData = {
										funcNo:"1020",
										username:username
									}
									request(resetData,function(r){
										$.messager.alert("success","重置成功")
									},function(){
										$.messager.alert("error","网络错误")
									})
								}
							});
						}
					},'-',{
						iconCls: 'icon-remove',
						handler: function(){
							var line =$(pageId+' #table').datagrid("getSelected");
							if(line == null){
								$.messager.alert("提示",'请先选中一行')
							}
							var username = line["username"];
							if(username == 'admin'){
								$.messager.alert('提示', '不能删除admin用户');
								return ;
							}
							
							$.messager.confirm('确认', '将删除用户'+username, function(r){
								if (r){
									var resetData = {
										funcNo:"1021",
										username:username
									}
									request(resetData,function(r){
										$.messager.alert("success","删除成功")
										reloadContent();
									},function(){
										$.messager.alert("error","网络错误")
									})
								}
							});
						}
					}],
					singleSelect:true,
					columns:[[
						{field:'id',title:'id',width:100},
						{field:'username',title:'username',width:100},
						{field:'nickname',title:'nickname',width:200},
						{field:"remark",title:"remark",width:200},
						{field:"phone",title:"phone",width:200},
						{field:"role",title:"role",width:200}
				    ]]
				});
			}
		},function(){console.log("error")});
	}
	var addwFlag = true;
	function initAddW(){
		$("#addUserW input").val("");
		if(addwFlag){
			addwFlag = false;
		}else{
			return ;
		}
		$("#addUserW #userRole").combobox({
	        data:[{role:"normal",value:"normal"},{role:'admin',value:"admin"}],
	        valueField:'value',
	        textField:'role',
	        editable:false
		})
		$("#addUserW #save").click(function(){
			var username =  $("#addUserW [name=username]").val();
			var nickname = $("#addUserW [name=nickname]").val();
			var remark = $("#addUserW [name=remark]").val();
			var phone = $("#addUserW [name=phone]").val();
			var role = $("#addUserW #userRole").combobox("getValue");
			if(username == ""){
				$("#addUserW [name=username]").focus();
				$.messager.alert("提示","请填写username");
				return ;
			}
			if(role == ""){
				$.messager.alert("提示","请选择角色");
				return ;
			}
			var addData = {
				username:username,
				nickname:nickname,
				remark:remark,
				phone:phone,
				role:role,
				funcNo:"1019"
			};
			request(addData,function(r){
				$.messager.alert("success","添加成功");
				reloadContent();
			},function(){
				$.messager.alert("error","网络错误")
			})
		})
		$("#addUserW #cancel").click(function(){
			$("#addUserW").window("close");
		})
	}
	initData();
}
function destroy(){
	$("#addUserW").window("close");
	$("#addUserW").remove();
}
$(document).ready(function(){
	rigthPageOb.init = init;
	rigthPageOb.destroy = destroy;
});
