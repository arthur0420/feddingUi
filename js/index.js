$(document).ready(function(){
	
	var userData = getSessionStorage("userData");
	if(userData == "" || userData==null){
		window.location.href = 'login.html';
	}
	var role = userData["role"];
	if(role == "admin"){
		$(".userManagement").show();
	}
	
	$("#quit").click(function(){
		removeSessionStorage("userData");
		window.location.href = 'login.html';
	})
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
})

