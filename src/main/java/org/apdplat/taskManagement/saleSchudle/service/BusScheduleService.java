package org.apdplat.taskManagement.saleSchudle.service;

import java.util.HashMap;
import java.util.Map;

import org.apdplat.taskManagement.saleSchudle.dao.BusScheduleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author liyz
 * @date 2017年4月17日
 */
@Service
public class BusScheduleService {
	
	@Autowired
	private BusScheduleDao busScheduleDao;
	
	public void updateTask(String dealDate,String busCode,String userName,String itemsSql) {
		Map<String,String> params =new HashMap<String,String>();
		params.put("dealDate", dealDate);
		params.put("busCode", busCode);
		params.put("userName", userName);
		params.put("itemsSql", itemsSql);
		busScheduleDao.updateTask(params);
	}

}
