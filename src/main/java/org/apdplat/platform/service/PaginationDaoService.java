package org.apdplat.platform.service;

import javax.annotation.Resource;

import org.apdplat.platform.dao.PageDao;
import org.apdplat.platform.util.Pagination;
import org.springframework.stereotype.Service;

/**
 * 
 * @author suyi
 *
 */
@Service
public class PaginationDaoService {

	@Resource(name="pageDao")
	private PageDao pageDao = null;
	
	public Pagination query(Pagination page,String sqlString,Object... values) {
		return pageDao.query(page, sqlString, values);
	}
	
	public Pagination queryForMap(Pagination page,String sqlString,Object... values) {
		return pageDao.queryForMap(page, sqlString, values);
	}

	public PageDao getPageDao() {
		return pageDao;
	}

	public void setPageDao(PageDao pageDao) {
		this.pageDao = pageDao;
	} 
	
	

}