package org.apdplat.wgreport.support.db.helper;

import org.apdplat.wgreport.util.ArrayUtil;
import org.apdplat.wgreport.util.StringUtil;

public abstract class PrepareStatementHelper {
	/**
	 * sql预编译语句条件中与字段名合并后的?,若num<1则""
	 * 
	 * @param what
	 *            字段名
	 * @param num
	 *            ?重复的次数
	 * @return "A=?"或"A in (?,?,...)"的形式，若num<1则""
	 */
	public static String getWhereQmark(String what, int num) {
		String r = getWhereQmark(num);
		if (r != null)
			return what + r;
		else
			return "";
	}

	public static String getWhereQmark(String what, String type, int num) {
		if (type == null || type.equals("eq"))
			return getWhereQmark(what, num);
		else if (type.equals("gt"))
			return what + ">?";
		else if (type.equals("ge"))
			return what + ">=?";
		else if (type.equals("lt"))
			return what += "<?";
		else if (type.equals("le"))
			return what += "<=?";
		else if (type.equals("ne"))
			return what += "<>?";
		else if (ArrayUtil.contains(new String[] { "begin_with", "end_with",
				"contain" }, type))
			return what += " like ?";
		else
			return getWhereQmark(what, num);
	}

	/**
	 * 取得sql预编译语句条件中?,若num<1，则返回null
	 * 
	 * @param num
	 *            ?的个数
	 * @return "="或"in (?,?,...)"的形式,num<1时null
	 */
	public static String getWhereQmark(int num) {
		if (num == 1)
			return "=?";
		else if (num > 1)
			return " in (" + StringUtil.repeat("?", num - 1, ",") + ")";
		else
			return null;
	}
}
