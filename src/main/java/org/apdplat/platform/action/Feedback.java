package org.apdplat.platform.action;

public class Feedback {
	private Long id;
	private String tip;
	
	public Feedback(){
		super();
	}
	public Feedback(Long id, String tip) {
		super();
		this.id = id;
		this.tip = tip;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTip() {
		return tip;
	}
	public void setTip(String tip) {
		this.tip = tip;
	}
}