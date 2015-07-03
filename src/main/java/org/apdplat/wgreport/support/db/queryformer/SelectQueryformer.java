package org.apdplat.wgreport.support.db.queryformer;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.regex.Pattern;

import org.apdplat.wgreport.support.db.helper.PrepareStatementHelper;
import org.apdplat.wgreport.support.db.helper.TypeHelper;
import org.apdplat.wgreport.util.ArrayUtil;
import org.apdplat.wgreport.util.MapUtil;
import org.apdplat.wgreport.util.PatternUtil;
import org.apdplat.wgreport.util.StringUtil;

/**
 * select 语句示例：select a,b from table where a=? and b:int=? and c=2 :int表示类型
 * 
 * 
 */
public class SelectQueryformer extends AbstractQueryformer implements
		Queryformer {
	List conditions;
	boolean addDefaultOrder;

	public SelectQueryformer(String query, List conditions,
			boolean addDefaultOrder) {
		this.query = query;
		this.conditions = conditions;
		this.addDefaultOrder = addDefaultOrder;
		execute();
	}

	public SelectQueryformer(String query, List conditions) {
		this(query, conditions, true);
	}

	protected void execute() {
		// 通过conditions,查找出需要替换掉的标记
		Vector v = PatternUtil.findAll(
				"((\\w+\\.)?(\\w+)\\s*(\\:\\w+)*\\s*=\\s*\\?)|(\\:\\w+)?\\?",
				query);
		int conditionMax = conditions == null ? -1 : (conditions.size() - 1);
		parameters = new Object[] {};
		// 循环v
		for (int i = 0; i < v.size(); i++) {
			String str = (String) v.get(i);
			String columntype = "varchar";
			String wheretype = "eq";
			Collection paraValues;
			Object[] values = null;
			if (i > conditionMax) {// 去除条件
				query = deleteCondition(query, str);
				continue;
			} else if (str.length() == 1) {// 对?等的处理
				Object conI = conditions.get(i);
				if (conI instanceof Array) {// 是数组,表明直接是值
					values = (Object[]) conI;
				} else if (conI instanceof Collection) {// 是Collection,表明直接是值
					values = ((Collection) conI).toArray();
				} else {
					Map condition = MapUtil.getMap(conI);
					paraValues = (Collection) condition.get("value");
					values = transToValues(wheretype, columntype, paraValues);
				}
				if (values == null || values.length < 1) {
					values = new Object[] { null };
				} else {
					values = new Object[] { values[0] };
				}
				parameters = ArrayUtil.concat(parameters, values);
				continue;
			} else {
				Object conI = conditions.get(i);
				if (conI == null) {// 去除条件
					query = deleteCondition(query, str);
					continue;
				}
				// 取得参数类型
				columntype = PatternUtil.find("\\:(\\w+)", str, 1);
				if (StringUtil.isNull(columntype))
					columntype = "varchar";

				// 取得参数名称
				String columnname = PatternUtil.find("(\\w+\\.)?\\w+", str);
				if (conI instanceof Array) {// 是数组,表明直接是值
					values = (Object[]) conI;
				} else if (conI instanceof Collection) {// 是Collection,表明直接是值
					values = ((Collection) conI).toArray();
				} else {
					Map condition = MapUtil.getMap(conI);
					paraValues = (Collection) condition.get("value");
					if (paraValues == null || paraValues.size() == 0) {// 去除条件
						query = deleteCondition(query, str);
						continue;
					}
					// 修正查询，因char问题,需加trim(trim会影响速度,注释下列两行代码后需保证char类型数据不能留空格,否则会匹配不上)
					// if (columntype.matches("(?i)\\s*char(\\(\\d+\\))*\\s*"))
					// columnname = "trim(" + columnname + ")";
					// logger.trace("[str]" + str + ",[columnname]" +
					// columnname);
					wheretype = (String) condition.get("type");
					if (StringUtil.isNull(wheretype))
						wheretype = "eq";
					values = transToValues(wheretype, columntype, paraValues);
				}
				// 替换条件
				query = query.replaceFirst(Pattern.quote(str),
						PrepareStatementHelper.getWhereQmark(columnname,
								wheretype, values.length));

				// 转化参数
				parameters = ArrayUtil.concat(parameters, values);
			}
		}

		// 添加order by
		if (addDefaultOrder && !query.matches(".*((?i)\\s+(order by)\\s+).*"))
			query += " order by 1";
	}

	/**
	 * 将value转换为指定类型数组
	 * 
	 * @param columntype
	 *            列数据类型
	 * @param collection
	 *            待转换的集合
	 * @return 转换后的数组
	 */
	protected Object[] transToValues(String type, String columntype,
			Collection collection) {
		Class targetType = null;
		if (TypeHelper.isLike(type)) {// 对于模糊匹配类型,值全部转换成String类型
			targetType = String.class;
		} else
			targetType = TypeHelper.getType(columntype);
		return ArrayUtil.toArray(collection, targetType);
	}

	protected String deleteCondition(String query, String condition) {
		String rex = Pattern.quote(condition);
		String match;
		String nrex;
		nrex = "\\b((?i)and|or)\\b\\s*" + rex;
		match = PatternUtil.find(nrex, query);
		if (match != null)
			return query.replaceFirst(nrex, "");
		nrex = rex + "\\s*\\b((?i)and|or)\\b";
		match = PatternUtil.find(nrex, query);
		if (match != null)
			return query.replaceFirst(nrex, "");
		nrex = "\\b(?i)where\\b\\s*" + rex;
		match = PatternUtil.find(nrex, query);
		if (match != null)
			return query.replaceFirst(nrex, "");
		return query;
	}

}
