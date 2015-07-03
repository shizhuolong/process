package org.apdplat.platform.util;

import java.util.Calendar;

public class DateUtil {
	public static String getZhWeekDay(Calendar c) {
		if (c == null) {
			return "星期一";
		}
		if (Calendar.MONDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期一";
		}
		if (Calendar.TUESDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期二";
		}
		if (Calendar.WEDNESDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期三";
		}
		if (Calendar.THURSDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期四";
		}
		if (Calendar.FRIDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期五";
		}
		if (Calendar.SATURDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期六";
		}
		if (Calendar.SUNDAY == c.get(Calendar.DAY_OF_WEEK)) {
			return "星期日";
		}
		return "星期一";
	}
	public static void main(String[] args) {
		
		Calendar c=Calendar.getInstance();
		System.out.println(getZhWeekDay(c));
	}
}
