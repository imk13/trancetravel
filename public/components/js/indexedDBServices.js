/**
 * IndexedDB management , services
 * inventory in & out management system on local DB
 * critical services , code with care :)
 * @author : MK
 **/
'use strict';
define(['app'] ,function (app) {
//	angular.module('hyperLocalApp')
	//var app = angular.module("tranceTravel");
	console.log(app);
	app.factory('indexedDBService', ['$rootScope', '$window', '$q', function($rootScope, $window, $q){
		var idbSupport = this;
		if("indexedDB" in window) {
	        idbSupport.flag = true;
			var indexedDB = $window.indexedDB || $window.mozIndexedDB || $window.msIndexedDB;
			idbSupport.widb = indexedDB;
		}
	//	console.log("idbflag : " + idbSupport.flag);
		
		function ceateIdbRecord (dbObjectStore, data, index) {
			var thisObj = {};
			thisObj.idbk = index;
			angular.extend(thisObj, data);
			// console.log(thisObj);
			var requestPut = dbObjectStore.put(thisObj);
			return requestPut;
		}


		if(idbSupport.flag){
			idbSupport.db=null;
			idbSupport.recordList = [];
			idbSupport.dbName = "hyperLocalDB";

			idbSupport.makeObjectList = function (recordList) {
				idbSupport.recordList = recordList;
			};

			idbSupport.getObjectList = function () {
				return idbSupport.recordList;
			};

			idbSupport.getStoreObjectList = function () {
				var listTable = [];
				for(var idxTable in idbSupport.recordList) {
					listTable.push(idbSupport.recordList[idxTable].iname);
				}
				return listTable;
			}
			
			idbSupport.open = function(){
				idbSupport.idbVersion = 1;
				idbSupport.defaultsIndex = 0;
				var deferred = $q.defer();
				var request = indexedDB.open(idbSupport.dbName, idbSupport.idbVersion);
				var recordList = idbSupport.getObjectList();

				request.onupgradeneeded = function(e) {
					console.log(e);
					idbSupport.idbVersion += 1;
					idbSupport.db = e.target.result;
					e.target.transaction.onerror = indexedDB.onerror;
					for(var idx in recordList){
						var record = recordList[idx];
						console.log(record);
						if(idbSupport.db.objectStoreNames.contains(record.iname)) {
							console.log("deleting existing record " , record.iname)
					  		idbSupport.db.deleteObjectStore(record.iname);
						}
					}
					for(var idx in recordList) {
						var record = recordList[idx];
						console.log(record);
						var store = idbSupport.db.createObjectStore(record.iname,{keyPath:"idbk"});
						store.createIndex('idbk','idbk', {unique:true});
						store.createIndex('sync','sync', {unique:false});
						
						for(var idxkey in record.ikeys){
							console.log(record.ikeys[idxkey])
							if(true) {
								store.createIndex(record.ikeys[idxkey],record.ikeys[idxkey], {unique:false});
							}
						}
					}
				};
				
				request.onsuccess = function(e) {
					idbSupport.db = e.target.result;
					console.log(idbSupport.db);
				//	db.setVersion(idbSupport.idbVersion);
					console.log(idbSupport.idbVersion , "IndexDB CONNECTION open");
					deferred.resolve(idbSupport.db);
				};

				request.onerror = function(e){
					console.log("Error",e.target.error.name);
					deferred.reject("unable to open IndexDB CONNECTION");
				};

				return deferred.promise;
			};

			idbSupport.checkIdbInstance = function () {
				return idbSupport.db;
			}

			idbSupport.dropDatabase = function(idbName) {
			    var delIdbRequest = indexedDB.deleteDatabase(idbName);
			    delIdbRequest.onsuccess = function() { console.log("idb Deleted"); };
			    delIdbRequest.onerror = function() { console.log("idb Deletion error"); };
			};

			idbSupport.getObjectStoreTrx = function (record, mode) {
			//	console.log(record);
			    var tx = idbSupport.db.transaction([record], mode);
			    return [tx.objectStore(record), tx];
			};

			idbSupport.getIndexCount = function (record) {
				var deferred = $q.defer();
				if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}else{
			  		var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readonly");
			  		var dbObjectStore = dbObjectStoreTrx[0];
				//	console.log(dbObjectStore);
					var request = dbObjectStore.count();
					console.log(request);
					request.onsuccess = function (e) {
						var count = e.target.result;
						deferred.resolve(count);
					}
					request.onerror = function (error) {
						console.log(error.value);
						deferred.reject("unable to count objects in " + record);
					}
			  	}
			  	return deferred.promise;
			};

			idbSupport.updateObjectCount = function () {
				var recordList = idbSupport.getStoreObjectList();
				for(var rIdx in recordList) {
					idbSupport.getIndexCount(recordList[rIdx]);
				}
			};

			idbSupport.addToMultipleRecord = function(record , dataArr, recordIndex){
				var deferred = $q.defer();
			//	console.log(record,data);
				if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}
			  	else{
			  		console.log(record , recordIndex , idbSupport[recordIndex]);
					var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readwrite");
					var dbObjectStore = dbObjectStoreTrx[0];
					var objCount = dbObjectStore.count();
					//console.log(objCount);
					var request = {}, dataIndex = 0;
					
					dbObjectStoreTrx[1].oncomplete = function (event) {
			            console.log("idb trx completed on " + record ,  event);
			            deferred.resolve(idbSupport[recordIndex]);
				    };

				    dbObjectStoreTrx[1].onerror = function (error) {
				       	console.log("TrxError: ", error);
				       	console.info(error.target.error);
						deferred.reject("Todo item couldn't be added!");
				    };


					objCount.onsuccess = function  (e) {
						console.log("objCount success");
						idbSupport[recordIndex] = (e.target.result + 1);
						function putNext() {
							if(dataIndex < dataArr.length) {
								console.log("calling putNext" , idbSupport[recordIndex] , dataArr[dataIndex])
								request = ceateIdbRecord (dbObjectStore, dataArr[dataIndex], idbSupport[recordIndex]);
								++dataIndex;
								++idbSupport[recordIndex];
								// console.log(request);
								request.onsuccess = function (e) {
									//console.log(e , dataArr[dataIndex] , idbSupport[recordIndex]);
									putNext();
								};

								request.onerror = function(e) {
									console.error(e , dataArr[dataIndex] , idbSupport[recordIndex]);
									putNext();
									//deferred.reject("Todo item couldn't be added!");
								};
							}
							return;
						}

						putNext();
					};

					objCount.onerror = function (error) {
						console.log(error);
						deferred.reject("Todo item couldn't be added!");
					};						
			  	}
			  	return deferred.promise;
			};

			idbSupport.addToRecord = function(record , data){
				var deferred = $q.defer();
			//	console.log(record,data);
				if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}
			  	else{
					var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readwrite");
					var dbObjectStore = dbObjectStoreTrx[0];
					var objCount = dbObjectStore.count();
					//console.log(objCount);
					var request = {};
					
					switch(record){
						case 'defaults' : objCount.onsuccess = function  (e) {
											idbSupport.defaultsIndex = (e.target.result + 1);
											request = ceateIdbRecord (dbObjectStore, data, idbSupport.defaultsIndex);
											// console.log(request);
											request.onsuccess = function(e) {
												deferred.resolve(objCount.result);
											};
											request.onerror = function(e) {
												console.log(e.value);
												deferred.reject("Todo item couldn't be added!");
											};
										}
										objCount.onerror = function (error) {
											console.log(error);
										}
										break;
						default : 	console.log("invalid IndexDB StoreObject !!!");
									break;

					}
			  	}
			  	return deferred.promise;
			};

			idbSupport.getToRecordData = function(record, key, keyValue,type){
			  	var deferred = $q.defer();
			   
			  	if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}
			  	else{
			  		var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readonly");
			  		var dbObjectStore = dbObjectStoreTrx[0];
			  		var objectIndex;
			  		if(type === 'bound2'){
			  			objectIndex = dbObjectStore.index(key.split("~"));
			  		}else {
			  			objectIndex = dbObjectStore.index(key);
			  		}
			    	var dataList = [];
			   
			    	// Get everything in the store;
			    	var keyRange;
			    	switch(type) {
			    		case 'none' : 	keyRange = IDBKeyRange.lowerBound(0);
			    						break;
			    		case 'only' : 		keyRange = IDBKeyRange.only(keyValue[0]);
			    						break;
			    		case 'lowerBound' : 	keyRange = IDBKeyRange.lowerBound(keyValue[0]);
			    						break;
			    		case 'upperBound' : 	keyRange = IDBKeyRange.upperBound(keyValue[0]);
			    						break;
			    		case 'bound' : 		keyRange = IDBKeyRange.bound(keyValue[0], keyValue[1]);
			    						break;
			    		case 'bound2' : var keyValue2 = keyValue.split('~');
			    						keyRange = IDBKeyRange.bound(keyValue2);
			    						break;				
			    		default : 		console.log("invalid keyrange type");
			    						break;
			    	}
			    	var cursorRequest = objectIndex.openCursor(keyRange);
			    	var lastIndex = -1;
			    	cursorRequest.onsuccess = function(e) {
			      		var result = e.target.result;
			      	//	console.log(result);
			      		if(result === null || result === undefined)	{
			        		deferred.resolve(dataList);
			      		}
			      		else{
			        			dataList.push(result.value);
			        			if(result.value.idbk > lastIndex){
			          				lastIndex=result.value.idbk;
			        			}
			        		result.continue();
			      		}
			    	};

			    	cursorRequest.onerror = function(e){
			      		console.log(e.value);
			      		deferred.reject("Something went wrong!!!");
			    	};
			    }
				return deferred.promise;
			};

			idbSupport.getToRecord = function(record, key, keyValue){
				var deferred = $q.defer();
				console.log(record , keyValue);
			  	if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}
			  	else{
			  		var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readonly");
			  		var dbObjectStore = dbObjectStoreTrx[0];
			  		var objectIndex = dbObjectStore.index(key);
			  		var itemRequest = objectIndex.get((keyValue));
			  	//	console.log(itemRequest);
			  		itemRequest.onsuccess = function(e) {
			  			console.log(e.target.result);
			  			var item = e.target.result;
			  		//	console.log(itemResult);
			  			deferred.resolve(item);
			  		};

			  		itemRequest.onerror = function(e) {
			  			console.log(e);
			  			deferred.reject("could not fetch item!!!");
			  		};
			  	}
			//  	console.log(deferred);
			  	return deferred.promise;
			};

			idbSupport.getAllWords = function (text) {
		        var allWordsIncludingDups = text.split(/[_,\s,-]+/);
		        var wordSet = allWordsIncludingDups.reduce(function (prev, current) {
		            prev[current] = true;
		            return prev;
		        }, {});
		        return Object.keys(wordSet);
		    };



			idbSupport.deleteToRecord = function(record , key, keyValue){
				var deferred = $q.defer();
			   
				if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}
			  	else{
					//var trans = db.transaction([record], "readwrite");
					//var store = trans.objectStore(record);
					var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readwrite");
					var dbObjectStore = dbObjectStoreTrx[0];
					var objectIndex = dbObjectStore.index(key);
					
					switch(record){
						case 'defaults'  : idbSupport.defaultsIndex--;
										var request = objectIndex.delete(keyValue);
										break;			
						default : 	console.log("invalid IndexDB StoreObject !!!");
									break;

					}
					request.onsuccess = function(e) {
						deferred.resolve();
					};
					request.onerror = function(e) {
						console.log(e.value);
						deferred.reject("Todo item couldn't be deleted!");
					};
			  	}
			  	return deferred.promise;
			};

			idbSupport.deleteToMultipleRecord = function(record , key, keyValue){
				var deferred = $q.defer();
			   
				if(idbSupport.db === null){
			    	deferred.reject("IndexDB is not opened yet!");
			  	}
			  	else{
					//var trans = db.transaction([record], "readwrite");
					//var store = trans.objectStore(record);
					var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record, "readwrite");
					var dbObjectStore = dbObjectStoreTrx[0];
					var objectIndex = dbObjectStore.index(key);
					var delCursorRequest = objectIndex.openCursor(IDBKeyRange.only(keyValue));
					console.log(delCursorRequest);
					var request;
					switch(record){
						case 'defaults' : delCursorRequest.onsuccess = function (e) {
											var delCursorObj = e.target.result;
											if(delCursorObj){
												idbSupport.defaultsIndex--;
												request = dbObjectStore.delete(delCursorObj.primaryKey);
    											delCursorObj.continue;
											}
											deferred.resolve(delCursorObj);
										};
										delCursorRequest.onerror = function (e) {
											console.log(e.value);
											deferred.reject("Todo item couldn't be deleted!");
										};

										break;
						default : 	console.log("invalid IndexDB StoreObject !!!");
									break;
					}
			  	}
			  	return deferred.promise;
			};

			idbSupport.clearObjectStore = function (record) {
			    var dbObjectStoreTrx = idbSupport.getObjectStoreTrx(record , 'readwrite');
			    var dbObjectStore = dbObjectStoreTrx[0];
			    var request = dbObjectStore.clear();
			    request.onsuccess = function(evt) {
			      console.log("Store cleared");
			    };
			    request.onerror = function (evt) {
			      console.error("clearObjectStore:", evt.target.errorCode);
			    };
			};

			idbSupport.clearAllObjectStore = function () {
				var recordArr = idbSupport.getStoreObjectList();
				for(var idx in recordArr){
					idbSupport.clearObjectStore(recordArr[idx]);
				}
			};

			idbSupport.closeDB = function () {
				console.info("idb close()");
				idbSupport.db.close();
			};
		}
		return idbSupport;
	}]);

});