package org.apdplat.module.workflow;

import static org.junit.Assert.assertNotNull;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.apdplat.module.security.model.User;
import org.apdplat.module.security.service.PasswordEncoder;
import org.apdplat.platform.service.PaginationDaoService;
import org.apdplat.platform.spring.SpringTransactionalTestCase;
import org.apdplat.platform.util.Pagination;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration(locations = { "/spring-test.xml" })
public class JpaQueryTest extends SpringTransactionalTestCase{
	
	@PersistenceContext(unitName = "apdplat")
    private EntityManager em;
	@Autowired
	private PaginationDaoService paginationDaoService;

	/**
	 * 检测引擎是否能正常工作
	 */
	@Test
	public void testQuery() {
		
		String sql = "select * from usertable";
		//List list = em.createNativeQuery(sql).getResultList();
		Query query = em.createNativeQuery(sql);
		query.unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
		List list = query.getResultList();
		System.out.println("------------->"+list.size());
	} 
	
	@Test
	public void testPaginationQuery() {
		
		//PaginationDaoService paginationDaoService = SpringContextUtils.getBean("paginationDaoService");
		String sql = "select orgName,code,treeId from org";
		Pagination page = new Pagination();
		page.setPageNo(1);
		page.setPageSize(15);
		paginationDaoService.queryForMap(page, sql, new String[]{});
		System.out.println("------------------>"+page.getTotalCount());
		System.out.println("------------------>"+page.getResult().size());
	}
	
	@Test
	public void generatePwd() {
		User u = new User();
		String s = PasswordEncoder.encode("admin",u);
		System.out.println(s);
	}

}
