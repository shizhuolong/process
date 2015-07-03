package org.apdplat.wgreport.detail;

import java.io.PrintStream;

import org.apdplat.wgreport.detail.bo.ExcelExportTask;
import org.apdplat.wgreport.detail.dao.ExportTaskDAO;

public class ExcelExportService
{
  public static int download_limit = 200;
  private ExportTaskDAO exportTaskDAO;
  private DetailDownLoadHelp detailDownLoadHelp;
  
  public ExportTaskDAO getExportTaskDAO()
  {
    if (this.exportTaskDAO == null) {
      throw new RuntimeException("ExportTaskDAO is not set");
    }
    return this.exportTaskDAO;
  }
  
  public void setExportTaskDAO(ExportTaskDAO exportTaskDAO)
  {
    System.out.println("exportTaskDAO is set");
    this.exportTaskDAO = exportTaskDAO;
  }
  
  public void createDownloadTask(ExcelExportTask task)
  {
    this.exportTaskDAO.addExportTask(task);
  }
  
  public boolean download(ExcelExportTask task)
  {
    String sql = task.getTaskSql();
    long count = this.exportTaskDAO.getTaskRecordCount(sql, task.getSqlParams());
    if (count < download_limit) {
      return true;
    }
    this.exportTaskDAO.addExportTask(task);
    return false;
  }
  
  public void addDownloadTask(ExcelExportTask task)
  {
    this.exportTaskDAO.addExportTask(task);
  }
  
  public String downloadExcelFile(ExcelExportTask task)
  {
    this.detailDownLoadHelp.excuteDownload(task);
    return task.getFileName();
  }
  
  public DetailDownLoadHelp getDetailDownLoadHelp()
  {
    return this.detailDownLoadHelp;
  }
  
  public void setDetailDownLoadHelp(DetailDownLoadHelp detailDownLoadHelp)
  {
    System.out.println("DetailDownLoadHelp is set");
    this.detailDownLoadHelp = detailDownLoadHelp;
  }
  
  public static int getDownload_limit()
  {
    return download_limit;
  }
  
  public void setDownload_limit(int download_limit)
  {
    download_limit = download_limit;
  }
}
