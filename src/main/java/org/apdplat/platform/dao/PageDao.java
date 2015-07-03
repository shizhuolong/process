package org.apdplat.platform.dao;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;
import org.apdplat.platform.util.Pagination;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

@Repository
public class PageDao extends DaoSupport {

	public PageDao() {
		super(MultiDatabase.APDPlat);
	}
	
	public PageDao(MultiDatabase multiDatabase) {
		super(multiDatabase);
	}

	public Pagination queryForMap(final Pagination page,final String sqlString,final Object ...values) {
    	return queryPage(page,sqlString,false,true,values);
    }
	
	public Pagination query(final Pagination page,final String sqlString,final Object... values) {
		return queryPage(page,sqlString,false,false,values);
	}
    
    
    private Pagination queryPage(final Pagination page,final String sqlString,boolean isJpql,boolean forMap,final Object... values) {
    	
    	Query q = isJpql? createHqlQuery(sqlString, values):createQuery(sqlString, values);
    	
    	if (page.recount()) {
			int totalCount = isJpql? countResultByHql(sqlString, values):countResult(sqlString, values);
			page.setTotalCount(totalCount);
		}
    	setPageParameter(q, page);
    	if(forMap) {
    		q.unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
			page.setResult(q.getResultList());
		}else{
			List result = q.getResultList();
			for (int i=0;i<result.size();i++){
				Object[] objArray = (Object[])result.get(i);
				Object[] resultArray = new Object[objArray.length+1];
				resultArray[0]=i;				
				System.arraycopy(objArray, 0, resultArray, 1, objArray.length);
				result.set(i, resultArray);
			}
			page.setResult(result);
		}		
    	return page;
    }
    
    public int countResultByHql(final String sql, final Object... values) {
		// select子句与order by子句会影响count查询,进行简单的排除.
		String fromSql = "from " + StringUtils.substringAfter(sql, "from");
		fromSql = StringUtils.substringBefore(fromSql, "order by");
		String countSql = "select count(*) " + fromSql;
		try {
			Object count = queryUniqueByHql(countSql, values);
			if(count ==null)return 0;
			 if (count instanceof Integer)
				 return ((Integer) count).intValue();
			 else if( count instanceof Long)
				 return ((Long) count).intValue();
			 else if( count instanceof BigDecimal)
				 return ((BigDecimal) count).intValue();
			 else
				 return Integer.parseInt(count.toString());
		} catch (Exception e) {
			throw new RuntimeException("sql can't be auto count, sql is:" + countSql, e);
		}
	}
    
    /**
	 * 执行count查询获得本次sql查询所能获得的对象总数.
	 *
	 * 本函数只能自动处理简单的sql语句,复杂的sql查询请另行编写count语句查询.
	 */
	public int countResult(final String sql, final Object... values) {

		String countSql = "select count(*) from ("+sql+") A";

		try {
			Object count = queryUnique(countSql, values);
			if(count ==null)return 0;

			 if (count instanceof Integer)
				 return ((Integer) count).intValue();
			 else if( count instanceof Long)
				 return ((Long) count).intValue();
			 else if( count instanceof BigDecimal)
				 return ((BigDecimal) count).intValue();
			 else
				 return Integer.parseInt(count.toString());

		} catch (Exception e) {
			throw new RuntimeException("sql can't be auto count, sql is:" + countSql, e);
		}
	}
	
	/**
	 * 设置分页参数到Query对象,辅助函数.
	 */
	protected Query setPageParameter(final Query q, final Pagination page) {
		// hibernate的firstResult的序号从0开始
		q.setFirstResult(page.getFirst() - 1);
		q.setMaxResults(page.getPageSize());
		return q;
	}

}