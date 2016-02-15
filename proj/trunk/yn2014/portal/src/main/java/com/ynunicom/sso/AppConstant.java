package com.ynunicom.sso;

public class AppConstant {

	private static String namingMethod = "findapp";
	private static String eipServiceId = "taskappservice";
	private static String caller = "yn001"; // 查询者的appId（可选）
	private static String userId = "yn001"; // 当前登录用户（可选）

	// 查询待办待阅服务地址  测试
	
	public static final String namingServiceUrl = "http://10.0.3.154:8080/eip_naming/rest/namingservice/"
			+ namingMethod + "/" + eipServiceId + "/" + caller + "/" + userId;
	
// 查询待办待阅服务地址  正式
	 		
//	public static final String namingServiceUrl = "http://name.portal.unicom.local/eip_naming/rest/namingservice/"
//			+ namingMethod + "/" + eipServiceId + "/" + caller + "/" + userId;
	public static final String URL = "http://130.86.10.199:10002/portal/sso-protect/workflow/work-flow!toProcess4ADetail.action";
	//public static final String URL = "http://10.216.1.137:10003/portal/sso-protect/workflow/work-flow";
	// 云门户分配给专业系统应用id
	public static String appId = "yn001";
	//public static String appId = "yn056";
	// 云门户分配给专业系统Token
	public static String authToken = "66666";
	// 身份代码
	public static String pendingCityCode = "yn";
	// 待办所属系统简称
	public static String pendingNote = "yn001";
 
	//测试SSO登录认证
	public static final String checkLoginPath = "http://sit3.portal.unicom.local:8080/eip_sso/rest/authentication/check_login";
	
	//正式SSO登录认证
	//public static final String checkLoginPath = "http://sso.portal.unicom.local/eip_sso/rest/authentication/check_login";

	//测试SSO登录状态检查
	public static final String checkAuthenticationPath = "http://10.0.3.154:8080/eip_sso/rest/authentication/check_authentication";

	
	// 正式SSO登录状态检查
	//public static final String checkAuthenticationPath = "http://sso.portal.unicom.local/eip_sso/rest/authentication/check_authentication";
	

	public static String getGTaskError(String errorCode) {  

		String error = "";
		if ("100".equals(errorCode)) {
			error = "操作成功";
		}

		if ("101".equals(errorCode)) {
			error = "重复的待办ID";
		}

		if ("102".equals(errorCode)) {
			error = "	重复的待阅ID";
		}
		if ("103".equals(errorCode)) {
			error = "	待办ID不存在";
		}
		if ("104".equals(errorCode)) {
			error = "	待阅ID不存在";
		}
		if ("201".equals(errorCode)) {
			error = "	新增待办待阅记录数超过最大值";
		}
		if ("202".equals(errorCode)) {
			error = "	更新待办待阅记录数超过最大值";
		}
		if ("203".equals(errorCode)) {
			error = "	新增待办参数不正确";
		}
		if ("204".equals(errorCode)) {
			error = "	更新待办参数不正确";
		}
		if ("205".equals(errorCode)) {
			error = "	新增待阅参数不正确";
		}
		if ("206".equals(errorCode)) {
			error = "	更新待阅参数不正确";
		}
		if ("301".equals(errorCode)) {
			error = "	待办待阅服务异常";
		}

		return error;

	}
}
