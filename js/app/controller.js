app.controller("rootController",['$scope',function($scope){

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