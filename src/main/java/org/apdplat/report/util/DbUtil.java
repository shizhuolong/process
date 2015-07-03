package org.apdplat.report.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.sql.DataSource;

public class DbUtil {
	@Resource
	DataSource dataSource;

	// 查询所有记录
	public  List<String[]> findList(String sql) {
		System.out.println("-- sql=" + sql);
		List<String[]> list = new ArrayList<String[]>();
		Connection conn = null;
		Statement stmt = null;
		ResultSet rs = null;
		try {
			conn = dataSource.getConnection();
			stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
					ResultSet.CONCUR_READ_ONLY);
			rs = stmt.executeQuery(sql);
			ResultSetMetaData md = rs.getMetaData();
			int rs_cols = md.getColumnCount();
			String[] data = new String[rs_cols];
			while (rs.next()) {
				data = new String[rs_cols];
				for (int i = 0; i < rs_cols; i++) {
					if (rs.getString(i + 1) != null) {
						data[i] = rs.getString(i + 1).trim();// 替换英文逗号为中文,防止被误用成字段分隔符(1列变多列).replaceAll(",",
																// "，")
					} else {
						data[i] = ""; // 不等于null,减少页面判断null
					}
				}
				list.add(data);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			this.closeAll(conn, stmt, rs);
		}
		return list;
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
}
