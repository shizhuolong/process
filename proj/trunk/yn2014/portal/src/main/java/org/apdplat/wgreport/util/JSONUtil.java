package org.apdplat.wgreport.util;

import net.sf.json.JSONSerializer;

public class JSONUtil {
	public static String toJson(Object obj) {
		if (obj == null)
			return "null";
		else if (obj instanceof Number || obj instanceof Boolean)
			return obj.toString();
		else if (obj instanceof Character || obj instanceof CharSequence) {
//			return "\""
//					+ obj.toString().replaceAll(
//							"([\"'\\(\\)\\[\\]\\{\\}:\\.\\/\\\\])", "\\\\$1") + "\"";
			return "\""
			+ obj.toString().replaceAll(
					"([\"\\'\n\r\t\b\f\\&\\\\])", "\\\\$1") + "\"";
		} else
			// 复杂对象
			return JSONSerializer.toJSON(obj).toString();
	}

	public static Object toJava(String json) {
		JSONSerializer jser = new JSONSerializer();
		if (StringUtil.isNull(json) || json.matches("^\\s*null\\s*$"))
			return null;
		json = json.trim();
		if (json.matches("(^\\{.*\\}$)|(^\\[.*\\]$)")) {
			return jser.toJava(JSONSerializer.toJSON(json));
		} else if (json.matches("\\d+")) {
			return NumberUtil.parseInteger(json);
		} else if (json.matches("\\d+\\.\\d+")) {
			return NumberUtil.parseDouble(json);
		} else if (json.matches("(^\".*\"$)|(^\'.*\'$)")) {
			return json.replaceAll("(^[\"\'])|([\"\']$)", "");
		} else{
			throw new UtilsException("parse Error");
		}
	}
}
