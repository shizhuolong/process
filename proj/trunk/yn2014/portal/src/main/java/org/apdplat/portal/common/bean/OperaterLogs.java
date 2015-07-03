package org.apdplat.portal.common.bean;


import org.apdplat.portal.common.BaseBean;


/**
 *操作日志表
 * @author xsg
 *
 */
public class OperaterLogs extends BaseBean{

	
	private String id;//实例ID
	private String code;//-1异常 0正常订单取消 1正常订单生成 2返销订单 3返销取消 4日结清机 5更结
	private String operater;	//操作人人
	private String operaterName;	//操作人人
	private String operateTime;	//操作时间
	private String  msg;//备注
	private String uniqueCode;//操作管理唯一码 如关联订单号等 一般为主键 
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getOperater() {
		return operater;
	}
	public void setOperater(String operater) {
		this.operater = operater;
	}
	public String getOperaterName() {
		return operaterName;
	}
	public void setOperaterName(String operaterName) {
		this.operaterName = operaterName;
	}
	public String getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(String operateTime) {
		this.operateTime = operateTime;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getUniqueCode() {
		return uniqueCode;
	}
	public void setUniqueCode(String uniqueCode) {
		this.uniqueCode = uniqueCode;
	}

}
