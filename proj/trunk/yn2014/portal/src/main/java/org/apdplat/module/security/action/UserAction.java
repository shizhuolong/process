package org.apdplat.module.security.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apdplat.module.security.model.Org;
import org.apdplat.module.security.model.Position;
import org.apdplat.module.security.model.Role;
import org.apdplat.module.security.model.User;
import org.apdplat.module.security.model.UserGroup;
import org.apdplat.module.security.service.OnlineUserService;
import org.apdplat.module.security.service.PasswordEncoder;
import org.apdplat.module.security.service.UserHolder;
import org.apdplat.module.system.service.PropertyHolder;
import org.apdplat.platform.action.ExtJSSimpleAction;
import org.apdplat.platform.criteria.Operator;
import org.apdplat.platform.criteria.PageCriteria;
import org.apdplat.platform.criteria.Property;
import org.apdplat.platform.criteria.PropertyCriteria;
import org.apdplat.platform.criteria.PropertyEditor;
import org.apdplat.platform.criteria.PropertyType;
import org.apdplat.platform.result.Page;
import org.apdplat.platform.service.PaginationDaoService;
import org.apdplat.platform.util.Pagination;
import org.apdplat.platform.util.Struts2Utils;
import org.apdplat.portal.common.Constant;
import org.apdplat.portal.common.dao.SystemParamCodeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

@Scope("prototype")
@Controller
@Namespace("/security")
public class UserAction extends ExtJSSimpleAction<User> {

	@Autowired
	private SystemParamCodeDao systemParamCodeDao;
	@Autowired
	private PaginationDaoService paginationDaoService;

	private long orgId;
	private String oldPassword;
	private String newPassword;
	private String roles;
	private String positions;
	private String userGroups;
	private boolean subordinate;

	// 在线用户 根据org查找
	private String org;
	// 在线用户 根据role查找
	private String role;
	// 用户重置密码
	private String password;

	// 用户选择组件
	private boolean select;

	@Override
	protected void checkModel(User model) throws Exception {
		/* 取得用户 */
		PropertyCriteria propertyCriteria = new PropertyCriteria();
		propertyCriteria.addPropertyEditor(new PropertyEditor("username",
				Operator.eq, "String", model.getUsername()));
		Page<User> p = getService().query(User.class, null, propertyCriteria);
		if (p.getTotalRecords() > 0) {
			throw new RuntimeException("添加的用户已存在，请更换用户名");
		}

		/*
		 * int len=model.getUsername().length(); for(int i=0;i<len;i++){ String
		 * name=model.getUsername().substring(0, i+1); p =
		 * getService().search("+username:"+name +" AND +alias:User", null,
		 * User.class); if(p.getTotalRecords()>0){ throw new
		 * RuntimeException("已经存在用户【"
		 * +name+"】,您的用户名【"+model.getUsername()+"】和其相似，请更换用户名"); } }
		 */
	}
	
	
	@Override
	 public String query() {
		
		String filterSql = "";
		PropertyCriteria propertyCriteria = super.buildPropertyCriteria();
		if(null != propertyCriteria) {
			List<PropertyEditor> propertyEditors = propertyCriteria.getPropertyEditors();
			for(PropertyEditor propertyEditor:propertyEditors) {
				Property property = propertyEditor.getProperty();
				String name = property.getName();
				String value = property.getValue().toString();
				if("username".equals(name)) {
					filterSql += " and a.username='"+value+"'";
				}else if("realName".equals(name)) {
					filterSql += " and a.realname like '%"+value+"%'";
				}
			}
		}
		 
		 StringBuffer sb = new StringBuffer();
		 sb.append("select a.id \"id\",a.version,a.username \"username\",a.realname \"realName\",a.phone \"phone\",a.email \"email\",case a.enabled when 1 then '启动' else '停用' end as \"enabled\"")
		 .append(",b.orgname \"orgName\",b.id as orgId,a.des,a.hr_id \"hrId\",a.user_type \"userType\" from apdp_user a left join apdp_org b on a.org_id=b.id where 1=1").append(filterSql);
		 if (subordinate) {
			 sb.append(" and (a.org_id=").append(orgId).append(" or a.org_id in (select id from apdp_org t connect by prior t.id=t.parent_id start with t.id=").append(orgId).append("))");
		 } else if (!subordinate) {
			 sb.append(" and a.org_id=").append(orgId);
		 }
		 PageCriteria pageCriteria = getPageCriteria();
		 Pagination page = new Pagination();
		 page.setPageNo(pageCriteria.getPage());
		 page.setPageSize(pageCriteria.getSize());
		 paginationDaoService.queryForMap(page, sb.toString(), new String[]{});
		 Map json = new HashMap();
		 json.put("totalProperty", page.getTotalCount());
		 json.put("root", page.getResult());
		 Struts2Utils.renderJson(json);
		 return null;
	 }

	// 每一次查询用户的时候都是查询特定的机构及其所有子机构下的用户
	// 方式一：使用多个OR连接
	/*
	 * @Override public PropertyCriteria buildPropertyCriteria(){
	 * PropertyCriteria propertyCriteria=super.buildPropertyCriteria();
	 * if(propertyCriteria==null){ propertyCriteria=new PropertyCriteria(); }
	 * if(orgId>0){ Org obj=getService().retrieve(Org.class, orgId);
	 * //获取orgId的所有子机构的ID List<Integer> orgIds=OrgService.getChildIds(obj);
	 * //加上orgId orgIds.add(obj.getId()); int i=0; for(int id : orgIds){
	 * PropertyEditor pe=new PropertyEditor("org.id", Operator.eq, id);
	 * //当有多个同样的属性时，要指定属性的顺序以区别不同的命名参数 pe.setSeq(i++);
	 * propertyCriteria.addPropertyEditor(pe); } return propertyCriteria; }
	 * return null; }
	 */
	// 方式二：使用IN语句

	@Override
	public PropertyCriteria buildPropertyCriteria() {
		PropertyCriteria propertyCriteria = super.buildPropertyCriteria();
		if (propertyCriteria == null) {
			propertyCriteria = new PropertyCriteria();
		}
		// orgId==-1或orgId<0代表为根节点，不加过滤条件
		if (!Constant.PROVINCE_CODE.equals(Long.toString(orgId)) && subordinate) {

			// 获取orgId的所有子机构的ID
			List<Long> orgIds = systemParamCodeDao.qrySubordinateByOrgId(orgId);

			PropertyEditor pe = new PropertyEditor("org.id", Operator.in,
					PropertyType.List, orgIds);
			propertyCriteria.addPropertyEditor(pe);

			return propertyCriteria;
		} else if (!subordinate) {
			PropertyEditor pe = new PropertyEditor("org.id", Operator.eq,
					PropertyType.Long, orgId);
			propertyCriteria.addPropertyEditor(pe);
		}

		return propertyCriteria;
	}

	public String reset() {
		Long[] ids = super.getIds();
		if (ids != null && ids.length > 0) {
			if (!StringUtils.isBlank(password)) {
				for (long id : ids) {
					User user = getService().retrieve(User.class, id);
					if (PropertyHolder.getBooleanProperty("demo")) {
						if (user.getUsername().equals("admin")) {
							Struts2Utils.renderText("演示版本不能重置admin用户的密码");
							return null;
						}
					}
					user.setPassword(PasswordEncoder.encode(password, user));
					getService().update(user);
				}
				Struts2Utils.renderText("已经成功将 " + ids.length + " 个用户的密码重置为"
						+ password);
			} else {
				Struts2Utils.renderText("重置密码不能为空");
			}
		} else {
			Struts2Utils.renderText("必须要指定需要重置密码的用户");
		}
		return null;
	}

	public String online() {
		int start = super.getStart();
		int len = super.getLimit();
		if (start == -1) {
			start = 0;
		}
		if (len == -1) {
			len = 10;
		}
		Org o = null;
		Role r = null;
		if (!StringUtils.isBlank(org)) {
			// 返回特定组织架构及其所有子机构的在线用户
			long id = Long.parseLong(org);
			o = getService().retrieve(Org.class, id);
		}
		if (!StringUtils.isBlank(role)) {
			// 返回属于特定角色的在线用户
			long id = Long.parseLong(role);
			r = getService().retrieve(Role.class, id);
		}

		List<User> users = OnlineUserService.getUser(o, r);
		LOG.info("获取在线用户,start: " + start + ",len:" + len);
		LOG.info("在线用户的总数为： " + users.size());
		if (len > users.size()) {
			len = users.size();
		}
		List<User> models = new ArrayList<>();
		for (int i = start; i < len; i++) {
			models.add(users.get(i));
		}
		// 构造当前页面对象
		page = new Page<>();
		page.setModels(models);
		page.setTotalRecords(users.size());

		Map json = new HashMap();
		json.put("totalProperty", page.getTotalRecords());
		List<Map> result = new ArrayList<>();
		renderJsonForQuery(result);
		json.put("root", result);
		Struts2Utils.renderJson(json);
		return null;
	}

	public String store() {
		if (select) {
			return super.query();
		}
		List<User> users = getService().query(User.class).getModels();
		List<Map<String, String>> data = new ArrayList<>();
		for (User user : users) {
			Map<String, String> temp = new HashMap<>();
			temp.put("value", user.getUsername());
			temp.put("text", user.getUsername());
			data.add(temp);
		}
		Struts2Utils.renderJson(data);
		return null;
	}

	@Override
	public void assemblyModelForCreate(User model) {
		model.setPassword(PasswordEncoder.encode(model.getPassword(), model));
		// 组装角色
		assemblyRoles(model);
		// 组装岗位
		assemblyPositions(model);
		// 组装用户组
		assemblyUserGroups(model);
	}

	public void assemblyRoles(User model) {
		if (roles != null && !"".equals(roles.trim())) {
			String[] roleIds = roles.trim().split(",");
			for (String id : roleIds) {
				String[] attr = id.split("-");
				if (attr.length == 2) {
					long roleId = Long.parseLong(attr[1]);
					Role temp = getService().retrieve(Role.class, roleId);
					if (temp != null) {
						model.addRole(temp);
					}
				}
			}
		}
	}

	public void assemblyPositions(User model) {
		if (positions != null && !"".equals(positions.trim())) {
			String[] positionIds = positions.trim().split(",");
			for (String id : positionIds) {
				String[] attr = id.split("-");
				if (attr.length == 2) {
					long positionId = Long.parseLong(attr[1]);
					Position temp = getService().retrieve(Position.class,
							positionId);
					if (temp != null) {
						model.addPosition(temp);
					}
				}
			}
		}
	}

	public void assemblyUserGroups(User model) {
		if (userGroups != null && !"".equals(userGroups.trim())) {
			String[] userGroupIds = userGroups.trim().split(",");
			for (String id : userGroupIds) {
				String[] attr = id.split("-");
				if (attr.length == 2) {
					long userGroupId = Long.parseLong(attr[1]);
					UserGroup temp = getService().retrieve(UserGroup.class,
							userGroupId);
					if (temp != null) {
						model.addUserGroup(temp);
					}
				}
			}
		}
	}

	@Override
	public void prepareForDelete(Long[] ids) {
		User loginUser = UserHolder.getCurrentLoginUser();
		for (long id : ids) {
			if (PropertyHolder.getBooleanProperty("demo")) {
				User toDeleteUser = getService().retrieve(modelClass, id);
				if (toDeleteUser.getUsername().equals("admin")) {
					throw new RuntimeException("演示版本不能删除admin用户");
				}
			}
			if (loginUser.getId() == id) {
				throw new RuntimeException("用户不能删除自己");
			}
		}
	}

	@Override
	protected void old(User model) {
		if (PropertyHolder.getBooleanProperty("demo")) {
			if (model.getUsername().equals("admin")) {
				throw new RuntimeException("演示版本不能修改admin用户");
			}
		}
	}

	public String modifyPassword() {
		User user = UserHolder.getCurrentLoginUser();

		PropertyCriteria propertyCriteria = new PropertyCriteria();
		propertyCriteria.addPropertyEditor(new PropertyEditor("username",
				Operator.eq, "String", user.getUsername()));
		Page<User> p = getService().query(User.class, null, propertyCriteria);
		User dbUser = p.getModels().get(0);
		Integer version = dbUser.getVersion();

		Map result = new HashMap();

		// Model model = getModel();
		if (user == null) {
			result.put("success", false);
			result.put("message", "用户没有登录");
			Struts2Utils.renderJson(result);
			return null;
		}
		if (PropertyHolder.getBooleanProperty("demo")) {
			if (user.getUsername().equals("admin")) {
				result.put("success", false);
				result.put("message", "演示版本admin用户不能更改密码");
				Struts2Utils.renderJson(result);
				return null;
			}
		}
		oldPassword = PasswordEncoder.encode(oldPassword.trim(), user);
		if (oldPassword.equals(user.getPassword())) {
			user.setPassword(PasswordEncoder.encode(newPassword.trim(), user));
			newPassword = PasswordEncoder.encode(newPassword.trim(), user);
			
			//新旧密码不一致，则修改版本号
			if (!newPassword.equals(dbUser.getPassword())) {
				user.setVersion(version);
				getService().update(user);
			}

			result.put("success", true);
			result.put("message", "修改成功");
			Struts2Utils.renderJson(result);
		} else {
			result.put("success", false);
			result.put("message", "修改失败，旧密码错误");
			Struts2Utils.renderJson(result);
		}
		return null;
	}

	// 在更新一个特定的部分的Model之前对Model添加需要修改的属性
	@Override
	protected void assemblyModelForPartUpdate(List<Property> properties) {
		for (Property property : properties) {
			if ("password".equals(property.getName().trim())) {
				property.setValue(PasswordEncoder.encode(property.getValue()
						.toString(), model));
				break;
			}
		}
	}

	@Override
	protected void assemblyModelForUpdate(User model) {
		if (roles != null) {
			model.clearRole();
			assemblyRoles(model);
		}

		if (positions != null) {
			model.clearPosition();
			assemblyPositions(model);
		}

		if (userGroups != null) {
			model.clearUserGroup();
			assemblyUserGroups(model);
		}
	}

	@Override
	protected void renderJsonForRetrieve(Map map) {
		render(map, model);
		map.put("roles", model.getRoleStrs());
		map.put("positions", model.getPositionStrs());
		map.put("userGroups", model.getUserGroupStrs());
	}

	@Override
	protected void renderJsonForSearch(List result) {
		for (User user : page.getModels()) {
			Map temp = new HashMap();
			render(temp, user);

			StringBuilder str = new StringBuilder();
			// 搜索出来的模型已经被detach了，无法获得延迟加载的数据
			User tmp = getService().retrieve(User.class, user.getId());
			for (Role r : tmp.getRoles()) {
				str.append(r.getRoleName()).append(",");
			}
			temp.put(
					"roles",
					str.length() > 1 ? str.toString().substring(0,
							str.length() - 1) : "");

			str = new StringBuilder();
			for (Position p : tmp.getPositions()) {
				str.append(p.getPositionName()).append(",");
			}
			temp.put(
					"positions",
					str.length() > 1 ? str.toString().substring(0,
							str.length() - 1) : "");
			result.add(temp);

			str = new StringBuilder();
			for (UserGroup p : tmp.getUserGroups()) {
				str.append(p.getUserGroupName()).append(",");
			}
			temp.put(
					"userGroups",
					str.length() > 1 ? str.toString().substring(0,
							str.length() - 1) : "");
			result.add(temp);
		}
	}

	@Override
	protected void renderJsonForQuery(List result) {
		for (User user : page.getModels()) {
			// 重新加载，避免出现延迟加载错误
			user = getService().retrieve(modelClass, user.getId());
			Map temp = new HashMap();
			render(temp, user);

			StringBuilder str = new StringBuilder();
			for (Role r : user.getRoles()) {
				str.append(r.getRoleName()).append(",");
			}
			temp.put(
					"roles",
					str.length() > 1 ? str.toString().substring(0,
							str.length() - 1) : "");

			str = new StringBuilder();
			for (Position p : user.getPositions()) {
				str.append(p.getPositionName()).append(",");
			}
			temp.put(
					"positions",
					str.length() > 1 ? str.toString().substring(0,
							str.length() - 1) : "");
			result.add(temp);

			str = new StringBuilder();
			for (UserGroup p : user.getUserGroups()) {
				str.append(p.getUserGroupName()).append(",");
			}
			temp.put(
					"userGroups",
					str.length() > 1 ? str.toString().substring(0,
							str.length() - 1) : "");
			result.add(temp);
		}
	}

	@Override
	protected void render(Map map, User model) {
		map.put("id", model.getId());
		map.put("version", model.getVersion());
		map.put("username", model.getUsername());
		map.put("realName", model.getRealName());
		map.put("enabled", model.isEnabled() == true ? "启用" : "停用");
		String orgName = "";
		long id = 0;
		if (model.getOrg() != null) {
			orgName = model.getOrg().getOrgName();
			id = model.getOrg().getId();
		}
		map.put("orgName", orgName);
		map.put("orgId", id + "");
		map.put("des", model.getDes());
		map.put("phone",model.getPhone());
		map.put("email",model.getEmail());
		map.put("oaComId",model.getOaComId());
		map.put("oaComName",model.getOaComName());
		map.put("oaDepId",model.getOaDepId());
		map.put("oaDepName",model.getOaDepName());
		map.put("oaJobId",model.getOaJobId());
		map.put("oaJobName",model.getOaJobName());
		map.put("hrId",model.getHrId());
		map.put("userType",model.getUserType());
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public void setRoles(String roles) {
		this.roles = roles;
	}

	public void setPositions(String positions) {
		this.positions = positions;
	}

	public void setUserGroups(String userGroups) {
		this.userGroups = userGroups;
	}

	public void setOrg(String org) {
		this.org = org;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setOrgId(int orgId) {
		this.orgId = orgId;
	}

	public void setSelect(boolean select) {
		this.select = select;
	}

	public void setSubordinate(boolean subordinate) {
		this.subordinate = subordinate;
	}

}