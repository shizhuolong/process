package org.apdplat.wgreport.detail;

import java.io.PrintStream;
import java.util.Date;

import org.apdplat.wgreport.detail.bo.ExcelExportTask;

public class DetailDownLoadUtil
  implements DetailDownload
{
  public boolean if_immediate_download(String functionName, String sql, Object[] params, String titles, String userid)
  {
    ExcelExportService service = ExcelExportServiceUtil.getService();
    

    ExcelExportTask task = new ExcelExportTask();
    task.setUserid(String.valueOf(userid));
    task.setCreateDate(new Date());
    task.setFunctionName(functionName);
    task.setDesc(functionName);
    task.setTaskSql(sql);
    task.setSqlTitle(titles);
    task.setSqlParams(params);
    task.setFininshCode("0");
    boolean if_immediate_download = false;
    if (service.download(task)) {
      if_immediate_download = true;
    }
    return if_immediate_download;
  }
  
  public String doDownLoad(String functionName, String sql, String titles)
  {
    ExcelExportService service = ExcelExportServiceUtil.getService();
    

    ExcelExportTask task = new ExcelExportTask();
    task.setCreateDate(new Date());
    task.setFunctionName(functionName);
    task.setDesc(functionName);
    task.setTaskSql(sql);
    task.setSqlTitle(titles);
    
    service.downloadExcelFile(task);
    return task.getFileName();
  }
  
  public String doDownLoad(String functionName, String sql, String titles, Object[] paramvalues)
  {
    ExcelExportService service = ExcelExportServiceUtil.getService();
    

    ExcelExportTask task = new ExcelExportTask();
    task.setCreateDate(new Date());
    task.setFunctionName(functionName);
    task.setDesc(functionName);
    task.setTaskSql(sql);
    task.setSqlTitle(titles);
    task.setSqlParams(paramvalues);
    service.downloadExcelFile(task);
    return task.getFileName();
  }
  
  public void addDownloadTask(String functionName, String sql, Object[] params, String titles, String userid, String remoteAddress, String appconId)
  {
    ExcelExportService service = ExcelExportServiceUtil.getService();
    

    ExcelExportTask task = new ExcelExportTask();
    task.setUserid(String.valueOf(userid));
    task.setCreateDate(new Date());
    task.setFunctionName(functionName);
    task.setDesc(functionName);
    task.setTaskSql(sql);
    task.setSqlTitle(titles);
    task.setSqlParams(params);
    

    task.setRemoteAddress(remoteAddress);
    task.setAppconId(appconId);
    task.setFininshCode("0");
    System.out.println("title is " + titles);
    System.out.println("sql is " + sql);
    System.out.println("userid is " + userid);
    System.out.println("functionName is " + functionName);
    
    System.out.println("\n\n\n新增任务" + task.getAppconId());
    System.out.println("," + task.getRemoteAddress() + "," + task.getRemoteAddress() + "\n\n\n");
    
    service.addDownloadTask(task);
  }
}
