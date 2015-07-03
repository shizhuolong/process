package org.apdplat.selfrpt.model;

public class User extends Page {
	private String userID;//用户ID
	private String userName;//用户名称
	private int level; 
	private String groupID;
	private String groupName; 
	private String groupID1=""; //省
	private String groupName1="";
	private String groupID2="";//地市
	private String groupName2="";
	private String groupID3="";//区县
	private String groupName3="";
	private String groupID4="";//营销中心
	private String groupName4="";
	private String groupID5="";//网格
	private String groupName5=""; 
	private String groupID6="";//网点
	private String groupName6="";

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	} 

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	} 

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getGroupID() {
		return groupID;
	}

	public void setGroupID(String groupID) {
		this.groupID = groupID;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getGroupID1() {
		return groupID1;
	}

	public void setGroupID1(String groupID1) {
		this.groupID1 = groupID1;
	}

	public String getGroupName1() {
		return groupName1;
	}

	public void setGroupName1(String groupName1) {
		this.groupName1 = groupName1;
	}

	public String getGroupID2() {
		return groupID2;
	}

	public void setGroupID2(String groupID2) {
		this.groupID2 = groupID2;
	}

	public String getGroupName2() {
		return groupName2;
	}

	public void setGroupName2(String groupName2) {
		this.groupName2 = groupName2;
	}

	public String getGroupID3() {
		return groupID3;
	}

	public void setGroupID3(String groupID3) {
		this.groupID3 = groupID3;
	}

	public String getGroupName3() {
		return groupName3;
	}

	public void setGroupName3(String groupName3) {
		this.groupName3 = groupName3;
	}

	public String getGroupID4() {
		return groupID4;
	}

	public void setGroupID4(String groupID4) {
		this.groupID4 = groupID4;
	}

	public String getGroupName4() {
		return groupName4;
	}

	public void setGroupName4(String groupName4) {
		this.groupName4 = groupName4;
	}

	public String getGroupID5() {
		return groupID5;
	}

	public void setGroupID5(String groupID5) {
		this.groupID5 = groupID5;
	}

	public String getGroupName5() {
		return groupName5;
	}

	public void setGroupName5(String groupName5) {
		this.groupName5 = groupName5;
	}

	public String getGroupID6() {
		return groupID6;
	}

	public void setGroupID6(String groupID6) {
		this.groupID6 = groupID6;
	}

	public String getGroupName6() {
		return groupName6;
	}

	public void setGroupName6(String groupName6) {
		this.groupName6 = groupName6;
	}

}
