package org.apdplat.portal.manualCommission.action;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.apdplat.platform.action.BaseAction;
import org.apdplat.platform.log.APDPlatLogger;

/**
 * 手工佣金+渠道补贴（原始）存储过程调用
 * @author only
 *
 */
@SuppressWarnings("serial")
public class ManualAndComOriginalAction extends BaseAction {

	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	@Resource
	DataSource dataSource;
	/**
	 * 特殊权限人员调用存储过程（现在有调用权限的人员为省公司"李菘" ）
	 */
	public void callstored() {
		String dealDate = request.getParameter("dealDate");
		Connection conn=null;
		CallableStatement stmt=null;
		try {
			//1.建立数据库连接
			conn = dataSource.getConnection();
			//2.创建存储过程调用对象
			stmt = conn.prepareCall("call PMRT.PRC_TAB_MRT_COMM_CY_DATA_MON(?,?)");
			//3.设置传入参数（传入in值）
			stmt.setString(1, dealDate);
			//4.设置返回参数（设置out值）
			stmt.registerOutParameter(2,java.sql.Types.DECIMAL);
			//5.执行
			stmt.executeUpdate();
			int num = stmt.getInt(2);
			if(num==0){
				this.reponseJson(SUCCESS);
			}else{
				this.reponseJson(ERROR);
			}
		} catch (SQLException e) {
			logger.info("调用存储过程出现异常！！");
			this.reponseJson(ERROR);
			e.printStackTrace();
		}finally{
			if(null!=stmt){
				try{
					stmt.close();
				}catch(Exception e){}
			}
			if(null!=conn){
				try{
					conn.close();
				}catch(Exception e){}
			}
		}
	}
}
