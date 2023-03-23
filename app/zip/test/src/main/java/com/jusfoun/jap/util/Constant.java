package com.jusfoun.jap.util;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 存放系统全局变量
 * 
 */
public final class Constant
{
    /**
     * 日志信息
     */
	private transient Logger logger = LoggerFactory.getLogger(getClass());
	
	/**
	 * phoenix url地址
	 */
	public static String PHOENIX_URL;

	/**
	 * hdfs url地址
	 */
	public static String HDFS_URL;
	
	/**
	 * kylin jdbc
	 */
	public static String KYLIN_URL;
	public static String KYLIN_USERNAME;
	public static String KYLIN_PASSWORD;
	public static String KYLIN_DATABASE;
	public static String KYLIN_PROJECTNAME;
	public static String KYLIN_ADDRESS;
	public static String KYLIN_AUTHORIZATION;
	
	public static String HIVE_DRIVERNAME;
	public static String HIVE_URL;
	public static String HIVE_SOURCE_DATABASE;
	public static String HIVE_ANALYSIS_DATABASE;
	//启动定时任务
	public static String JOB_ENABLE;
	
    static
    {
        initParam();
    }

    /**
     * 初始化系统参数
     */
    public static void initParam()
    {
    	PHOENIX_URL = InitParam.getInitParamMap().get("phoenix.url");
    	HDFS_URL = InitParam.getInitParamMap().get("hdfs.url");
    	KYLIN_URL= InitParam.getInitParamMap().get("kylin.url");
    	KYLIN_USERNAME= InitParam.getInitParamMap().get("kylin.username");
    	KYLIN_PASSWORD= InitParam.getInitParamMap().get("kylin.password");
    	KYLIN_DATABASE= InitParam.getInitParamMap().get("kylin.database");
    	KYLIN_ADDRESS = InitParam.getInitParamMap().get("kylin.address");
    	KYLIN_AUTHORIZATION = InitParam.getInitParamMap().get("kylin.authorization");
    	KYLIN_PROJECTNAME= InitParam.getInitParamMap().get("kylin.projectName");
    	HIVE_DRIVERNAME=InitParam.getInitParamMap().get("hive.drivername");
    	HIVE_URL=InitParam.getInitParamMap().get("hive.url");
    	HIVE_SOURCE_DATABASE=InitParam.getInitParamMap().get("hive.source.database");
    	HIVE_ANALYSIS_DATABASE=InitParam.getInitParamMap().get("hive.analysis.database");
    	JOB_ENABLE=InitParam.getInitParamMap().get("job.enable");
    	
    }
    
    /**
     * 日志模块，操作类型常量
     */
    public static final String LOGIN = "38D6D3B082CA36B4E050A8C0226414A3";
    public static final String LOGOUT = "38D6D3B082CE36B4E050A8C0226414A3";
    public static final String QUERY = "38D6D3B082C936B4E050A8C0226414A3";
    public static final String INSERT = "38D6D3B082CB36B4E050A8C0226414A3";
    public static final String UPDATE = "38D6D3B082CD36B4E050A8C0226414A3";
    public static final String DELETE = "38D6D3B082CC36B4E050A8C0226414A3";
    public static final String INSERT_UPDATE = "38D6D3B082D736B4E050A8C0226414A3";
    
    /**
     * 日志模块，模块id常量
     */
    public static final String DWFX = "38D6D3B082D436B4E050A8C0226414A3";
    public static final String XTGL_ZZGL = "38D6D3B082D336B4E050A8C0226414A3";
    public static final String XTGL_YHGL = "38D6D3B082D136B4E050A8C0226414A3";
    public static final String XTGL_CDGL = "38D6D3B082D036B4E050A8C0226414A3";
    public static final String XTGL_RZGL = "38D6D3B082CF36B4E050A8C0226414A3";
    public static final String XTGL_MXGL = "38D6D3B082D236B4E050A8C0226414A3";
    public static final String XTGL_YCSJGL = "38D6D3B082D536B4E050A8C0226414A3";
    public static final String XTGL_JSGL = "38D6D3B082D636B4E050A8C0226414A3";

    public static final String DEFAULT_ENTCRYPT_STR = "jusfoun_JAP_2016-8-10_19:59:37";
    public static final String DEFAULT_SF = "SHA-1";
    
    private static String getStringDefault(ResourceBundle rb, String key, String defaultvalue)
    {
        try
        {
            return rb.getString(key);
        }
        catch (MissingResourceException e)
        {
            return defaultvalue;
        }

    }


}
