package org.apdplat.portal.contract.service;

import java.io.File;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.apache.struts2.ServletActionContext;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.contract.dao.ContractProcessDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContractProcessServiceTask {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ContractProcessDao dao;
	@Autowired
	private TaskService taskService;
	
	@Transactional(rollbackFor=Exception.class)
	public void complete(DelegateExecution delegateExecution) throws Exception {
	
		try{
			String businessKey = delegateExecution.getProcessBusinessKey();
			Map<String,String> params=new HashMap<String,String>();
			params.put("businessKey", businessKey);
			params.put("status", "2");
			dao.updateStatus(params);
			logger.debug("流程结束！");
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("结束失败！！！");
		}
	}
	
	@Transactional(rollbackFor=Exception.class)
	public void cancel(DelegateExecution delegateExecution) throws Exception {
		try{
			String path=ServletActionContext.getServletContext().getRealPath("/");
			String businessKey = delegateExecution.getProcessBusinessKey();
			Map<String,String> params=new HashMap<String,String>();
			params.put("businessKey", businessKey);
			dao.delResultByKey(params);
			List<Map<String,Object>> filesPath=dao.queryFiles(businessKey);
			if(filesPath!=null&&!filesPath.isEmpty()){
				for(int i=0;i<filesPath.size();i++){
					deleteFile(path+filesPath.get(i).get("filePath").toString());
				}
				dao.deleteFilesByKey(businessKey);
			}
			logger.debug("流程作废！");
		}catch(Exception e){
			logger.error(e.getMessage(), e);
			throw new BusiException("结束失败！！！");
		}
	}
	
	public void deleteFile(String filePath) {
		try{
			//删除服务器上的文件
			File f=new File(filePath);
			if(f.exists()){
				f.delete();
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
    }
}
