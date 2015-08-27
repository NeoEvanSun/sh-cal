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
        $scope.curSumFee = 0;
        var splitProductObj = rootService.splitProducts($scope.products);
        /*最小量大于1,必须出现的*/
        var shouldProducts = splitProductObj.shouldProducts;
        /*必须参与计算*/
        var mustProducts = splitProductObj.mustProducts;
        /*可选计算指标*/
        var choiceProducts = splitProductObj.choiceProducts;
        /*首次执行先行运算*/
        var executeResults = splitProductObj.executeResults;
        var sumFee = $scope.sumFee;
        var firstFee = 0;
        executeResults.forEach(function(element,index,array){
            firstFee += element.sumFee;
        });
        if(sumFee > splitProductObj.allMaxFee){
            alert("输入的单品量不足以完成额度!");
            return;
        }
        sumFee -= firstFee;
        var presentFee = 0;
        if(sumFee <= 0) {
            alert("指标量与总成本冲突");
        }else{
            var keepExecute = true;
            while(keepExecute) {
                var canProduct = shouldProducts.concat(choiceProducts);
                var objIndex = rootService.getRandom(0, canProduct.length);
                var obj = canProduct[objIndex];
                /*随机数量*/
                var objCount = rootService.getRandom(obj.productMin, obj.productMax);
                var has = false;
                for (var i = 0; i < executeResults.length; i++) {
                    if (executeResults[i].productName == obj.productName) {
                        has = true;
                        executeResults[i].count += objCount;
                        executeResults[i].count = executeResults[i].count > executeResults[i].productMax ? executeResults[i].productMax : executeResults[i].count;
                        executeResults[i].sumFee = executeResults[i].count * executeResults[i].productPrice;
                    }
                }
                if (!has) {
                    var result = {};
                    result.productName = obj.productName;
                    result.count = objCount;
                    result.productPrice = obj.productPrice;
                    result.max = obj.productMax;
                    result.min = obj.productMin;
                    result.sumFee = result.count * result.productPrice;
                    result.maxFee = result.max * result.productPrice;
                    executeResults.push(result);
                }

                executeResults.forEach(function (ele, index, array) {
                    presentFee += ele.sumFee;
                });

                keepExecute = sumFee - presentFee <= 0 ? false : true ;
            }
            $scope.executeResults = executeResults;
            console.log(executeResults);
            $scope.curSumFee = presentFee ;
            if(Math.abs($scope.curSumFee - $scope.sumFee) > parseInt($scope.sumFee*10/10000)){
                $scope.executeResult();
            }else{
                console.log("不行");
            }
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
       },

       splitProducts : function (products){
           var shouldProducts = [];
           var mustProducts = [];
           var choiceProducts = [];
           var executeResults = [];
           var allMaxFee = 0;
           for(var i=0;i<products.length;i++){
               if(products[i].productMin == products[i].productMax){
                   mustProducts.push(products[i]);
               }else if(products[i].productMin >= 1){
                   shouldProducts.push(products[i])
               }else if(products[i].productMin == 0){
                   choiceProducts.push(products[i]);
               }

               if(products[i].productMin >= 1){
                   var result = {};
                   result.productName = products[i].productName;
                   result.count = products[i].productMin;
                   result.productPrice = products[i].productPrice;
                   result.max = products[i].productMax;
                   result.min = products[i].productMin;
                   result.sumFee = result.count * result.productPrice;
                   result.maxFee = result.max * result.productPrice;
                   executeResults.push(result);
               }

               allMaxFee += products[i].productPrice * products[i].productMax;
           }
           var theReturn = {
               shouldProducts:shouldProducts,
               mustProducts:mustProducts,
               choiceProducts:choiceProducts,
               executeResults:executeResults,
               allMaxFee:allMaxFee
           }
           console.log(theReturn);
           return theReturn;
       }
   }
   return service;
});