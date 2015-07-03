package org.apdplat.wgreport.util;

import java.util.List;

import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.wgreport.support.db.FindSupport;
import org.apdplat.wgreport.support.db.UpdateSupport;
import org.apdplat.wgreport.support.db.queryformer.Queryformer;
import org.apdplat.wgreport.support.db.queryformer.SelectQueryformer;
import org.apdplat.wgreport.support.preferense.Config;

/**
 * 数据库支持类，辅助处理SQL语句及其参数
 * 
 * 
 */
public abstract class DbHelper {
	/**
	 * 通过sql键获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySqlKey(String sqlKey, String jsCondition) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return getBySqlKey(sqlKey, condition);
	}

	/**
	 * 通过sql键获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySqlKey(String sqlKey, String jsCondition,
			List replaceValues) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return getBySqlKey(sqlKey, condition, replaceValues);
	}

	/**
	 * 通过sql键获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySqlKey(String sqlKey, String jsCondition,
			Object[] replaceValues) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return getBySqlKey(sqlKey, condition, replaceValues);
	}

	/**
	 * 通过sql语句获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySQL(String sql, String jsCondition) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return getBySQL(sql, condition);
	}

	/**
	 * 通过sql语句获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySQL(String sql, String jsCondition,
			List replaceValues) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return getBySQL(sql, condition, replaceValues);
	}

	/**
	 * 通过sql语句获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySQL(String sql, String jsCondition,
			Object[] replaceValues) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return getBySQL(sql, condition, replaceValues);
	}

	/**
	 * 通过sql键值获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySqlKey(String sqlKey, List condition) {
		String sql = Config.getProperty(sqlKey);
		return getBySQL(sql, condition);
	}

	/**
	 * 通过sql键值获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySqlKey(String sqlKey, List condition,
			List replaceValues) {
		String sql = Config.getProperty(sqlKey);
		return getBySQL(sql, condition, replaceValues);
	}

	/**
	 * 通过sql键值获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySqlKey(String sqlKey, List condition,
			Object[] replaceValues) {
		String sql = Config.getProperty(sqlKey);
		return getBySQL(sql, condition, replaceValues);
	}

	/**
	 * 通过sql语句获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySQL(String sql, List condition) {
		Queryformer sf = new SelectQueryformer(sql, condition, false);
		FindSupport fs = SpringManager.getFindDao();
		return fs.find(sf.getQuery(), sf.getParameters());
	}

	/**
	 * 通过sql语句获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySQL(String sql, List condition,
			Object[] replaceValues) {
		return getBySQL(sql, condition, ArrayUtil.toList(replaceValues));
	}

	/**
	 * 通过sql语句获取数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return List<Map> map中的键值为字段名称,小写
	 */
	public static List getBySQL(String sql, List condition, List replaceValues) {
		Queryformer sf = new SelectQueryformer(sql, condition, false);
		FindSupport fs = SpringManager.getFindDao();
		String query = _replaceValues(sf.getQuery(), replaceValues);
		Object[] params = sf.getParameters();
		return fs.find(query, params);
	}

	/**
	 * 通过sql语句键值更新数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param jsCondition
	 *            javascript语法条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return int 受影响的数据条数
	 */
	public static int updateBySQLKey(String sqlKey, String jsCondition) {
		return updateBySQLKey(sqlKey, (List) JSONUtil.toJava(jsCondition));
	}

	/**
	 * 通过sql语句键值更新数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return int 受影响的数据条数
	 */
	public static int updateBySQLKey(String sqlKey, List condition) {
		return updateBySQLKey(sqlKey, condition, (List) null);
	}

	/**
	 * 通过sql语句键值更新数据
	 * 
	 * @param sqlKey
	 *            sql键
	 * @param condition
	 *            条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return int 受影响的数据条数
	 */
	public static int updateBySQLKey(String sqlKey, List condition,
			List replaceValues) {
		return updateBySQL(Config.getProperty(sqlKey), condition, replaceValues);
	}

	/**
	 * 通过sql语句更新数据
	 * 
	 * @param sql
	 *            sql语句
	 * @param jsCondition
	 *            javascript语法表达的条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return int 受影响的数据条数
	 */
	public static int updateBySQL(String sql, String jsCondition) {
		List condition = (List) JSONUtil.toJava(jsCondition);
		return updateBySQL(sql, condition);
	}

	/**
	 * 通过sql语句更新数据
	 * 
	 * @param sql
	 *            sql语句
	 * @param condition
	 *            条件
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return int 受影响的数据条数
	 */
	public static int updateBySQL(String sql, List condition) {
		return updateBySQL(sql, condition, (List) null);
	}

	/**
	 * 通过sql语句更新数据
	 * 
	 * @param sql
	 *            sql语句
	 * @param condition
	 *            条件
	 * @param replaceValues
	 *            替换值
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer
	 * @return int 受影响的数据条数
	 */
	public static int updateBySQL(String sql, List condition, List replaceValues) {
		Queryformer sf = new SelectQueryformer(sql, condition, false);
		UpdateSupport up = SpringManager.getUpdateDao();
		String query = _replaceValues(sf.getQuery(), replaceValues);
		Object[] params = sf.getParameters();
		return up.update(query, params);
	}
   
	public static void updatebykey(String sql,Object[] obj){
		String query=Config.getProperty(sql);
		 SpringManager.getUpdateDao().update(query, obj);
	}
	public static List getAraary(String sql,String jsCondition,List replace){
		List condition = (List) JSONUtil.toJava(jsCondition);
		String sqls = Config.getProperty(sql);
		Queryformer sf = new SelectQueryformer(sqls, condition, false);
		FindSupport fs = SpringManager.getArrayFindDao();
		String query = _replaceValues(sf.getQuery(), replace);
		Object[] params = sf.getParameters();
		return fs.find(query, params);
	}
	/**
	 * 按replaceValues中的次序替换标记值<br/>
	 * 标记值如：$1,$2,...
	 * 
	 * @param str
	 *            待替换的字符串
	 * @param replaceValues
	 *            替换的值
	 * @return 替换完成后的字符串
	 */
	protected static String _replaceValues(final String str,
			Object[] replaceValues) {
		return _replaceValues(str, ArrayUtil.toList(replaceValues));
	}

	/**
	 * 按replaceValues中的次序替换标记值<br/>
	 * 标记值如：$1,$2,...
	 * 
	 * @param str
	 *            待替换的字符串
	 * @param replaceValues
	 *            替换的值
	 * @return 替换完成后的字符串
	 */
	protected static String _replaceValues(final String str, List replaceValues) {
		if (replaceValues == null)
			return str.replaceAll("\\$\\d*", "");// 替换掉不合适的【$+数值】标记字符
		String result = str;
		// 替换标记值
		for (int i = 0, imax = replaceValues.size(); i < imax; i++) {
			String value = StringUtil.nullTrim(replaceValues.get(i));
			if (StringUtil.isNull(value))
				continue;
			result = result.replaceAll("\\$" + (i + 1) + "", value);// 使用替换值，替换掉特定的【$+数值】标记字符
		}
		return result.replaceAll("\\$\\d*", "");// 替换掉不合适的【$+数值】标记字符
	}
}
