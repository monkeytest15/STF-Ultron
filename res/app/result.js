window.onload = function () {
    console.log('load!!!!')
    loadResult()
    loadSumResult()
}
function loadResult(){
    var _starttime = GetRequest().starttime
    var _device = GetRequest().device
    var total_pass=0
    var total_fail=0
    console.log(_starttime+' '+_device)
    $.ajax({
        type: 'POST',
        data: {starttime: _starttime , device: _device}, 
        url: '/test/resultList',
        success: function(result){
            insert_div = document.getElementById('device－result')
            var hh = "<br/><table width=\"100%\"  border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"center\" valign=\"middle\">"
            var hh2 = "</td></tr></table>"
            hh+="<table class=\"bordered\">"
            hh+="<th>Name</th><th>Module</th><th>Result</th><th>Info</th><th>Picture</th>"
            for (var i in result) {
                hh+="<tr>"
                for(var j in result[i]){
                    if(j=='starttime'||j=='device')
                        continue
                    // console.log('result:'+result[i][j])
                    if(j=='result'){
                        if(result[i][j]=='pass')
                            total_pass++
                        else
                            total_fail++
                    }
                    if(j=='picture'&&result[i][j]!='null'){
                        hh+="<td><p><a class=\"group1\" href=\""+result[i][j]+"\" title=\"test result\">picture</a></p></td>"
                    }
                    else{
                        if(result[i][j]=='null'){
                            hh+="<td>N/A</td>"
                        }
                        else
                            hh+="<td>"+result[i][j]+"</td>"
                    }
                }
                hh+="</tr>"
            }
            hh+="</table>"+hh2
            insert_div.innerHTML = hh
            var pass_rate = (total_pass/(total_fail+total_pass)*100).toFixed(2)
            console.log('hahaha'+pass_rate)
            var myChart = echarts.init(document.getElementById('light'));
            // 指定图表的配置项和数据
            option1 = {
                backgroundColor: '#FFFAF0',
                color:['#76EE00', '#FF0000'],
                title : {
                    text: 'Test Result',
                    subtext: 'device: '+_device,
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['pass','fail']
                },
                series : [
                    {
                        name: 'test result',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:total_pass, name:'pass'},
                            {value:total_fail, name:'fail'}
                        ],
                        itemStyle: {
                            normal: {
                                label:{ 
                                    show: true, 
                                    formatter: '{b} : {c} ({d}%)' 
                                }, 
                                opacity: 0.7
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            option2 = {
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [
                    {
                        name: '业务指标',
                        type: 'gauge',
                        detail: {formatter:'{value}%'},
                        data: [{value: pass_rate, name: 'Pass Rate'}]
                    }
                ]
            };
            option3 = {
                backgroundColor: '#acd6ff',

                title: {
                    text: 'Test Result',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#330e0e'
                    }
                },

                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                // visualMap: {
                //     show: false,
                //     min: 80,
                //     max: 600,
                //     inRange: {
                //         colorLightness: [0, 1]
                //     }
                // },
                series : [
                    {
                        name:'Test Result',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[
                            {value:total_pass, name:'Pass'},
                            {value:total_fail, name:'Fail'},
                            {value:1, name:'Fail'}
                        ].sort(function (a, b) { return a.value - b.value}),
                        roseType: false,
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(255, 239, 213, 0.6)'
                            }
                        }
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option1);
            $(".group1").colorbox({rel:'group1', transition:"none", width:"50%"});
            
            //Example of preserving a JavaScript event for inline calls.
            $("#click").click(function(){ 
                $('#click').css({"background-color":"#f00", "color":"#fff", "cursor":"inherit"}).text("Open this window again and this message will still be here.");
                return false;
            });
            var th = jQuery('th'),
                li = jQuery('li'),
                inverse = false;
            
            th.click(function(){
                
                var header = $(this),
                    index = header.index();
                    
                header
                    .closest('table')
                    .find('td')
                    .filter(function(){
                        return $(this).index() === index;
                    })
                    .sortElements(function(a, b){
                        
                        a = $(a).text();
                        b = $(b).text();
                        
                        return (
                            isNaN(a) || isNaN(b) ?
                                a > b : +a > +b
                            ) ?
                                inverse ? -1 : 1 :
                                inverse ? 1 : -1;
                            
                    }, function(){
                        return this.parentNode;
                    });
                
                inverse = !inverse;
                
            });
            
            $('button').click(function(){
                li.sortElements(function(a, b){
                    return $(a).text() > $(b).text() ? 1 : -1;
                });
            });
        }
    })
}
function loadSumResult(){
    var _starttime = GetRequest().starttime
    var _device = GetRequest().device
    $.ajax({
        type: 'POST',
        data: {starttime: _starttime , device: _device}, 
        url: '/test/sumResultList',
        success: function(result){
            insert_div2 = document.getElementById('sum_result')
            var hh = "<table width=\"100%\"  border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"center\" valign=\"middle\">"
            var hh2 = "</td></tr></table>"
            hh+="<table class=\"bordered\">"
            hh+="<th>Module</th><th>Pass</th><th>Fail</th>"
            var module_list = new Array();
            var pass_list = new Array();
            var fail_list = new Array();
            for (var i in result) {
                for(var j in result[i]){
                    if(j=='module'){
                        var module_eq=false
                        for(var h in module_list){
                            if(result[i][j]==module_list[h]){
                                module_eq=true;
                                break;
                            }
                        }
                        if(!module_eq){
                            module_list.push(result[i][j])
                        }
                    }
                }
            }
            for(var h in module_list){
                pass_list[h]=0;
                fail_list[h]=0;
            }
            for (var i in result) {
                for(var j in result[i]){
                    if(j=='module'){
                        for(var h in module_list){
                            if(result[i][j]==module_list[h]){
                                console.log("eql module_list"+result[i]['result']);
                                if(result[i]['result']=='pass'){
                                    pass_list[h]=pass_list[h]+1
                                }
                                if(result[i]['result']=='fail'){
                                    fail_list[h]=fail_list[h]+1
                                }
                            }
                        }
                    }
                }
            }
            for(var h in module_list){
                ww = "<tr>"
                ww1 = "<td>"+module_list[h]+"</td>"+"<td>"+pass_list[h]+"</td>"+"<td>"+fail_list[h]+"</td>"
                ww2 = "</tr>"
                hh+=ww+ww1+ww2
            }
            hh+="</table>"+hh2
            insert_div2.innerHTML = hh
        }
    });
}
function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function ImgShow(evt){
	var imgTag=(window.event)?event.srcElement:evt.target;
	var imgPath=imgTag.src.replace(/\_\d\./,"_4.");//取得弹出的大图url
	var tagTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);
	var tag=document.createElement("div");
		tag.style.cssText="width:100%;height:"+Math.max(document.body.clientHeight,document.body.offsetHeight,document.documentElement.clientHeight)+"px;position:absolute;background:black;top:0;filter: Alpha(Opacity=80);Opacity:0.8;";
		tag.ondblclick=closes;
	var tagImg=document.createElement("div");
		tagImg.style.cssText="font:12px /18px verdana;overflow:auto;text-align:center;position:absolute;width:200px;border:5px solid white;background:white;color:white;left:"+(parseInt(document.body.offsetWidth)/2-100)+"px;top:"+(document.documentElement.clientHeight/3+tagTop)+"px;"
		tagImg.innerHTML="<div style='padding:10px;background:#cccccc;border:1px solid white'><img src='http://p1.mb5u.com/texiao/1/20110225160551610.gif' /><br /><br /><b style='color:#999999;font-weight:normal'>Image loading...</b><br /></div>";
		tagImg.oncontextmenu=function(){var clsOK=confirm("确定要取消图片显示吗?点击确定将关闭图片。\n如果您是想缩放图片请在图片上双击。"); if(clsOK){closes();};return false};
	var closeTag=document.createElement("div");
		closeTag.style.cssText="display:none;position:absolute;left:10px;top:10px;color:black;";
		var closesHtml="<b style='background:red;border:1px solid white;filter:Alpha(Opacity=50);Opacity:0.5;cursor:pointer;'>&nbsp;关闭&nbsp;</b>";
		closeTag.innerHTML=closesHtml+" 提示:双击图片缩放";
		closeTag.onclick=closes;
	document.body.appendChild(tag);
	document.body.appendChild(tagImg);
	var img=new Image();
		img.src=imgPath;
		img.style.cssText="border:1px solid #cccccc;filter: Alpha(Opacity=0);Opacity:0;cursor:pointer";
	var barShow,imgTime;
	img.complete?ImgOK():img.onload=ImgOK;
	function ImgOK(){
		var Stop1=false,Stop2=false,temp=0;
		var tx=tagImg.offsetWidth,ty=tagImg.offsetHeight;
		var ix=img.width,iy=img.height;
		var sx=document.documentElement.clientWidth,sy=window.innerHeight||document.documentElement.clientHeight;
		if(iy>sy||ix>sx){
				var yy=sy-100;
				var xx=(ix/iy)*yy;
		}else{
			var xx=ix+4;
			var yy=iy+3;
		}
			img.style.width=xx-4+'px';
			img.style.height=yy-3+'px';
		if(ix<sx&&iy<sy){tagImg.alt="";closeTag.innerHTML=closesHtml;};
		var maxTime=setInterval(function(){
			temp+=35;
			if((tx+temp)<xx){
				tagImg.style.width=(tx+temp)+"px";
				tagImg.style.left=(sx-(tx+temp))/2+"px";
			}else{
				Stop1=true;
				tagImg.style.width=xx+"px";
				tagImg.style.left=(sx-xx)/2+"px";
			}
			if((ty+temp)<yy){
				tagImg.style.height=(ty+temp)+"px";
				tagImg.style.top=(tagTop+((sy-(ty+temp))/2))+"px";
			}else{
				Stop2=true;
				tagImg.style.height=yy+"px";
				tagImg.style.top=(tagTop+((sy-yy)/2))+"px";
			}
			if(Stop1&&Stop2){
				clearInterval(maxTime);
				tagImg.appendChild(img);
				temp=0;
				imgOPacity();
			}
		},1);
		function imgOPacity(){
			temp+=10;
			img.style.filter="alpha(opacity="+temp+")";
			img.style.opacity=temp/100;
			imgTime=setTimeout(imgOPacity,1)
			if(temp>100) clearTimeout(imgTime);
		}
		tagImg.innerHTML="";
		tagImg.appendChild(closeTag);
			
		if(ix>xx||iy>yy){
			img.alt="左键拖动,双击放大缩小";
			img.ondblclick=function (){
				if(tagImg.offsetWidth<img.offsetWidth||tagImg.offsetHeight<img.offsetHeight){
					img.style.width="auto";
					img.style.height="100%";
					img.alt="双击可以放大";
					img.onmousedown=null;
					closeTag.style.top="10px";
					closeTag.style.left="10px";
					tagImg.style.overflow="visible";
					tagImg.style.width=img.offsetWidth+"px";
					tagImg.style.left=((sx-img.offsetWidth)/2)+"px";
				}else{
					img.style.width=ix+"px";
					img.style.height=iy+"px";
					img.alt="双击可以缩小";
					img.onmousedown=dragDown;
					tagImg.style.overflow="auto";
					tagImg.style.width=(ix<sx-100?ix+20:sx-100)+"px";
					tagImg.style.left=((sx-(ix<sx-100?ix+20:sx-100))/2)+"px";
				}
			}
			img.onmousedown=dragDown;
			tagImg.onmousemove=barHidden;
			tagImg.onmouseout=moveStop;
			document.onmouseup=moveStop;
		}else{
			tagImg.style.overflow="visible";
			tagImg.onmousemove=barHidden;
		}
	}
	function dragDown(a){
		img.style.cursor="move";
		var evts=a||window.event;
		var onx=evts.clientX,ony=evts.clientY;
		var sox=tagImg.scrollLeft,soy=tagImg.scrollTop;
		var sow=img.width+2-tagImg.clientWidth,soh=img.height+2-tagImg.clientHeight;
		var xxleft,yytop;
		document.onmousemove=function(e){
			var evt=e||window.event;
			xxleft=sox-(evt.clientX-onx)<0?"0":sox-(evt.clientX-onx)>sow?sow:sox-(evt.clientX-onx);
			yytop=soy-(evt.clientY-ony)<0?"0":soy-(evt.clientY-ony)>soh?soh:soy-(evt.clientY-ony);
			tagImg.scrollTop=yytop;
			tagImg.scrollLeft=xxleft;
			closeTag.style.top=(yytop+10)+"px";
			closeTag.style.left=(xxleft+10)+"px";
			return false;
		}
		return false;
	}
	function barHidden(){
		clearTimeout(barShow);
		closeTag.style.top=(tagImg.scrollTop+10)+"px";
		closeTag.style.left=(tagImg.scrollLeft+10)+"px";
		if(closeTag.style.display=="none")closeTag.style.display="block";
		barShow=setTimeout(function(){closeTag.style.display="none";},1000);
	}
	function closes(){
		document.body.removeChild(tag);
		document.body.removeChild(tagImg);
		clearTimeout(barShow);
		clearTimeout(imgTime);
		document.onmouseup=null;
		tag=img=tagImg=closeTag=null;
	}
	function moveStop(){
		document.onmousemove=null;
		tagImg.onmousemove=barHidden;
		img.style.cursor="pointer";
	}
}