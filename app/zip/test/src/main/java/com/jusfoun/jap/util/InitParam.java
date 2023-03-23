package com.jusfoun.jap.util;

import java.util.Enumeration;
import java.util.Map;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.log4j.Logger;

public class InitParam
{
    /**
     * 操作日志的逻辑实现类
     */
    private static Logger logger = Logger.getLogger(InitParam.class);

    private static ResourceBundle rb = null;

    /**
     * 初始化init.properties参数
     */
    private static Map<String, String> initParamMap = new ConcurrentHashMap<String, String>();

    static
    {
        try
        {
            // 读取版本配置文件
            rb = ResourceBundle.getBundle("application");
            Enumeration<String> keys = rb.getKeys();
            while (keys.hasMoreElements())
            {
                String key = keys.nextElement();
                initParamMap.put(key, rb.getString(key));
            }
        }
        catch (MissingResourceException e)
        {
            logger.error(e.getMessage(), e);
        }
    }

    public static Map<String, String> getInitParamMap()
    {
        return initParamMap;
    }
    
}
