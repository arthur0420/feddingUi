// 样式初始化
var maxWidth = document.documentElement.clientWidth;
var theHtml = document.getElementsByTagName('html');
theHtml[0].style.fontSize = maxWidth / 75 + 'px';


var page2Data = {};
var page3Data = {};
var pages = null;
$(function () {
    pages = $("#page1,#page2,#page3");
    // 初始化 牧场列表
    page1Init();
});


function page1Init() {

    pages.hide();
    $("#page1").show();
    var data = {
        funcNo: '1002',
        dataType: "detail"
    }
    request(data, function (r) {
        if (r.error_no == '0') {
            var rdata = r.data;
            var animalGross = 0;
            for (var i = 0; i < rdata.length; i++) {
                var one = rdata[i];
                one["delivery_fed"] = one.deliveryGross + "/" + one.animalGross;
                one["rate"] = one.fedGross + "/" + one.weightGross;
                one["pl_name_ap_name"] = one.pl_name + " " + one.ap_name;
                animalGross += one.animalGross;
            }
            $("#animalGross").html(animalGross);
            var list = $("#list1");
            var html = temp($("#temp1"), rdata);
            list.html("");
            list.append(html);
            // 点击事件 。跳转到 page2
            $("#list1").find(".bb").click(function () {
                var vid = $(this).attr("vid");
                page2Data.id = vid;
                page2Data.name = $(this).find("div").eq(0).html();
                page2init();
            })
        }
    }, function () { console.log("请求失败") });
}
function page2init() {
    $("#page2_title_name").html(page2Data.name);
    pages.hide();
    $("#page2").show();
    var data = {
        funcNo: '1003',
        apartmentId: page2Data.id
    }
    request(data, function (r) {
        if (r.error_no == '0') {
            var rdata = r.data;
            console.log(rdata);
            for (var i = 0; i < rdata.length; i++) {
                var one = rdata[i];
                var have = one.have_animal;
                var switchh = one["switch"];
                var have_animal_cn = have == '0' ? "无" : '有';
                var switch_cn = one["switch"] == '0' ? "关" : "开";
                if (have == '0') {
                    rdata[i] = { no_in_apartment: one.no_in_apartment, id: one.id, have_animal_cn: have_animal_cn };
                    continue;
                } else if (switchh == '0') {
                    rdata[i] = { no_in_apartment: one.no_in_apartment, id: one.id, have_animal_cn: have_animal_cn, switch_cn: switch_cn };
                    continue;
                }
                one["have_animal_cn"] = have_animal_cn;
                one["switch_cn"] = switch_cn;
                one["fedRate"] = ((one.fedPercent * one.wfwac / 100).toFixed(0)) / 10 + "/" + one.wfwac / 10;
                one["index"] = i;
            }

            var list = $("#list2");
            list.html("");
            var html = temp($("#temp2"), rdata);
            list.append(html);
            $("#list2").find(".bb").click(function () {
                var vid = $(this).attr("vid");
                var index = $(this).attr("index");
                page3Data.id = vid;
                page3Data.name = rdata[index].no_in_apartment;
                page3Init();
            })
        }
    }, function () { console.log("请求失败") });

    $("#page2 .title").click(function () {
        page1Init();
    })
}

function page3Init() {
    pages.hide();
    $("#page3").show();
}

function temp(tempo, data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var t = tempo.html();
        var one = data[i];
        for (var pp in one) {
            t = t.replace("{{" + pp + "}}", one[pp]);
        }
        html += t;
    }
    return html;
}