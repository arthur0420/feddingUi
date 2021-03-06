function init(){
	var pageId = "#schedule ";
	var scheduleId='1';
	var flagInit = [true,false,false,false];
	//-------------------------------------page1
	
	var reqeustData = {
		funcNo:"1008",
		id:scheduleId
	}
	request(reqeustData,function(r){ // page1 初始化
		if(r.error_no == '0'){
			var rdata = r.data;
			var preE = new Array();
			for(var i = 0 ; i<rdata.length; i++){
				var one =rdata[i];
				var days = one["days"];
				var fodder = one['fodder'] /10;
					fodder=fodder.toFixed(1);
				if(days<0){
					preE.push(one);
				}else if(days > 0){
					var html = $("#template").html();
					$("#tb2").append(html);
					var lastTr =  $("#tb2").find("tr").last();
					var inputs = lastTr.find("input");
					inputs.eq(0).val(days);
					inputs.eq(1).val(fodder);
				}else{
					var first =  $("#tb2").find("tr").first();
					var last = $("#tb1").find("tr").last();
					first.find("input").val(fodder);
					last.find("input").val(fodder);
				}
			}
			for(var i = preE.length-1 ; i>=0; i--){
				var one =preE[i];
				var days = one["days"];
				days = -days;
				var fodder = one['fodder'] /10;
					fodder=fodder.toFixed(1);
				var html = $("#template").html();
				$("#tb1").prepend(html);
				var firstTr =  $("#tb1").find("tr").first();
				var inputs = firstTr.find("input");
				inputs.eq(0).val(days);
				inputs.eq(1).val(fodder);
			}
			inputchangePage1();
		}else{
			$.messager.alert("error",r.error_info);
		}
	},function(){})
	function checkInput(inputs){
		for(var i = 0 ; i<inputs.length; i++){
			var one = inputs.eq(i);
			var val = one.val();
			if(val == '' || val== null){
				one.focus();
				return false;
			}
		}
		return true;
	}
	function inputchangePage1(){
		var allinput = $("#page1").find("tr").find('input[step="0.1"]');
		allinput.change(function(){
			var val = $(this).val()*1;
			val =  val.toFixed(1);
			$(this).val(val);
			chartInit();
		});
		var input0day1 = $("#tb1").find("tr").last().find('input');
		var input0day2 = $("#tb2").find("tr").first().find('input');
		input0day1.unbind("change");
		input0day1.change(function(){
			var val = $(this).val()*1;
			val =  val.toFixed(1);
			$(this).val(val);
			input0day2.val(val);
			chartInit();
		})
		input0day2.unbind("change");
		input0day2.change(function(){
			var val = $(this).val()*1;
			val =  val.toFixed(1);
			$(this).val(val);
			input0day1.val(val);
			chartInit(); 
		})
		chartInit();
		// console.log(data);
	}
	function inputchangePage2(){
		// var allinput = $("#page2").find("tr").find('input');
		$("#offset_absolute").change(function(){
			var val = $(this).val()*1;
			val =  val.toFixed(1);
			$(this).val(val);
		});
	}
	function chartInit(){
		var allinput = $("#page1").find("tr").find('input[step="0.1"]');
		var input0day1 = $("#tb1").find("tr").last().find('input');
		var input0day2 = $("#tb2").find("tr").first().find('input');
		var day = [];
		var weight = [];
		var data = [];
		
		for(var i = 0 ;i<allinput.length;i++){
			var one = allinput.eq(i);
			if(one[0] == input0day1[0])continue;

			var w =  one.val()*1;
			if(one[0] == input0day2[0]) {
				data.push({
					d:0,
					w:w
				});
				continue;
			}
			var d = one.parent().parent().find("input:eq(0)").val()*1;
			var tid = one.parent().parent().parent().attr("id");
			if(tid == 'tb1'){
				d = -d;
			}
			data.push({
				d:d,
				w:w
			});
		}
		data = data.sort(function(a,b){
			if(a.d>b.d){
				return 1;
			}else{
				return -1;
			}
		});
		for(var i = 0 ; i<data.length;i++){
			var one = data[i];
			day.push(one.d);
			weight.push(one.w);
		}
		var myChart = echarts.init(document.getElementById('chart'));
		// var day = [];
		// var weight = [];
		 // 指定图表的配置项和数据
		var option = {
			title: {
				text: '喂料曲线'
			},
			tooltip: {},
			xAxis: {
				data: day,
				boundaryGap:false
			},
			yAxis: {},
			series: [{
				// name: '销量',
				type: 'line',
				data: weight
			}]
		};
        myChart.setOption(option);
	}
	function inputchangePage3(){
		var hour =  $("#page3").find(".hour");
		hour.change(function(){
			var tval = $(this).val();
			if(tval == ''){
				$(this).val("0");
			}
			var tr = $(this).parent().parent();
			var thour = tr.find(".hour");
			var sum = 0;
			var count = -1;
			for(var i = 0 ; i<thour.length ;i++){
				var one = thour.eq(i);
				var oneval = one.val()*1;
				sum+=oneval;
				if(oneval !=0){
					count++;
				}
			}
			var lastTd =tr.find("td").last();
				lastTd.html(sum);
			if(sum != 100){
				lastTd.css("color","red");
			}else{
				lastTd.css("color","black");
			}
		/* 	if(sum > 100){
				console.log(1);
				// var sum = sum-100;
				// var pre = (sum/count).toFixed(0)*1;
				 	for(var i = 0 ; i<thour.length ;i++){
					var one = thour.eq(i);
					var oneval = one.val()*1;
					if(oneval!=0  && one[0]!=$(this)[0] ){
						if(count==1 ){
							one.val(oneval-sum); 
						}else{
							one.val(oneval-pre); 
							count--;
							sum = sum - pre;
						}
					}
				} 
				var lastTd =tr.find("td").last();
				lastTd.html(100);
				lastTd.css("color","black");
				window.setTimeout(function(p){
					p.html("");
				},3000,lastTd);
			}else if(sum < 100){
				
			}else{
				var lastTd =tr.find("td").last();
				lastTd.html(100);
				lastTd.css("color","black");
				window.setTimeout(function(p){
					p.html("");
				},3000,lastTd);
			} */
		});
	}
/*	function getConstants(){
		var data = {
			funcNo:'1005'
		}
		request(data,function(r){
			if(r.error_no == '0'){
				var rdata = r.data;
				constants = rdata;
				initialize(constants);
				setSessionStorage("constants",constants);
			}
		},function(){console.log("请求失败")});
	}*/
	//-----//------------------------------------事件
	$("#bt1 , #bt2").click(function(){
		var html = $("#template").html();
		var id = $(this).attr("id");
		var tbid = "";
		if(id == "bt1"){
			tbid='tb1';
			$("#"+tbid).prepend(html);
		}else if(id == 'bt2'){
			tbid = 'tb2';
			$("#"+tbid).append(html);
		}else{
			return ;
		}
	})
	inputchangePage1();
	inputchangePage2();
	inputchangePage3();
	$('#submitPage1').click(function(){ // 提交
		var trs1 = $("#tb1").find("tr");
		var trs2 = $("#tb2").find("tr");
		var dataArray = [];
		for(var i = 0 ; i< trs1.length; i++){
			var tr = trs1.eq(i);
			var input = tr.find("input");
			if(!checkInput(input))return ;
			if(input.length ==2){
				var days = input.eq(0).val();
				var fodder = input.eq(1).val();
				fodder =(fodder*10).toFixed(0); 
				dataArray.push({days:-days,fodder:fodder})
			}else{
				var fodder = input.eq(0).val();
				fodder =(fodder*10).toFixed(0); 
				dataArray.push({days:0,fodder:fodder});
			}
		}
		for(var i = 0 ; i< trs2.length; i++){
			var tr = trs2.eq(i);
			var input = tr.find("input");
			if(!checkInput(input))return ;
			if(input.length ==2){
				var days = input.eq(0).val();
				var fodder = input.eq(1).val();
				fodder =(fodder*10).toFixed(0); 
				dataArray.push({days:days,fodder:fodder})
			}
		}
		var dataStr = JSON.stringify(dataArray);
		console.log(dataStr);
		
		var data = {
			funcNo:'1011',
			scheduleId:scheduleId,
			data:dataStr
		}
		request(data,function(r){
			if(r.error_no == '0'){
				console.log(r)
			}
		},function(){console.log("请求失败")});
	})
	//----------------------------------------------page2
	
	function page2Init(){
		
		var datap2 = {
			funcNo:"1012",
			scheduleId:scheduleId
		};
		request(datap2,function(r){
			if(r.error_no == '0'){
				var d = r.data[0];
				var offset_absolute = d["offset_absolute"];
				var offset_relative = d["offset_relative"];
				var speed = d["speed"];
				offset_absolute = (offset_absolute/10).toFixed(1);
				$("#offset_absolute").val(offset_absolute);
				$("#offset_relative").val(offset_relative);
				$("#speed").val(speed);
				
			}
		},function(){})
		$("#page2 table input").change(function(e){
			var key = $(this).attr("id");
			var value = $(this).val();
			if(value =="") return;
			var changeData = {
				funcNo:"1013",
				scheduleId:scheduleId
			}
			if(key == 'offset_absolute')
				value = (value*10).toFixed(0);
			
			changeData[key] = value;
			
			request(changeData,function(r){
				if(r.error_no=='0'){
					console.log(r);
				}else{
					$.messager.alert(r.error_info);
				}
			},function(){});
		})
	}
	
	function hourProcess(one,inputs){
		var sum = 0;
		for(var i = 1 ; i< 25 ;i++){
			var ie =  inputs.eq(i);
			var value = one["h"+(i-1)];
			value = value==null?0:value;
			$(ie).val(value);
			sum += value*1;
		}
		var tr = inputs.eq(0).parent().parent();
		var lastTd =tr.find("td").last();
		lastTd.html(sum);
		lastTd.css("color","black");
	}
	function hourSum(inputs){
		var sum = 0;
		for(var i = 1 ; i<25 ; i++){
			var ie = inputs.eq(i);
			var value = ie.val();
			value = parseInt(value);
			if(isNaN(value))continue;
			sum+=value;
		}
		return sum;
	}
	function hourData(obj,inputs){
		for(var i = 1 ; i<25 ; i++){
			var ie = inputs.eq(i);
			var value = ie.val();
			value = parseInt(value);
			if(!isNaN(value)  && value !=0){
				obj["h"+(i-1)] = value;
			}
		}
		return obj;
	}


	function page3init(){
		
		var datap3 = {
			funcNo:'1014',
			scheduleId:scheduleId
		}
		request(datap3,function(r){
			if(r.error_no=='0'){
				var rdata = r.data;
				var preE = new Array();
				for(var i = 0 ; i<rdata.length; i++){
					var one =rdata[i];
					var days = one["days"];
					if(days<0){
						preE.push(one);
					}else if(days > 0){
						var html = $("#page3 template").html();
						$("#page3 table").append(html);
						var lastTr =  $("#page3 table").find("tr").last();
						var inputs = lastTr.find("input");
						inputs.eq(0).val(days);
						hourProcess(one,inputs);
					}else{
						var html = $("#page3 template").html();
						var first =  $("#page3 table").find("tr").first();
						first.after(html);
						first = $("#page3 table").find("tr").eq(1);
						var inputs =first.find("input");
						inputs.eq(0).val(days);
						hourProcess(one,inputs);
					}
				}
				for(var i = preE.length-1 ; i>=0; i--){
					var one =preE[i];
					var days = one["days"];
//					days = -days;
					var html = $("#page3 template").html();
					var first =  $("#page3 table").find("tr").first();
					first.after(html);
					first = $("#page3 table").find("tr").eq(1);
					var inputs =first.find("input");
					inputs.eq(0).val(days);
					hourProcess(one,inputs);
				}				
			}else{
				$.messager.alert("error",r.error_info);
			}
			$("#page3 .lastTd").unbind("click");
			$("#page3 .lastTd").click(function(){
				$(this).parent().remove();
			})

			inputchangePage3();
		},function(){})
		$("#bt3").click(function(){
			var html =  $("#page3 template").html();
			$("#page3 table").append(html);
			
			$("#page3 .lastTd").unbind("click");
			$("#page3 .lastTd").click(function(){
				$(this).parent().remove();
			})
			
		})
		$("#bt4").click(function(){
			var dataArray = [];
			var trs =  $("#page3 table").find("tr");
			for(var i = 1 ; i< trs.length; i++){
				var tr = trs.eq(i)
				var inputs =tr.find("input");
				var sum = hourSum(inputs);
				if(sum != 100){
					var lastTd =tr.find("td").last();
					lastTd.html(sum);
					lastTd.css("color","red");
					window.setTimeout(function(p){
						p.html("");
					},3000,lastTd);
					return;
				}
				var days = inputs.eq(0).val();
				days = parseInt(days);
				if(isNaN(days)){
					inputs.eq(0).focus();
					inputs.eq(0).css("color","red");
					window.setTimeout(function(p){
						p.css("color","black");
					},3000,inputs.eq(0));
					return;
				}
				var one = {days:days};
				one = hourData(one,inputs);
				dataArray.push(one);
			}
			var dataStr = JSON.stringify(dataArray);
			// console.log(dataStr);
			
			datap3 = {
				funcNo:1015,
				scheduleId:scheduleId,
				data:dataStr
			}
			request(datap3,function(r){
				if(r.error_no == '0'){
					$.messager.alert("success","修改成功");
				}
			},function(){});
		})
	}
	
	
	
	
	
	
	
	
	
	
	
	
	$('#main_div').tabs({
	    onSelect:function(title,index){
			if(!flagInit[index]){
				if(index == 1)page2Init();
				if(index == 2)page3init();
				flagInit[index] = true;
			}
	    }
	});
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
