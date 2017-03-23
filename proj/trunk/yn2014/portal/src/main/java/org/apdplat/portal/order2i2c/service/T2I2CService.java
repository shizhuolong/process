package org.apdplat.portal.order2i2c.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apdplat.portal.order2i2c.dao.T2I2CDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.miemiedev.mybatis.paginator.domain.PageList;

@Service
public class T2I2CService {
	
	@Autowired
	private T2I2CDao t2I2CDao;
	
	
	public Object undistributedOrderList(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = t2I2CDao.undistributedOrderList(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	
	public Object taskListDetail(Map<String, String> params) {
		Map<String,Object> result = new HashMap<String,Object>();
		PageList<Map<String, Object>> rows = t2I2CDao.taskListDetail(params);
		result.put("rows", rows);
		result.put("pagin", rows.getPaginator());
		return result;
	}
	
	
	public List<Map<String, Object>> getTeamByParentId(String pId,String regionCode){
		List<Map<String, Object>> roots=t2I2CDao.getTeamByParentId(pId,regionCode);
		if(roots!=null){
			for(Map<String, Object> root:roots){
				root.put("children", t2I2CDao.getTeamByParentId((String) root.get("ID"),regionCode));
			}
		}
		return roots;
	}
	public List<Map<String, Object>> getTeamByWorkNo(String workNo){
		String pId="-1";
		List<Map<String, Object>> roots=t2I2CDao.getTeamByWorkNo(pId,workNo);
		if(roots!=null){
			for(Map<String, Object> root:roots){
				root.put("children", t2I2CDao.getTeamByWorkNo((String) root.get("ID"),workNo));
			}
		}
		return roots;
	}
	
	public boolean provinceAgree(String workNo){
		try{
			t2I2CDao.updateStatus("2", workNo);
			return true;
		}catch(Exception e){
			return false;
		}
	}
	public boolean provinceCancel(String workNo){
		try{
			t2I2CDao.updateStatus("0", workNo);
			return true;
		}catch(Exception e){
			return false;
		}
	}
}
