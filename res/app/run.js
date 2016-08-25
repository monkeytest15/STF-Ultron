function run_click(input, serialNum)
{
    document.getElementById("runBt").disabled=true;
    var se_obj = document.getElementById("select_package");
    var index = se_obj.selectedIndex;
    var text = se_obj.options[index].text;
    var value = se_obj.options[index].value;
    alert("run!");
    $.ajax({
        type: 'POST',
        data: {serialNum: serialNum , package: value}, 
        url: 'run'
    });
}
function result_click(input, serialNum)
{
    // document.getElementById("resultBt").disabled=true;
    alert("result!");
    $.ajax({
        type: 'POST',
        data: "serialNum="+serialNum,
        url: '/result'
    });
}
function singleReuslt_click(input, starttime)
{
    // alert("starttime:"+starttime);
    $.ajax({
        type: 'POST',
        data: "starttime="+starttime,
        url: '/test/singleResult',
        success: function(result){
            var tempTime = starttime
            tempTime=parseInt(tempTime,10);
            var date = new Date(tempTime);
            console.log("date----"+date)
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()) : date.getMonth()) + '-';
            var D = (date.getDate()+1 < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
            var h = (date.getHours()+1 < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
            var m = (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
            var s = (date.getSeconds()+1 < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
            var formatTime = Y+M+D+h+m+s
            // pos = GetObjPos(input);
            l=document.getElementById('light')
            l.style.display='block';
            var hh="<a class=\"button small blue\"onClick=\"document.getElementById('light').style.display='none'\">X</a>"+"<br/><br/><h4>"+formatTime+"</h4>"+"<table class=\"bordered\">"
            hh+="<th>Device</th><th>Total</th><th>Pass</th><th>Fail</th>"
            for (var i in result) {
                hh+="<tr>"
                for(var j in result[i]){
                //   console.log("circle j "+j)
                    if(j=='starttime'){
                        continue;
                    }
                    // if(j=='starttime'){
                    //     var date = new Date(result[i][j]);
                    //     Y = date.getFullYear() + '-';
                    //     M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()) : date.getMonth()) + '-';
                    //     D = (date.getDate()+1 < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
                    //     h = (date.getHours()+1 < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
                    //     m = (date.getMinutes()+1 < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
                    //     s = (date.getSeconds()+1 < 10 ? '0'+(date.getSeconds()) : date.getSeconds()); 
                    //     hh += Y+M+D+h+m+s+" "
                    // }
                    // else{
                    //     hh += result[i][j]+" ";
                    // }
                    if(j=='device'){
                        hh += "<td><a class='large button blue' href='/static/app/result.html?starttime="+starttime+"&device="+result[i][j]+"'target='_blank' >"+result[i][j]+"</a>";

                    }
                    else{
                        hh += "<td>"+result[i][j];
                    }
                    hh+="</td>"
                }
              hh += "</tr>"
            }
            hh += "</table>"
            l.innerHTML=hh
            // l.innerHTML+="<div id=\"light2\" style=\"width: 600px;height:400px;\"></div>"

            //        // 基于准备好的dom，初始化echarts实例
            // var myChart = echarts.init(document.getElementById('light2'));

            // // 指定图表的配置项和数据
            // option = {
            //     title : {
            //         text: 'test result',
            //         subtext: 'device:xxxx',
            //         x:'center'
            //     },
            //     tooltip : {
            //         trigger: 'item',
            //         formatter: "{a} <br/>{b} : {c} ({d}%)"
            //     },
            //     legend: {
            //         orient: 'vertical',
            //         left: 'left',
            //         data: ['pass','fail']
            //     },
            //     series : [
            //         {
            //             name: 'test result',
            //             type: 'pie',
            //             radius : '55%',
            //             center: ['50%', '50%'],
            //             data:[
            //                 {value:1, name:'pass'},
            //                 {value:1, name:'fail'}
            //             ],
            //             itemStyle: {
            //                 emphasis: {
            //                     shadowBlur: 10,
            //                     shadowOffsetX: 0,
            //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
            //                 }
            //             }
            //         }
            //     ]
            // };



            // // 使用刚指定的配置项和数据显示图表。
            // myChart.setOption(option);
            // alert(hh);
        }
    });
}
function runAll_click()
{
    document.getElementById("runAllBt").disabled=true;
    alert("run all devices!");
    $.ajax({
        type: 'POST',
        data: "serialNum= ",
        url: '/runAll'
    });
}
