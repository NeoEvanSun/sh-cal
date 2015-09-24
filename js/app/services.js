angular.module('cal').factory("rootService",function(){
    var service={
        getRandom : function (min, max){
            return parseInt(Math.random()*(max-min)+min);
        },

        getMinPrice: function (items){
            var minPrice;
            items.forEach(function(ele,index,array){
                (index==0 )&& (minPrice=ele.productPrice);
                (minPrice > ele.productPrice )&& (minPrice = ele.productPrice);
            });
            return minPrice;
        },

        getMax : function (product,sumFee){
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
            return theReturn;
        }
    }
    return service;
}).factory("dataService",function(){
    var service = {
        getData : function(){
            try{
                var dataStr = fs.readFileSync('../caldata.dll','utf-8');
                if($.trim(dataStr)==""){
                    return null;
                }else {
                    console.log(dataStr);
                    console.log(JSON.parse(dataStr));
                    return JSON.parse(dataStr);
                }
            }catch(e){
                console.log(e);
                return null;
            }

        },
        saveData : function(obj){
            console.log(obj);
            fs.writeFile('../caldata.dll',JSON.stringify(obj),function(err) {
                if(err){
                    alert(err);
                }else{
                    console.log("ok");
                }
            })
        }
    }
    return service;
});

