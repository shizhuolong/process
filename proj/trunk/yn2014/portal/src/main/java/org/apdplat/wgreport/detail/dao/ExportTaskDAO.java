package org.apdplat.wgreport.detail.dao;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintStream;
import java.sql.Blob;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.Date;

import org.apdplat.wgreport.detail.bo.ExcelExportTask;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

public class ExportTaskDAO
  extends JdbcDaoSupport
{
  public static final String intsert_task_sql = "insert into T_DETAIL_DOWNLOAD_TASK( DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,SQL_TITLE,SQL_PARAMS,REMOTE_ADDRESS,APPCONID) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  public static final String query_task_sql = "select  DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,SQL_TITLE,SQL_PARAMS from T_DETAIL_DOWNLOAD_TASK where  finish_code=? order by CREATE_DATE";
  public static final String update_task_sql = "update T_DETAIL_DOWNLOAD_TASK set finish_code=?,finish_date=?,file_name=? where  DETAIL_TASKID=? and finish_code=?";
  public static final String query_task_status_sql = "select finish_code from  T_DETAIL_DOWNLOAD_TASK where  DETAIL_TASKID=? ";
  
  public void addExportTask(ExcelExportTask task)
  {
    String taskid = generateTaskid(task);
    task.setTaskId(taskid);
    







    getJdbcTemplate().update(
      "insert into T_DETAIL_DOWNLOAD_TASK( DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,SQL_TITLE,SQL_PARAMS,REMOTE_ADDRESS,APPCONID) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
      new Object[] { task.getTaskId(), task.getTaskName(), 
      task.getFunctionName(), task.getUserid(), 
      task.getTaskSql(), task.getDesc(), "0", "0", "1", 
      task.getCreateDate(), task.getSqlTitle(), 
      serializeSqlParams(task.getSqlParams()), 
      task.getRemoteAddress(), 
      task.getAppconId() });
  }
  
  public Collection queryDownLoadTask()
  {
    Collection objs = getJdbcTemplate().query("select  DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,SQL_TITLE,SQL_PARAMS from T_DETAIL_DOWNLOAD_TASK where  finish_code=? order by CREATE_DATE", 
      new Object[] { "0" }, new RowMapper()
      {
        public Object mapRow(ResultSet rs, int rowNum)
          throws SQLException
        {
          ExcelExportTask task = new ExcelExportTask();
          task.setTaskSql(rs.getString("DETAIL_SQL"));
          task.setTaskId(rs.getString("DETAIL_TASKID"));
          task.setSqlTitle(rs.getString("SQL_TITLE"));
          
          task.setFunctionName(rs.getString("FUNCTION_NAME"));
          


          task.setCreateDate(rs.getDate("CREATE_DATE"));
          Blob b = rs.getBlob("SQL_PARAMS");
          byte[] data = (byte[])null;
          if (b != null) {
            try
            {
              InputStream inStream = b.getBinaryStream();
              
              data = new byte[(int)b.length()];
              
              inStream.read(data);
              task.setSqlParams(ExportTaskDAO.this.deserializeSqlParams(data));
              inStream.close();
            }
            catch (Exception localException) {}
          }
          return task;
        }
      });
    return objs;
  }
  
  public int updateTaskStatue(ExcelExportTask task, String oldstatue)
  {
    File file = new File("C:/downloadserver/error.txt");
    try
    {
      FileOutputStream out = new FileOutputStream(file);
      String temp = "getFininshCode : " + task.getFininshCode();
      out.write(temp.getBytes());
      temp = "getFinishDate : " + task.getFinishDate();
      out.write(temp.getBytes());
      temp = "getFileName : " + task.getFileName();
      out.write(temp.getBytes());
      temp = "getTaskId : " + task.getTaskId();
      out.write(temp.getBytes());
      temp = "oldstatue : " + oldstatue;
      out.write(temp.getBytes());
      out.flush();
      out.close();
    }
    catch (FileNotFoundException e)
    {
      e.printStackTrace();
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
    return getJdbcTemplate().update(
      "update T_DETAIL_DOWNLOAD_TASK set finish_code=?,finish_date=?,file_name=? where  DETAIL_TASKID=? and finish_code=?", 
      new Object[] { task.getFininshCode(), task.getFinishDate(), 
      task.getFileName(), task.getTaskId(), oldstatue });
  }
  
  public int updateTaskDownloadStatue(ExcelExportTask task)
  {
    String update_download_statue = "update T_DETAIL_DOWNLOAD_TASK set download_code =?,download_date=? where detail_taskid=?";
    System.out.println("update sql is:" + update_download_statue);
    return getJdbcTemplate().update(
      update_download_statue, 
      new Object[] { task.getDownloadCode(), task.getDownloadDate(), 
      task.getTaskId() });
  }
  
  public int updateTaskValidStatue(String filename)
  {
    String update_valid_statue = "update T_DETAIL_DOWNLOAD_TASK set valid_code =? where file_name =?";
    System.out.println("update sql is:" + update_valid_statue);
    return getJdbcTemplate().update(update_valid_statue, 
      new Object[] { Character.valueOf('0'), filename });
  }
  
  public int queryFinishTaskCount(String user_id)
  {
    String query_fininsh_task_count_sql = "select count(*) from T_DETAIL_DOWNLOAD_TASK where userid=? and finish_code='2' and download_code='0' and valid_code='1' ";
    long count = getJdbcTemplate().queryForLong(
      query_fininsh_task_count_sql, new Object[] { user_id });
    return (int)count;
  }
  
  public String queryTaskStatue(ExcelExportTask task)
  {
    return (String)getJdbcTemplate().queryForObject("select finish_code from  T_DETAIL_DOWNLOAD_TASK where  DETAIL_TASKID=? ", 
      new Object[] { task.getTaskId() }, String.class);
  }
  
  public String generateTaskid(ExcelExportTask task)
  {
    String userid = task.getUserid();
    String timestr = String.valueOf(new Date().getTime());
    return userid + timestr;
  }
  
  public long getTaskRecordCount(String sql, Object[] params)
  {
    String countsql = "select count(*) from ( " + sql + " )";
    long count = getJdbcTemplate().queryForLong(countsql, params);
    return count;
  }
  
  public Collection queryTaskByCond(String user_id, String start_time, String end_time, String taskstatus, String function_name)
  {
    StringBuffer basic_query_sql = new StringBuffer();
    basic_query_sql.append("select  DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,FINISH_DATE,FILE_NAME from T_DETAIL_DOWNLOAD_TASK where 1=1 and valid_code ='1' ");
    if (user_id != null) {
      basic_query_sql.append(" and USERID='").append(user_id).append("'");
    }
    if (!start_time.equals("")) {
      basic_query_sql.append(" and CREATE_DATE>=to_date('").append(start_time).append("','yyyy-mm-dd')");
    }
    if (!end_time.equals("")) {
      basic_query_sql.append(" and CREATE_DATE<=to_date('").append(end_time).append("','yyyy-mm-dd')");
    }
    if (!function_name.equals("")) {
      basic_query_sql.append(" and FUNCTION_NAME like '%").append(function_name).append("%'");
    }
    basic_query_sql.append(" order by CREATE_DATE desc");
    
    System.out.println("basic_query_sql=" + basic_query_sql.toString());
    Collection objs = getJdbcTemplate().query(basic_query_sql.toString(), 
      new RowMapper()
      {
        public Object mapRow(ResultSet rs, int rowNum)
          throws SQLException
        {
          ExcelExportTask task = new ExcelExportTask();
          task.setTaskId(rs.getString("DETAIL_TASKID"));
          task.setTaskSql(rs.getString("DETAIL_SQL"));
          task.setFileName(rs.getString("FILE_NAME"));
          task.setFininshCode(rs.getString("FINISH_CODE"));
          
          task.setFinishDate(rs.getTimestamp("FINISH_DATE"));
          

          task.setCreateDate(rs.getTimestamp("CREATE_DATE"));
          task.setFunctionName(rs.getString("FUNCTION_NAME"));
          task.setDesc(rs.getString("TASK_DESC"));
          task.setDownloadCode(rs.getString("DOWNLOAD_CODE"));
          task.setDesc(rs.getString("TASK_DESC"));
          
          return task;
        }
      });
    return objs;
  }
  
  public Collection queryTaskByFile(String filename)
  {
    String basic_query_sql = "select  DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,FINISH_DATE,FILE_NAME from T_DETAIL_DOWNLOAD_TASK where file_name =? ";
    
    System.out.println("basic_query_sql=" + basic_query_sql);
    Collection objs = getJdbcTemplate().query(basic_query_sql, 
      new Object[] { filename }, new RowMapper()
      {
        public Object mapRow(ResultSet rs, int rowNum)
          throws SQLException
        {
          ExcelExportTask task = new ExcelExportTask();
          task.setTaskId(rs.getString("DETAIL_TASKID"));
          task.setTaskSql(rs.getString("DETAIL_SQL"));
          task.setFileName(rs.getString("FILE_NAME"));
          task.setFininshCode(rs.getString("FINISH_CODE"));
          task.setFinishDate(rs.getDate("FINISH_DATE"));
          task.setCreateDate(rs.getDate("CREATE_DATE"));
          task.setFunctionName(rs.getString("FUNCTION_NAME"));
          task.setDesc(rs.getString("TASK_DESC"));
          task.setDownloadCode(rs.getString("DOWNLOAD_CODE"));
          
          return task;
        }
      });
    return objs;
  }
  
  public ExcelExportTask queryTaskById(String taskid)
  {
    String basic_query_sql = "select  DETAIL_TASKID,DETAIL_TASKNAME,FUNCTION_NAME,USERID,DETAIL_SQL,TASK_DESC,FINISH_CODE,DOWNLOAD_CODE, VALID_CODE, CREATE_DATE,FINISH_DATE,FILE_NAME from T_DETAIL_DOWNLOAD_TASK where DETAIL_TASKID=?  ";
    
    System.out.println("basic_query_sql=" + basic_query_sql);
    ExcelExportTask task = (ExcelExportTask)getJdbcTemplate()
      .queryForObject(basic_query_sql, new Object[] { taskid }, 
      new RowMapper()
      {
        public Object mapRow(ResultSet rs, int rowNum)
          throws SQLException
        {
          ExcelExportTask task = new ExcelExportTask();
          task.setTaskId(rs.getString("DETAIL_TASKID"));
          task.setTaskSql(rs.getString("DETAIL_SQL"));
          task.setFileName(rs.getString("FILE_NAME"));
          task
            .setFininshCode(rs
            .getString("FINISH_CODE"));
          task.setFinishDate(rs.getDate("FINISH_DATE"));
          task.setCreateDate(rs.getDate("CREATE_DATE"));
          task.setFunctionName(
            rs.getString("FUNCTION_NAME"));
          task.setDesc(rs.getString("TASK_DESC"));
          task.setDownloadCode(
            rs.getString("DOWNLOAD_CODE"));
          task.setValidCode(rs.getString("VALID_CODE"));
          
          return task;
        }
      });
    return task;
  }
  
  public byte[] serializeSqlParams(Object[] params)
  {
    if ((params == null) || (params.length == 0)) {
      return null;
    }
    try
    {
      ByteArrayOutputStream byteout = new ByteArrayOutputStream();
      ObjectOutputStream out = new ObjectOutputStream(byteout);
      out.writeObject(params);
      return byteout.toByteArray();
    }
    catch (Exception localException) {}
    return null;
  }
  
  public Object[] deserializeSqlParams(byte[] params)
  {
    if ((params == null) || (params.length == 0)) {
      return null;
    }
    try
    {
      ByteArrayOutputStream byteout = new ByteArrayOutputStream();
      ObjectOutputStream out = new ObjectOutputStream(byteout);
      out.writeObject(params);
      ObjectInputStream in = new ObjectInputStream(
        new ByteArrayInputStream(params));
      return (Object[])in.readObject();
    }
    catch (Exception localException) {}
    return null;
  }
  
  public void writeDownLog(String sql, Object[] sqlparam)
  {
    getJdbcTemplate().update(sql, sqlparam);
  }
}
