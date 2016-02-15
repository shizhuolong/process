package com.ynunicom.sso.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;


public class HttpRequestUtil {
    public static String sendRequest(String strUrl,String requestMethod,String contentype,String content) throws IOException
    {
    	StringBuffer buffer = new StringBuffer();
    	URL url = new URL(strUrl);
    	HttpURLConnection httpUrlConnection = (HttpURLConnection)url.openConnection();
    	httpUrlConnection.setRequestMethod(requestMethod);
    	httpUrlConnection.setRequestProperty("Content-type","application/json");
    	httpUrlConnection.setDoOutput(true); 
    	httpUrlConnection.setDoInput(true);
    	httpUrlConnection.setUseCaches(false);  
    	httpUrlConnection.connect();
    	
        if(content.length()>0){
	        OutputStreamWriter out = new OutputStreamWriter(httpUrlConnection.getOutputStream(), "UTF-8");
		    out.write(content);
		    out.flush();
		    out.close(); 
        }
        
        BufferedReader in = new BufferedReader(new InputStreamReader(httpUrlConnection.getInputStream()));   
        String inputLine;  
        while ((inputLine = in.readLine()) != null) {  
        	buffer.append(inputLine.trim());  
        }  
        in.close();
        httpUrlConnection.disconnect();
        return buffer.toString();
    }
}
