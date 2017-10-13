package org.apdplat.portal.index.bean;

public class User {
	private String userName;
	private String phone;
	private String realName;
	private String orgLevel;
	private String regionCode;
	private String regionName;
	private String code;
	private String orgName;
	private String hrId;
	private String uid;
	private String id;
	private String job;
	private String userCode;
	public String getJob() {
		return job;
	}


	public void setJob(String job) {
		this.job = job;
	}


	public String getUserCode() {
		return userCode;
	}


	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	private int state;
	private String messgae;
	
	
	public int getState() {
		return state;
	}


	public void setState(int state) {
		this.state = state;
	}


	public String getMessgae() {
		return messgae;
	}


	public void setMessgae(String messgae) {
		this.messgae = messgae;
	}


	public String getUid() {
		return uid;
	}


	public void setUid(String uid) {
		this.uid = uid;
	}


	public String getUserName() {
		return userName;
	}


	public void setUserName(String userName) {
		this.userName = userName;
	}


	public String getPhone() {
		return phone;
	}


	public void setPhone(String phone) {
		this.phone = phone;
	}


	public String getRealName() {
		return realName;
	}


	public void setRealName(String realName) {
		this.realName = realName;
	}


	public String getOrgLevel() {
		return orgLevel;
	}


	public void setOrgLevel(String orgLevel) {
		this.orgLevel = orgLevel;
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


	public String getCode() {
		return code;
	}


	public void setCode(String code) {
		this.code = code;
	}


	public String getOrgName() {
		return orgName;
	}


	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}


	public String getHrId() {
		return hrId;
	}


	public void setHrId(String hrId) {
		this.hrId = hrId;
	}


	public static String getMetaData() {
	    return "用户信息";
	}
}
