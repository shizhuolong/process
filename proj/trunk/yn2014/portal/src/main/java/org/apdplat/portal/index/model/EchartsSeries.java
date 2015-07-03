package org.apdplat.portal.index.model;

import java.util.List;

/**
 * 定义一个echarts图表的Series类 设置其每一组sereis的一些基本属性
 * @author wcyong
 *
 */
public class EchartsSeries {

	public static final String SERIES_LINE = "line";//折线图
	public static final String SERIES_BAR = "bar";//柱状图
	public static final String SERIES_SCATTER = "scatter";//柱状图
	public static final String SERIES_K = "k";//柱状图
	public static final String SERIES_PIE = "pie";//饼图
	public static final String SERIES_RADAR = "radar";//雷达图
	public static final String SERIES_CHORD = "chord";//和弦图
	public static final String SERIES_FORCE = "force";//力导向布局图
	public static final String SERIES_MAP = "map";//地图
	
	/**
	 * sereis序列组id
	 */
	private int id;
	/**
	 * series序列组名称
	 */
	private String name;
	/**
	 * series序列组呈现图表类型(line、column、bar等)
	 */
	private String type;
	/**
	 * series序列组的数据为数据类型数组
	 */
	private List<Double> data;
	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<Double> getData() {
		return data;
	}
	public void setData(List<Double> data) {
		this.data = data;
	}
	
}
