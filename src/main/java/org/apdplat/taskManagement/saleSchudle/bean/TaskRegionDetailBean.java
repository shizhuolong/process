package org.apdplat.taskManagement.saleSchudle.bean;

/**
 * @author suyi
 * @date 2015年3月24日
 */
public class TaskRegionDetailBean {

	private String id;
	private String targetId;
	private String targetValue;
	private String creater;
	private String createTime;
	private String modifier;
	private String modifyTime;
	private String isValid;
	private String taskRegionId;
	private String lastValue;
	private IndexTargetBean indexTargetBean;
	
	private String targetName;
	private String targetType;
	private String unit;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTargetId() {
		return targetId;
	}
	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}
	public String getTargetValue() {
		return targetValue;
	}
	public void setTargetValue(String targetValue) {
		this.targetValue = targetValue;
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
	public String getIsValid() {
		return isValid;
	}
	public void setIsValid(String isValid) {
		this.isValid = isValid;
	}
	public String getTaskRegionId() {
		return taskRegionId;
	}
	public void setTaskRegionId(String taskRegionId) {
		this.taskRegionId = taskRegionId;
	}
	public String getLastValue() {
		return lastValue;
	}
	public void setLastValue(String lastValue) {
		this.lastValue = lastValue;
	}
	public IndexTargetBean getIndexTargetBean() {
		return indexTargetBean;
	}
	public void setIndexTargetBean(IndexTargetBean indexTargetBean) {
		this.indexTargetBean = indexTargetBean;
	}
	public String getTargetName() {
		return targetName;
	}
	public void setTargetName(String targetName) {
		this.targetName = targetName;
	}
	public String getTargetType() {
		return targetType;
	}
	public void setTargetType(String targetType) {
		this.targetType = targetType;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	
	
}
