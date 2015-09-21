var app = angular.module('cal');
app.directive('searchChart',function(){
   return {
       restrict:'EA',
       template:'<div style="min-width: 310px; max-width: 600px; height: 400px; margin: 0 auto;"></div>',
       scope:{
            topTitle:"=",
            myVal:"="
       },
       link:function($scope, $element, $attrs){
           console.log($scope.myVal);
           $scope.$watch("myVal",function(newVal,oldVal){
               console.log(newVal);
               $scope.draw();
           });

           $scope.draw = function (){
               $($element).highcharts({
                   chart: {
                       type: 'bar'
                   },
                   title: {
                       text: '商品总额支出预算计算器'
                   },
                   subtitle: {
                       text: 'Source: <a>'+$scope.topTitle+'</a>'
                   },
                   xAxis: {
                       categories: $scope.myVal,
                       title: {
                           text: null
                       }
                   },
                   yAxis: {
                       min: 0,
                       title: {
                           text: 'Population (millions)',
                           align: 'high'
                       },
                       labels: {
                           overflow: 'justify'
                       }
                   },
                   tooltip: {
                       valueSuffix: ' millions'
                   },
                   plotOptions: {
                       bar: {
                           dataLabels: {
                               enabled: true
                           }
                       }
                   },
                   legend: {
                       layout: 'vertical',
                       align: 'right',
                       verticalAlign: 'top',
                       x: -40,
                       y: 80,
                       floating: true,
                       borderWidth: 1,
                       backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                       shadow: true
                   },
                   credits: {
                       enabled: false
                   },
                   series: [{
                       name: '单价',
                       data: [107, 31, 635, 203, 2]
                   }, {
                       name: '数量',
                       data: [133, 156, 947, 408, 6]
                   }, {
                       name: '占用额度',
                       data: [1052, 954, 4250, 740, 38]
                   }]
               });
           }

       }
   }
});
