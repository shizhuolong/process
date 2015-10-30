package org.apdplat.module.workflow;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.UUID;

public class EncodeTest {
	public static void main(String[] args) {
		/*String s="%E7%BD%91%E6%A0%BC%E6%9D%83%E9%99%90%E8%A1%A8%E5%85%B3%E7%B3%BB.pdf";
		try {
			s=java.net.URLDecoder.decode(s,"utf-8");
			System.out.println(s);
			System.out.println(URLEncoder.encode(s, "UTF-8"));
			
			System.out.println(new String(s.getBytes(),"iso8859-1"));
			System.out.println(new String(s.getBytes("GB2312"),"iso8859-1"));
			System.out.println(new String(s.getBytes("utf-8"),"iso8859-1"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		System.out.println(UUID.randomUUID().toString().replaceAll("-", ""));*/
		
		System.out.println(getDisOrgList("28059",2));
	}
	//游离渠道树
			public static String getDisOrgList(String groupId,int orgLevel) {
				
				String table = "";
				String filterSql = " group_id_"+orgLevel+" ='"+groupId+"'";
				String pidSql = ",group_id_"+orgLevel+" as pid";
				int nextLevel = orgLevel+1;
				
				switch(nextLevel) {
					case 1:
						table = "pcde.tb_cde_region_code";
						filterSql = " 1=1 ";
						pidSql = "";
						break;
					case 2:
						table = "pcde.tb_cde_city_code";
						break;
					case 3:
						table = "pcde.tb_cde_group_code";
						filterSql += " and is_default=0 and IS_VALID != '0' ";
						break;
				}
				String sql = "select group_id_"+nextLevel+" as id,group_id_"+nextLevel+"_name as name,"
				   			+"'"+nextLevel+"' as dlevel"+pidSql+" from "+table+" a left join (select b.group_id_code,c.name from PORTAL.TB_PORTAL_GRID_ORGUSER b,"
				   			+"portal.pprt_pt_sys_user c where to_char(trim(b.userid))=to_char(trim(c.userid))) d on a.group_id_"+nextLevel+"=d.group_id_code where "+filterSql;
			
				return sql;
			}
}
