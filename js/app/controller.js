app.controller("rootController",['$scope','$modal','$log',function($scope,$modal,$log){

}]);


app.controller("resultController",['$scope','$rootScope',function($scope,$rootScope){
    $scope.products = $rootScope.products ;
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

});
