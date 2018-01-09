package org.apdplat.portal.schoolManagement.service;

import java.util.List;
import java.util.Map;

import org.apdplat.portal.schoolManagement.dao.SchoolManagerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SchoolMangerService {

	@Autowired
	private SchoolManagerDao schoolManagerDao;
	//查询学校名称
    public List<Map<String, Object>> findSchoolName(Map<String, String> param) {
        return schoolManagerDao.findSchoolName(param);
    }

    public Map<String, Object> findSchoolByID(Map<String, String> param) {
        return schoolManagerDao.findSchoolByID(param);
    }
}
