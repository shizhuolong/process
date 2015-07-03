package org.apdplat.selfrpt.util;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apdplat.selfrpt.model.Page;
import org.springframework.stereotype.Repository;
@Repository 
public class JdbcUtil { 	
	@Resource
	DataSource dataSource; 
	
	//插入1条记录 
	public int add(String sql) {
		int flag = 0;
		Connection conn =null;
		Statement stmt =null;
		try { 
			conn=dataSource.getConnection();  //spring获取链接
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			System.out.println("插入记录 sql=" + sql);
			stmt.executeUpdate(sql);// 执行SQL语句
			flag = 1;
		} catch (SQLException e) { 
			 e.printStackTrace();
		} finally {// 依次关闭Statement和connection 
			try {
				conn.commit();
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			this.closeAll(conn,stmt); 
		}
		return flag;
	}
	
	public Page add2(String sql) {
		String errorMsg="";
		int flag = 0;
		Connection conn =null;
		Statement stmt =null;
		try { 
			conn=dataSource.getConnection();  //spring获取链接
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			System.out.println("插入记录 sql=" + sql);
			stmt.executeUpdate(sql);// 执行SQL语句
			flag = 1;
		} catch (SQLException e) { 
			 e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			} 
			errorMsg=e.toString();
			errorMsg=errorMsg.substring(errorMsg.indexOf(":")+1,errorMsg.length());
			System.out.println("---errorMsg="+errorMsg);
			flag=0;
		} finally {// 依次关闭Statement和connection 
			try {
				conn.commit();
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			this.closeAll(conn,stmt); 
		}
		Page page=new Page();
		page.setFlag(flag);
		page.setErrorMsg(errorMsg);
		return page;
	}
	
	//批量插入      
	public  Page adds(List<String> list)  { 
		String errorMsg="";
		int flag = 0; 
		Connection conn =null;
		Statement stmt =null;
		try { 
			conn=dataSource.getConnection();
			stmt = conn.createStatement(); 
			conn.setAutoCommit(false);
			Long beginTime = System.currentTimeMillis();   
		    boolean autoCommit = conn.getAutoCommit();//获得自动提交状态	    
		    conn.setAutoCommit(false);//关闭自动提交	   
		    for (int i = 0; i < list.size(); i++) { //将SQL语句加入到Batch中
		    	System.out.println(list.get(i)+";"); //不打印日志
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
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}   
			errorMsg=e.toString();
			errorMsg=errorMsg.substring(errorMsg.indexOf(":")+1,errorMsg.length());
			System.out.println("---errorMsg="+errorMsg);
			flag=0;
		} finally { 
			this.closeAll(conn,stmt); 
		}
		Page page=new Page();
		page.setFlag(flag);
		page.setErrorMsg(errorMsg);
		return page;
	}

	// 更新
	public int update(String sql) {
		int flag = 0;
		Connection conn =null;
		Statement stmt =null;
		try { 
			conn=dataSource.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			System.out.println("更新sql=" + sql);
			stmt.executeUpdate(sql);
			flag = 1;
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				conn.commit();
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			this.closeAll(conn,stmt); 
		}
		return flag;
	}
	
	public Page update2(String sql) {
		String errorMsg="";
		int flag = 0;
		Connection conn =null;
		Statement stmt =null;
		try { 
			conn=dataSource.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			System.out.println("更新sql=" + sql);
			stmt.executeUpdate(sql);
			flag = 1;
		} catch (SQLException e) {
			errorMsg=e.toString();
			errorMsg=errorMsg.substring(errorMsg.indexOf(":")+1,errorMsg.length());
			System.out.println("---errorMsg="+errorMsg);
			flag=0;
		} finally {
			try {
				conn.commit();
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			this.closeAll(conn,stmt); 
		}
		Page page=new Page();
		page.setFlag(flag);
		page.setErrorMsg(errorMsg);
		return page;
	}

	// 删除记录
	public int delete(String sql) {
		int flag = 0;
		Connection conn =null;
		Statement stmt =null;
		try { 
			System.out.println("删除sql=" + sql);
			conn=dataSource.getConnection();
			conn.setAutoCommit(false);
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
			flag = 1;
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			try {
				conn.commit();
				conn.setAutoCommit(true);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			this.closeAll(conn,stmt); 
		}
		return flag;
	} 

	//查询所有记录
	public List<String[]> findList(String sql) {
		System.out.println("-- sql="+sql);
		List<String[]> list = new ArrayList<String[]>(); 
		Connection conn =null;
		Statement stmt =null;
		ResultSet rs=null;
		try { 
			conn=dataSource.getConnection();
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
			this.closeAll(conn,stmt,rs); 
		} 
		return list;
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
	
   //分页查询-oralce
	@SuppressWarnings("resource")
	public Page findPage(Page form) {
		int flag=0;
		String errorMsg="";
		List<String[]> list = new ArrayList<String[]>();
		boolean isTrim=form.getIsTrim();
		int currentPage=form.getCurrentPage();
		int pageSize=form.getPageSize();
		int firstRow=(currentPage - 1) * pageSize;
		int endRow=firstRow+pageSize; 
		int rs_cols=0,maxRow = 0,decimal=0;
		float[] dataMaxLen=null;
		boolean[] isSameLen = null;
		String sql=form.getSql();
		String colNames="",colTypes="",tableName="",tmp="";
		Connection conn =null;
		Statement stmt =null;
		ResultSet rs=null;
		try { 
			conn=dataSource.getConnection();
			stmt = conn.createStatement( ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY); 
			System.out.println("--findPage sql="+sql);
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
						if(isTrim){
							data[j] = rs.getString(i).trim().replaceAll(",", "，"); 
						}else{
							data[j] = rs.getString(i).replaceAll(",", "，"); //.trim()不能删除，否则in()获取不到?
						} 
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
				tmp="";
				decimal=md.getScale(i);  
				int precision=md.getPrecision(i);
				 if(decimal>=0){
					 tmp=","+decimal;
				 }else if(decimal<0){ //若字段类型是number，没有指明小数位数，则为-127
					 precision=22;
					 tmp=","+0; 
				 }
		       	 colTypes+=md.getColumnTypeName(i).toLowerCase()+"("+precision+tmp+");"; 
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
			this.closeAll(conn,stmt,rs); 
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
	  //下钻查询
	public Page newFindPage(Page form) {
		int flag=0;
		String errorMsg="";
		List<String[]> list = new ArrayList<String[]>();
		boolean isTrim=form.getIsTrim();
		
		int rs_cols=0,decimal=0;
		float[] dataMaxLen=null;
		boolean[] isSameLen = null;
		String sql=form.getSql();
		String colNames="",colTypes="",tableName="",tmp="";
		Connection conn =null;
		Statement stmt =null;
		ResultSet rs=null;
		try { 
			conn=dataSource.getConnection();
			stmt = conn.createStatement( ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY); 
			System.out.println("--findPage sql="+sql);
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
				for (int i = 1; i <rs_cols+1; i++) {
					int j=i-1;
					if (rs.getString(i) != null) {
						if(isTrim){
							data[j] = rs.getString(i).trim().replaceAll(",", "，"); 
						}else{
							data[j] = rs.getString(i).replaceAll(",", "，"); //.trim()不能删除，否则in()获取不到?
						} 
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
				tmp="";
				decimal=md.getScale(i);  
				int precision=md.getPrecision(i);
				 if(decimal>=0){
					 tmp=","+decimal;
				 }else if(decimal<0){ //若字段类型是number，没有指明小数位数，则为-127
					 precision=22;
					 tmp=","+0; 
				 }
		       	 colTypes+=md.getColumnTypeName(i).toLowerCase()+"("+precision+tmp+");"; 
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
			this.closeAll(conn,stmt,rs); 
		}		 
		Page page = new Page(); 
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
		String owner=""; 
		if(tableName.indexOf(".")>0){
			owner=tableName.substring(0,tableName.indexOf("."));
			tableName=tableName.substring(tableName.indexOf(".")+1,tableName.length());
		}  
		int flag=0;
		String errorMsg=""; 
		String colNames="",colTypes="",colRemarks="",tmp=""; 
		List<String[]> list = new ArrayList<String[]>();
		Connection conn =null;
		Statement stmt =null;
		ResultSet rs=null;
		try { 
			conn=dataSource.getConnection();
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
			this.closeAll(conn,stmt,rs);
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
	
	
	public void closeAll(Connection conn,Statement stmt) {
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

	public void closeAll(Connection conn,Statement stmt,ResultSet rs) {
		if (rs != null) {  
			try {
				rs.close();
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

	public static void main(String[] args) {
		JdbcUtilV1 jdbc = new JdbcUtilV1();
		String sql="SELECT * FROM portal.TB_WORK_VALUE_IMP_SZCOMMISSION "; 
		List<String[]> list=jdbc.findList(sql);  
		System.out.println("---list.size="+list.size());
	}

}