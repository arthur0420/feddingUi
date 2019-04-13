// 样式初始化
var maxWidth = document.documentElement.clientWidth;
var theHtml = document.getElementsByTagName('html');
theHtml[0].style.fontSize = maxWidth / 75 + 'px';


var page2Data ={};

$(function(){
// 初始化 牧场列表
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
            one["pl_name_ap_name"] = one.pl_name+" "+one.ap_name;
            animalGross+= one.animalGross;
        }
        $("#animalGross").html(animalGross);
        var list = $("#list");
        var html = temp($("#temp1"),rdata);
        list.append(html);
        // 点击事件 。跳转到 page2
        $("#list").find(".bb").click(function(){
            var vid = $(this).attr("vid");
            page2Data.id = vid;
            page2Data.name = $(this).find("div").eq(0).html();
            page2init();
        })
    }
},function(){console.log("请求失败")});
});

function page2init(){
$("#page2_title_name").html(page2Data.name);
$("#page1").hide();
$("#page2").show();

var data = {
    funcNo:'1003',
    apartmentId:page2Data.id
}
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


        
        /* $(pageId+' #table').datagrid({
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
        }); */
    }
},function(){console.log("请求失败")});
}

function temp(tempo,data){
var html = "";
for(var i = 0 ; i<data.length;i++){
    var t = tempo.html();
    var one = data[i];
    for(var pp in one){
        t = t.replace("{{"+pp+"}}",one[pp]);
    }
    html +=t;
}
return html;
}