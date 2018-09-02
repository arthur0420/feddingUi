var config ={
//	url:"http://192.168.0.100:8081/EnterServlet"
//	url:"http://192.168.0.101:8080/feedingBus/EnterServlet"
url:"http://176.122.148.51:8080/feedingBus/EnterServlet"
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
function getSessionStorage(key){
	var value =  sessionStorage.getItem(key);
	var realValue = JSON.parse(value);
	return realValue;
};
$(document).ready(function(){
	$(".Navigator li").mouseover(function(){
			$(this).css("background-color","#ACD6FF");
		});
		$(".Navigator li").mouseout(function(){
			$(this).css("background-color","#fff");
		});
		$(".Navigator li").click(function(e){
			var toPage =  $(this).attr("toHtml")+".html";
			var title = $(this).text();
			rigthPageOb.destroy();
			$('#content').panel({
				 title:title,
				 href:toPage,
				 onLoad:function(){
		    		rigthPageOb.init();
		    	}
			});
			var value =  [{page:toPage,title:title}]; // 初始化栈。
			setSessionStorage("pageStack",value);			
		})
		// 自适应
        var height1 = $(window).height()-20;  
        $("#main_layout").attr("style","width:100%;height:"+height1+"px");  
        $("#main_layout").layout("resize",{  
            width:"100%",  
            height:height1+"px"  
        });  
    	
    	$('#content').panel({
//		    width:500,
//		    height:150,
		    title:' ',
//		    tools:[{
//		    iconCls:'icon-add',
//		    handler:function(){alert('new')}
//		    },{
//		    iconCls:'icon-save',
//		    handler:function(){alert('save')}
//		    }]
			href:'welcome.html',
		    onLoad:function(){
		    	rigthPageOb.init();
		    }
		});
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
})

