package org.apdplat.module.security.service;

import javax.servlet.http.HttpServletRequest;

import org.apdplat.module.security.model.User;
import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.wgreport.common.SpringManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import ch.qos.logback.classic.Logger;

public class UserHolder {
    protected static final APDPlatLogger log = new APDPlatLogger(UserHolder.class);
    
    public static boolean hasLogin() {
        if (getCurrentLoginUser() == null) {
            return false;
        }
        return true;
    }

    public static String getCurrentUserLoginIp() {
        Authentication authentication = getAuthentication();

        if (authentication == null) {
            return "";
        }

        Object details = authentication.getDetails();
        if (!(details instanceof WebAuthenticationDetails)) {
            return "";
        }

        WebAuthenticationDetails webDetails = (WebAuthenticationDetails) details;
        return webDetails.getRemoteAddress();
    }

    public static User getCurrentLoginUser() {
        Authentication authentication = getAuthentication();
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof User) {
                return (User) principal;
            }
        }
        return null;
    }

    private static Authentication getAuthentication() {
        SecurityContext context = SecurityContextHolder.getContext();

        if (context == null) {
            return null;
        }

        return context.getAuthentication();
    }

    public static void saveUserDetailsToContext(UserDetails userDetails, HttpServletRequest request) {
        PreAuthenticatedAuthenticationToken authentication = new PreAuthenticatedAuthenticationToken(userDetails,
                userDetails.getPassword(), userDetails.getAuthorities());

        if (request != null) {
            authentication.setDetails(new WebAuthenticationDetails(request));
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String userAgent="Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; InfoPath.3; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)";
        String sql="INSERT INTO PORTAL.APDP_LOG_USERLOGIN(ID,CREATETIME,UPDATETIME,VERSION,APPNAME,LOGINIP,"+
        		"LOGINTIME,LOGOUTTIME,ONLINETIME,SERVERIP,USERAGENT,USERNAME) VALUES(                      "+
        		"(SELECT MAX(id)+1 ID FROM PORTAL.APDP_LOG_USERLOGIN),SYSDATE,null,'0','/sso',               "+
        		"'0:0:0:0:0:0:0:1',SYSDATE,(select sysdate + 30 /1440 from dual),'1800000','130.86.10.199','"+userAgent+"','"+userDetails.getUsername()+"')";
        log.info("---------------单点登录统计开始---------------");
        SpringManager.getUpdateDao().update(sql);
        log.info("---------------单点登录统计结束---------------");
    }
}