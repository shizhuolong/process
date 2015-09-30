var field=["ACCT_2_CHW_NUM",  
           "ACCT_2_SHW_NUM",  
           "ACCT_2_BDW_NUM",  
           "ACCT_2_LLW_NUM",  
           "ACCT_2_JSK_NUM",  
           "ACCT_2_OT_NUM",   
           "ACCT_2G_NUM",    
           "ACCT_3_DK_NUM",   
           "ACCT_3_GJSF_NUM", 
           "ACCT_3_CFSJ_NUM", 
           "ACCT_3_CFSF_NUM", 
           "ACCT_3_ZBJ_NUM",  
           "ACCT_3_SWK_NUM",
           "ACCT_3_OT_NUM",
           "ACCT_3G_NUM", 
           "ACCT_4_BDDK_NUM", 
           "ACCT_4_HYHJ_NUM",  
           "ACCT_4_CFSF_NUM",  
           "ACCT_4_GJSF_NUM",  
           "ACCT_4_CFSJ_NUM",  
           "ACCT_4_HYHJ1_NUM", 
           "ACCT_4_CFSF1_NUM",
           "ACCT_4_OT_NUM",
           "ACCT_4G_NUM",    
           "ACCT_ADSL_NUM",   
           "ACCT_LAN_NUM",    
           "ACCT_EOC_NUM",    
           "ACCT_FTTH_NUM",   
           "ACCT_10M_NUM", 
           "ACCT_BB_NUM", 
           "DEV_2_CHW_NUM",   
           "DEV_2_SHW_NUM",   
           "DEV_2_BDW_NUM",   
           "DEV_2_LLW_NUM",   
           "DEV_2_JSK_NUM",   
           "DEV_2_OT_NUM",    
           "DEV_2G_NUM",    
           "DEV_3_DK_NUM",    
           "DEV_3_GJSF_NUM",  
           "DEV_3_CFSJ_NUM",  
           "DEV_3_CFSF_NUM",  
           "DEV_3_ZBJ_NUM",   
           "DEV_3_SWK_NUM",
           "DEV_3_OT_NUM",
           "DEV_3G_NUM",     
           "DEV_4_BDDK_NUM",  
           "DEV_4_HYHJ_NUM",  
           "DEV_4_CFSF_NUM",  
           "DEV_4_GJSF_NUM",  
           "DEV_4_CFSJ_NUM",  
           "DEV_4_HYHJ1_NUM", 
           "DEV_4_CFSF1_NUM",
           "DEV_4_OT_NUM",
           "DEV_4G_NUM",     
           "DEV_ADSL_NUM",    
           "DEV_LAN_NUM",     
           "DEV_EOC_NUM",     
           "DEV_FTTH_NUM",       
           "DEV_10M_NUM",
           "DEV_BB_NUM",
           "SR_2_CHW_NUM",    
           "SR_2_SHW_NUM",    
           "SR_2_BDW_NUM",    
           "SR_2_LLW_NUM",    
           "SR_2_JSK_NUM",    
           "SR_2_OT_NUM",     
           "SR_2G_NUM",      
           "SR_3_DK_NUM",     
           "SR_3_GJSF_NUM",   
           "SR_3_CFSJ_NUM",   
           "SR_3_CFSF_NUM",   
           "SR_3_ZBJ_NUM",    
           "SR_3_SWK_NUM",
           "SR_3_OT_NUM",
           "SR_3G_NUM",      
           "SR_4_BDDK_NUM",   
           "SR_4_HYHJ_NUM",   
           "SR_4_CFSF_NUM",   
           "SR_4_GJSF_NUM",   
           "SR_4_CFSJ_NUM",   
           "SR_4_HYHJ1_NUM",
           "SR_4_CFSF1_NUM",//全国套餐存费送费
           "SR_4_OT_NUM",//其他
           "SR_4G_NUM",       
           "SR_ADSL_NUM",     
           "SR_LAN_NUM",      
           "SR_EOC_NUM",      
           "SR_FTTH_NUM",      
           "SR_10M_NUM", 
           "SR_BB_NUM", 
           "DEV_ZZX_NUM",    
           "SR_ZZX_NUM",
           "DEV_NET_NUM",
           "SR_NET_NUM",
           "CALL_TIME_2G",    
           "MOU_2G",          
           "FLOW_2G",         
           "AVG_FLOW_2G",     
           "CALL_TIME_3G",    
           "MOU_3G",          
           "FLOW_3G",         
           "AVG_FLOW_3G",    
           "CALL_TIME_4G",    
           "MOU_4G",          
           "FLOW_4G",        
           "AVG_FLOW_4G"];
var mmf=[//需要环比的字段
"ACCT_2G_NUM",
"ACCT_3G_NUM",
"ACCT_4G_NUM",
"ACCT_BB_NUM",
"DEV_2G_NUM",
"DEV_3G_NUM",
"DEV_4G_NUM",
"DEV_BB_NUM",
"DEV_ZZX_NUM",
"DEV_NET_NUM",
"SR_2G_NUM",
"SR_3G_NUM",
"SR_4G_NUM",
"SR_BB_NUM",
"SR_ZZX_NUM",
"SR_NET_NUM"];

var avgf=[//需要平均值的字段
         "MOU_2G",
         "MOU_3G",
         "MOU_4G",
         "AVG_FLOW_2G",
         "AVG_FLOW_3G",
         "AVG_FLOW_4G"
         ];
var avg0=[//分子
          "CALL_TIME_2G",
          "CALL_TIME_3G",
          "CALL_TIME_4G",
          "FLOW_2G",
          "FLOW_3G",
          "FLOW_4G"
          ];
var avg1=[//分母
          "ACCT_2G_NUM",
          "ACCT_3G_NUM",
          "ACCT_4G_NUM",
          "ACCT_2G_NUM",
          "ACCT_3G_NUM",
          "ACCT_4G_NUM"
          ];
function getSumField(){
	var fs="";
	if($("#mmBtn").attr("checked")){//环比处理
		for(var i=0;i<field.length;i++){
			if(fs.length>0){
				fs+=",";
			}
			var index=avgf.indexOf(field[i]);
			if(index>=0){
				fs+="case sum(t."+avg1[index]+") when 0 then 0  else round(sum(t."+avg0[index]+") / sum(t."+avg1[index]+"), 2) end "+avgf[index];
			}else if(mmf.indexOf(field[i])>=0){
				fs+="case sum(LAST_"+field[i]+") when 0 then '-%' else to_char((nvl(sum("+field[i]+"),0)-sum(LAST_"+field[i]+"))*100/sum(LAST_"+field[i]+"),'fm99999999999990.00')||'%' end "+field[i];
			}else{
				fs+="sum(t."+field[i]+") "+field[i];
			}
		}
	}else{//非环比处理
		for(var i=0;i<field.length;i++){
			if(fs.length>0){
				fs+=",";
			}
			var index=avgf.indexOf(field[i]);
			if(index>=0){
				fs+="case sum(t."+avg1[index]+") when 0 then 0  else round(sum(t."+avg0[index]+") / sum(t."+avg1[index]+"), 2) end "+avgf[index];
			}else{
				fs+="sum(t."+field[i]+") "+field[i];
			}
		}
	}
	return fs;
}
var orderBy='';	
$(function(){
	
	var sumSql=getSumField();//" sum(t.ACCT_2_CHW_NUM) ACCT_2_CHW_NUM,sum(t.ACCT_2_SHW_NUM) ACCT_2_SHW_NUM,sum(t.ACCT_2_BDW_NUM) ACCT_2_BDW_NUM,sum(t.ACCT_2_LLW_NUM) ACCT_2_LLW_NUM,sum(t.ACCT_2_JSK_NUM) ACCT_2_JSK_NUM,sum(t.ACCT_2_OT_NUM) ACCT_2_OT_NUM,sum(t.ACCT_2G_NUM) ACCT_2G_NUM,sum(t.ACCT_3_DK_NUM) ACCT_3_DK_NUM,sum(t.ACCT_3_GJSF_NUM) ACCT_3_GJSF_NUM,sum(t.ACCT_3_CFSJ_NUM) ACCT_3_CFSJ_NUM,sum(t.ACCT_3_CFSF_NUM) ACCT_3_CFSF_NUM,sum(t.ACCT_3_ZBJ_NUM) ACCT_3_ZBJ_NUM,sum(t.ACCT_3_SWK_NUM) ACCT_3_SWK_NUM,sum(t.ACCT_3_OT_NUM) ACCT_3_OT_NUM,sum(t.ACCT_3G_NUM) ACCT_3G_NUM,sum(t.ACCT_4_BDDK_NUM) ACCT_4_BDDK_NUM,sum(t.ACCT_4_HYHJ_NUM) ACCT_4_HYHJ_NUM,sum(t.ACCT_4_CFSF_NUM) ACCT_4_CFSF_NUM,sum(t.ACCT_4_GJSF_NUM) ACCT_4_GJSF_NUM,sum(t.ACCT_4_CFSJ_NUM) ACCT_4_CFSJ_NUM,sum(t.ACCT_4_HYHJ1_NUM) ACCT_4_HYHJ1_NUM,sum(t.ACCT_4_CFSF1_NUM) ACCT_4_CFSF1_NUM,sum(t.ACCT_4_OT_NUM) ACCT_4_OT_NUM,sum(t.ACCT_4G_NUM) ACCT_4G_NUM,sum(t.ACCT_ADSL_NUM) ACCT_ADSL_NUM,sum(t.ACCT_LAN_NUM) ACCT_LAN_NUM,sum(t.ACCT_EOC_NUM) ACCT_EOC_NUM,sum(t.ACCT_FTTH_NUM) ACCT_FTTH_NUM,sum(t.ACCT_10M_NUM) ACCT_10M_NUM,sum(t.ACCT_BB_NUM) ACCT_BB_NUM,sum(t.DEV_2_CHW_NUM) DEV_2_CHW_NUM,sum(t.DEV_2_SHW_NUM) DEV_2_SHW_NUM,sum(t.DEV_2_BDW_NUM) DEV_2_BDW_NUM,sum(t.DEV_2_LLW_NUM) DEV_2_LLW_NUM,sum(t.DEV_2_JSK_NUM) DEV_2_JSK_NUM,sum(t.DEV_2_OT_NUM) DEV_2_OT_NUM,sum(t.DEV_2G_NUM) DEV_2G_NUM,sum(t.DEV_3_DK_NUM) DEV_3_DK_NUM,sum(t.DEV_3_GJSF_NUM) DEV_3_GJSF_NUM,sum(t.DEV_3_CFSJ_NUM) DEV_3_CFSJ_NUM,sum(t.DEV_3_CFSF_NUM) DEV_3_CFSF_NUM,sum(t.DEV_3_ZBJ_NUM) DEV_3_ZBJ_NUM,sum(t.DEV_3_SWK_NUM) DEV_3_SWK_NUM,sum(t.DEV_3_OT_NUM) DEV_3_OT_NUM,sum(t.DEV_3G_NUM) DEV_3G_NUM,sum(t.DEV_4_BDDK_NUM) DEV_4_BDDK_NUM,sum(t.DEV_4_HYHJ_NUM) DEV_4_HYHJ_NUM,sum(t.DEV_4_CFSF_NUM) DEV_4_CFSF_NUM,sum(t.DEV_4_GJSF_NUM) DEV_4_GJSF_NUM,sum(t.DEV_4_CFSJ_NUM) DEV_4_CFSJ_NUM,sum(t.DEV_4_HYHJ1_NUM) DEV_4_HYHJ1_NUM,sum(t.DEV_4_CFSF1_NUM) DEV_4_CFSF1_NUM,sum(t.DEV_4_OT_NUM) DEV_4_OT_NUM,sum(t.DEV_4G_NUM) DEV_4G_NUM,sum(t.DEV_ADSL_NUM) DEV_ADSL_NUM,sum(t.DEV_LAN_NUM) DEV_LAN_NUM,sum(t.DEV_EOC_NUM) DEV_EOC_NUM,sum(t.DEV_FTTH_NUM) DEV_FTTH_NUM,sum(t.DEV_10M_NUM) DEV_10M_NUM,sum(t.DEV_BB_NUM) DEV_BB_NUM,sum(t.SR_2_CHW_NUM) SR_2_CHW_NUM,sum(t.SR_2_SHW_NUM) SR_2_SHW_NUM,sum(t.SR_2_BDW_NUM) SR_2_BDW_NUM,sum(t.SR_2_LLW_NUM) SR_2_LLW_NUM,sum(t.SR_2_JSK_NUM) SR_2_JSK_NUM,sum(t.SR_2_OT_NUM) SR_2_OT_NUM,sum(t.SR_2G_NUM) SR_2G_NUM,sum(t.SR_3_DK_NUM) SR_3_DK_NUM,sum(t.SR_3_GJSF_NUM) SR_3_GJSF_NUM,sum(t.SR_3_CFSJ_NUM) SR_3_CFSJ_NUM,sum(t.SR_3_CFSF_NUM) SR_3_CFSF_NUM,sum(t.SR_3_ZBJ_NUM) SR_3_ZBJ_NUM,sum(t.SR_3_SWK_NUM) SR_3_SWK_NUM,sum(t.SR_3_OT_NUM) SR_3_OT_NUM,sum(t.SR_3G_NUM) SR_3G_NUM,sum(t.SR_4_BDDK_NUM) SR_4_BDDK_NUM,sum(t.SR_4_HYHJ_NUM) SR_4_HYHJ_NUM,sum(t.SR_4_CFSF_NUM) SR_4_CFSF_NUM,sum(t.SR_4_GJSF_NUM) SR_4_GJSF_NUM,sum(t.SR_4_CFSJ_NUM) SR_4_CFSJ_NUM,sum(t.SR_4_HYHJ1_NUM) SR_4_HYHJ1_NUM,sum(t.SR_4_CFSF1_NUM) SR_4_CFSF1_NUM,sum(t.SR_4_OT_NUM) SR_4_OT_NUM,sum(t.SR_4G_NUM) SR_4G_NUM,sum(t.SR_ADSL_NUM) SR_ADSL_NUM,sum(t.SR_LAN_NUM) SR_LAN_NUM,sum(t.SR_EOC_NUM) SR_EOC_NUM,sum(t.SR_FTTH_NUM) SR_FTTH_NUM,sum(t.SR_10M_NUM) SR_10M_NUM,sum(t.SR_BB_NUM) SR_BB_NUM,sum(t.DEV_ZZX_NUM) DEV_ZZX_NUM,sum(t.SR_ZZX_NUM) SR_ZZX_NUM,sum(t.DEV_NET_NUM ) DEV_NET_NUM,sum(t.SR_NET_NUM ) SR_NET_NUM,sum(t.CALL_TIME_2G) CALL_TIME_2G,case  sum(t.ACCT_2G_NUM) when 0 then 0 else  round( sum(t.CALL_TIME_2G)/sum(t.ACCT_2G_NUM),2) end MOU_2G,sum(t.FLOW_2G) FLOW_2G,case  sum(t.ACCT_2G_NUM) when 0 then 0 else  round( sum(t.FLOW_2G)/sum(t.ACCT_2G_NUM),2) end AVG_FLOW_2G,sum(t.CALL_TIME_3G) CALL_TIME_3G,case  sum(t.ACCT_3G_NUM) when 0 then 0 else  round( sum(t.CALL_TIME_3G)/sum(t.ACCT_3G_NUM),2) end MOU_3G,sum(t.FLOW_3G) FLOW_3G,case  sum(t.ACCT_3G_NUM) when 0 then 0 else  round( sum(t.FLOW_3G)/sum(t.ACCT_3G_NUM),2) end AVG_FLOW_3G,sum(t.CALL_TIME_4G) CALL_TIME_4G,case  sum(t.ACCT_4G_NUM) when 0 then 0 else round(sum(t.CALL_TIME_4G)/sum(t.ACCT_4G_NUM),2) end  MOU_4G,sum(t.FLOW_4G) FLOW_4G,case  sum(t.ACCT_4G_NUM) when 0 then 0 else round( sum(t.FLOW_4G)/sum(t.ACCT_4G_NUM),2) end  AVG_FLOW_4G ";
	
	var report=new LchReport({
		title:[
["营销架构","2G出账用户","2G出账用户","2G出账用户","2G出账用户","2G出账用户","2G出账用户","2G出账用户",
 "3G出账用户","3G出账用户","3G出账用户","3G出账用户","3G出账用户","3G出账用户","3G出账用户","3G出账用户",//
 "4G出帐用户","4G出帐用户","4G出帐用户","4G出帐用户","4G出帐用户","4G出帐用户","4G出帐用户","4G出帐用户","4G出帐用户",//
 "固网宽带出账用户","固网宽带出账用户","固网宽带出账用户","固网宽带出账用户","固网宽带出账用户","固网宽带出账用户",
 
 "2G用户发展","2G用户发展","2G用户发展","2G用户发展","2G用户发展","2G用户发展","2G用户发展",
 "3G用户发展","3G用户发展","3G用户发展","3G用户发展","3G用户发展","3G用户发展","3G用户发展","3G用户发展",
 "4G用户发展","4G用户发展","4G用户发展","4G用户发展","4G用户发展","4G用户发展","4G用户发展","4G用户发展","4G用户发展",
 
 "固网宽带用户发展","固网宽带用户发展","固网宽带用户发展","固网宽带用户发展","固网宽带用户发展","固网宽带用户发展",
 "2G出账收入","2G出账收入","2G出账收入","2G出账收入","2G出账收入","2G出账收入","2G出账收入",
 "3G出账收入","3G出账收入","3G出账收入","3G出账收入","3G出账收入","3G出账收入","3G出账收入","3G出账收入",
 "4G出账收入","4G出账收入","4G出账收入","4G出账收入","4G出账收入","4G出账收入","4G出账收入","4G出账收入","4G出账收入",
 
 "固网宽带出账收入","固网宽带出账收入","固网宽带出账收入","固网宽带出账收入","固网宽带出账收入","固网宽带出账收入","专租线发展","专租线收入","固话发展量","固话收入","2G用户语音流量","2G用户语音流量","2G用户语音流量","2G用户语音流量","3G用户语音流量","3G用户语音流量","3G用户语音流量","3G用户语音流量","4G用户语音流量","4G用户语音流量","4G用户语音流量","4G用户语音流量"],
["营销架构","长话王","市话王","包打王","流量王","极速卡","其他","合计",/*2G出账*/ 
 "单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计",/*3G出账*/
 "本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计",/*4G*/
 "ADSL","LAN","EOC","FTTH","其中10M及以上","合计",
 
 "长话王","市话王","包打王","流量王","极速卡","其他","合计",/*2G发展*/
 "单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计",/*3G*/
 "本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计",/*4G*/
 
 "ADSL","LAN","EOC","FTTH","其中10M及以上","合计",
 "长话王","市话王","包打王","流量王","极速卡","其他","合计",/*2G收入*/
 "单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计",/*3G*/
 "本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计",/*4G*/
 "ADSL","LAN","EOC","FTTH","其中10M及以上","合计",
 "专租线发展","专租线收入","固话发展量","固话收入","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量"]

		],
		field:["ROW_NAME"].concat(field),
		css:[{gt:0,css:LchReport.RIGHT_ALIGN}],
		rowParams:["ROW_ID","PER_TYPE"],//第一个为rowId
		content:"content",
		orderCallBack:function(index,type){
			if(index==0){
				orderBy=" order by row_name "+type+" ";
			}else if(index>0){
				orderBy=" order by "+field[index-1]+" "+type+" ";
			}
			report.showSubRow();
		},
		getSubRowsCallBack:function($tr){
			if($tr&&$tr.attr("orgLevel")==4){
				showAgentList($tr);
				return null;
			}
			sumSql=getSumField();
			
			var preField='';
			var where='';
			var groupBy='';
			var code='';
			var orgLevel='';
			var qdate = $.trim($("#month").val());
			var provinceSql="";
			if($tr){
				code=$tr.attr("row_id");
				orgLevel=parseInt($tr.attr("orgLevel"));
				var parentId=$tr.attr("parentId");
				
				if(orgLevel==2){//点击市
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//点击营服中心
					preField=" t.AGENT_M_USERID ROW_ID,t.AGENT_M_NAME||'('|| case t.PER_TYPE when '1' then '客户经理' when '2' then '渠道经理' else '小区经理' end ||')' ROW_NAME,t.PER_TYPE ";
					groupBy=' group by t.AGENT_M_USERID,t.AGENT_M_NAME,t.PER_TYPE ';
					where=' where t.unit_id=\''+code+"\' ";
				}else if(orgLevel>=4){//点击渠道经理
					preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME ';
					groupBy=' group by t.group_id_4,t.group_id_4_name ';
					if(code=='undefined'){
						where=' where t.AGENT_M_USERID is null and t.unit_id=\''+parentId+'\' ';
					}else{
						where=' where t.AGENT_M_USERID=\''+code+'\' and t.unit_id=\''+parentId+'\' ';
					}
				}else{
					return {data:[],extra:{}};
				}
				orgLevel++;
			}else{
				//先根据用户信息得到前几个字段
				code=$("#code").val();
				orgLevel=$("#orgLevel").val();
				if(orgLevel==1){//省
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_0=\''+code+"\' ";
					orgLevel=2;
					
					provinceSql=' union all select t.group_id_0 ROW_ID,\'全省合计\' ROW_NAME,'+sumSql+' from PMRT.TAB_MRT_TARGET_CH_MON t ';
					provinceSql+=' where t.GROUP_ID_0=\''+code+'\'  and  t.DEAL_DATE='+qdate+' ';
					provinceSql+=' group by t.group_id_0 ';
				}else if(orgLevel==2){//市
					preField=' t.group_id_1 ROW_ID,t.group_id_1_name ROW_NAME';
					groupBy=' group by t.group_id_1,t.group_id_1_name ';
					where=' where t.GROUP_ID_1=\''+code+"\' ";
				}else if(orgLevel==3){//营服中心
					preField=' t.unit_id ROW_ID,t.unit_name ROW_NAME';
					groupBy=' group by t.unit_id,t.unit_name ';
					where=' where t.unit_id=\''+code+"\' ";
				}else if(orgLevel>=4){//
					preField=' t.group_id_4 ROW_ID,t.group_id_4_name ROW_NAME';
					groupBy=' group by t.group_id_4,t.group_id_4_name ';
					where=' where t.GROUP_ID_4=\''+code+"\' ";
				}else{
					return {data:[],extra:{}};
				}
			}	
			var sql='select '+preField+','+sumSql+' from PMRT.TAB_MRT_TARGET_CH_MON t ';
			
			
			if(where!=''&&qdate!=''){
				where+=' and  t.DEAL_DATE='+qdate+' ';
			}
			if(where!=''){
				sql+=where;
			}
			if(groupBy!=''){
				sql+=groupBy;
			}
			
			if(provinceSql!=""){
				sql+=provinceSql;
			}
			if(orderBy!=''){
				sql="select * from( "+sql+") t "+orderBy;
			}
			var d=query(sql);
			
			return {data:d,extra:{orgLevel:orgLevel}};
		}
	});
	report.showSubRow();
	report.showAllCols(0);
	
///////////////////////////////////////////
	//$("#lch_DataHead").find("TH").unbind();
	//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
	///////////////////////////////////////////
	$("#searchBtn").click(function(){
		report.showSubRow();
		report.showAllCols(0);
///////////////////////////////////////////
		//$("#lch_DataHead").find("TH").unbind();
		//$("#lch_DataHead").find(".sub_on,.sub_off,.space").remove();
		///////////////////////////////////////////
	});
	$("#mmBtn").click(function(){
		$("#searchBtn").trigger("click");
	});
});
/**
 * 查看渠道经理下的渠道列表
 * @param 
 * @return
 */
function showAgentList($tr){
	var agentId=$tr.attr("row_id");
	var unitId=$tr.attr("parentId");
	var $unit=$("#lch_DataBody").find("TR[row_id='"+unitId+"']");
	var perType=$tr.attr("PER_TYPE");
	var month = $.trim($("#month").val());
	var text=$unit.find("TD:eq(0)").find("A:eq(0)").text()+"->"+$tr.find("TD:eq(0)").find("A:eq(0)").text();
	var url=$("#ctx").val()+"/report/devIncome/jsp/income_and_dev_month_list.jsp?agentId="+agentId+"&unitId="+unitId+"&month="+month+"&agentType="+perType;
	window.parent.openWindow(text,null,url);
}
/////////////////////////下载开始/////////////////////////////////////////////
function getdownField(field){
	var fs="";
	if($("#mmBtn").attr("checked")){
		for(var i=0;i<field.length;i++){
			if(fs.length>0){
				fs+=",";
			}
			if(mmf.indexOf(field[i])>=0){
				fs+="case LAST_"+field[i]+" when 0 then '-%' else to_char((nvl("+field[i]+",0)-LAST_"+field[i]+")*100/LAST_"+field[i]+",'fm99999999999990.00')||'%' end "+field[i];
			}else{
				fs+=field[i];
			}
		}
	}else{
		fs=field.join(",");
	}
	return fs;
}
function downsAll() {
	var qdate = $.trim($("#month").val());
	
	var preField=' t.group_id_1_name,t.unit_name,t.agent_m_name,case t.PER_TYPE when \'1\' then \'客户经理\' when \'2\' then \'渠道经理\' else \'小区经理\' end  PER_TYPE ,t.HR_ID,t.group_id_4_name,t.state,t.HQ_CHAN_CODE,t.DEAL_DATE ';
	var where='';
	var orderBy=" order by t.group_id_1_name,t.unit_name,t.agent_m_name,t.PER_TYPE ,t.HR_ID,t.group_id_4_name,t.HQ_CHAN_CODE,t.DEAL_DATE ";
	var fieldSql=getdownField(field);
	
	
	
	//先根据用户信息得到前几个字段
	var code = $("#code").val();
	var orgLevel = $("#orgLevel").val();
	if (orgLevel == 1) {//省
		where = " where t.GROUP_ID_0='" + code + "' ";
	} else if (orgLevel == 2) {//市
		where = " where t.GROUP_ID_1='" + code + "' ";
	} else if (orgLevel == 3) {//营服中心
		where = " where t.unit_id='" + code + "' ";
	} else if (orgLevel >= 4) {//
		where = " where t.GROUP_ID_4='" + code + "' ";
	}
	if(where!=''&&qdate!=''){
		where+=' and  t.DEAL_DATE='+qdate+' ';
	}

	var sql = 'select ' + preField + ',' + fieldSql
			+ ' from PMRT.TAB_MRT_TARGET_CH_MON t';
	if (where != '') {
		sql += where;
	}
	if(orderBy!=''){
		sql="select * from( "+sql+") t "+orderBy;
	}
	
	showtext = '用户发展收入月报-' + qdate;
	var title=[["营销架构","","","","","","","","帐期","2G出账用户","","","","","","","3G出账用户","","","","","","","","4G出帐用户","","","","","","","","","固网宽带出账用户","","","","","","2G用户发展","","","","","","","3G用户发展","","","","","","","","4G用户发展","","","","","","","","","固网宽带用户发展","","","","","","2G出账收入","","","","","","","3G出账收入","","","","","","","","4G出账收入","","","","","","","","","固网宽带出账收入","","","","","","专租线发展","专租线收入","固话发展量","固话收入","2G用户语音流量","","","","3G用户语音流量","","","","4G用户语音流量","","",""],
	           ["地市","营服中心","人员","类型","HR编码","渠道（小区）名称","渠道（小区）状态","渠道（小区）编码","","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","长话王","市话王","包打王","流量王","极速卡","其他","合计","单卡","购机送费","存费送机","存费送费","本省自备机","上网卡","其他","合计","本地单卡","本地套餐合约惠机","本地套餐存费送费","全国套餐购机送费","全国套餐存费送机","全国套餐合约惠机","全国套餐存费送费","其他","合计","ADSL","LAN","EOC","FTTH","其中10M及以上","合计","","","","","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流量","户均流量","通话分钟数","MOU","流 量","户均流量"]];

	downloadExcel(sql,title,showtext);
}
////////////////////////////////////////////////////////////////////////