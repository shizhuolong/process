package org.apdplat.wgreport.detail.bo;

import java.util.Date;

public class ExcelExportTask
{
  public String taskId;
  public String taskName = "";
  public String desc = "";
  public String taskSql = "";
  public String fininshCode;
  public String downloadCode;
  public String validCode;
  public Date createDate;
  public Date downloadDate;
  public Date finishDate = new Date();
  public String fileName = "";
  public String userid = "";
  public String functionName = "";
  public String sqlTitle;
  public Object[] sqlParams;
  public int listCount;
  public String remoteAddress;
  public String appconId;
  
  public Date getCreateDate()
  {
    return this.createDate;
  }
  
  public void setCreateDate(Date createDate)
  {
    this.createDate = createDate;
  }
  
  public String getDesc()
  {
    return this.desc;
  }
  
  public void setDesc(String desc)
  {
    this.desc = desc;
  }
  
  public String getDownloadCode()
  {
    return this.downloadCode;
  }
  
  public void setDownloadCode(String downloadCode)
  {
    this.downloadCode = downloadCode;
  }
  
  public Date getDownloadDate()
  {
    return this.downloadDate;
  }
  
  public void setDownloadDate(Date downloadDate)
  {
    this.downloadDate = downloadDate;
  }
  
  public String getFileName()
  {
    return this.fileName;
  }
  
  public void setFileName(String fileName)
  {
    this.fileName = fileName;
  }
  
  public String getFininshCode()
  {
    return this.fininshCode;
  }
  
  public void setFininshCode(String fininshCode)
  {
    this.fininshCode = fininshCode;
  }
  
  public Date getFinishDate()
  {
    return this.finishDate;
  }
  
  public void setFinishDate(Date finishDate)
  {
    this.finishDate = finishDate;
  }
  
  public String getTaskId()
  {
    return this.taskId;
  }
  
  public void setTaskId(String taskId)
  {
    this.taskId = taskId;
  }
  
  public String getTaskName()
  {
    return this.taskName;
  }
  
  public void setTaskName(String taskName)
  {
    this.taskName = taskName;
  }
  
  public String getTaskSql()
  {
    return this.taskSql;
  }
  
  public void setTaskSql(String taskSql)
  {
    this.taskSql = taskSql;
  }
  
  public String getValidCode()
  {
    return this.validCode;
  }
  
  public void setValidCode(String validCode)
  {
    this.validCode = validCode;
  }
  
  public String getUserid()
  {
    return this.userid;
  }
  
  public void setUserid(String userid)
  {
    this.userid = userid;
  }
  
  public String getFunctionName()
  {
    return this.functionName;
  }
  
  public void setFunctionName(String functionName)
  {
    this.functionName = functionName;
  }
  
  public String getSqlTitle()
  {
    return this.sqlTitle;
  }
  
  public void setSqlTitle(String sqlTitle)
  {
    this.sqlTitle = sqlTitle;
  }
  
  public Object[] getSqlParams()
  {
    return this.sqlParams;
  }
  
  public void setSqlParams(Object[] sqlParams)
  {
    this.sqlParams = sqlParams;
  }
  
  public int getListCount()
  {
    return this.listCount;
  }
  
  public void setListCount(int listCount)
  {
    this.listCount = listCount;
  }
  
  public String getRemoteAddress()
  {
    return this.remoteAddress;
  }
  
  public void setRemoteAddress(String remoteAddress)
  {
    this.remoteAddress = remoteAddress;
  }
  
  public String getAppconId()
  {
    return this.appconId;
  }
  
  public void setAppconId(String appconId)
  {
    this.appconId = appconId;
  }
}
