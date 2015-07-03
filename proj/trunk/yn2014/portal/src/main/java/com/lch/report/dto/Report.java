package com.lch.report.dto;

import java.util.List;

public class Report {
	private String id;
	private String name;
	private int cx;//表的列数
	private int cy;//表的行数
	public int getCx() {
		return cx;
	}
	public void setCx(int cx) {
		this.cx = cx;
	}
	public int getCy() {
		return cy;
	}
	public void setCy(int cy) {
		this.cy = cy;
	}
	private List<String[]> topTitle;
	private List<String[]> leftTitle;
	private Condition condition;
	public Condition getCondition() {
		return condition;
	}
	public void setCondition(Condition condition) {
		this.condition = condition;
	}
	private long pageSize=15;
	public long getPageSize() {
		return pageSize;
	}
	public void setPageSize(long pageSize) {
		this.pageSize = pageSize;
	}
	private List<Table> bind;
	public List<Table> getBind() {
		return bind;
	}
	public void setBind(List<Table> bind) {
		this.bind = bind;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<String[]> getTopTitle() {
		return topTitle;
	}
	public void setTopTitle(List<String[]> topTitle) {
		this.topTitle = topTitle;
	}
	public List<String[]> getLeftTitle() {
		return leftTitle;
	}
	public void setLeftTitle(List<String[]> leftTitle) {
		this.leftTitle = leftTitle;
	}
}
