package org.apdplat.taskManagement.inspection.action;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Calendar;
import java.util.Date;
import java.text.SimpleDateFormat;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.struts2.ServletActionContext;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.taskManagement.inspection.bean.InspectionBean;
import org.apdplat.taskManagement.inspection.service.ChanlInspectionService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 渠道巡检
 * @author wcyong
 *
 */
@SuppressWarnings("serial")
public class ChanlInspectionAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Autowired
	private ChanlInspectionService chanlInspectionService;
	private Map<String, String> resultMap;
	
	/**
	 * 渠道巡检界面
	 * @return
	 */
	public String index() {
		Map<String,String> usermap = new HashMap<String,String>();
		
		User user = UserHolder.getCurrentLoginUser();
		String userid  =user.getId().toString();
		usermap.put("userid", userid);
		
		Calendar ca=Calendar.getInstance();
		String month=new SimpleDateFormat("yyyyMM").format(ca.getTime());
		usermap.put("month", month);
		
		request.setAttribute("isManager", chanlInspectionService.ismanager(usermap));
		
		return SUCCESS;
	}
	
	
	/**
	 * 查询日常巡检人
	 */
	public void queryRcPerson(){
		try {
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			
			String realName = request.getParameter("realName");
			String userName = request.getParameter("userName");
			String phone = request.getParameter("phone");
			//日常巡检只能营服中心负责人下发，所以用户的code就是营服ID
			String unitId = org.getCode();
			String month = new SimpleDateFormat("yyyyMM").format(new Date());
			
			if(realName!=null && !"".equals(realName.trim())){
				resultMap.put("realName", "%"+realName+"%");
			}
			if(userName!=null && !"".equals(userName.trim())){
				resultMap.put("userName", userName);
			}
			if(phone!=null && !"".equals(phone.trim())){
				resultMap.put("phone", phone);
			}
			if(month!=null && !"".equals(month.trim())){
				resultMap.put("month", month);
			}
			resultMap.put("unitId", unitId);
			Object result = chanlInspectionService.queryRcPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询日常巡检人员信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询日常巡检人员信息失败\"}");
		}
	}
	
	/**
	 * 查询日常巡检渠道
	 */
	public void queryRcChanl(){
		try{
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			String unitId = org.getCode();
			resultMap.put("unitId", unitId);
	       
			String userId = request.getParameter("userId");
			resultMap.put("userId", userId);
			
			String month =  new SimpleDateFormat("yyyyMM").format(new Date());
			resultMap.put("month", month);
			
			String hqChanlName = request.getParameter("hqChanlName");
			String hqChanlCode = request.getParameter("hqChanlCode");
			
			if(hqChanlName != null && !"".equals(hqChanlName.trim())) {
				resultMap.put("hqChanlName", "%"+hqChanlName+"%");
			}
			if(hqChanlCode != null && !"".equals(hqChanlCode.trim())) {
				resultMap.put("hqChanlCode", hqChanlCode);
			}
			
			Object result = chanlInspectionService.queryRcChanl(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询日常巡检渠道信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询日常巡检渠道信息失败\"}");
		}
	}
	
	/**
	 * 查询巡检列表信息
	 */
	public void list() {
		try{
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			
			String inspec_name = request.getParameter("inspec_name");
			String creator = request.getParameter("creator");
			String startTime = request.getParameter("startTime");
			String endTime = request.getParameter("endTime");
			String inspec_type = request.getParameter("inspec_type");
			resultMap.put("code", org.getCode());
			resultMap.put("orgLevel", org.getOrgLevel());
			if(inspec_name != null && !"".equals(inspec_name.trim())) {
				resultMap.put("inspec_name", "%"+inspec_name+"%");
			}
			if(creator != null && !"".equals(creator.trim())) {
				resultMap.put("creator", "%"+creator+"%");
			}
			if(startTime != null && !"".equals(startTime.trim())) {
				resultMap.put("startTime", startTime);
			}
			if(endTime != null && !"".equals(endTime.trim())) {
				resultMap.put("endTime", endTime);
			}
			if(inspec_type != null && !"".equals(inspec_type.trim())) {
				resultMap.put("inspec_type", inspec_type);
			}
			Object result = chanlInspectionService.list(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询渠道巡检列表信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询渠道巡检列表信息失败\"}");
		}
	}

	/**
	 * 添加日常巡检界面
	 * @return
	 */
	public String addRCInspection() {
		return "addRCInspection";
	}
	
	/**
	 * 添加活动巡检界面
	 * @return
	 */
	public String addHDInspection() {
		return "addHDInspection";
	}
	/**
	 * 添加信息收集界面
	 * @return
	 */
	public String addXXInspection() {
		return "addXXInspection";
	}
	/**
	 * 查询活动巡检人员
	 * @return
	 */
	public void queryHdPerson() {
		try{
			User user = UserHolder.getCurrentLoginUser();
			Org org = user.getOrg();
			
			String realName = request.getParameter("realName");
			String userName = request.getParameter("userName");
			String phone = request.getParameter("phone");
			if(realName != null && !"".equals(realName.trim())) {
				resultMap.put("realName", "%"+realName+"%");
			}
			if(userName != null && !"".equals(userName.trim())) {
				resultMap.put("userName", userName);
			}
			if(phone != null && !"".equals(phone.trim())) {
				resultMap.put("phone", phone);
			}
			resultMap.put("code", org.getCode());
			resultMap.put("orgLevel", org.getOrgLevel());
			Object result = chanlInspectionService.queryHdPerson(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询活动巡检人员信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询活动巡检人员信息失败\"}");
		}
	}
	
	/**
	 * 查询活动巡检渠道
	 */
	public void queryHdChanl() {
		try{
	        String hqChanlName = request.getParameter("hqChanlName");
			String hqChanlCode = request.getParameter("hqChanlCode");
			if(hqChanlName != null && !"".equals(hqChanlName.trim())) {
				resultMap.put("hqChanlName", "%"+hqChanlName+"%");
			}
			if(hqChanlCode != null && !"".equals(hqChanlCode.trim())) {
				resultMap.put("hqChanlCode", hqChanlCode);
			}
			Object result = chanlInspectionService.queryHdChanl(resultMap);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询活动巡检渠道信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询活动巡检渠道信息失败\"}");
		}
	}
	
	/**
	 * 添加活动巡检
	 */
	public void saveHdInspection() {
		ResultInfo resultInfo = new ResultInfo();
		try {
			String taskInfoJsonStr = request.getParameter("taskInfoJsonStr");
			List<InspectionBean> list = JsonStrToList(taskInfoJsonStr);
			chanlInspectionService.saveHdInspection(list);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("操作成功！");
		} catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("操作失败！");
		}
		this.reponseJson(resultInfo);
	}
	/**
	 * 添加信息收集
	 */
	public void saveXXInspection() {
		ResultInfo resultInfo = new ResultInfo();
		try {
			String taskInfoJsonStr = request.getParameter("taskInfoJsonStr");
			List<InspectionBean> list = JsonStrToList(taskInfoJsonStr);
			chanlInspectionService.saveHdInspection(list);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("操作成功！");
		} catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("操作失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	/**
	 * 删除活动巡检
	 */
	public void delHdInspection() {
		ResultInfo resultInfo = new ResultInfo();
		try {
			String id = request.getParameter("id");
			chanlInspectionService.delHdInspection(id);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("删除成功！");
		} catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("删除失败！");
		}
		this.reponseJson(resultInfo);
	}

	private List<InspectionBean> JsonStrToList(String taskInfoJsonStr) throws IllegalAccessException,
			InvocationTargetException, BusiException {
		List<InspectionBean> list = new ArrayList<InspectionBean>();
		try {
			Pattern pat = Pattern.compile("\\s*|\n|\r|\t");
			Matcher mat = pat.matcher(taskInfoJsonStr);
			taskInfoJsonStr = mat.replaceAll("");
			JSONObject jsonObject = JSONObject.fromObject(taskInfoJsonStr);
			
			JSONArray taskJsonArray = (JSONArray) jsonObject.get("taskInfo");
			Iterator<JSONObject> it = taskJsonArray.iterator();
			while (it.hasNext()) {
				JSONObject object = (JSONObject) it.next();
				
				InspectionBean bean = new InspectionBean();
				BeanUtils.copyProperties(bean,object);
				list.add(bean);
			}
		} catch (Exception e) {
			throw new BusiException("类型转换异常！" + e.getMessage());
		}
		return list;
	}
	
	/**
	 * 修改活动巡检
	 */
	public String updateHdInspection() {
		String id = request.getParameter("id");
		ServletActionContext.getContext().put("inspec_id", id);
		return "updateHdInspection";
	}
	/**
	 * 修改信息采集
	 */
	public String updateXXInspection() {
		String id = request.getParameter("id");
		ServletActionContext.getContext().put("inspec_id", id);
		return "updateXXInspection";
	}
	/**
	 * 修改日常巡检
	 * @return
	 */
	public String updateRcInspection(){
		String id = request.getParameter("id");
		ServletActionContext.getContext().put("inspec_id", id);
		return "updateRcInspection";
	}
	
	/**
	 * 通过巡检任务id查询渠道
	 */
	public void queryInspectionChanl() {
		try{
	        String inspec_id = request.getParameter("inspec_id");
			Object result = chanlInspectionService.queryInspectionChanl(inspec_id);
			this.reponseJson(result);
		} catch (Exception e) {
			logger.error("查询已经添加的巡检活动渠道信息失败",e);
			outJsonPlainString(response,"{\"msg\":\"查询已经添加的巡检活动渠道信息失败\"}");
		}
	}
	
	/**
	 * 修改活动巡检
	 */
	public void updateHdInspec() {
		ResultInfo resultInfo = new ResultInfo();
		try {
			String inspec_id = request.getParameter("inspec_id");
			String taskInfoJsonStr = request.getParameter("taskInfoJsonStr");
			List<InspectionBean> list = JsonStrToList(taskInfoJsonStr);
			chanlInspectionService.updateHdInspec(list,inspec_id);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("操作成功！");
		} catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("操作失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	
	
	public String showInspecInfo() {
		String id = request.getParameter("id");
		ServletActionContext.getContext().put("inspec_id", id);
		return "showInspecInfo";
	}
	
	public Map<String, String> getResultMap() {
		return resultMap;
	}

	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

}
