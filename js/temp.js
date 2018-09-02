function init(){
	var pageId = "#";
	var data = {
		funcNo:'1001'
	}
	request(data,function(r){
				
	},function(){console.log("error")});
}
$(document).ready(function(){
	rigthPageOb.init = init;
});
