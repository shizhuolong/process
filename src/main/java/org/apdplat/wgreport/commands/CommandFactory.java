package org.apdplat.wgreport.commands;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apdplat.wgreport.util.ObjectUtil;

public class CommandFactory {
	static Log logger = LogFactory.getLog(CommandFactory.class);

	public static HttpCommand getHttpCommand(int cmd) {
		return getHttpCommand(getHttpCommandClass(cmd));
	}

	public static HttpCommand getHttpCommand(String cmdClass) {
		return (HttpCommand) ObjectUtil.getInstance(cmdClass);
	}

	protected static String getHttpCommandClass(int cmd) {
		// logger.debug("getHttpCommandClass(int) [cmd]" + cmd);
		String commandsFolder = "org.apdplat.wgreport.commands.impl";
		String result = commandsFolder + ".";

		switch (cmd) {
		case 1:
			result += "MenuTitlesHttpCommand";// 菜单标题
			break;
		case 2:
			result += "DataHttpCommand";// 获取数据(需元数据支持)
			break;
		case 3:
			result += "SelectHttpCommand";// 获取选项(需元数据支持)
			break;
		case 4:
			result += "UserDataHttpCommand";// 取得用户数据
			break;
		case 5:
			result += "UserDataUpdateHttpCommand";// 个性化数据更新
			break;
		case 6:
			result += "PictureHttpCommand";// 获得图形
			break;
		case 7:
			result += "LoadHttpCommand";// 下载 excel
			break;
		case 8:
			result += "TargetUserHttpCommand";// 目标客户群(需要元数据支持)
			break;
		case 9:
			result += "PersonalHttpCommand";// 个性化数据 恢复为系统默认
			break;
		//温州存量客户精确化营销系统
		case 11:
		   result +="AssessmentSetHttpCommand"; //效果评估配置信息
		   break;
		case 12:
			result +="AssessmentHttpCommand"; //效果评估
			break;
		case 13:
			result +="ProcessSetHttpCommand"; //过程跟踪与监控体系设置
			break;
		case 14:
			result +="ProcessHttpCommand"; //过程跟踪与监控体系
			break;
		case 15:
			result += "MtxHttpCommand";// 营销矩阵操作类
			break;
		case 16:
			result += "MtxUploadHttpCommand";// 营销矩阵上传类
			break;
		case 17:
			result += "RWPZHttpCommand";// 营销任务处理类
			break;
		case 18:
			result += "MtxConfMgtHttpCommand";// 营销矩阵基本配置维护类
			break;
		case 19:
			result += "HmdHttpCommand";// 黑名单处理类
			break;
		case 20:
			result += "HmdUploadHttpCommand";// 黑名单上传类型
			break;
		case 21:
			result += "CodeUploadHttpCommand";// 黑名单上传类型
			break;
		case 22:
			result += "DownLoadHttpCommand";// 下载页面
			break;
		// 101-105为天津电信iODS新增20090805
		case 101:
			result += "TargetUserFilterHttpCommand";// 目标客户群操作(此目标客户群为针对性营销特征客户群提供过滤条件)
			break;
		case 104:
			result += "TargetUserManagerHttpCommand";// 目标客户群操作(此目标客户群为针对性营销特征客户群提供过滤条件)
			break;
		case 102:
			result += "AnaModelHttpCommand";// 分析模型相关(针对性营销分析模型)
			break;
		case 103:
			result += "SetsinfoHttpCommand";// 套餐资料相关(针对性营销)
			break;
		case 105:
			result += "ExcelTemplateHttpCommand";// excel导出,根据模板
			break;
		case 107:
			result += "OfferHttpCommand";// excel导出,根据模板
			break;
		case 109:
			result += "ZfeeHttpCommand";// 资费设计
			break;
		case 3001: 
			result += "DownloadExcelHttpCommand";//excel下载
			break;
		case 3002:
			result += "RptFixHttpCommand";//excel下载
			break;
		case 3003: 
			result += "KpiHttpCommand";//关键指标模块
			break;
		default:
			result += "DefaultHttpCommand";
			break;
		}
		return result;
	}
}
