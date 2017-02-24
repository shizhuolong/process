package org.apdplat.portal.subsidyInput.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.apache.struts2.ServletActionContext;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.subsidyInput.dao.SubsidyInputDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubsidyInputServiceTask {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private SubsidyInputDao dao;
	@Autowired
	private TaskService taskService;
	
	@Transactional(rollbackFor=Exception.class)
	public void complete(DelegateExecution delegateExecution) throws Exception {
		try{
			String workNo = delegateExecution.getProcessBusinessKey();
			Map<String,String> params=new HashMap<String,String>();
			params.put("workNo", workNo);
			params.put("status", "6");
			dao.updateStatus(params);
			//taskService.complete(taskId);
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
			String workNo = delegateExecution.getProcessBusinessKey();
			Map<String,String> params=new HashMap<String,String>();
			params.put("workNo", workNo);
			dao.deleteResultByWorkNo(params);
			List<Map<String,String>> filesPath=dao.findFilesByWorkNo(params);
			if(filesPath!=null&&!filesPath.isEmpty()){
				for(int i=0;i<filesPath.size();i++){
					deleteFile(path+filesPath.get(i).get("filePath"));
				}
				dao.deleteFilesByWorkNo(params);
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
