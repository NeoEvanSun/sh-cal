app.controller("rootController",['$scope','$modal','$log',function($scope,$modal,$log){
    $scope.open = function(size){
        var modalInstance = $modal.open({
            animation:true,
            templateUrl:'views/myModal.html',
            controller:'ModalInstanceCtrl',
            size:size,
            resolve:{
                items:function(){
                    return [1,2,3,4];
                }
            }
        });

        modalInstance.result.then(function(selectedItem){
            $scope.selected = selectedItem;
        },function(){
            $log.info("modal dismissed at : "+new Date());
        })
    }
}]);

app.controller("productController",['$scope','$rootScope',function($scope,$rootScope){
    $scope.products = $rootScope.products ? $rootScope.products :[];

    $scope.addProduct = function (){
        var product = {};
        product.productName = $scope.productName;
        product.productPrice = $scope.productPrice;
        product.productMax = $scope.productMax;
        product.productMin = $scope.productMin;
        $scope.products.push(product);
    }

    $rootScope.products = $scope.products;
}]);


app.controller("resultController",['$scope','$rootScope',function($scope,$rootScope){
    $scope.products = $rootScope.products ;
}]);

app.controller("ModalInstanceCtrl",function($scope, $modalInstance, items){
    $scope.items = items;
    $scope.selected ={
        item:$scope.items[0]
    }
    $scope.ok = function (){
        $modalInstance.close($scope.selected.item);
    };
    $scope.cancel = function(){
        $modalInstance.dismiss("cancel");
    }
});