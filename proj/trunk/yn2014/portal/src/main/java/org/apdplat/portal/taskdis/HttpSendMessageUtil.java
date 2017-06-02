package org.apdplat.portal.taskdis;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;

import org.apdplat.platform.exception.BusiException;

/**
 * 
 * @author xsg date 2015-1-9
 */
public class HttpSendMessageUtil {

	public static final String CHARSET = "UTF-8";
	public static final String PHONETOKEN = "109CCA3D34A9F3E6E053823309B4F7B7";// 发短信访问地址token
	// 短信发送地址，如果地址多个以分号隔开
	public static final String MESSAGEURL = "http://130.86.10.199:10002/portal/message/message_sendMsg.action;http://130.86.10.199:10002/portal/message/message_sendMsg.action";

	public static void main(String[] a) {
		for(int i=0;i<500;i++){
			System.out.println(sendMessage("18669270883", "测试"+i));
		}
	}

	public static String sendMessage(String mobile, String content) {
		Map map = new HashMap();
		map.put("mobilePhone", mobile);
		map.put("mobileContent", content);
		String result = "0";
		try {
			result = readContentFromPost(MESSAGEURL.split(";")[0], map);
		} catch (IOException e) {
			try {
				result = readContentFromPost(MESSAGEURL.split(";")[1], map);
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
		if (!"0".equals(result)) {
			try {
				getConnection().createStatement().executeUpdate(
						" insert into portal.TB_PORTAL_MSGS_NEW(id,phone,content,DEAL_DATE) values ( "
								+ "'"+(UUID.randomUUID()+"").replaceAll("-", "")+"',"
								+ "'"+mobile+"',"
								+ "'"+content+"',"	
								+ "sysdate"
								+ ")");
				result = "0";
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;

	}

	/**
	 * 
	 * @Title readContentFromPost
	 * @Description TODO(http post请求)
	 * @param @param url
	 * @param @param map
	 * @param @return
	 * @param @throws IOException 设定文件
	 * @return String 返回类型
	 * @throws
	 */
	public static String readContentFromPost(String url, Map map)
			throws IOException {
		// Post请求的url，与get不同的是不需要带参数
		URL postUrl = new URL(url);
		// 打开连接
		HttpURLConnection connection = (HttpURLConnection) postUrl
				.openConnection();
		// 设置是否向connection输出，因为这个是post请求，参数要放在
		// http正文内，因此需要设为true
		connection.setDoOutput(true);
		// Read from the connection. Default is true.
		connection.setDoInput(true);
		// Set the post method. Default is GET
		connection.setRequestMethod("POST");
		// Post cannot use caches
		// Post 请求不能使用缓存
		connection.setUseCaches(false);
		connection.setConnectTimeout(30000);
		connection.setReadTimeout(30000);
		// URLConnection.setFollowRedirects是static函数，作用于所有的URLConnection对象。
		// connection.setFollowRedirects(true);
		// URLConnection.setInstanceFollowRedirects是成员函数，仅作用于当前函数
		connection.setInstanceFollowRedirects(true);
		// connection. Settings above must be set before connect!
		// 配置本次连接的Content-type，配置为application/x-www-form-urlencoded的
		// 意思是正文是urlencoded编码过的form参数，下面我们可以看到我们对正文内容使用URLEncoder.encode
		// 进行编码
		connection.setRequestProperty("Content-Type",
				"application/x-www-form-urlencoded;charset=" + CHARSET);
		// 连接，从postUrl.openConnection()至此的配置必须要在connect之前完成，
		// 要注意的是connection.getOutputStream会隐含的进行connect。
		connection.connect();
		DataOutputStream out = new DataOutputStream(
				connection.getOutputStream());
		StringBuffer sb = new StringBuffer();
		Iterator it = map.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry) it.next();
			sb.append(pairs.getKey())
					.append("=")
					.append(URLEncoder.encode(pairs.getValue().toString(),
							CHARSET)).append("&");
		}
		if (sb.length() > 0) {
			sb.setLength(sb.length() - 1);
		}

		// send data
		String sendData = sb.toString();
		out.writeBytes(sendData);
		out.flush();
		out.close(); // flush and close
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				connection.getInputStream(), CHARSET));// 设置编码,否则中文乱码
		String line = "";
		StringBuffer result = new StringBuffer();
		while ((line = reader.readLine()) != null) {
			if (line != null && !(line.trim()).equals("")) {
				result.append(line);
			}
		}
		reader.close();
		connection.disconnect();
		return result.toString();
	}

	/** 获得数据库连接 **/
	private static Connection getConnection() throws BusiException {

		Connection conn = null;
		InputStream in = null;
		try {
			in = HttpSendMessageUtil.class.getResourceAsStream("/properties/db.properties");
			Properties cp = new Properties();
			cp.load(in);
			String driver = cp.getProperty("db.driver");
			String strUrl = cp.getProperty("db.url");
			String username = cp.getProperty("db.username");
			String password = cp.getProperty("db.password");
			Class.forName(driver);
			conn = DriverManager.getConnection(strUrl, username, password);
		} catch (ClassNotFoundException e) {
			throw new BusiException(e.getMessage());
		} catch (IOException e) {
			throw new BusiException(e.getMessage());
		} catch (SQLException e) {
			throw new BusiException(e.getMessage());
		} finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return conn;
	}
}
