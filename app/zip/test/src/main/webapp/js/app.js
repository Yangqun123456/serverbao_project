/**
 * Created by tuyadi on 2016/6/21.
 */
var isSessionFalse = true;
var ctx = function() {
    var path = window.location.href;
    var pathName = window.location.pathname;
    var hostPath = path.substring(0, path.indexOf(pathName))
    var projectName = pathName.substring(0, pathName.substring(1).indexOf('/') + 1);
    return (hostPath + projectName);
}
var routerApp = angular.module('routerApp', ['ui.router','headerDirective','zztzApp','myDataSource','ngDialog','ui.colorpicker','myDataModel','myDataModelAdd','myDataModelDetail']);

routerApp.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
routerApp.factory('httpInterceptor', [ '$q', '$injector',function($q, $injector) {
	  var httpInterceptor = { 
		      'response' : function(response) { 
		    	  if(JSON.stringify(response.data).indexOf("isLogonHtmlFlag")>0){
		    		  if(isSessionFalse){
//		    			  alert("会话超时，请重新登陆！");
			        	  window.location.href=ctx()+"/logon.html";
		    		  }
		    		  isSessionFalse = false;
		    	  }
		        return response; 
		      } 
		    }  
	return httpInterceptor; 
	}]);

routerApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider, $urlRouterProvider,$httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor'); 
	$urlRouterProvider.otherwise('/zztzfx/myTable');
    $stateProvider
	    .state('api',{
	        url: '/api',
	        templateUrl: 'html/api.html'
	
	    })
        .state('zztzfx',{
            url: '/zztzfx',
            templateUrl: 'html/zztzfxApp.html'

        })
        .state('zztzfx.workPanel',{
            url: '/workPanel',
            templateUrl: 'html/workPanel.html'

        })
        .state('zztzfx.myTable',{
            url: '/myTable',
            templateUrl: 'html/myTable.html'

        })
        .state('zztzfx.myPie',{
            url: '/myPie',
            templateUrl: 'html/myPie.html'

        })
        .state('zztzfx.myStory',{
        	url: '/myStory',
        	templateUrl: 'html/myStory.html'
        		
        })
        .state('zztzfx.myDataSource',{
            url: '/myDataSource',
            templateUrl: 'html/myDataSource.html'

        })
        .state('zztzfx.myDataSourceDetail',{
            url: '/myDataSourceDetail',
            templateUrl: 'html/myDataSourceDetail.html'

        })
        .state('zztzfx.myDataSource_Service',{
            url: '/myDataSource_Service',
            templateUrl: 'html/myDataSource_Service.html'

        })
        .state('zztzfx.LeadPage',{
            url: '/LeadPage',
            templateUrl: 'html/LeadPage.html'

        })
        .state("zztzfx.myDataModel",{
            url:"/myDataModel",
            templateUrl:'html/myDataModel.html'
        })
        .state("zztzfx.myDataModelAdd",{
            url:"/myDataModelAdd",
            templateUrl:'html/myDataModelAdd.html'
        })
        .state("zztzfx.myDataModelDetail",{
            url:'/myDataModelDetail/:cubeId/:cubeNameCn',
            templateUrl:'html/myDataModelDetail.html'
        })





        
}]);
