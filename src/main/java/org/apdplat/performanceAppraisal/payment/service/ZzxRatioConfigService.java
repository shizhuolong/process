package org.apdplat.performanceAppraisal.payment.service;

import java.util.List;
import java.util.Map;

import org.apdplat.performanceAppraisal.payment.dao.ZzxRatioConfigDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class ZzxRatioConfigService {

	@Autowired
	private ZzxRatioConfigDao zzxConfigDao;
	
	public List<Map<String, Object>> list(Map<String, Object> m) {
		return zzxConfigDao.list();
	}
	
	@Transactional
	public void update(Map<String, Object> m) {
		zzxConfigDao.update(m);
	}
	
}
