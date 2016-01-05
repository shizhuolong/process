package com.ynunicom.sso.dto;


public class PendingEntity {
	private String pendingCode;
    private String pendingTitle;
    private String pendingDate;
    private String pendingUserID;
    private String pendingURL;
    private String pendingStatus;
    private int pendingLevel;
    private String pendingCityCode;
    private String pendingSource;
    private String pendingSourceUserID;
    private String pendingNote;
    private String lastUpdateDate;
    public String getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(String lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	public static final String preStatus = "0";
    public static final String afterStatus = "1";
    public static final String deleteStatus = "d";
	public String getPendingCode() {
		return pendingCode;
	}
	public void setPendingCode(String pendingCode) {
		this.pendingCode = pendingCode;
	}
	public String getPendingTitle() {
		return pendingTitle;
	}
	public void setPendingTitle(String pendingTitle) {
		this.pendingTitle = pendingTitle;
	}
	public String getPendingDate() {
		return pendingDate;
	}
	public void setPendingDate(String pendingDate) {
		this.pendingDate = pendingDate;
	}
	public String getPendingUserID() {
		return pendingUserID;
	}
	public void setPendingUserID(String pendingUserId) {
		this.pendingUserID = pendingUserId;
	}
	public String getPendingURL() {
		return pendingURL;
	}
	public void setPendingURL(String pendingURL) {
		this.pendingURL = pendingURL;
	}
	public String getPendingStatus() {
		return pendingStatus;
	}
	public void setPendingStatus(String pendingStatus) {
		this.pendingStatus = pendingStatus;
	}
	public int getPendingLevel() {
		return pendingLevel;
	}
	public void setPendingLevel(int gLevelpendingLevel) {
		this.pendingLevel = gLevelpendingLevel;
	}
	public String getPendingCityCode() {
		return pendingCityCode;
	}
	public void setPendingCityCode(String pendingCityCode) {
		this.pendingCityCode = pendingCityCode;
	}
	public String getPendingSource() {
		return pendingSource;
	}
	public void setPendingSource(String pendingSource) {
		this.pendingSource = pendingSource;
	}
	public String getPendingNote() {
		return pendingNote;
	}
	public void setPendingNote(String pendingNote) {
		this.pendingNote = pendingNote;
	}
	public String getPendingSourceUserID() {
		return pendingSourceUserID;
	}
	public void setPendingSourceUserID(String pendingSourceUserID) {
		this.pendingSourceUserID = pendingSourceUserID;
	}
	@Override
	public String toString() {
		return "PendingEntity [pendingCode=" + pendingCode + ", pendingTitle="
				+ pendingTitle + ", pendingDate=" + pendingDate
				+ ", pendingUserID=" + pendingUserID + ", pendingURL="
				+ pendingURL + ", pendingStatus=" + pendingStatus
				+ ", pendingLevel=" + pendingLevel + ", pendingCityCode="
				+ pendingCityCode + ", pendingSource=" + pendingSource
				+ ", pendingSourceUserID=" + pendingSourceUserID
				+ ", pendingNote=" + pendingNote + "]";
	}
	
}
