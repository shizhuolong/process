package org.apdplat.platform.dao;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;
import org.apdplat.platform.common.DataPrivilegeControl;
import org.apdplat.platform.criteria.Order;
import org.apdplat.platform.criteria.OrderCriteria;
import org.apdplat.platform.criteria.PageCriteria;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.criteria.Sequence;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.util.ReflectionUtils;
import org.hibernate.SQLQuery;
import org.hibernate.transform.Transformers;

/**
 * 通用的DAO操作支持类
 * @author sun
 *
 */
public abstract class DaoSupport extends DataPrivilegeControl{
    protected final APDPlatLogger LOG = new APDPlatLogger(getClass());
    
    protected static final OrderCriteria defaultOrderCriteria = new OrderCriteria();

    static {
        defaultOrderCriteria.addOrder(new Order("id", Sequence.DESC));
    }
    
    public DaoSupport(MultiDatabase multiDatabase){
        super(multiDatabase);
    }
    

    protected <T extends Model> Page<T> queryData(Class<T> modelClass, PageCriteria pageCriteria, PropertyCriteria propertyCriteria, OrderCriteria sortCriteria) {

        /*
        //权限控制
        User user=UserHolder.getCurrentLoginUser();
        //如果用户不是超级用户就限制数据访问
        if(user!=null && !user.isSuperManager() && needPrivilege(modelClass)){
            user=em.find(User.class, user.getId());
            Org org=user.getOrg();
            List<Integer> child=OrgService.getChildIds(org);
            if(propertyCriteria==null){
                propertyCriteria=new PropertyCriteria();
            }

            //如果用户的组织架构为最底层，则用户只能操纵自己的数据
            if(child.isEmpty()){
                propertyCriteria.addPropertyEditor(new PropertyEditor("ownerUser.id", Operator.eq,  user.getId()));
            }
            //如果用户的组织架构有子机构，则用户除了能操纵自己的数据，还能操纵子机构的所有数据
            else{
                PropertyEditor pe=new PropertyEditor(Criteria.or);
                pe.addSubPropertyEditor(new PropertyEditor("ownerUser.id", Operator.eq,  user.getId()));

                //可以操纵用户子机构下的所有的数据
                for(Integer orgID : child){
                    pe.addSubPropertyEditor(new PropertyEditor("ownerUser.org.id", Operator.eq,"Integer", orgID));
                }
                propertyCriteria.addPropertyEditor(pe);
            }
        }
         * 
         */

        //根据属性过滤条件、排序条件构造jpql查询语句
        StringBuilder jpql = new StringBuilder("select o from ");
        jpql.append(getEntityName(modelClass)).append(" o ").append(buildPropertyCriteria(propertyCriteria)).append(buildOrderCriteria(sortCriteria));
        LOG.debug("jpql:" + jpql);
        Query query = getEntityManager().createQuery(jpql.toString());
        //绑定属性过滤条件值
        bindingPropertyCriteria(query, propertyCriteria);
        //根据页面条件设置query参数
        buildPageCriteria(pageCriteria, query);

        setQueryCache(query);
        
        Page<T> page = new Page<>();
        List<T> models = query.getResultList();
        if (models != null) {
            page.setModels(models);
            //根据属性过滤条件获取查询数据的总记录数
            page.setTotalRecords(getCount(modelClass, propertyCriteria));
        }
        return page;
    }
    private void setQueryCache(Query query){
        if (query instanceof org.hibernate.ejb.QueryImpl) {
            ((org.hibernate.ejb.QueryImpl) query).getHibernateQuery().setCacheable(true);
        }
    }

    private void bindingPropertyCriteria(Query query, PropertyCriteria propertyCriteria) {
        if (query != null && propertyCriteria != null) {
            List<PropertyEditor> propertyEditors=propertyCriteria.getPropertyEditors();
            int len=propertyEditors.size();
            for (int i=0;i<len;i++) {
                PropertyEditor propertyEditor = propertyEditors.get(i);
                List<PropertyEditor> subPropertyEditor=propertyEditor.getSubPropertyEditor();
                if(subPropertyEditor==null || subPropertyEditor.isEmpty()){
                    query.setParameter(propertyEditor.getProperty().getNameParameter(), propertyEditor.getProperty().getValue());
                }else{
                    binding(query,propertyEditor,1);
                }
            }
        }
    }

    private void binding(Query query, PropertyEditor propertyEditor,int level) {
            List<PropertyEditor> subPropertyEditor=propertyEditor.getSubPropertyEditor();

            int l=subPropertyEditor.size();
            for(int j=0;j<l;j++){
                PropertyEditor p = subPropertyEditor.get(j);
                List<PropertyEditor> ss=p.getSubPropertyEditor();
                if(ss==null || ss.isEmpty()){
                    query.setParameter(p.getProperty().getNameParameter()+"_"+level+"_"+j, p.getProperty().getValue());
                }else{
                    binding(query,p,++level);
                }
            }
    }

    /**
     * 设置查询页面参数
     * @param pageCriteria
     * @param query
     */
    private void buildPageCriteria(PageCriteria pageCriteria, Query query) {
        if (query != null && pageCriteria != null) {
            int firstindex = (pageCriteria.getPage() - 1) * pageCriteria.getSize();
            int maxresult = pageCriteria.getSize();
            query.setFirstResult(firstindex).setMaxResults(maxresult);
        }
    }

    /**
     * 组装where 语句
     * @param propertyCriteria
     * @return
     */
    private <T extends Model> String buildPropertyCriteria(PropertyCriteria propertyCriteria) {
        StringBuilder wherejpql = new StringBuilder("");
        String result = "";
        if (propertyCriteria != null && propertyCriteria.getPropertyEditors().size() > 0) {
            //判断是否支持集合查询
            if(propertyCriteria.getCollection()!=null && propertyCriteria.getObject()!=null){
                wherejpql.append(" join o.").append(propertyCriteria.getCollection()).append(" ").append(propertyCriteria.getObject());
            }
            
            wherejpql.append(" where ");

            List<PropertyEditor> propertyEditors=propertyCriteria.getPropertyEditors();
            int len=propertyEditors.size();
            for (int i=0;i<len;i++) {
                PropertyEditor propertyEditor=propertyEditors.get(i);
                List<PropertyEditor> subPropertyEditor=propertyEditor.getSubPropertyEditor();
                //当没有子属性的时候时，属性编辑器本身才是有效的，否则他就是子属性的一个容器而已
                if(subPropertyEditor==null || subPropertyEditor.isEmpty()){
                    //判断是否支持集合查询
                    if(propertyCriteria.getCollection()!=null && propertyCriteria.getObject()!=null && propertyEditor.getProperty().getName().startsWith(propertyCriteria.getObject())){
                        wherejpql.append(" ");
                    }else{
                        wherejpql.append(" o.");
                    }
                    wherejpql.append(propertyEditor.getProperty().getName())
                            .append(" ")
                            .append(propertyEditor.getPropertyOperator().getSymbol())
                            .append(" ")
                            .append(":")
                            .append(propertyEditor.getProperty().getNameParameter());
                    if(i<len-1){
                            wherejpql.append(" ");
                            wherejpql.append(propertyCriteria.getCriteria().name());
                            wherejpql.append(" ");
                    }
                }
                else{
                    wherejpql.append(dealWithSubPropertyEditor(propertyEditor,1));
                }
            }
            result = wherejpql.toString();
        }
        return result;
    }
    private String dealWithSubPropertyEditor(PropertyEditor propertyEditor,int level){
            StringBuilder wherejpql=new StringBuilder();
            List<PropertyEditor> subPropertyEditor=propertyEditor.getSubPropertyEditor();
            wherejpql.append(" ( ");
            for (int j=0;j<subPropertyEditor.size();j++) {
                PropertyEditor sub = subPropertyEditor.get(j);
                List<PropertyEditor> ss=sub.getSubPropertyEditor();
                //当没有子属性的时候时，属性编辑器本身才是有效的，否则他就是子属性的一个容器而已
                if(ss!=null && !ss.isEmpty()){
                    wherejpql.append(dealWithSubPropertyEditor(sub,++level));
                }
                else{
                    wherejpql.append(" o.").append(sub.getProperty().getName()).append(" ").append(sub.getPropertyOperator().getSymbol()).append(" ")
                            .append(":")
                            .append(sub.getProperty().getNameParameter())
                            .append("_")
                            .append(level)
                            .append("_")
                            .append(j);
                }
                if(j<subPropertyEditor.size()-1){
                    wherejpql.append(" ").append(propertyEditor.getCriteria().name()).append(" ");
                }
            }
            wherejpql.append(" ) ");
            return wherejpql.toString();
    }
    /**
     * 组装order by语句
     * @param sortCriteria
     * @return
     */
    private String buildOrderCriteria(OrderCriteria sortCriteria) {
        StringBuilder orderbyql = new StringBuilder("");
        if (sortCriteria != null && sortCriteria.getOrders().size() > 0) {
            orderbyql.append(" order by ");

            for (Order order : sortCriteria.getOrders()) {
                orderbyql.append("o.").append(order.getPropertyName()).append(" ").append(order.getSequence().getValue()).append(",");
            }
            orderbyql.deleteCharAt(orderbyql.length() - 1);
        }
        return orderbyql.toString();
    }

    /**
     * 根据属性过滤条件获取查询数据的总记录数
     * @param clazz
     * @param propertyCriteria
     * @return
     */
    private Long getCount(Class<? extends Model> clazz, PropertyCriteria propertyCriteria) {
        Query query = getEntityManager().createQuery("select count(o.id) from " + getEntityName(clazz) + " o " + buildPropertyCriteria(propertyCriteria));
        //绑定属性过滤条件值
        bindingPropertyCriteria(query, propertyCriteria);        
        setQueryCache(query);
        return (Long) query.getSingleResult();
    }
    public Long getCount(Class<? extends Model> clazz) {
        Query query = getEntityManager().createQuery("select count(o.id) from " + getEntityName(clazz) + " o ");
        return (Long) query.getSingleResult();
    }

    
    
    public List<Map> queryForMap(String sqlString,Object ...values) {
    	
    	Query query = createQuery(sqlString,values);
    	query.unwrap(SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
    	return query.getResultList();
    }
    
    public Long getCountBySql(String sql, Object... values) {
    	Query query = createQuery(sql, values);
    	return ((BigDecimal)query.getSingleResult()).longValue();
    }
    
    public Query createQuery(String sqlString,Object ...values) {
    	Query query = this.getEntityManager().createNativeQuery(sqlString);
    	if (values != null) {
    		for (int i = 0; i < values.length; i++) {
    			query.setParameter(i+1, values[i]);
    		}
    	}
    	return query;
    }
    
    public Query createHqlQuery(final String hql, final Object... values) {
		Query query = getEntityManager().createQuery(hql);
		if (values != null) {
			for (int i = 0; i < values.length; i++) {
				query.setParameter(i+1, values[i]);
			}
		}
		return query;
	}
    
    
	/**
	 * 按jpql查询唯一对象.
	 * 
	 * @param values 数量可变的参数,按顺序绑定.
	 */
	public <X> X queryUniqueByHql(final String sql, final Object... values) {
		return (X) createHqlQuery(sql, values).getSingleResult();
	}
	
	/**
	 * 按sql查询唯一对象.
	 * 
	 * @param values 数量可变的参数,按顺序绑定.
	 */
	public <X> X queryUnique(final String sql, final Object... values) {
		return (X) createQuery(sql, values).getSingleResult();
	}
}