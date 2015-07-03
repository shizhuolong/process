package org.apdplat.wgreport.util;

import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PatternUtil {
	/**
	 * 返回第一个模式匹配的字符串,若没有则为 null
	 * 
	 * @param regex
	 *            模式字符串
	 * @param input
	 *            待查找的字符串
	 * @return 返回第一个模式匹配的字符串
	 */
	public static String find(String regex, String input) {
		return find(regex, input, 0);
	}

	/**
	 * 返回第一个模式匹配的字符串,若没有则为 null
	 * 
	 * @param regex
	 *            模式字符串
	 * @param input
	 *            待查找的字符串
	 * @param group
	 *            匹配到的组序号,从0开始
	 * @return 返回第一个模式匹配的字符串
	 */
	public static String find(String regex, String input, int group) {
		return find(Pattern.compile(regex), input, group);
	}

	/**
	 * 返回第一个模式匹配的字符串,若没有则为 null
	 * 
	 * @param pattern
	 *            匹配模式
	 * @param input
	 *            待查找的字符串
	 * @param group
	 *            匹配到的组序号,从0开始
	 * @return 返回第一个模式匹配的字符串
	 */
	public static String find(Pattern pattern, String input, int group) {
		return find(pattern, input, group, 0);
	}

	/**
	 * 返回模式匹配的字符串,若没有则为 null
	 * 
	 * @param pattern
	 *            匹配模式
	 * @param input
	 *            待查找的字符串
	 * @param group
	 *            匹配到的组序号,从0开始
	 * @param index
	 *            第几次匹配,从0开始
	 * @return 返回模式匹配的字符串
	 */
	public static String find(Pattern pattern, String input, int group,
			int index) {
		String result = null;
		Matcher m = pattern.matcher(input);
		if (m.find(index))
			result = m.group(group);
		return result;
	}

	public static Vector findAll(String regex, String input) {
		return findAll(regex, input, 0);
	}

	public static Vector findAll(String regex, String input, int group) {
		return findAll(Pattern.compile(regex), input, group);
	}

	public static Vector findAll(Pattern pattern, String input) {
		return findAll(pattern, input, 0);
	}

	/**
	 * 搜索所有满足的字符，返回字符数组
	 * 
	 * @param pattern
	 * @param input
	 * @param group
	 * @return 字符数组
	 */
	public static Vector findAll(Pattern pattern, String input, int group) {
		Vector v = new Vector();
		Matcher m = pattern.matcher(input);
		while (m.find())
			v.add(m.group(group));
		return v;
	}

	/**
	 * 是否匹配
	 * 
	 * @param regex
	 *            匹配模式字符串
	 * @param input
	 *            待匹配的字符串
	 * @return 是否匹配
	 */
	public static boolean matches(String regex, String input) {
		return Pattern.matches(regex, input);
	}

	/**
	 * 是否匹配
	 * 
	 * @param pattern
	 *            匹配模式
	 * @param input
	 *            待匹配的字符串
	 * @return 是否匹配
	 */
	public static boolean matches(Pattern pattern, String input) {
		return pattern.matcher(input).matches();
	}
}
