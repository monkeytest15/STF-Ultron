This Doc writed by 其亦优

Update
---
  1. 目前支持一台或多台机器的自动化用例触发
  2. 基于JQuery和ECharts制作的测试报告
  3. 目前只有部分发送视频相关的用例
  4. 目前还支持3到8台不等少量的机器

注意事项
---
  1. 本工程改造于STF，如有继续改造需求请先至https://github.com/openstf/stf 查看相应的搭建方法
  2. 在改造之前需先对jade nodejs angularjs javascript 及html等框架和语言有所了解

运行stf流程
---
  1. 安装git
  2. 在github上下载openstf的源码
```git clone https://github.com/openstf/stf.git```
  3. 安装nodejs
  4. 安装brew
  5. 之后用brew 安装```brew install rethinkdb graphicsmagick zeromq protobuf yasm pkg-config```
  6. 启动rethinkdb```rethinkdb```  
  7. 进入stf源码的文件夹 执行编译(可能会缺某些模块，需要手动安装一下 npm install xxx)
```sudo gulp clean```
```sudo gulp webpack:build```
  8. 运行stf```stf local```

已改造的模块
---
  1. 后端服务接口 lib/units/app/index.js
    * post接口要加在app.use cookie之前 别问我为什么 我也不知道，加后面没效果
    * 已增加接口
      + post: ```/run``` ```/test/singleResult``` ```/test/resultList``` ```/test/sumResultList``` ```/runAll```
      + get: ```/test/result```
  2. 在前端detials tab增加run按钮 res/app/device-list/details/device-list-details-directive.js
    * 修改func createRow() 在创建表格时增加run button
  3. 在前端增加result tab res/app/device-list/result 搭配 res/app/device-list/resultcolumn
    * result tab的内容是从mysql中读取
  4. 增加js脚本 /res/app/run.js /res/app/result.js
    * 监听run button 和result tab
  5. 增加result页面 /res/app/result.html

改造STF的历程以及一些遇到的坑
---
  1. 先写一些无关的话题  有助于理解整个心路历程
    * 拿到整个stf源码的时候是懵比的
    * 本以为前端是用html写的，结果我承认是我太天真，前端是jade，所以要修改界面什么的，先看看jade的语法规则吧
    * 然后jade套angularjs使用是在上面懵比的基础上又加了一锤子，直接击晕了。
    * 然后增加后端服务器接口，使用的nodejs 这个还好理解一些，但是很快就遇到坑了 加入的post接口没有效果，必须写在cookie之前，原因至今不得而知
    * 介于angularjs实在难以驾驭，所以改造的时候用的是普通的js脚本，虽然没使用，但是至少要能看懂angular的一些规则
  2. 闲话少说 开始搞起
    * 第一个需求是在detials标签页的每一行的最后增加一个run 的按钮
      + 连猜带蒙 大概猜出前端的页面在res这个文件夹内 看到的主页是这个文件: ```/res/app/views/index.jade```
      + 当了解了jade的一些语法的时候试图改这个index.jade 然后用上面提到的gulp命令编译 然后stf local运行，发现的确是这个页面
      + 接下来是找detials这个tab页 继续连蒙带猜找到这个文件```/res/app/device-list/details/device-list-details.jade``` 打开后并没有一行行```<tr/>```
      然后意识到这里面得device应该都是动态加载的, 然后找到同目录下的```device-list-details-directive.js```文件
      + 在这个文件模糊的看到了一些逻辑 每次又新的设备插入是都会调用```createRow(device)filterRow(row, device)insertRow(row, device)```这三个方法
      所以在createRow方法中加入一列button就可以了 然后再给这个button加入js的监听方法```runTd.innerHTML = '<a class="large button blue" id="runBt" type="button" num="'+device.serial+'"onclick="run_click(this,\''+device.serial+'\');">run</a>';```
      + 在/res/app的目录下添加run.js文件 在run.js中加入run方法
    ```
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
    ```
      + 利用ajax给后端传值 结构体写在data中 如上所示 
      + 之后在后端接口中添加run接口,首先要找到对应的nodejs，继续连蒙带猜 在```/lib/units/app/index.js```找到
      + 根据nodejs的语法添加app.post()方法 注意：一定要在```  app.use(cookieSession())```之前加，在之后加会报错，别问我为什么 我也不知道
      + 在post('/run')方法中调用ant命令去调用mus-captainamerica 传两个参数device和packagename给ant然后运行的逻辑就都在mus-captainamerica中了
    * 第二个需求是在details tab页的旁边加入新的tab页 result 用来显示测试结果
      + ok, 本以为有了上述经验我们知道如何修改和增加页面了，结果开搞了才发现有大坑……
      + 首先找到这个目录```/res/app/device-list/device-list.jade```这里面放的是Devices和Details的tab如法炮制 复制```/res/app/device-list/details```文件夹为```/res/app/device-list/result``` 并且在device-list.jade这个文件中模仿detials添加tab
      + 编译运行后发现成功添加result tab，不过里面的内容跟detials是一模一样的，这并不是我们想要的，根据上述需求我们知道修改createrow方法可以修改table其中的列，但有一个问题，表头尼玛怎么改？
      + 在```device-list-details.jade```中找了很久也没发现可以直接修改表头的地方，后来仔细地查看代码发现了column这个文件夹 发现这个文件夹才是控制detials tab表头的元凶
      + 根据ctrl+C ctrl+V的定律，复制column文件夹为resultcolumn并在device-list.jade中修改为```device-list-result(tracker='tracker', columns='resultColumns', sort='sort', filter='filter').selectable```
      + 然后```/res/app/device-list/resultcolumn/device-resultcolumn-service.js```中DeviceResultcolumnService方法返回的数组将title属性修改为自己想要的内容
      + 接下来就跟之前一样修改```/res/app/device-list/result/device-list-result-directive.js```文件中的createRow方法，在其中调用```$http.get('/test/result/').success(function(data){})```方法从后端拿到返回的数据,然后遍历加到页面中
      + 然后在后端的nodejs中添加上述get方法 涉及到nodejs访问mysql数据库 并用第二个参数res.send传回json数组，如下:
    ```
    app.get('/test/result', function(req, res) {
      connection.query('SELECT * from result_info', function(err, rows, fields) {
      if (err) {
              console.log('[query] - :'+err);
          return;
      }
      var tempresultmap= {}
      for (var i = 0; i < rows.length; i++) {
        var singleResultMap
        singleResultMap = {
          starttime: rows[i].starttime,
          total: rows[i].total,
          pass: rows[i].pass,
          fail: rows[i].fail,
          user: rows[i].user,
          buildverison: rows[i].buildverison
        }
        tempresultmap[i]= singleResultMap
      }
      res.send(tempresultmap)
      })
    })
    ```
    * 第三个需求是展示单次结果的详细数据
      + ok 实现这个的时候就完全脱坑了，直接html+javascript+后端的nodejs就OK了，完全不要跟angularjs打交道的感觉实在是太幸福了
      + gg
  
