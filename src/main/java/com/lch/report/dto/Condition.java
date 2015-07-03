package com.lch.report.dto;

import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import com.lch.report.power.PowerUtil;

public class Condition {
	private List<Button> buttons=new ArrayList<Button>();
	private List<Like> likes=new ArrayList<Like>();
	private List<Equal> equals=new ArrayList<Equal>();
	private String power;
	public String getPower() {
		return power;
	}
	public void setPower(String power) {
		this.power = power;
	}
	public List<Equal> getEquals() {
		return equals;
	}
	public void setEquals(List<Equal> equals) {
		this.equals = equals;
	}
	public List<Button> getButtons() {
		return buttons;
	}
	public void setButtons(List<Button> buttons) {
		this.buttons = buttons;
	}
	public List<Like> getLikes() {
		return likes;
	}
	public void setLikes(List<Like> likes) {
		this.likes = likes;
	}
	public List<Object> getConditions(){
		List<Object> ls = new ArrayList<Object>();
		ls.addAll(buttons);
		ls.addAll(likes);
		ls.addAll(equals);
		Object[] os=ls.toArray();
		Arrays.sort(os,new Comparator<Object>(){

			@Override
			public int compare(Object o1, Object o2) {
				if(o1==null||o2==null){
					return 0;
				}
				try {
					Method m1=o1.getClass().getDeclaredMethod("getIndex", new Class[]{});
					Method m2=o2.getClass().getDeclaredMethod("getIndex", new Class[]{});
					Object o1v= m1.invoke(o1, new Object[]{});
					Object o2v= m2.invoke(o2, new Object[]{});
					return ((Integer)o1v-(Integer)o2v);
				} catch (Exception e) {
					e.printStackTrace();
					return 0;
				}
			}
		});
		
		return Arrays.asList(os);
	}
}
