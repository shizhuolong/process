package org.apdplat.taskManagement.saleSchudle.action;

import java.io.File;
import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.util.ResultInfo;
import org.apdplat.portal.common.Constant;
import org.apdplat.portal.common.bean.FileDocumentBean;
import org.apdplat.portal.common.service.CommonParamService;
import org.apdplat.portal.common.service.FileDocumentService;
import org.apdplat.portal.common.util.JsonUtils;
import org.apdplat.portal.common.util.UUIDGeneratorUtils;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionBean;
import org.apdplat.taskManagement.saleSchudle.service.SaleScheduleService;
import org.springframework.beans.factory.annotation.Autowired;

public class SaleScheduleAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private static final long serialVersionUID = -6012349865607532232L;
	
	@Autowired
	private SaleScheduleService saleScheduleService;
	@Autowired
	private FileDocumentService fileDocumentService;
	@Autowired
	private CommonParamService commonParamService;
	@Resource
	DataSource dataSource;
	
	private String saleType;
	private String sumTaskInfoJsonStr;	//任务汇总json串
	private String taskInfoJsonStr;		//下级地域分解json串
	private String title;
	private String nextDealer;
	private String workNo;
	private String parentTaskId;
	private Map<String, String> resultMap;
	private String taskId;
	private String status;
	private String taskCode;
	private File[] myFile;//附件
    private String[] myFileFileName;
    private String userFlag; //chnlManager:渠道经理
	
	public String index() {
		return "list";
	}
	
	/**
	 * 进入添加排产任务界面
	 */
	public String addSaleScheduleInput() {
		return "saleschedule_add";
	}
	
	//新增排产任务
	public void addTask() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			
			if(StringUtils.isBlank(title)) {
				throw new BusiException("请填写工单主题！");
			}
			if(StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			
			List<TaskRegionBean> sumList = JsonUtils.jsonInfo2TaskRegionBeanList(sumTaskInfoJsonStr);
			List<TaskRegionBean> detailList = JsonUtils.jsonInfo2TaskRegionBeanList(taskInfoJsonStr);
			if(sumList.size() != 1) {
				throw new BusiException("总任务值有误，保存失败！");
			}
			
			String seqId = commonParamService.getId();
			SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
			String time = format.format(new Date());
			String businessKey = "YN-"+time+seqId; //工单编号
			doUploadFiles(businessKey);
			
			saleScheduleService.addTask(sumList.get(0), detailList,title,nextDealer,businessKey);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("发送成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("发送失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	//拟稿人修改任务
	public void editTask() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if(StringUtils.isBlank(workNo)) {
				throw new BusiException("工单编号不能为空！");
			}
			doUploadFiles(workNo);
			
			List<TaskRegionBean> sumList = JsonUtils.jsonInfo2TaskRegionBeanList(sumTaskInfoJsonStr);
			List<TaskRegionBean> detailList = JsonUtils.jsonInfo2TaskRegionBeanList(taskInfoJsonStr);
			if(sumList.size() != 1) {
				throw new BusiException("总任务值有误，保存失败！");
			}
			
			saleScheduleService.editTask(sumList.get(0), detailList);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("修改成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("修改失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	//拟稿人修改任务
	public void editRejectTask() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if(StringUtils.isBlank(title)) {
				throw new BusiException("请填写工单主题！");
			}
			if(StringUtils.isBlank(nextDealer)) {
				throw new BusiException("请选择下一步审批人！");
			}
			
			List<TaskRegionBean> sumList = JsonUtils.jsonInfo2TaskRegionBeanList(sumTaskInfoJsonStr);
			List<TaskRegionBean> detailList = JsonUtils.jsonInfo2TaskRegionBeanList(taskInfoJsonStr);
			if(sumList.size() != 1) {
				throw new BusiException("总任务值有误，保存失败！");
			}
			saleScheduleService.editRejectTask(sumList.get(0),detailList, title, nextDealer);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("发送成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("发送失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	//查询总任务信息
	public void qrySumTaskData() {
		
		try{
			TaskRegionBean taskRegionBean = saleScheduleService.qrySumTaskInfoByWorkNo(workNo);
			this.reponseJson(taskRegionBean);
		}catch(BusiException e){
			logger.error(e.getMessage(),e);
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
		}
	}
	
	//查询下级地域分解任务信息
	public void qrySubordinateTaskData() {
		
		try{
			List<TaskRegionBean> list = saleScheduleService.qrySubordinateTaskInfoByParentTaskId(parentTaskId, workNo);
			this.reponseJson(list);
		}catch(BusiException e){
			logger.error(e.getMessage(),e);
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
		}
	}
	
	//查询总任务信息
	public void qryTaskById() {
		
		try{
			TaskRegionBean taskRegionBean = saleScheduleService.qryTaskById(taskId);
			this.reponseJson(taskRegionBean);
		}catch(BusiException e){
			logger.error(e.getMessage(),e);
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
		}
	}
	
	
	public void queryMyTaskList() {
		
		try{
			User user = UserHolder.getCurrentLoginUser();
			String orgCode = user.getOrg().getCode();
			if("chnlManager".equals(userFlag)) {
				resultMap.put("regionCode", user.getId().toString());
			}else {
				resultMap.put("regionCode", orgCode);
			}
			Object result = saleScheduleService.queryMyTaskList(resultMap);
			this.reponseJson(result);
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			outJsonPlainString(response,"{\"msg\":\"加载数据失败！\"}");
		}
	}
	
	//查询下级地域已拒绝的任务
	public void qryRejectTaskByParentTaskId() {
		
		try{
			List<TaskRegionBean> list = saleScheduleService.qryRejectTaskByParentTaskId(parentTaskId);
			this.reponseJson(list);
		}catch(BusiException e){
			logger.error(e.getMessage(),e);
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
		}
	}
	
	
	public void updateTaskStatusById() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			if(StringUtils.isBlank(taskId)) {
				throw new BusiException("任务ID不能为空！");
			}
			if(StringUtils.isBlank(status)) {
				throw new BusiException("任务状态不能为空！");
			}
			saleScheduleService.updateTaskRegionStatusById(status, taskId);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("操作成功！");
		}catch(BusiException e) {
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
			logger.error(e.getMessage(),e);
		}catch(Exception e) {
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("操作失败！");
			logger.error(e.getMessage(),e);
		}
		this.reponseJson(resultInfo);
	}
	
	/**
	 * 作废排产任务
	 * 级联将下级所有任务作废（先将数据移入历史表然后再删除）
	 * 如果下级存在审批中的任务则不然作废
	 */
	public void doCancelTask() {
		
		ResultInfo resultInfo = new ResultInfo();
		try{
			saleScheduleService.cancelTask(parentTaskId);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			resultInfo.setMsg("操作成功！");
		}catch(BusiException e) {
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
			logger.error(e.getMessage(),e);
		}catch(Exception e) {
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("操作失败！");
			logger.error(e.getMessage(),e);
		}
		this.reponseJson(resultInfo);
	}
	
	/**
	 * 营服中心任务分解
	 * 营服中心分解任务成功后，当前营服中心的状态更新为6，即已下发，下级的渠道经理状态更新为2
	 */
	public void saveChanlManagerTask() {
		ResultInfo resultInfo = new ResultInfo();
		try{
			List<TaskRegionBean> detailList = JsonUtils.jsonInfo2TaskRegionBeanList(taskInfoJsonStr);
			saleScheduleService.addChanlManagerTask(taskId,taskCode,detailList);
			resultInfo.setCode(ResultInfo._CODE_OK_);
			Connection conn =null;
			CallableStatement stmt=null;
			//调用存储过程
			conn = dataSource.getConnection();
			stmt = conn.prepareCall("{CALL PORTAL.PRC_PORTAL_TASK_DETAIL(?,?)}");
			String dateValue=request.getParameter("dateValue");
			stmt.setString(1,dateValue);
			stmt.registerOutParameter(2,java.sql.Types.DECIMAL);
			stmt.executeUpdate();
			conn.close();
			stmt.close();
			resultInfo.setMsg("操作成功！");
		}catch(BusiException e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg(e.getMessage());
		}catch(Exception e) {
			logger.error(e.getMessage(),e);
			resultInfo.setCode(ResultInfo._CODE_FAIL_);
			resultInfo.setMsg("任务分解失败！");
		}
		this.reponseJson(resultInfo);
	}
	
	
	/**上传附件**/
	private void doUploadFiles(String workNo) throws BusiException {
		
		User user = UserHolder.getCurrentLoginUser();
		try {
			if(myFile!=null&&myFile.length!=0){
				String filepath = "";
				List<FileDocumentBean> fileDocumentBeanList = new ArrayList<FileDocumentBean>();
				for(int i=0;i<myFile.length;i++){
					if(myFile[i] != null) {
						String FILE_ID = UUIDGeneratorUtils.getUUID();
						String saveFileName = FILE_ID+"_"+myFileFileName[i];
						File imageFile = new File(ServletActionContext.getServletContext().getRealPath("/upload/taskManagement") + "/" + saveFileName);
						filepath = "/upload/taskManagement/"+saveFileName;
						FileUtils.copyFile(myFile[i], imageFile);
						FileDocumentBean fileDocumentBean = new FileDocumentBean();
						fileDocumentBean.setId(UUIDGeneratorUtils.getUUID());
						fileDocumentBean.setFilePath(filepath);
						fileDocumentBean.setForeignId(workNo);
						fileDocumentBean.setNewFileName(myFileFileName[i]);
						fileDocumentBean.setOldFileName(myFileFileName[i]);
						fileDocumentBean.setIsValid("1");
						fileDocumentBean.setCreator(user.getUsername());
						fileDocumentBeanList.add(fileDocumentBean);
					}
				}	
				fileDocumentService.addFileMsgBatch(fileDocumentBeanList);
			}
		}catch (IOException e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("附件上传失败！");
		}catch(Exception e) {
			logger.error(e.getMessage(), e);
			throw new BusiException("附件上传失败！");
		}
	}
	
	//追踪分析报表
	public void qrySaleScheduleReport() {
		
		try{
			
			Org org = UserHolder.getCurrentLoginUser().getOrg();
			String orgLevel = org.getOrgLevel();
			String orgCode = org.getCode();
			resultMap.put("orgLevel", orgLevel);
			resultMap.put("regionCode", orgCode);
			
			String selectColumn = "";
			if(StringUtils.isNotBlank(resultMap.get("parentRegionCode"))) {
				String regionType = resultMap.get("regionType");
				if("1".equals(regionType)) {
					selectColumn = "GROUP_ID_1_NAME regionName,GROUP_ID_1 regionCode,'2' regionType,TASK_CODE taskCode,";
				}else if("2".equals(regionType)){
					selectColumn = "UNIT_NAME regionName,UNIT_ID regionCode,'3' regionType,TASK_CODE taskCode,";
				}else if("3".equals(regionType)){
					//selectColumn = "FATHER_ID_4_NAME regionName,FATHER_ID_4 regionCode,'10' regionType,";
					selectColumn = "ORG_NAME regionName,ORG_ID regionCode,'10' regionType,TASK_CODE taskCode,";
				}else if("10".equals(regionType)){
					selectColumn = "ORG_NAME regionName,ORG_ID regionCode,'4' regionType,TASK_CODE taskCode,";
				}
			}else {
				if(Constant.PROVINCE_LEVEL.equals(orgLevel)) {
					selectColumn = "GROUP_ID_0_NAME regionName,GROUP_ID_0 regionCode,'1' regionType,'' AS taskCode,";
				}else if(Constant.REGION_LEVEL.equals(orgLevel)){
					selectColumn = "GROUP_ID_1_NAME regionName,GROUP_ID_1 regionCode,'2' regionType,TASK_CODE taskCode,";
				}else if(Constant.CITY_LEVEL.equals(orgLevel)){
					selectColumn = "UNIT_NAME regionName,UNIT_ID regionCode,'3' regionType,TASK_CODE taskCode,";
				}else if(Constant.DEPART_LEVEL.equals(orgLevel)){
					selectColumn = "ORG_NAME regionName,ORG_ID regionCode,'4' regionType,TASK_CODE taskCode,";
				}
			}
			resultMap.put("selectColumn", selectColumn);
			
			Object result = saleScheduleService.qrySaleScheculeReport(resultMap);
			this.reponseJson(result);
		}catch(Exception e){
			logger.error(e.getMessage(),e);
			outJsonPlainString(response,"{\"msg\":\"加载数据失败！\"}");
		}
	}

	public String getSaleType() {
		return saleType;
	}

	public void setSaleType(String saleType) {
		this.saleType = saleType;
	}

	public void setSumTaskInfoJsonStr(String sumTaskInfoJsonStr) {
		this.sumTaskInfoJsonStr = sumTaskInfoJsonStr;
	}

	public void setTaskInfoJsonStr(String taskInfoJsonStr) {
		this.taskInfoJsonStr = taskInfoJsonStr;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setNextDealer(String nextDealer) {
		this.nextDealer = nextDealer;
	}

	public String getWorkNo() {
		return workNo;
	}
	public void setWorkNo(String workNo) {
		this.workNo = workNo;
	}

	public void setParentTaskId(String parentTaskId) {
		this.parentTaskId = parentTaskId;
	}

	public Map<String, String> getResultMap() {
		return resultMap;
	}
	public void setResultMap(Map<String, String> resultMap) {
		this.resultMap = resultMap;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTaskCode() {
		return taskCode;
	}

	public void setTaskCode(String taskCode) {
		this.taskCode = taskCode;
	}

	public File[] getMyFile() {
		return myFile;
	}

	public void setMyFile(File[] myFile) {
		this.myFile = myFile;
	}

	public String[] getMyFileFileName() {
		return myFileFileName;
	}

	public void setMyFileFileName(String[] myFileFileName) {
		this.myFileFileName = myFileFileName;
	}

	public void setUserFlag(String userFlag) {
		this.userFlag = userFlag;
	}
	
	
}
