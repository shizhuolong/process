package com.ynunicom.sso.dto;


public class ReadingEntity {
	private String readingCode;
    private String readingTitle;
    private String readingDate;
    private String readingURL;
    private String readingUserId;
    private String readingStatus;
    private String readingSource;
    private String readingNote;
    private String  readingSourceUserID;
    private String  lastUpdateDate;
    public static final String preStatus = "0";
    public static final String afterStatus = "1";
    public static final String deleteStatus = "d";
	public String getReadingCode() {
		return readingCode;
	}
	public void setReadingCode(String readingCode) {
		this.readingCode = readingCode;
	}
	public String getReadingTitle() {
		return readingTitle;
	}
	public void setReadingTitle(String readingTitle) {
		this.readingTitle = readingTitle;
	}
	public String getReadingDate() {
		return readingDate;
	}
	public void setReadingDate(String readingDate) {
		this.readingDate = readingDate;
	}
	public String getReadingURL() {
		return readingURL;
	}
	public void setReadingURL(String readingURL) {
		this.readingURL = readingURL;
	}
	public String getReadingUserId() {
		return readingUserId;
	}
	public void setReadingUserId(String readingUserId) {
		this.readingUserId = readingUserId;
	}
	public String getReadingStatus() {
		return readingStatus;
	}
	public void setReadingStatus(String readingStatus) {
		this.readingStatus = readingStatus;
	}
	public String getReadingSource() {
		return readingSource;
	}
	public void setReadingSource(String readingSource) {
		this.readingSource = readingSource;
	}
	public String getReadingNote() {
		return readingNote;
	}
	public void setReadingNote(String readingNote) {
		this.readingNote = readingNote;
	}
	public String getReadingSourceUserID() {
		return readingSourceUserID;
	}
	public void setReadingSourceUserID(String readingSourceUserID) {
		this.readingSourceUserID = readingSourceUserID;
	}
	public String getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(String lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
}
