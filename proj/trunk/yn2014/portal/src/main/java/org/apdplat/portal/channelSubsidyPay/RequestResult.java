package org.apdplat.portal.channelSubsidyPay;

public class RequestResult {
	private boolean ok;
	private String msg;
	private Object data;
	public boolean isOk() {
		return ok;
	}
	public void setOk(boolean ok) {
		this.ok = ok;
	}
	public String getMsg() {
		return msg;
	}
	public RequestResult() {
		super();
		// TODO Auto-generated constructor stub
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}
