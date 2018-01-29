package org.apdplat.portal.schoolManagement.service;

import java.util.List;
import java.util.Map;

import org.apdplat.portal.schoolManagement.dao.SchoolManagerDao;
import org.apdplat.portal.schoolManagement.dao.SchoolPioneerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SchoolPioneerService {

	@Autowired
	private SchoolPioneerDao schoolPioneerDao;
	
    public List<Map<String, Object>> listTree() {
        return schoolPioneerDao.listTree();
    }

    @Transactional
    public void addHead(Map<String, String> resultMap) {
        schoolPioneerDao.addHead(resultMap);
    }

    public List<Map<String, Object>> listSchool(Map<String, String> param) {
        return schoolPioneerDao.listSchool(param);
    }
}
