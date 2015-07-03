package org.apdplat.platform.util;

import java.io.Serializable;

/**
 * 
 * @author suyi
 *
 */
public class ResultInfo implements Serializable{
	
	/**
	* @Fields serialVersionUID : TODO
	*/
	private static final long serialVersionUID = 1L;
	public static final String _CODE_OK_ = "OK";
	public static final String _CODE_FAIL_ = "FAIL";
	private String code; //返回前台代码
	private String msg;	 //返回前台信息
	
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}

	
}