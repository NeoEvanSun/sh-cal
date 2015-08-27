var app = angular.module("app",[]);
app.controller("rootController",['$scope','rootService',function ($scope,rootService){
    //$scope.products = [];
    $scope.products = [{productName:'单品1',productPrice:12,productMax:40,productMin:1},
                        {productName:'单品2',productPrice:17,productMax:60,productMin:60},
                        {productName:'单品3',productPrice:26,productMax:70,productMin:1}];
    $scope.sumFee;
    $scope.curSumFee=0;

    $scope.addProduct = function (){
        var product = {};
        product.productName = $scope.productName;
        product.productPrice = $scope.productPrice;
        product.productMax = $scope.productMax;
        product.productMin = $scope.productMin;
        $scope.products.push(product);
    }

    $scope.executeResults = [];

    $scope.executeResult = function (){
        $scope.executeResults = [];
        var sumFee = $scope.sumFee;
        var keepFlag = true;
        while(keepFlag){
            /*随机确定单品下标*/
            var productIndex = rootService.getRandom(0,$scope.products.length);
            /*取出单品*/
            var product = $scope.products[productIndex];
            /*获取当前单品最大数量*/
            var max = rootService.getMaxNum(product,sumFee);
            /*获取随机数量起始值*/
            var start = product.productMin > max ? max : product.productMin;
            /*获取随机数量终止值*/
            var end = product.productMax > max ? max : product.productMax;
            /*获取随机单品数*/
            var random = rootService.getRandom(start,end);
            var result = {};
            result.productName = product.productName;
            result.count = parseInt(random/$scope.products.length);
            result.max = max;
            result.sumFee = product.productPrice * random;
            result.productPrice =product.productPrice;

            var resultSumFee = 0;
            var has = false;
            for(var i= 0,len =$scope.executeResults.length;i<len;i++){
                if($scope.executeResults[i].productName == result.productName){
                    $scope.executeResults[i].count += result.count;
                    $scope.executeResults[i].count = $scope.executeResults[i].count > max ? max :$scope.executeResults[i].count;
                    $scope.executeResults[i].sumFee = $scope.executeResults[i].productPrice * $scope.executeResults[i].count;
                    has = true;
                }
            }
            if(!has){
                $scope.executeResults.push(result);
            }

            $scope.executeResults.forEach(function(element,index,array){
                resultSumFee += element.sumFee;
                console.log(element);
            });
            keepFlag = resultSumFee - sumFee >= 0 ? false :true;
        }
        $scope.curSumFee=resultSumFee;
        alert(parseInt($scope.sumFee/20));
        if(Math.abs($scope.curSumFee - $scope.sumFee) > parseInt($scope.sumFee/100)){
            $scope.executeResult();
        }
    }
}]);

app.factory("rootService",function(){
   var service={
       getRandom : function (min, max){
           return Math.floor(min+Math.random()*(max-min));
       },

       getMaxNum : function (product,sumFee){
           var result = parseInt(sumFee/product.productPrice);
           return result;
       }
   }
   return service;
});