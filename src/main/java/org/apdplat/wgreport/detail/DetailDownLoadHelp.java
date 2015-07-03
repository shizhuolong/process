package org.apdplat.wgreport.detail;


import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Collection;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apdplat.wgreport.detail.bo.ExcelExportTask;
import org.apdplat.wgreport.detail.dao.ExportTaskDAO;
import org.apdplat.wgreport.tools.JxcellExcelExporter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

public class DetailDownLoadHelp
{
  private ExportTaskDAO taskdao;
  private static String fileDir = "";
  private static String NEW_TASK_CODE = "0";
  private static String FINISH_DOING = "1";
  private static String FINISH_SUCCESS = "2";
  private static String FINISH_FAILURE = "3";
  
  public DetailDownLoadHelp()
  {
    init();
  }
  
  public void excuteDownload(ExcelExportTask task)
  {
    String sql = task.getTaskSql();
    
    JxcellExcelExporter jex = new JxcellExcelExporter();
    String filename = getNewDownLoadFileName(task);
    String fullname = fileDir + "/" + filename;
    jex.setFileName(fullname);
    Object[] task_params = task.getSqlParams();
    long count = this.taskdao.getTaskRecordCount(sql, task_params);
    
    long endrow = 0L;
    long leave_count = 1L;
    long startrow = 0L;
    long row_number = 0L;
    
    String pagesql = "select * from ( select rownum as rn ,t.* from (" + 
      sql + ") t )   p where p.rn BETWEEN ? AND ? ";
    

    String sqltitle = task.getSqlTitle();
    Object[] titles;
    if ((sqltitle == null) || (sqltitle.equals(""))) {
      titles = getMetaInfoBySQL(sql, task_params);
    } else {
      titles = sqltitle.split(",");
    }
    jex.setTitle(titles);
    


    final int dataCols = titles.length;
    while (leave_count > 0L)
    {
      startrow = endrow + 1L;
      endrow = startrow + 3000L > count ? count : startrow + 3000L;
      leave_count = count - endrow;
      Object[] sql_params = getSqlParams(task, startrow, endrow);
      Collection objs = this.taskdao.getJdbcTemplate().query(pagesql, 
        sql_params, 
        new RowMapper()
        {
          public Object mapRow(ResultSet rs, int rowNum)
            throws SQLException
          {
            Object[] tmp = new Object[dataCols];
            for (int i = 0; i < dataCols; i++) {
              tmp[i] = rs.getObject(i + 1);
            }
            return tmp;
          }
        });
      jex.setData(objs.toArray());
      jex.print();
    }
    jex.close();
    zipDownLoadFile(filename);
    task.setFininshCode(FINISH_SUCCESS);
    task.setFinishDate(new Date());
    String rarfilename = filename.substring(0, filename.indexOf(".")) + 
      ".rar";
    task.setFileName(rarfilename);
  }
  
  public void zipDownLoadFile(String filename)
  {
    int BUFFER = 2048;
    
    String rarfilename = filename.substring(0, filename.indexOf(".")) + 
      ".rar";
    try
    {
      FileOutputStream fos = new FileOutputStream(fileDir + "/" + 
        rarfilename);
      

      ZipOutputStream gzipout = new ZipOutputStream(fos);
      ZipEntry myZipEntry = new ZipEntry(filename);
      gzipout.putNextEntry(myZipEntry);
      
      BufferedInputStream origin = new BufferedInputStream(
        new FileInputStream(fileDir + "/" + filename), BUFFER);
      
      byte[] databyte = new byte[BUFFER];
      int readcount;
      while ((readcount = origin.read(databyte, 0, BUFFER)) != -1)
      {
        gzipout.write(databyte, 0, readcount);
      }
      origin.close();
      gzipout.closeEntry();
      gzipout.close();
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
  
  public String getNewDownLoadFileName(ExcelExportTask task)
  {
    String userid = task.getUserid();
    String timestr = String.valueOf(new Date().getTime());
    return userid + "_" + timestr + ".xls";
  }
  
  public Object[] getMetaInfoBySQL(String sql, Object[] task_params)
  {
    String sql_local = "select * from (" + sql + ") where rownum <=1";
    Object[] metas = (Object[])this.taskdao.getJdbcTemplate().queryForObject(
      sql_local, task_params, new RowMapper()
      {
        public Object mapRow(ResultSet rs, int rowNum)
          throws SQLException
        {
          ResultSetMetaData rsmeta = rs.getMetaData();
          int dataCols = rsmeta.getColumnCount();
          Object[] title = new Object[dataCols];
          for (int i = 0; i < dataCols; i++)
          {
            String headstr = rsmeta.getColumnLabel(i + 1);
            title[i] = headstr;
          }
          return title;
        }
      });
    return metas;
  }
  
  public Object[] getSqlParams(ExcelExportTask task, long startrow, long endrow)
  {
    Object[] task_params = task.getSqlParams();
    if (task_params == null) {
      return new Object[] { new Long(startrow), new Long(endrow) };
    }
    int count = task_params.length + 2;
    Object[] sql_params = new Object[count];
    for (int i = 0; i < task_params.length; i++) {
      sql_params[i] = task_params[i];
    }
    sql_params[(count - 2)] = new Long(startrow);
    sql_params[(count - 1)] = new Long(endrow);
    return sql_params;
  }
  
  public ExportTaskDAO getTaskdao()
  {
    return this.taskdao;
  }
  
  public void setTaskdao(ExportTaskDAO taskdao)
  {
    this.taskdao = taskdao;
    System.out.println("ExportTaskDAO is set in DetailDownLoadHelp ");
  }
  
  public void init() {}
  
  public static String getFileDir()
  {
    return fileDir;
  }
  
  public void setFileDir(String fileDir)
  {
    fileDir = fileDir;
  }
}
