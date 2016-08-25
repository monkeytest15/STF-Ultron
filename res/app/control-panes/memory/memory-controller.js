module.exports = function MemoryCtrl($scope) {

var myChart = echarts.init(document.getElementById('memory_page'));


var oneDay = 24 * 3600 * 1000;
var date = [];
var memory_data =1111;
var data = [];
var now = new Date();
var count=0

function getMemoryData(){
var command = "dumpsys meminfo your package name | grep TOTAL"
var number_count = 0

 $scope.result = null

    $scope.command = ''

     $scope.control.shell(command)
      .progressed(function(result) {
        console.log("this is progressed")
        $scope.result = result
        $scope.data = result.data.join('')
        $scope.$digest()
        if ($scope.data== null || $scope.data== undefined || $scope.data== ''){
            return 
        }
        for (var i=0;i<$scope.data.split(/\s+/).length;i++)
        {
            var b = $scope.data.split(/\s+/)[i]
            if (b ==="TOTAL")
            {
                number_count = i
            }
        }
        memory_data = $scope.data.split(/\s+/)[number_count+1]
        console.log("in getMemoryData"+memory_data)

      })
    //   .then(function(result) {
    //     console.log("this is then")
    //     $scope.result = result
    //     $scope.data = result.data.join('')
    //     $scope.$digest()
    //     console.log($scope.data.split(/\s+/))
    //   })
return memory_data
}

for (var i = 1; i < 100; i++) {
    // var hh= (new Date()).getSeconds()
    date.push(count+"s");
    data.push(0);
}


function addData(shift) {
    var hh= (new Date()).getSeconds()
    date.push(count+"s");
    memory_data = getMemoryData()
    console.log("in addData"+memory_data)
    data.push(parseInt(memory_data, 10));
    if (shift) {
        date.shift();
        data.shift();
    }
    now = new Date(Date.parse(now) + 24 * 3600 * 1000);
}

// for (var i = 1; i < 100; i++) {
//     addData();
// }

option = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value'
    },
    series: [
        {
            name:'成交',
            type:'line',
            smooth:true,
            symbol: 'none',
            stack: 'a',
            areaStyle: {
                normal: {}
            },
            data: data
        }
    ]
};

setInterval(function () {
    count = count + 1
    myChart.setOption(option)
    addData(true);
    myChart.setOption({
        xAxis: {
            data: date
        },
        series: [{
            name:'成交',
            data: data
        }]
    });
}, 1500);



 
}