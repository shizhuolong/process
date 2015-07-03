package org.apdplat.selfrpt.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apdplat.selfrpt.model.Page;

public class JdbcUtilV1 { 	
	public static String driver = "";

	public static String url ="";

	public static String dbName = "";  

	public static String dbPassword = ""; 
	
	protected Connection conn;

	protected PreparedStatement pstmt = null;
	
	protected Statement stmt = null;

	protected ResultSet rs = null;

	//读取资源文件信息
    public void getProperties() {
		String fileName = "/props/jdbc.properties";//application.properties /props/jdbc.properties
		try {
			Properties p = new Properties(); 
			InputStream is = this.getClass().getResourceAsStream(fileName); 
			p.load(is);  
			
			driver=p.getProperty("jdbc.driver");
			url=p.getProperty("jdbc.url");
			dbName=p.getProperty("jdbc.username");
			dbPassword=p.getProperty("jdbc.password");   
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
    
	public void openConn() {
		try {
			getProperties();//读取资源文件信息
			Class.forName(driver);
			conn = DriverManager.getConnection(url, dbName, dbPassword);
			} catch (ClassNotFoundException e) {
			System.out.println("加载数据库驱动" + driver + "失败！");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void closeAll() {
		if (rs != null) {  
			try {
				rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
 
		if (pstmt != null) {
			try {
				pstmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		if (stmt != null) {
			try {
				stmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
 
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	} 

	//插入1条记录 
	public int add(String sql) {
		int flag = 0;
		try {
			this.openConn();
			stmt = conn.createStatement();
			System.out.println("插入记录 sql=" + sql);
			stmt.executeUpdate(sql);// 执行SQL语句
			flag = 1;
		} catch (SQLException e) { 
			 e.printStackTrace();
		} finally {
			this.closeAll();
		}
		return flag;
	}
	
	//批量插入      
	public  Page adds(List<String> list)  {  
		String errorMsg="";
		int flag = 0; 
		try {
			this.openConn(); 
			stmt = conn.createStatement(); 
			conn.setAutoCommit(false);
			Long beginTime = System.currentTimeMillis();   
		    boolean autoCommit = conn.getAutoCommit();//获得自动提交状态	    
		    conn.setAutoCommit(false);//关闭自动提交	   
		    for (int i = 0; i < list.size(); i++) { //将SQL语句加入到Batch中
		    	System.out.println("--sqls["+i+"]="+list.get(i)); //不打印日志
		    	 stmt.addBatch(list.get(i).toString());
		    	 if (i % 500 == 0) { // 每500条提交一次,建议500-800
		    		stmt.executeBatch(); //执行批处理	  	    
				    conn.commit();      
		    	 }
		    } 
		    stmt.executeBatch();  	    
		    conn.commit(); 
		    conn.setAutoCommit(autoCommit); 
			Long endTime = System.currentTimeMillis();
			System.out.println("批量插入耗费时间：" + (endTime - beginTime) / 1000 + "秒"); 
			flag = 1;
		} catch (SQLException e) {
			errorMsg=e.toString();
			errorMsg=errorMsg.substring(errorMsg.indexOf(":")+1,errorMsg.length());
			System.out.println("---errorMsg="+errorMsg);
			flag=0;
		} finally {
			this.closeAll(); 
		}
		Page page=new Page();
		page.setFlag(flag);
		page.setErrorMsg(errorMsg);
		return page;
	}

	// 更新
	public int update(String sql) {
		int flag = 0;
		try {
			this.openConn();
			stmt = conn.createStatement();
			System.out.println("更新sql=" + sql);
			stmt.executeUpdate(sql);
			flag = 1;
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			this.closeAll();
		}
		return flag;
	}

	// 删除记录
	public int delete(String sql) {
		int flag = 0;
		try {
			this.openConn();
			System.out.println("删除sql=" + sql);
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
			flag = 1; 
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			this.closeAll();
		}
		return flag;
	} 
	
	public String findOneData(String sql) {
		List<String[]> list=findList(sql);
		String data="";
		if(list.size()>0){
			String[] data1 = (String[]) list.get(0);  
			data=data1[0];			
		}
		return data;
	}

	//查询所有记录
	public List<String[]> findList(String sql) {
		System.out.println("-- sql="+sql);
		List<String[]> list = new ArrayList<String[]>(); 
		try {
			this.openConn();  
			stmt = conn.createStatement( ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
			rs = stmt.executeQuery(sql);
			ResultSetMetaData md = rs.getMetaData(); 
			int rs_cols = md.getColumnCount();
			String[] data = new String[rs_cols];
			while (rs.next()) {
				data = new String[rs_cols];
				for (int i = 0; i < rs_cols; i++) {
					if (rs.getString(i + 1) != null) {
						data[i] = rs.getString(i + 1).trim();//替换英文逗号为中文,防止被误用成字段分隔符(1列变多列).replaceAll(",", "，")
					}else{
						data[i] =""; //不等于null,减少页面判断null
					}
				}
				list.add(data);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally { 
			this.closeAll(); 
		} 
		return list;
	}
	 
	
   //分页查询-oralce
	public Page findPage(Page form) {
		int flag=0;
		String errorMsg="";
		List<String[]> list = new ArrayList<String[]>();
		int currentPage=form.getCurrentPage();
		int pageSize=form.getPageSize();
		int firstRow=(currentPage - 1) * pageSize;
		int endRow=firstRow+pageSize; 
		
		int rs_cols=0;
		int maxRow = 0;
		float[] dataMaxLen=null;
		boolean[] isSameLen = null;
		String sql=form.getSql();
		String colNames="",colTypes="",tableName="";
		try {
			this.openConn(); 
			stmt = conn.createStatement( ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);  
			System.out.println("--sql="+sql);
			String sql2="select count(*) from ("+sql+")"; 
			rs = stmt.executeQuery(sql2);
			rs.next();
			maxRow=rs.getInt(1);
			System.out.println("firstRow="+firstRow+",endRow="+endRow+",总记录数 maxRow="+maxRow);	  
			sql="select * from ( select row_.*,rownum rr  from ( "   
			    +sql+
			" )row_ ) where rr <= "+endRow+" and rr > "+firstRow; 
			rs = stmt.executeQuery(sql);
			ResultSetMetaData md = rs.getMetaData(); 
			rs_cols = md.getColumnCount();
			String[] data = new String[rs_cols];
			String[] dataLast = new String[rs_cols];
			dataMaxLen = new float[rs_cols];
			isSameLen= new boolean[rs_cols]; 
			for(int i=0;i<rs_cols;i++){
				isSameLen[i]=true;
			}
			while (rs.next()) {
				data = new String[rs_cols]; 
				for (int i = 1; i <rs_cols; i++) {
					int j=i-1;
					if (rs.getString(i) != null) {
						data[j] = rs.getString(i).trim().replaceAll(",", "，");
					}else{
						data[j] = " ";//页面不出现null
					}
					if (data[j] != null && dataMaxLen[j] < data[j].trim().length()) {
						dataMaxLen[j] = data[j].trim().length();
					} 
					if(dataLast[j]!=null && data[j]!=null && dataLast[j].length()!=data[j].length()){
						isSameLen[j]=false;
					}
				}
				for(int i=0;i<data.length;i++){
					dataLast[i]=data[i];
				}  
				list.add(data); 
			} 
			for(int i = 1; i <= rs_cols-1; i ++){
				colNames+=md.getColumnName(i).toLowerCase()+";"; 
				colTypes+=md.getColumnTypeName(i).toLowerCase()+";"; 
			}  
			colNames=colNames.substring(0,colNames.length()-1); 
			colTypes=colTypes.substring(0,colTypes.length()-1); 
			flag=1;//操作成功
		} catch (SQLException e) {
			errorMsg=e.toString();
			errorMsg=errorMsg.substring(errorMsg.indexOf(":")+1,errorMsg.length());
			System.out.println("---errorMsg="+errorMsg);
			flag=0;
		} finally {
			this.closeAll(); 
		}		 
		Page page = new Page(); 
		page.set(currentPage, pageSize, maxRow); 
		page.setColNum(rs_cols-1);
		page.setColNames(colNames);
		page.setColTypes(colTypes);
		page.setTableName(tableName);
		page.setDataMaxLen(dataMaxLen);
		page.setIsSameLen(isSameLen);
		page.setFlag(flag); 
		page.setErrorMsg(errorMsg); 
		page.setList(list);
		return page;
	} 
	
	//根据表名获取表结构信息
	public Page getTableInfo(String tableName) {
		tableName=tableName.toUpperCase();
		String owner=dbName.toUpperCase(); //schema
		if(tableName.indexOf(".")>0){
			owner=tableName.substring(0,tableName.indexOf("."));
			tableName=tableName.substring(tableName.indexOf(".")+1,tableName.length());
		}  
		int flag=0;
		String errorMsg=""; 
		String colNames="",colTypes="",colRemarks="",tmp=""; 
		List<String[]> list = new ArrayList<String[]>();
		try {
			this.openConn(); // 创建连接 
			DatabaseMetaData databaseMetaData = conn.getMetaData();   
            rs =databaseMetaData.getColumns("",owner,tableName,"%");  //获得指定tableName对应的列   
            while(rs.next()){       
            	 colNames+=rs.getString("COLUMN_NAME").toLowerCase()+";";
            	 int decimal=rs.getInt("DECIMAL_DIGITS");
            	 tmp="";
				 if(decimal!=0){
					 tmp=","+decimal;
				 } 
            	 colTypes+=rs.getString("TYPE_NAME").toLowerCase()+"("+rs.getInt("COLUMN_SIZE")+""+tmp+");"; 
            }      
            if(colNames.length()>=1){
        	   colNames=colNames.substring(0,colNames.length()-1);
               colTypes=colTypes.substring(0,colTypes.length()-1);  
               String sql="select b.comments from all_tab_columns a, all_col_comments b where a.table_name = b.table_name and a.column_name = b.column_name "+
               			  "and a.owner = b.owner and a.table_name = '"+tableName+"' and a.owner = '"+owner+"' order by a.column_id";
               list=findList(sql);  
               colRemarks="";
               for(int i=0;i<list.size();i++){
            	   String[] data1 = (String[]) list.get(i); 
            	   colRemarks+=data1[0]+";"; 
               } 
               colRemarks=colRemarks.substring(0,colRemarks.length()-1);  
               flag=1;
            }else{
            	flag=0;//获取表信息失败
            }  
		} catch (SQLException e) {
			errorMsg=e.toString();
			errorMsg=errorMsg.substring(errorMsg.indexOf(":")+1,errorMsg.length());
			System.out.println("---errorMsg="+errorMsg);
			flag=0;			
		} finally { 
			this.closeAll();
		} 
		Page page = new Page();  
		page.setColNum(colNames.split(";").length);
		page.setColNames(colNames); 
		page.setColTypes(colTypes); 
		page.setColRemarks(colRemarks); 
		page.setFlag(flag);  
		page.setErrorMsg(errorMsg); 
		return page;
	}  

	
	public  void test() {
		this.openConn();
		try {
			stmt = conn.createStatement();
			String sql="insert into pgrp.tb_rpt_group_gz(value1,value214) values(?,?)"; 
			PreparedStatement ps=conn.prepareStatement(sql); 
			ps.setInt(1, 8888); 
			java.sql.Clob clob=conn.createClob();
			  clob.setString(2, new String("1asdfdas"));
			  ps.setClob(2, clob);
			int result=ps.executeUpdate(); 
			System.out.println("result="+result);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		 
	}

}