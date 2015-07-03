package org.apdplat.portal.common.service;


import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.bean.OperaterLogs;
import org.apdplat.portal.common.dao.OperaterLogsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**  
 * @author : suyi
 * @date 2014-5-14 下午07:55:35
 * @version V1.0  
 */
@Service
public class OperaterLogsService {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private OperaterLogsDao operaterLogsDao;
		
		// 保存日志
		@Transactional
		public void  insertLogs(OperaterLogs data) {
				logger.info("保存操作日志");
				operaterLogsDao.insertLogs(data);
		}
		
}
