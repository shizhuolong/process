package org.apdplat.wgreport.commands.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;
import org.apdplat.wgreport.commands.HttpCommand;
import org.apdplat.wgreport.common.SpringManager;
import org.apdplat.wgreport.detail.DetailDownload;
import org.apdplat.wgreport.support.db.queryformer.Queryformer;
import org.apdplat.wgreport.support.db.queryformer.SelectQueryformer;
import org.apdplat.wgreport.support.exporter.ExcelTemplate;
import org.apdplat.wgreport.support.exporter.ExcelValidation;
import org.apdplat.wgreport.support.preferense.Config;
import org.apdplat.wgreport.support.servlets.SpringServlet;
import org.apdplat.wgreport.util.ArrayUtil;
import org.apdplat.wgreport.util.DatesUtil;
import org.apdplat.wgreport.util.MapUtil;
import org.apdplat.wgreport.util.NumberUtil;
import org.apdplat.wgreport.util.StringUtil;
import org.apdplat.wgreport.util.UUIDUtil;

public abstract class CommonHttpCommand extends AbstractHttpCommand implements
		HttpCommand {
	public Object process(Object o) {
		Map md = MapUtil.getMap(o);
		int type = NumberUtil.toInt(md.get("type"));
		Object data = md.get("data");
		Object result = null;

		switch (type) {// type 1-100由本类实现,其它由子类实现
		case 0:
			result = _getUserInfo();
			break;
		case 1:
			result = _pageData(data);
			break;
		case 2:
			result = _count(data);
			break;
		case 3:
			result = _updateByQueryKeys(data);
			break;
		case 4:
			result = _download(data);
			break;
		/*case 5:
			result = _picture(data);
			break;*/
		case 6:
			result = _getData(data);
			break;
		/*case 7:
			result = _pictureData(data);
			break;*/
		case 8:
			result = _downWithTemplate(data);
			break;
		case 9:
			_updateByQueryKey(data);
			result = null;
			break;
		case 10:
			result = _downWithValidation(data);
			break;
		case 50:
			result = _getIdTime();
			break;
		case 51:
			result = _initFind(data);
			break;
		default:
			result = process(type, data);
			break;
		}
		return result;
	}

	protected Object _initFind(Object data) {
		Map result = (Map) _getUserInfo();
		result.put("data", _getData(data));
		result.put("time", DatesUtil.format());
		return result;
	}

	/**
	 * 处理数据,子类处理
	 * 
	 * @param type
	 *            类型，供转向使用
	 * @param data
	 *            数据
	 * @return 数据
	 */
	public abstract Object process(int type, Object data);

	protected String _getQuery(String key, Map md) {
		String query = null;
		String queryKey = (String) md.get(key);
		if (StringUtil.isNotNull(queryKey))
			query = Config.getProperty(queryKey);
		if (StringUtil.isNull(query))
			query = (String) md.get("query");
		return StringUtil.nullTrim(query);
	}

	protected String _getQuery(Map md) {
		return _getQuery("queryKey", md);
	}

	/**
	 * 获取用户信息
	 * 
	 * @return 用户信息
	 */
	protected Object _getUserInfo() {
//		Operator operator = (Operator)ServletActionContext.getRequest().getSession().getAttribute("operator");
		Map result = new HashMap();
		result.put("userid", getUserid());// 用户id
		result.put("region", getFromSession("j_region"));// 用户地市
//		result.put("region", null == operator?"-99":operator.getRegionCode());// 用户地市
//		result.put("city", null == operator?"-99":operator.getCityCode());// 用户区县
		result.put("city", getFromSession("j_city"));// 用户区县
		result.put("pmn", getCheckAdmin()); //是否是管理员权限
		result.put("pmn1", getCheckUserSelect()); //判断用户是否 是 只有查询权限
		return result;
	}
	
	protected int  getCheckAdmin(){
//		String userid = getUserid();
//		String userid = "2";
//		String sql = Config.getProperty("sql.zj.yzjz.check.admin.count");
//		int count = getArrayFindDao().count(sql,new Object[]{userid});
		return 1;
	}
	protected int  getCheckUserSelect(){
		
//		String userid = getUserid();
//		String userid = "2";
//		String sql = Config.getProperty("sql.zj.yzjz.check.userselect.count");
//		int count = getArrayFindDao().count(sql,new Object[]{userid});
		return 0;
	}

	/**
	 * 对于数据,条件相同,语句不同,连续执行<br/>
	 * 支持替换标记值(组)。标记值如:$1,$2,...
	 * 
	 * @see #_updateByQueryKey(String, List)
	 * @param data
	 *            参数
	 * @return null
	 */
	protected Object _updateByQueryKeys(Object data) {
		Map md = MapUtil.getMap(data);
		List querys = new ArrayList();
		List _querys = (List) md.get("querys");
		List queryKeys = (List) md.get("queryKeys");
		if (queryKeys != null) {
			for (int i = 0, imax = queryKeys.size(); i < imax; i++) {
				querys.add(Config.getProperty((String) queryKeys.get(i)));
			}
		}
		if (_querys != null)
			querys.addAll(_querys);
		List conditions = (List) md.get("conditions");
		List replaceValues = (List) md.get("replaceValues");
		if (replaceValues == null)
			replaceValues = new ArrayList();
		int rn = replaceValues.size();
		// 更新目标客户群表
		for (int i = 0, imax = querys.size(); i < imax; i++) {
			_updateByQuery((String) querys.get(i), conditions,
					i < rn ? (List) replaceValues.get(i) : null);
		}
		return null;
	}

	/**
	 * 执行更新,支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_replaceValues(String, List)
	 * @see #_updateByQueryKey(String, List, List)
	 * @param data
	 *            参数
	 */
	protected void _updateByQueryKey(Object data) {
		Map md = MapUtil.getMap(data);
		List replaceValues = (List) md.get("replaceValues");
		List conditions = (List) md.get("conditions");
		_updateByQuery(_getQuery(md), conditions, replaceValues);
	}

	/**
	 * 根据query表示的语句 执行更新 <br/>
	 * 不支持替换标记值
	 * 
	 * @param query
	 *            获取语句query
	 * @param conditions
	 *            条件
	 */
	protected void _updateByQuery(String query, List conditions) {
		_updateByQuery(query, conditions, null);
	}

	/**
	 * 执行更新,支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(String, List)
	 * @param query
	 *            语句query
	 * @param conditions
	 *            条件
	 * @param replaceValues
	 *            替换值
	 */
	protected void _updateByQuery(String query, List conditions,
			List replaceValues) {
		query = _replaceValues(query, replaceValues);
		Queryformer qf = _queryFormer(query, conditions);
		getUpdateDao().update(qf.getQuery(), qf.getParameters());
	}

	/**
	 * 构造Queryformer,支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(String, List)
	 * @param md
	 *            参数Map(queryKey:String,conditions:List)
	 * @return Queryformer
	 */
	protected Queryformer _queryFormer(Map md) {
		List replaceValues = (List) md.get("replaceValues");
		String query = _replaceValues(_getQuery(md), replaceValues);
		List conditions = (List) md.get("conditions");
		return _queryFormer(query, conditions);
	}

	/**
	 * 构造Queryformer
	 * 
	 * @see com.unicom.biportal.support.db.queryformer.SelectQueryformer#SelectQueryformer(String,
	 *      List, boolean)
	 * @param query
	 *            需要整合的语句
	 * @param conditions
	 *            条件
	 * @return Queryformer
	 */
	protected Queryformer _queryFormer(String query, List conditions) {
		return new SelectQueryformer(query, conditions, false);
	}

	/**
	 * 获取分页数据列表<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(Map)
	 * @param data
	 *            参数
	 * @return 数据List
	 */
	protected List _pageData(Object data) {
		Map md = MapUtil.getMap(data);
		int first = NumberUtil.toInt(md.get("first"));
		int limit = NumberUtil.toInt(md.get("limit"));
		Queryformer qf = _queryFormer(md);
		return getArrayFindDao().find(qf.getQuery(), qf.getParameters(), first,
				limit);
	}

	/**
	 * 获取数据列表<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(Map)
	 * @param data
	 *            参数
	 * @return 数据List
	 */
	protected List _getData(Object data) {
		Map md = MapUtil.getMap(data);
		Queryformer qf = _queryFormer(md);
		return _getData(qf.getQuery(), qf.getParameters());
	}

	/**
	 * 根据语句和条件获取数据
	 * 
	 * @see com.unicom.biportal.support.db.FindSupport#find(String, Object[])
	 * @param query
	 *            查询语句
	 * @param conditions
	 *            条件数组
	 * @return 数据列表
	 */
	protected List _getData(String query, Object[] conditions) {
		return getArrayFindDao().find(query, conditions);
	}

	/**
	 * 下载<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(Map)
	 * @param data
	 *            数据Map
	 *            {configname:String,columns:String,queryKey:String,conditions
	 *            :List }
	 * @return false
	 */
	protected Object _download(Object data) {
		Map md = MapUtil.getMap(data);
		String configname = (String) md.get("configname");
		String columns = (String) md.get("columns");
		Queryformer qf = _queryFormer(md);
		String query = qf.getQuery();
		Object[] paragrams = qf.getParameters();

		DetailDownload d = SpringManager.getDetailDownload();
		Object result = null;
		d.addDownloadTask(configname, query, paragrams, columns, getUserid(),request.getRemoteAddr(), "s0-0-0");
		result = new Boolean(false);
		System.out.println("result++++++++++====="+result);
		return result;
	}

	/**
	 * 计算数据条数<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(Map)
	 * @param data
	 *            参数
	 * @return Integer
	 */
	protected Integer _count(Object data) {
		Map md = MapUtil.getMap(data);
		Queryformer qf = _queryFormer(md);
		int cnt = getArrayFindDao().count(qf.getQuery(), qf.getParameters());
		return new Integer(cnt);
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
	protected String _replaceValues(final String str, Object[] replaceValues) {
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
	protected String _replaceValues(final String str, List replaceValues) {
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

	/**
	 * 查询数据并获取图形<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @param data
	 *            参数
	 * @return 图形信息
	 */
	/*protected Object[] _picture(Object data) {
		return _picture(data, _getData(data));
	}*/

	/**
	 * 根据数据生成图形格式
	 * 
	 * @param data
	 *            参数,包含数据(dataSet)
	 * @return 图形
	 */
	/*protected Object[] _pictureData(Object data) {
		Map md = MapUtil.getMap(data);
		return _picture(data, (List) md.get("dataSet"));
	}*/

	/**
	 * 由已知数据获取图形<br/>
	 * 
	 * @param data
	 *            参数
	 * @return 图形信息
	 */
	/*protected Object[] _picture(Object data, List dataList) {
		Map md = MapUtil.getMap(data);

		// 构建图形
		// 图形配置
		Map config = MapUtil.getMap(md.get("picture_config"));
		String picturePath = Config.getProperty(ConfigKeys.folder_picture);
		String realPath = PathUtil.getWebRootAbsolutePath(picturePath);
		config.put("data", dataList);
		int type = NumberUtil.toInt(config.get("type"));
		Chart chart = ChartFactory.getChart(type);
		String imgName = chart.create(config, realPath);
		String imgMap = chart.getMapinfo();

		// 取得图形的特定配置
		Config picConfig = chart.getConfig();
		String mapName = picConfig.getMapname();
		// 返回数据
		return new Object[] { imgName, imgMap, mapName, data };
	}*/

	/**
	 * 根据模板导出数据<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_downWithTemplate(Map)
	 * @param data
	 *            参数
	 * @return 绝对路径
	 */
	protected Object _downWithTemplate(Object data) {
		return _downWithTemplate(MapUtil.getMap(data));
	}

	/**
	 * 根据模板导出数据<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(Map)
	 * @param md
	 *            Map
	 *            {queryKey:String,conditions:List,excelModal:String,cols:Integer
	 *            [,startRow:Integer,startCol:Integer]}
	 * @return 绝对路径
	 */
	protected Object _downWithTemplate(Map md) {
		// excel模板名称
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		// 以下标识示例行
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));

		List excelData = (List) md.get("excelData");
		//System.out.println(excelData.size());

		String excelModalFolder = Config.getProperty("Folder.excelModal");
		String downFolder = Config.getProperty("Folder.down");

		excelModalFile = SpringServlet.getRealPath(excelModalFolder + "/"
				+ excelModalFile);
		exportFile = SpringServlet.getRealPath(downFolder + "/" + exportFile);

		if (excelData == null) {
			Queryformer qf = _queryFormer(md);
			excelData = getArrayFindDao().find(qf.getQuery(),
					qf.getParameters());
		} else {// excelData中的元素假定为List,将其转换为Object[]
			int imax = excelData.size();
			List dataList = new ArrayList(imax);
			for (int i = 0; i < imax; i++) {
				Object tempObj = excelData.get(i);
				if (tempObj != null)
					tempObj = ((List) tempObj).toArray();
				dataList.add(tempObj);
			}
			excelData = dataList;
		}

		ExcelTemplate ee = new ExcelTemplate();
		ee.setStartRow(startRow);
		ee.setStartCol(startCol);
		ee.setCols(cols);
		ee.setData(excelData);
		ee.setExcelModalFile(new File(excelModalFile));
		ee.setExportFile(new File(exportFile));
		ee.print();

		return exportFile;
	}
	
	
	/**
	 * 根据模板导出数据<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_downWithTemplate(Map)
	 * @param data
	 *            参数
	 * @return 绝对路径
	 */
	protected Object _downWithValidation(Object data) {
		return _downWithValidation(MapUtil.getMap(data));
	}

	/**
	 * 根据模板导出数据<br/>
	 * 支持替换标记值。标记值如:$1,$2,...
	 * 
	 * @see #_queryFormer(Map)
	 * @param md
	 *            Map
	 *            {queryKey:String,conditions:List,excelModal:String,cols:Integer
	 *            [,startRow:Integer,startCol:Integer]}
	 * @return 绝对路径
	 */
	protected Object _downWithValidation(Map md) {
		// excel模板名称
		String excelModalFile = (String) md.get("excelModal");
		String exportFile = UUIDUtil.generate() + ".xls";
		// 以下标识示例行
		int startRow = NumberUtil.toInt(md.get("startRow"));
		int startCol = NumberUtil.toInt(md.get("startCol"));
		int cols = NumberUtil.toInt(md.get("cols"));

		List excelData = (List) md.get("excelData");
		System.out.println(excelData.size());

		String excelModalFolder = Config.getProperty("Folder.excelModal");
		String downFolder = Config.getProperty("Folder.down");

		excelModalFile = SpringServlet.getRealPath(excelModalFolder + "/"
				+ excelModalFile);
		exportFile = SpringServlet.getRealPath(downFolder + "/" + exportFile);

		if (excelData == null) {
			Queryformer qf = _queryFormer(md);
			excelData = getArrayFindDao().find(qf.getQuery(),
					qf.getParameters());
		} else {// excelData中的元素假定为List,将其转换为Object[]
			int imax = excelData.size();
			List dataList = new ArrayList(imax);
			for (int i = 0; i < imax; i++) {
				Object tempObj = excelData.get(i);
				if (tempObj != null)
					tempObj = ((List) tempObj).toArray();
				dataList.add(tempObj);
			}
			excelData = dataList;
		}

		ExcelValidation ee = new ExcelValidation();
		ee.setStartRow(startRow);
		ee.setStartCol(startCol);
		ee.setCols(cols);
		ee.setData(excelData);
		ee.setExcelModalFile(new File(excelModalFile));
		ee.setExportFile(new File(exportFile));
		ee.print();

		return exportFile;
	}

	/**
	 * 返回唯一编码和时间
	 * 
	 * @return Map(id:编码id,time:时间)
	 */
	protected Object _getIdTime() {
		Map result = new HashMap();
		// 获取id
		Object _id = ((Object[]) getArrayFindDao().findOne(
				Config.getProperty("Sql.ana.targetusers.sequence")))[0];
		String _time = DatesUtil.format();
		result.put("id", _id);
		result.put("time", _time);
		return result;
	}

	/**
	 * 根据键值及替换值更新数据表
	 * 
	 * @see #updateByKey(String, Object[], List)
	 * @param queryKey
	 *            配置文件中的键值
	 * @param para
	 *            参数数组
	 * @return 受影响的条数
	 */
	protected Object updateByKey(String queryKey, Object[] para) {
		return updateByKey(queryKey, para, (List) null);
	}

	/**
	 * 根据键值及替换值更新数据表
	 * 
	 * @see #updateByKey(String, Object[], List)
	 * @param queryKey
	 *            配置文件中的键值
	 * @param para
	 *            参数数组
	 * @param replaceValues
	 *            替换值组
	 * @return 受影响的条数
	 */
	protected Object updateByKey(String queryKey, Object[] para,
			Object[] replaceValues) {
		return updateByKey(queryKey, para, ArrayUtil.toList(replaceValues));
	}

	/**
	 * 根据键值及替换值更新数据表
	 * 
	 * @param queryKey
	 *            配置文件中的键值
	 * @param para
	 *            参数数组
	 * @param replaceValues
	 *            替换列表
	 * @return 受影响的条数
	 */
	protected Object updateByKey(String queryKey, Object[] para,
			List replaceValues) {
		String sql = Config.getProperty(queryKey);
		sql = _replaceValues(sql, replaceValues);
		int num = getUpdateDao().update(sql, para);
		return new Integer(num);
	}
}
