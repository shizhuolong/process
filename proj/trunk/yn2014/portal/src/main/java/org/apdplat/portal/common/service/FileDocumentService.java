package org.apdplat.portal.common.service;

import java.sql.SQLException;
import java.util.List;

import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.portal.common.bean.FileDocumentBean;
import org.apdplat.portal.common.dao.FileDocumentDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FileDocumentService {
	
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private FileDocumentDao fileDocumentDao;
	
	public void insert(FileDocumentBean fileDocumentBean) throws BusiException{
		
		try{
			fileDocumentDao.insert(fileDocumentBean);
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("新增附件信息失败！");
		}
	}
	
	@Transactional
	public void addFileMsgBatch(List<FileDocumentBean> fileDocumentBeanList) throws BusiException {
		
		try{
			for(FileDocumentBean fileDocumentBean:fileDocumentBeanList) {
				fileDocumentDao.insert(fileDocumentBean);
			}
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("新增附件信息失败！");
		}
	}
	
	public List<FileDocumentBean> qryFileMsgList(String foreignId) throws BusiException {
		
		try{
			return fileDocumentDao.qryFileMsgList(foreignId);
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("查询附件信息失败！");
		}
	}
	
	public void delete(String id) throws BusiException {
		
		try{
			fileDocumentDao.delete(id);
		}catch(SQLException e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("删除附件信息失败！");
		}
	}

}
