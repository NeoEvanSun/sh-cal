app.controller("rootController",['$scope','$modal','$log','$rootScope',"$timeout",function($scope,$modal,$log,$rootScope,$timeout){
    $scope.step = $rootScope.step || 1;
    $rootScope.products = [{productName:'单品1',productPrice:12,productMax:40,productMin:1},
        {productName:'单品2',productPrice:17,productMax:60000,productMin:60},
        {productName:'单品3',productPrice:26,productMax:70000,productMin:1}];
    $scope.product = $rootScope.products;
    $scope.productNames = [];
    $scope.productPirces = [];
}]);


app.controller("resultController",['$scope','$rootScope','rootService',function($scope,$rootScope,rootService){
    $scope.products = $rootScope.products || [];
    $scope.sumFee = $rootScope.sumCount ;

    $scope.executeResults = [];
    $scope.executeArray = $rootScope.executeArray || [];

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
        }else if(executeResults.length>0){
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
            $scope.curSumFee = presentFee ;
            if(Math.abs($scope.curSumFee - $scope.sumFee) > parseInt($scope.sumFee*10/1000)){
                $scope.executeResult();
            }else{
                console.log("不行");
            }
        }
    }

    $scope.executeSerTimes = function(){
        $scope.executeArray = [];
        for(var i =0 ;i <3; i++){
            $scope.executeResult();
            $scope.executeArray.push({executeResults:$scope.executeResults,curSumFee:$scope.curSumFee});
        }
        $rootScope.executeArray = $rootScope.executeArray;
    }

    $scope.turnActive = function ($index){
        angular.element($event.target).addClass("col_active")
    }
}]);

app.controller("productListController",function($scope,$modal,$log,$rootScope){
    $scope.productList =  $scope.products = $rootScope.products ? $rootScope.products :[];
    $scope.open = function(size){
        var modalInstance = $modal.open({
            animation:true,
            templateUrl:'views/product.html',
            controller:'productEditController',
            size:size,
            windowClass:'productEdit'
        });

        modalInstance.result.then(function(product){
            $scope.productList.push(product);
            $rootScope.products = $scope.productList;
        },function(){
            $log.info("modal dismissed at : "+new Date());
        })
    }
    $scope.deleteProduct = function (index){
        $scope.productList.splice(index,1);
        $rootScope.products = $scope.productList;
    }

    $scope.productList.length ==0 && $scope.open();
});

app.controller("productEditController",function($scope,$modalInstance){

    $scope.addProduct = function (){
        if($scope.product_form.$valid){
            var product = {};
            product.productName = $scope.productName;
            product.productPrice = $scope.productPrice;
            product.productMax = $scope.productMax;
            product.productMin = $scope.productMin;
            $modalInstance.close(product);
        }else{
            $scope.product_form.$dirty=true;
            console.log("验证不通过")
        }
    };

    $scope.cancel = function(){
        $modalInstance.dismiss("cancel");
    }

});

app.controller("sumCountController",function($scope,$rootScope){
    $scope.sumCount = $rootScope.sumCount || 0;
    $scope.$watch('sumCount',function(newValue,oldValue){
        $rootScope.sumCount = newValue;
    })
});
