package org.apdplat.taskManagement.saleSchudle.bean;

import java.util.List;

/**
 * @author suyi
 * @date 2015年3月24日
 */
public class TaskRegionBean {
	
	private String id;
	private String dateType;
	private String dateDesc;
	private String regionCode;
	private String regionName;
	private String taskCode;
	private String parentTaskId;
	private String status;
	private String isValid;
	private String createrRegion;
	private String creater;
	private String createTime;
	private String modifier;
	private String modifyTime;
	private String dateValue;
	private String isNew;
	private String regionType;
	private String workNo;
	private List<TaskRegionDetailBean> taskDetailList;
	private int rejectTaskNum;
	private String userType;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDateType() {
		return dateType;
	}
	public void setDateType(String dateType) {
		this.dateType = dateType;
	}
	public String getDateDesc() {
		return dateDesc;
	}
	public void setDateDesc(String dateDesc) {
		this.dateDesc = dateDesc;
	}
	public String getRegionCode() {
		return regionCode;
	}
	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}
	public String getRegionName() {
		return regionName;
	}
	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}
	public String getTaskCode() {
		return taskCode;
	}
	public void setTaskCode(String taskCode) {
		this.taskCode = taskCode;
	}
	public String getParentTaskId() {
		return parentTaskId;
	}
	public void setParentTaskId(String parentTaskId) {
		this.parentTaskId = parentTaskId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getIsValid() {
		return isValid;
	}
	public void setIsValid(String isValid) {
		this.isValid = isValid;
	}
	public String getCreaterRegion() {
		return createrRegion;
	}
	public void setCreaterRegion(String createrRegion) {
		this.createrRegion = createrRegion;
	}
	public String getCreater() {
		return creater;
	}
	public void setCreater(String creater) {
		this.creater = creater;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getModifier() {
		return modifier;
	}
	public void setModifier(String modifier) {
		this.modifier = modifier;
	}
	public String getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(String modifyTime) {
		this.modifyTime = modifyTime;
	}
	public String getDateValue() {
		return dateValue;
	}
	public void setDateValue(String dateValue) {
		this.dateValue = dateValue;
	}
	public String getIsNew() {
		return isNew;
	}
	public void setIsNew(String isNew) {
		this.isNew = isNew;
	}
	
	public String getRegionType() {
		return regionType;
	}
	public void setRegionType(String regionType) {
		this.regionType = regionType;
	}
	
	public String getWorkNo() {
		return workNo;
	}
	public void setWorkNo(String workNo) {
		this.workNo = workNo;
	}
	public List<TaskRegionDetailBean> getTaskDetailList() {
		return taskDetailList;
	}
	public void setTaskDetailList(List<TaskRegionDetailBean> taskDetailList) {
		this.taskDetailList = taskDetailList;
	}
	public int getRejectTaskNum() {
		return rejectTaskNum;
	}
	public void setRejectTaskNum(int rejectTaskNum) {
		this.rejectTaskNum = rejectTaskNum;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}

}
