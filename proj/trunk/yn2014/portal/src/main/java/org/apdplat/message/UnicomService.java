package org.apdplat.message;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ConnectException;
import java.net.Socket;
import java.net.UnknownHostException;

import org.apdplat.platform.log.APDPlatLogger;

import spApi.Bind;
import spApi.BindResp;
import spApi.SGIP_Command;
import spApi.SGIP_Exception;
import spApi.Submit;
import spApi.SubmitResp;
import spApi.Unbind;

/**
 * 短信及时连接网关下发类
 * @author Administrator
 *
 */
public final class UnicomService {
	private final APDPlatLogger logger = new APDPlatLogger(getClass());
	private static UnicomService instance = null;

	// 短信接口
	private Socket socket1 = null;
	private final static Byte[] locks = new Byte[0];  
	private SGIP_Command sgip = null;
	private Bind command = null;
	private DataOutputStream out = null;
	private DataInputStream in = null;
	
	/**
	 * 单态模式，在获取实例时作双重检测，防止多线程情况下产生多个实例
	 * 
	 * @return　SPSender
	 */
	public static UnicomService getInstance() {
		if (instance == null) {
			synchronized (UnicomService.class) {
				if (instance == null) {
					instance = new UnicomService();
				}
			}
		}
		return instance;
	}

	private UnicomService() {

	}

	private Socket getSMSSocket() throws UnknownHostException, IOException{
		// --------------------连接
		int connectnum = 0; // 连接次数
		Socket socket= null;
		if (socket == null) {
			while (true) {
				try {
					socket = new Socket(SocketMsg.smsSocket, SocketMsg.smsSocketPort);
					socket.setKeepAlive(true);
					if (socket != null) {
						break;
					}
				} catch (ConnectException e) {
					connectnum++;
					if (connectnum > 2) { // 如果连接次数超过3次，放弃连接，报告重大错误
						break;
					}
					continue;
				}
			}
		}
		return socket;
	}
	
	private SGIP_Command getSgip(){
		if(sgip==null){
			sgip = new SGIP_Command();
		}
		return sgip;
	}
	
	private Bind getBind(){
		if(command==null){
			command = new Bind(); // login password
			command.setSeqno_1(SocketMsg.nodeId);
			command.SetLoginType(1);
			command.SetLoginName(SocketMsg.Login_name);
			command.SetLoginPassword(SocketMsg.Login_pass);
		}
		return command;
	}
	/**
	 * 发送短信，广东10010519 返回0 表示成功
	 * 
	 * @param mobile
	 * @param content
	 * @return
	 * @throws Exception
	 */
	public int sendSMS(String mobile, String content) {
		logger.debug("发送信息：电话"+mobile+","+content);
		synchronized (locks)  
	    {  
			int result = 0;
			SGIP_Command tmp = null;
			Socket socket = null ;
			try {
				sgip = getSgip();
				command = getBind();
				int err;
//				byte[] byte_content = new byte[140];
				Submit submit = null;
				SubmitResp submitresp = null;
				BindResp resp = null;
				if(socket==null||(!socket.isConnected() && socket.isClosed()))
					socket=this.getSMSSocket();
				// 连接失败
				if (socket != null) {
					try{
						socket.setTcpNoDelay(true);
						socket.setTrafficClass(20);//0x04 | 0x10
						out = new DataOutputStream(socket.getOutputStream());
						in = new DataInputStream(socket.getInputStream());
					}catch (Exception e) {
						logger.debug(e.getMessage());
						try{
							if(in !=null) in.close();
							if(out !=null) out.close();   
							if(socket !=null) {socket.close();socket = null;}
							socket=this.getSMSSocket();
							if (socket != null) {
								socket.setTcpNoDelay(true);
								socket.setTrafficClass(20);//0x04 | 0x10
								out = new DataOutputStream(socket.getOutputStream());
								in = new DataInputStream(socket.getInputStream());
							}
						}catch (Exception e1) {
							logger.debug(e1.getMessage());
						}
					}
					err = command.write(out); // 发送bind
					if (err != 0) {
					}
					tmp = sgip.read(in); // 接收sgip 消息
					if (sgip.getCommandID() == SGIP_Command.ID_SGIP_BIND_RESP) {
						resp = (BindResp) tmp; // 强制转换为bindresp
						resp.readbody(); // 对消息进行解包
					}                     
					submit = new Submit(SocketMsg.nodeId);
					submit.setSPNumber(SocketMsg.spNum); // 10010018
					submit.setChargeNumber("000000000000000000000");// 付费号码
					submit.setUserNumber("86" + mobile);
					submit.setCorpId(SocketMsg.CorpId); // 企业代码
					submit.setServiceType(SocketMsg.ServiceType);// 业务代码
					submit.setFeeType(0); // 计费类型
					submit.setFeeValue("0"); // 短消息收费值
					submit.setGivenValue("0"); // 赠送话费
					submit.setMOrelatetoMTFlag(2); // 引起MT消息的原因
					submit.setPriority(9); // 优先级(0表示群发，9表示最高优先级)
					submit.setExpireTime(""); // 短消息终止时间
					submit.setScheduleTime(""); // 011125120000032+短消息定时发送时间
					submit.setReportFlag(1); // 状态报告标志
					submit.setTP_pid(0); // GSM协议类型
					submit.setTP_udhi(0); // GSM协议类型
					submit.setMessageType(0);
					submit.setContent(15, content);
					submit.write(out); // 发送submit
					tmp = sgip.read(in);
					if (tmp.getCommandID() == SGIP_Command.ID_SGIP_SUBMIT_RESP) {
						submitresp = (SubmitResp) tmp; // 强制转换
						submitresp.readbody(); // 解包
						result = submitresp.getResult();
					}
					if(0==result){
						
					}
					System.out.println("11111111111111111111111111=result="+result+"-----isclosed="+socket.isClosed());
					Unbind unbind = new Unbind();
					unbind.write(out);
					unbind.read(in);
					if(in !=null) in.close();
					if(out !=null) out.close();
					if(socket !=null) {socket.close();socket = null;}
					return result;
				} else {
					result = 1;
				}
			} catch (SGIP_Exception e) {
				logger.debug(e.getMessage());
				try {
					if(in !=null) in.close();
					if(out !=null) out.close();
					if(socket !=null) {socket.close();socket = null;}
					result = 1;
				} catch (Exception e1) {
					result = 1;
				}
			} catch (Exception e) {
				logger.debug(e.getMessage());
				try {
					if(in !=null) in.close();
					if(out !=null) out.close();
					if(socket !=null) {socket.close();socket = null;}
					result = 1;
				} catch (Exception e1) {
					result = 1;
				}
				result = 1;
	
			}
			return result;
	    }
		
	}

	public static void main(String[] agrs) throws Exception {
		// UnicomService us = new UnicomService();
		// for (int i = 0; i < 2; i++) {
		// us.sendSMS("18620039899", "你好怎么样");
		// java.lang.Thread.sleep(2000);
		// }

		// SPSender s=SPSender.getInstance();
		// HashMap<String, String> mtreq=new HashMap<String, String>();
		// s.launchTimer();
		// s.sendMTReq(mtreq );
		// UnicomService us = UnicomService.getInstance();
		// for (int i = 0; i < 3; i++) {
		// us.sendSMS("18620039899", "nihao");
		// us.sendSMS("13060876448", "nihao");
		// }
		System.out.print("1");
		for (int i = 0; i < 1; i++) {
			UnicomService us = UnicomService.getInstance();
			us.sendSMS("18669270883", "网格系统测试短信");
			UnicomService us1 = UnicomService.getInstance();
			us1.sendSMS("18669270883", "nihao1");
		}
		System.out.print("2");
		// us1.sendSMS("13060876448", "nihao");
		// us.launchTimer();
	}
}
