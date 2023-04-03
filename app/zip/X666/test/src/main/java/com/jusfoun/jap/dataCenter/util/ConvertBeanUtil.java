package com.jusfoun.jap.dataCenter.util;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ConvertBeanUtil
{
    private final static Logger log = LoggerFactory.getLogger(ConvertBeanUtil.class);
    /**
     * 将一个 JavaBean 对象转化为一个 Map
     * 
     * @param bean
     *            要转化的JavaBean 对象
     * @return 转化出来的 Map 对象
     * @throws IntrospectionException
     *             如果分析类属性失败
     * @throws IllegalAccessException
     *             如果实例化 JavaBean 失败
     * @throws InvocationTargetException
     *             如果调用属性的 setter 方法失败
     */
    public static Map<String, Object> convertBean(Object bean)
    {
        Class<? extends Object> type = bean.getClass();
        Map<String, Object> returnMap = new HashMap<String, Object>();
        try
        {
            BeanInfo beanInfo = Introspector.getBeanInfo(type);
    
            PropertyDescriptor[] propertyDescriptors = beanInfo
                    .getPropertyDescriptors();
            for (int i = 0; i < propertyDescriptors.length; i++)
            {
                PropertyDescriptor descriptor = propertyDescriptors[i];
                String propertyName = descriptor.getName();
                if (!propertyName.equals("class"))
                {
                    Method readMethod = descriptor.getReadMethod();
                    Object result = readMethod.invoke(bean, new Object[0]);
                    if (null != result)
                    {
                        returnMap.put(propertyName, result);
                    }
                }
            }
        }catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
        return returnMap;
    }

//    public static void main(String[] args)
//    {
        //ResponseMessage message = new ResponseMessage();
//        message.setHttpResult(1);
//
//        Map<String, Object> map = ConvertBeanUtil.convertBean(message);
//        for (Entry<String, Object> e : map.entrySet())
//        {
//            System.out.println(e.getKey() + "-" + e.getValue());
//        }
//    }

}
