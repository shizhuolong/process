package org.apdplat.portal.common.action;



import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.common.bean.FileDocumentBean;
import org.apdplat.portal.common.service.FileDocumentService;
import org.springframework.beans.factory.annotation.Autowired;

public class FileDocumentAction  extends BaseAction {
	private static final long serialVersionUID = -5783603501252556889L;
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private FileDocumentService fileDocumentService;
	
	private FileDocumentBean fileDocumentBean;
	private String fileId;
	private String foreignId;
	
	/**删除附件**/
	public void doDelete() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if(StringUtils.isBlank(fileId)) {
				throw new BusiException("附件ID不能为空！");
			}
			fileDocumentService.delete(fileId);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("删除成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(), e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(), e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}
		this.reponseJson(resultInfo);
	}
	
	
	public void qryFileMsgList() {
		
		try{
			List<FileDocumentBean> list = fileDocumentService.qryFileMsgList(foreignId);
			this.reponseJson(list);
		}catch(Exception e) {
			logger.error(e.getMessage(), e);
		}
	}


	public FileDocumentBean getFileDocumentBean() {
		return fileDocumentBean;
	}
	public void setFileDocumentBean(FileDocumentBean fileDocumentBean) {
		this.fileDocumentBean = fileDocumentBean;
	}


	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public void setForeignId(String foreignId) {
		this.foreignId = foreignId;
	}
	
}
