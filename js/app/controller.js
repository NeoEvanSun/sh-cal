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
        var maxCount = 0;
        var minCount = 0;
        var sumFee=$scope.sumFee;

        var startArray = [];
        $scope.products.forEach(function(ele,index,array) {
            maxCount += ele.productPrice * ele.productMax;
            minCount += ele.productPrice * ele.productMin;
            if (ele.productMin > 0) {
                var obj = {};
                obj.count = ele.productMin;
                obj.productPrice = ele.productPrice;
                obj.productMax = ele.productMax;
                obj.productName = ele.productName;
                startArray.push(obj);
            }
        });
        console.log("the max ["+maxCount+"] the min ["+minCount+"]");
        if(sumFee>=minCount&&sumFee<=maxCount){
            console.log("in area");
            var flag = true;
            var feenow = 0;
            while(flag){
                var ranIndex = rootService.getRandom(0,$scope.products.length);
                console.log("random index for items ["+ranIndex+"]");
                var ranItem = $scope.products[ranIndex];
                var itemExsits = false;

                feenow = 0;
                startArray.forEach(function(ele,index,array){
                    feenow+=(ele.productPrice*ele.count);
                });

                for(var i=0 ;i<startArray.length;i++){
                    var aryItem = startArray[i];
                    if(aryItem.productName == ranItem.productName){
                        itemExsits = true;
                        var theRealMax = rootService.getMax(aryItem,sumFee);
                        console.log("the product is ["+aryItem.productName+"] realMax ["+theRealMax+"] theMax ["+aryItem.productMax+"]");
                        (theRealMax > aryItem.productMax) && (theRealMax=aryItem.productMax);
                        var plusCount = rootService.getRandom(0,parseInt((sumFee-feenow)/aryItem.productPrice));
                        console.log("random add count is ["+plusCount+"]");
                        if(plusCount<0){
                            flag=false;
                            console.log("error ["+parseInt((sumFee-feenow)/aryItem.productPrice)+"] feenow ["+feenow+"]");
                        }
                        if(feenow+startArray[i].productPrice*plusCount>sumFee){
                            console.log("out side! cancel");
                        }else{
                            startArray[i].count+=plusCount;
                        }
                        break;
                    }
                }

                if(!itemExsits){
                    var obj = {};
                    obj.count = rootService.getRandom(0,ranItem.productMax<5?ranItem.productMax:5);
                    obj.productPrice = ranItem.productPrice;
                    obj.productMax = ranItem.max;
                    obj.productName = ranItem.name;
                    if(feenow+obj.productPrice*obj.count>sumFee){
                        console.log("out side! cancel add");
                    }else{
                        startArray.push(obj);
                    }
                }

                feenow=0;
                startArray.forEach(function(ele,index,array){
                    feenow+=(ele.productPrice*ele.count);
                });

                if(sumFee-feenow<=rootService.getMinPrice($scope.products)*5){
                    flag=false;
                    $scope.curSumFee=feenow;
                    console.log("the final fee is ["+feenow+"]");
                }else{
                    console.log("fee is ["+feenow+"]");
                }
            }
            console.log(startArray);
            startArray.forEach(function(ele,index,array){
                ele.sumFee= ele.productPrice*ele.count;
            });
            $scope.executeResults = startArray;
        }else{
            console.log(sumFee+"不在计算区间内");
        }
    };

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
