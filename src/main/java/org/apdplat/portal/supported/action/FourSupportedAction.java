package org.apdplat.portal.supported.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.supported.service.FourSupportedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 系统支撑3G补贴审批
 * @author shizl
 *
 */
@SuppressWarnings("serial")
@Controller
@Namespace("/fourSupported")
@Scope("prototype")
@Results({
	@Result(name="index", location="/portal/supported/jsp/import_fourSupported_list.jsp")
})
public class FourSupportedAction extends BaseAction{
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	
	@Autowired
	private FourSupportedService fourSupportedService;
	private Map<String, String> resultMap=new HashMap<String,String>();
	private File[] myFile;
	private String myFileFileName;
    
	public String index() {
		return "index";
	}
	
	/**
	 * 列表
	 */
	public void list() {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String code = org.getCode();
			String username=user.getUsername();
			resultMap.put("code", code);
			resultMap.put("orgLevel", org.getOrgLevel());
			resultMap.put("username", username);
			Object result = fourSupportedService.list(resultMap);
			this.reponseJson(result);
	}
	
	public void queryTotalFee() {
		User user = UserHolder.getCurrentLoginUser();
		Org org = user.getOrg();
		String username=user.getUsername();
		String code = org.getCode();
		resultMap.put("code", code);
		resultMap.put("orgLevel", org.getOrgLevel());
		resultMap.put("username", username);
		double result = fourSupportedService.queryTotalFee(resultMap);
		this.reponseJson(result);
   }
	
	public void queryTotalFeeByInitId() {
		String workNo=request.getParameter("workNo");
		if(workNo != null && !"".equals(workNo.trim())) {
			resultMap.put("workNo", workNo);
		}
		double result = fourSupportedService.queryTotalFeeByInitId(resultMap);
		this.reponseJson(result);
   }
	
	/**
	 * 提交审批 
	 */
	public void doSubmitTask() {
		ResultInfo info = new ResultInfo();
		try {
			String theme = request.getParameter("theme");
			String nextDealer = request.getParameter("nextDealer");
			if(StringUtils.isBlank(theme)) {
				throw new BusiException("工单主题不能为空！");
			}
			if(StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			Map<String, String> map = new HashMap<String, String>();
			map.put("title", theme);
			map.put("nextDealer", nextDealer);
			fourSupportedService.doSendOrder(map);
			info.setCode(ResultInfo._CODE_OK_);
		} catch (BusiException e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg(e.getMessage());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			info.setCode(ResultInfo._CODE_FAIL_);
			info.setMsg("工单提交审批失败！");
		}
		this.reponseJson(info);
	}
	
	//通过工单编号查询列表,只读界面
	public void listByWorkNo() {
		try {
			String businessKey = request.getParameter("businessKey");
			if(businessKey == null || "".equals(businessKey)) {
				throw new BusiException("工单编号不空，查询数据失败！");
			}
			
			resultMap.put("businessKey", businessKey);
			Object result = fourSupportedService.listByWorkNo(resultMap);
			this.reponseJson(result);
		} catch(BusiException e) {
			logger.error(e.getMessage(), e);
			outJsonPlainString(response,"{\"msg\":\""+e.getMessage()+"\"}");
		}catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.error("查询数据失败！",e);
			outJsonPlainString(response,"{\"msg\":\"查询数据失败\"}");
		}
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	public File[] getMyFile() {
		return myFile;
	}

	public void setMyFile(File[] myFile) {
		this.myFile = myFile;
	}

	public String getMyFileFileName() {
		return myFileFileName;
	}

	public void setMyFileFileName(String myFileFileName) {
		this.myFileFileName = myFileFileName;
	}
	
	
}
