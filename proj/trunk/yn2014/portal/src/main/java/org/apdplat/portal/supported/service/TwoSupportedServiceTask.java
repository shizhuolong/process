package org.apdplat.portal.supported.service;

import java.util.HashMap;
import java.util.Map;

import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.supported.dao.TwoSupportedDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TwoSupportedServiceTask {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private TwoSupportedDao dao;
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
}
