var config ={
	// url:"http://192.168.1.103:8080/EnterServlet"
	url:"http://127.0.0.1:8081/EnterServlet"
//	url:"http://192.168.0.101:8080/feedingBus/EnterServlet"
//url:"http://176.122.148.51:8080/feedingBus/EnterServlet"
};
function request(data,success,error){
	var newSuccess = function(r){
		r = eval("("+r+")");
		success(r);
	}
	$.ajax({
		type:"post",
		url:config.url,
		async:true,
		data:data,
		success:newSuccess,
		error:error
	});
}
function contentChange(toPage,title){
	toPage = toPage+".html";
	rigthPageOb.destroy();
	$('#content').panel({
		 title:title,
		 href:toPage,
		 onLoad:function(){
    		rigthPageOb.init();
    	}
	});
	var stack  = getSessionStorage("pageStack");
	stack.push({page:toPage,title:title});
	setSessionStorage("pageStack",stack);
}
function backContent(){
	var stack  = getSessionStorage("pageStack");
	stack.pop();
	var backObject =  stack.pop();
	if(backObject == null)return;
	var toPage = backObject["page"];
	var title = backObject["title"];
	stack.push(backObject);
	setSessionStorage("pageStack",stack);
	rigthPageOb.destroy();
	$('#content').panel({
		 title:title,
		 href:toPage,
		 onLoad:function(){
    		rigthPageOb.init();
    	}
	});
}
function reloadContent(){
	rigthPageOb.destroy();
	$("#content").panel("refresh");
}
function setSessionStorage(key,value){
	sessionStorage.setItem(key, JSON.stringify(value));
}
function removeSessionStorage(key){
	sessionStorage.removeItem(key);
}
function getSessionStorage(key){
	var value =  sessionStorage.getItem(key);
	var realValue = JSON.parse(value);
	return realValue;
};
$.fn.datebox.defaults.formatter = function (date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}
$.fn.datebox.defaults.parser = function(s){
	var t = Date.parse(s);
	if (!isNaN(t)){
		return new Date(t);
	} else {
		return new Date();
	}
}