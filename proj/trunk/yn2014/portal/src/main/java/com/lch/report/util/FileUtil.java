package com.lch.report.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import com.lch.report.dto.Report;

public class FileUtil {
	/**
     * 递归删除目录下的所有文件及子目录下所有文件
     * @param dir 将要删除的文件目录
     * @return boolean Returns "true" if all deletions were successful.
     *                 If a deletion fails, the method stops attempting to
     *                 delete and returns "false".
     */
    public static boolean deleteDir(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list();
            //递归删除目录中的子目录下
            for (int i=0; i<children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }
        // 目录此时为空，可以删除
        return dir.delete();
    }
    @SuppressWarnings("deprecation")
	public static Report getReport(File f){
    	if(f==null||!f.exists()){
    		return null;
    	}
    	BufferedReader read=null;
    	try{
    		StringBuffer sb=new StringBuffer();
    		read = new BufferedReader(new InputStreamReader(new FileInputStream(f),"gbk"));  
    		String line=null;
    		while((line=read.readLine())!=null){
    			sb.append(line);
    		}
    		return JsonUtil.jsonToBean(sb.toString(), Report.class);
    	}catch(Exception e){
    		e.printStackTrace();
    		return null;
    	}finally{
    		if(read!=null){
    			try{
    				read.close();
    			}catch(Exception e){}
    		}
    	}
    }
    @SuppressWarnings("deprecation")
	public static boolean saveReport(File f,String reportStr){
    	if(f==null){
    		return false;
    	}
    	BufferedWriter write=null;
    	try{
    		if(!f.exists()){
        		f.createNewFile();
        	}
    		write = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(f),"gbk"));              
    	    write.write(reportStr);    
    	    write.flush();
    		return true;
    	}catch(Exception e){
    		e.printStackTrace();
    		return false;
    	}finally{
    		if(write!=null){
    			try{
    				write.close();
    			}catch(Exception e){}
    		}
    	}
    }
}
