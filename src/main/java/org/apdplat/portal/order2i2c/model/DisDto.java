package org.apdplat.portal.order2i2c.model;

import java.util.List;

public class DisDto {
	private String taskNo;//系统自动生成
	private String taskTitle;//系统自动生成
	private String disType;
	private String disValue;
	public String getTaskNo() {
		return taskNo;
	}
	public void setTaskNo(String taskNo) {
		this.taskNo = taskNo;
	}
	public String getTaskTitle() {
		return taskTitle;
	}
	public void setTaskTitle(String taskTitle) {
		this.taskTitle = taskTitle;
	}
	public String getDisType() {
		return disType;
	}
	public void setDisType(String disType) {
		this.disType = disType;
	}
	public String getDisValue() {
		return disValue;
	}
	public void setDisValue(String disValue) {
		this.disValue = disValue;
	}
	public List<TeamOrderRalation> getDis() {
		return dis;
	}
	public void setDis(List<TeamOrderRalation> dis) {
		this.dis = dis;
	}
	private List<TeamOrderRalation> dis;
}
