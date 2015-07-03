package org.apdplat.portal.common.dao;

import java.sql.SQLException;
import java.util.List;

import org.apdplat.portal.common.bean.FileDocumentBean;

public interface FileDocumentDao {
	
	public void insert(FileDocumentBean fileDocumentBean) throws SQLException;
	
	public List<FileDocumentBean> qryFileMsgList(String foreignId) throws SQLException;
	
	public void delete(String id) throws SQLException;
	
	
}
