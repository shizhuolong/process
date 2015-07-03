package org.apdplat.portal.common.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.apdplat.platform.exception.BusiException;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionBean;
import org.apdplat.taskManagement.saleSchudle.bean.TaskRegionDetailBean;


/**  
 * @author : suyi
 * @date 2014-5-8 上午11:31:34
 * @version V1.0  
 */

public class JsonUtils {
	
	@SuppressWarnings("unchecked")
	public synchronized static List<TaskRegionBean> jsonInfo2TaskRegionBeanList(
		String jsonInfoStr) throws BusiException {
		List<TaskRegionBean> list = new ArrayList<TaskRegionBean>();
		
		Pattern pat = Pattern.compile("\\s*|\n|\r|\t");
		Matcher mat = pat.matcher(jsonInfoStr);
		jsonInfoStr = mat.replaceAll("");
		JSONObject jsonObject = JSONObject.fromObject(jsonInfoStr);
		
		//排产任务信息
		JSONArray taskJsonArray = (JSONArray) jsonObject.get("taskInfo");
		Iterator<JSONObject> it = taskJsonArray.iterator();
		while (it.hasNext()) {
			try {
				JSONObject object = (JSONObject) it.next();
				
				List<TaskRegionDetailBean> taskDetailList = new ArrayList<TaskRegionDetailBean>();
				JSONArray taskDetailJsonArray = (JSONArray) object.get("taskDetails");
				Iterator<JSONObject> iterator = taskDetailJsonArray.iterator();
				while (iterator.hasNext()) {
					try {
						JSONObject o = (JSONObject) iterator.next();
						TaskRegionDetailBean detailBean = new TaskRegionDetailBean();
						BeanUtils.copyProperties(detailBean,o);
						taskDetailList.add(detailBean);
					}catch (Exception e) {
						throw new BusiException("转换排产任务串错误：" + e.getMessage());
					}
				}
				
				TaskRegionBean bean = new TaskRegionBean();
				bean.setTaskDetailList(taskDetailList);
				BeanUtils.copyProperties(bean,object);
				list.add(bean);
			} catch (Exception e) {
				throw new BusiException("转换排产任务串错误：" + e.getMessage());
			}
		}
		return list;
	}
	
	
	public static void testJsonInfo2TaskRegionBeanList() throws BusiException {
		
		StringBuffer sb = new StringBuffer();
		sb.append("{\"taskInfo\":[{\"id\":\"C687FC7DEAC0000188F912601C10184A\",\"dateType\":\"1\",\"regionCode\":\"16004\",\"regionName\":")
		.append("\"曲靖市分公司\",\"taskCode\":\"111111\",\"status\":\"2\",\"isValid\":\"1\",\"creater\":\"张三\",")
		.append("\"regionType\":\"region\",\"taskDetails\":[{\"id\":\"1122\",\"targetId\":\"1\",\"targetValue\":\"23\"}]},{\"id\":\"C687FC7DEAC0000188F912601C10184A\",\"dateType\":\"1\",\"regionCode\":\"16004\",\"regionName\":")
		.append("\"曲靖市分公司\",\"taskCode\":\"111111\",\"status\":\"2\",\"isValid\":\"1\",\"creater\":\"张三\",")
		.append("\"regionType\":\"region\",\"taskDetails\":[{\"id\":\"1122\",\"targetId\":\"1\",\"targetValue\":\"23\"}]}]}");
		
		List<TaskRegionBean> list = JsonUtils.jsonInfo2TaskRegionBeanList(sb.toString());
		System.out.println("------>"+list.size());
	}
	
	public static void main(String args[]) throws Exception{
		testJsonInfo2TaskRegionBeanList();
	}

}
