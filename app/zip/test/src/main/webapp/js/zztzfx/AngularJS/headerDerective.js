/**
 * Created by tuyadi on 2016/8/17.
 */
var headerDirective = angular.module('headerDirective', []);

headerDirective.directive('headerChecked',function($document,hrefFactory,locals){
        return{
            scope: false,
            restrict: 'AE',
            link: function (scope, element, attr) {
            	$document.ready(function(){
            		var obj={};
            		if(locals.getObject("href").currentName){
            			obj=locals.getObject("href");
            		}
            		else{
            			locals.setObject("href",hrefFactory);
            			obj=hrefFactory;
            		}
            		element.children("li").each(function(){
            			if($(this).attr("id")==obj.currentName){
            				$(this).addClass("active");
            				$(this).siblings("li").removeClass("active");
            			}
            		})
            	});
            }
        }
});

headerDirective.directive('headerClicked',function(locals,tableDetail,pieDetail,storyDetail){
    return{
        scope: false,
        restrict: 'AE',
        link: function (scope, element, attr) {
        	element.on("click",function(){
        		pieDetail.pieDetail = null;
        		storyDetail.storyDetail = null;
        		tableDetail.tableDetail = null;
        		var obj={
        				"currentName":element.attr("id")
        		}
        		locals.setObject("href",obj);
        		element.addClass("active");
        		element.siblings("li").removeClass("active");
        	})
        }
    }
});


//本地存储数据===================================
headerDirective.factory('locals',['$window',function($window){
    return{
        //存储单个属性
        set :function(key,value){
            $window.localStorage[key]=value;
        },
        //读取单个属性
        get:function(key,defaultValue){
            return  $window.localStorage[key] || defaultValue;
        },
        //存储对象，以JSON格式存储
        setObject:function(key,value){
            $window.localStorage[key]=JSON.stringify(value);
        },
        //读取对象
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);

headerDirective.factory('hrefFactory',function(){
    return{
        "currentName":"menu_myTable"
    }
});