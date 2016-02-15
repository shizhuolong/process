package com.ynunicom.sso.service;

import java.io.UnsupportedEncodingException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.ynunicom.sso.AppConstant;
import com.ynunicom.sso.dto.PendingEntity;
import com.ynunicom.sso.dto.ReadingEntity;

/*
 * 待办待阅工具类
 *lyz
 * */
@Service
public class SsoTaskService {

	
	/**
	 * 待办任务添加
	 * */
	public String addPending(List<PendingEntity> emtitylist ){
		
	    	
	    	PendingEntity[] pendings = emtitylist.toArray(new PendingEntity[0]);
	    	Gson gson = new Gson();
	    	String content = gson.toJson(pendings);
	    	String method = "addpending";
	    	return appUrl(method, content);
	  
	}
	
	
	/**
	 * 待办任务状态更新
	 * */
	public String updatePendingStatus(List<PendingEntity> emtitylist ){
		
		PendingEntity[] pendings = emtitylist.toArray(new PendingEntity[0]);
    	Gson gson = new Gson();
    	String content = gson.toJson(pendings);
    	String method = "updatependingstatus";
    	return appUrl(method, content);
	}
	
	/**
	 * 待办任务标题更新
	 * */
	public String updatePendingTitle(List<PendingEntity> emtitylist ){
		
		PendingEntity[] pendings = emtitylist.toArray(new PendingEntity[0]);
    	Gson gson = new Gson();
    	String content = gson.toJson(pendings);
    	String method = "updatependingtitle";
    	return appUrl(method, content);
	}
	
	/**
	 *  待办转派
	 * */
	 public String pendingtaskforward(List<PendingEntity> emtitylist){
		 
			PendingEntity[] pendings = emtitylist.toArray(new PendingEntity[0]);
	    	Gson gson = new Gson();
	    	String content = gson.toJson(pendings);
	    	String method = "taskforward";
	    	return appUrl(method, content);
	 }
	
	/**
	 * 待阅添加
	 * */
	public String addReading(List<ReadingEntity> readlist ){
		
		ReadingEntity[] pendings = readlist.toArray(new ReadingEntity[0]);
    	Gson gson = new Gson();
    	String content = gson.toJson(pendings);
    	String method = "addreading";
    	return appUrl(method, content);
	}
	
	/**
	 * 待阅状态更新
	 * */
	public String upateStatusFromEIP(List<ReadingEntity> readlist ){
		
		ReadingEntity[] pendings = readlist.toArray(new ReadingEntity[0]);
    	Gson gson = new Gson();
    	String content = gson.toJson(pendings);
    	String method = "updatereadingstatus";
    	return appUrl(method, content);
	}
	
	
	
	/**
	 * 得到请求服务地址
	 * */
	 public String getBaseUrl(){
		 
		 //连续三次请求服务
		 for(int i=0;i<3;i++){
			 
				try {
					  String namingServiceUrl =AppConstant.namingServiceUrl;
					  return HttpRequestUtil.sendRequest(namingServiceUrl, "GET", "application/json", "");
				} catch (Exception e) {
					System.out.println("&&&&&&&&&&&&&&----getBaseUrl----&&&&&&&&&&&&&&&");
					e.printStackTrace();
					System.out.println("&&&&&&&&&&&&&&----getBaseUrl----&&&&&&&&&&&&&&&&");
					continue;
				} 
		 }
		 
		 return "";
				
	 }
	 
	 
	 public String  appUrl(String methodName,String content){
		 
		
    	String taskServiceUrl = getBaseUrl();
    	String appId = AppConstant.appId;//"na009";
    	String authToken = AppConstant.authToken;
	    	
	    String url = taskServiceUrl + "/" + methodName + "/" + appId + "/" + authToken;
	    
	    System.out.println("taskService:--appUrl-------------"+url);
	    
		 //连续三次请求服务
		 for(int i=0;i<3;i++){
		 
			 try {
				 return getResultMessage(HttpRequestUtil.sendRequest(url, "POST", "application/json",content));
			 } catch (Exception e) {
				 System.out.println("***************---appUrl---****************");
				 e.printStackTrace();
				 System.out.println(e.getMessage());
				 System.out.println("***************---appUrl---****************");
				 continue;
			 }
		 }
		 
		 return "";
	 }
	 
	 
	 /**
	  * 得到错误信息
	  * */
	 public String getResultMessage(String result){
		 Gson gson = new Gson();
		 if (result != null)
	    	{
	    	    Map<String,String> map = gson.fromJson(result, new TypeToken<Map<String,String>>(){}.getType());
	    	    Iterator<String> it = map.keySet().iterator();
	    	    while(it.hasNext())
	    	    {
	    	    	String pendingCode = it.next();
	    	    	String isSuccess = map.get(pendingCode);
	    	    	try {
						result = new String(isSuccess.getBytes(), "UTF-8");
					} catch (UnsupportedEncodingException e) {
						System.out.println("------------------getResultMessage--------------------");
						e.printStackTrace();
						System.out.println("--------------------------getResultMessage-----------------------------");
					}
	    	    	System.out.println("返回代码=="+result);
	    	    }
	    	    
	    	    return AppConstant.getGTaskError(result);
	    	}
		 
		 
		 return "";
	 }
}
