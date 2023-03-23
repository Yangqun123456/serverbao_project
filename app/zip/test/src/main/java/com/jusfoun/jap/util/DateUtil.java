package com.jusfoun.jap.util;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtil
{
    private static final int LAST_SECOND_OF_MINUTE = 59;
    private static final int LAST_MINUTE_OF_HOUR = 59;
    private static final int LAST_HOUR_OF_DAY = 23;
    public static int YEAR = 1;
    public static int MONTH = 2;
    public static int WEEK_OF_YEAR = 3;
    public static int WEEK_OF_MONTH = 4;
    public static int DAY_OF_MONTH = 5;
    public static int DAY_OF_YEAR = 6;
    /** 年 格式化 */
    public static final String YEAR_MONTH = "yyyy-MM";
    /** 日期 格式化 */
    public static final String DATE = "yyyy-MM-dd";
    /** 日期时间 格式化 */
    public static final String TIMESTAMP = "yyyy-MM-dd HH:mm:ss";
    /** 时间 格式化 */
    public static final String TIME = "HH:mm:ss";
    /**
     * 返回指定日期类型日期增量日期
     * 
     * @param dateType 日期类型
     * @param count 增加数量，可以为负数
     * @return
     */
    public static Date getMagicDate(int dateType, int count)
    {
        Calendar calendar = new GregorianCalendar();
        Date todayTime = new Date();
        calendar.setTime(todayTime);
        calendar.add(dateType, count);
        return calendar.getTime();
    }

    /**
     * 返回指定日期类型日期增量日期
     * 
     * @param dateType 日期类型
     * @param count 增加数量，可以为负数
     * @param baseDate 参照日期
     * @return
     */
    public static Date getMagicDate(int dateType, int count, Date baseDate)
    {
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(baseDate);
        calendar.add(dateType, count);
        return calendar.getTime();
    }

    public static String getDateNow()
    {
        return dateToString(new Date(), DATE);
    }

    /**
     * 日期转换为指定格式的字符
     * 
     * @param date 日期
     * @param dateFormat 日期格式
     * @return
     */
    public static String dateToString(Date date, String dateFormat)
    {
        SimpleDateFormat df = null;
        String returnValue = "";
        if (date != null)
        {
            df = new SimpleDateFormat(dateFormat);
            returnValue = df.format(date);
        }
        return returnValue;
    }

    public static Date getDayStartSeconds(Date date)
    {
        Date start = null;
        String dateStr = DateUtil.dateToString(date, "yyyy-MM-dd");
        try
        {
            start = DateUtil.stringToDate(dateStr, "yyyy-MM-dd");
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return start;
    }

    public static Date getDayEndSeconds(Date date)
    {
        Date end = null;
        String dateStr = DateUtil.dateToString(date, "yyyy-MM-dd");
        try
        {
            end = DateUtil.stringToDate(dateStr, "yyyy-MM-dd");
            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return end;
    }

    /**
     * 日期字符串转换为日期格式
     * 
     * @param dateStr 日期字符串
     * @param dateFormat 日期格式
     * @return
     * @throws ParseException
     */
    public static Date stringToDate(String dateStr, String dateFormat) throws ParseException
    {
        SimpleDateFormat sf = new SimpleDateFormat(dateFormat);
        try
        {
            return sf.parse(dateStr);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            throw new ParseException("日期解析错误！", 0);
        }
    }

    /**
     * 获得当前日期与本周日相差的天数
     * 
     * @return 星期日是第一天，星期一是第二天......
     */
    public static int getMondayPlus()
    {
        Calendar cd = Calendar.getInstance();
        // 获得今天是一周的第几天，星期日是第一天，星期一是第二天......
        int dayOfWeek = cd.get(Calendar.DAY_OF_WEEK) - 1; // 因为按中国礼拜一作为第一天所以这里减1
        if (dayOfWeek == 1)
        {
            return 0;
        }
        else
        {
            return 1 - dayOfWeek;
        }
    }

    /**
     * 根据报表时间标志，取得时间段
     * 
     * @param timeType 时间标志
     * @return String[]
     * @throws ParseException
     * @throws ParseException
     */
    @SuppressWarnings("deprecation")
    public static String[] time(String timeType)
    {
        try
        {
            String[] time = new String[2];
            Timestamp beginTime = null;
            Timestamp endTime = null;
            java.util.Date today = new java.util.Date();
            java.util.GregorianCalendar calendar = new java.util.GregorianCalendar();
            calendar.setTime(today);
            if ("0".equals(timeType))
            {
                // 当天
                beginTime = new Timestamp(calendar.getTime().getTime());
                calendar.add(Calendar.DATE, 1);
                endTime = new Timestamp(calendar.getTime().getTime());
                time[0] = beginTime.toString().substring(0, 10);
                time[1] = endTime.toString().substring(0, 10);
            }
            else if ("1".equals(timeType))
            {
                // 前一天
                calendar.add(Calendar.DATE, -1);
                beginTime = new Timestamp(calendar.getTime().getTime());
                endTime = new Timestamp(calendar.getTime().getTime());
                time[1] = beginTime.toString().substring(0, 10) + " 23:59:59";
                time[0] = endTime.toString().substring(0, 10);
            }
            else if ("2".equals(timeType))
            {
                // 前三天
                calendar.add(Calendar.DATE, -1);
                beginTime = new Timestamp(calendar.getTime().getTime());
                calendar.add(Calendar.DATE, -2);
                endTime = new Timestamp(calendar.getTime().getTime());
                time[1] = beginTime.toString().substring(0, 10) + " 23:59:59";
                time[0] = endTime.toString().substring(0, 10);
            }
            else if ("3".equals(timeType))
            {
                // 上一周
                // 获取上周一的时间
                int weeks = 0;
                weeks--;
                int mondayPlus = getMondayPlus();
                calendar.add(Calendar.DATE, mondayPlus + 7 * weeks);
                beginTime = new Timestamp(calendar.getTime().getTime());
                // 获取上周日的时间
                calendar.add(Calendar.DATE, 6);
                endTime = new Timestamp(calendar.getTime().getTime());
                time[0] = beginTime.toString().substring(0, 10);
                time[1] = endTime.toString().substring(0, 10) + " 23:59:59";
            }
            else if ("4".equals(timeType))
            {
                // 上一月
                beginTime = new Timestamp(calendar.getTime().getTime());
                calendar.add(Calendar.MONTH, -1);
                beginTime = new Timestamp(calendar.getTime().getTime());
                time[0] = beginTime.toString().substring(0, 8) + "01";
                String endStr = beginTime.toString().substring(0, 5) + String.valueOf(beginTime.getMonth() + 2) + "-01";
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                try
                {
                    calendar.setTime(sdf.parse(endStr));
                }
                catch (ParseException e)
                {
                    e.printStackTrace();
                }
                calendar.add(Calendar.DATE, -1);
                endTime = new Timestamp(calendar.getTime().getTime());
                time[1] = endTime.toString().substring(0, 10) + " 23:59:59";
            }
            else if ("5".equals(timeType))
            {
                // 上一季
                beginTime = new Timestamp(calendar.getTime().getTime());
                calendar.add(Calendar.MONTH, -3);
                endTime = new Timestamp(calendar.getTime().getTime());
                String beginTimeStr = beginTime.toString().substring(0, 8) + "01";
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                calendar.setTime(sdf.parse(beginTimeStr));
                calendar.add(Calendar.DATE, -1);
                beginTime = new Timestamp(calendar.getTime().getTime());
                time[1] = beginTime.toString().substring(0, 10) + " 23:59:59";
                time[0] = endTime.toString().substring(0, 8) + "01";
            }
            else
            {
                // 去年
                beginTime = new Timestamp(calendar.getTime().getTime());
                calendar.add(Calendar.YEAR, -1);
                endTime = new Timestamp(calendar.getTime().getTime());
                time[1] = beginTime.toString().substring(0, 5) + "01-01";
                time[0] = endTime.toString().substring(0, 5) + "01-01";
            }
            return time;
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取当前日期格式 yyyy-MM-dd hh:mm:ss
     * 
     * @return the current date/time
     */
    public static String getDateTimeNow()
    {
        return dateToString(new Date(), TIMESTAMP);
    }

    /**
     * 获取日期间间隔秒数 getIntervalDays
     * 
     * @param startday
     * @param endday
     * @return
     */
    public static int getIntervalSeconds(Date startday, Date endday)
    {
        if (startday.after(endday))
        {
            Date cal = startday;
            startday = endday;
            endday = cal;
        }
        long sl = startday.getTime();
        long el = endday.getTime();
        long ei = el - sl;
        return (int) (ei / 1000);
    }

    /**
     * Date2 string.
     * 
     * @param pattern the pattern
     * @param date the date
     * @return the string
     */
    public static String dateToString(String pattern, Date date)
    {
        String date_string;
        SimpleDateFormat df = new SimpleDateFormat(pattern);
        if (date != null)
        {
            date_string = df.format(date);
        }
        else
        {
            return null;
        }
        return date_string;
    }

    /**
     * @brief 获取一个时间，这个时间是今天的第0秒
     * @return 时间
     */
    public static Date getTodayAtFirstSecond()
    {
        Calendar now = Calendar.getInstance();
        now.setTimeInMillis(System.currentTimeMillis());
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.set(now.get(Calendar.YEAR), now.get(Calendar.MONTH), now.get(Calendar.DAY_OF_MONTH));
        return cal.getTime();
    }

    /**
     * @brief 获取一个时间，这个时间是今天的最后一秒
     * @return 时间
     */
    public static Date getTodayAtLastSecond()
    {
        Calendar now = Calendar.getInstance();
        now.setTimeInMillis(System.currentTimeMillis());
        Calendar cal = Calendar.getInstance();
        cal.clear();
        cal.set(now.get(Calendar.YEAR), now.get(Calendar.MONTH), now.get(Calendar.DAY_OF_MONTH), LAST_HOUR_OF_DAY,
                LAST_MINUTE_OF_HOUR, LAST_SECOND_OF_MINUTE);
        return cal.getTime();
    }

    /**
     * @brief 两个时间之间的天数
     * @param startDate
     * @param endDate
     * @return
     */
    public static int getDays(String startDate, String endDate, String fmt)
    {
        if (startDate == null || startDate.equals(" "))
            return 0;
        if (endDate == null || endDate.equals(" "))
            return 0;
        // 转换为标准时间
        SimpleDateFormat myFormatter = new SimpleDateFormat(fmt);
        java.util.Date date = null;
        java.util.Date mydate = null;
        try
        {
            date = myFormatter.parse(startDate);
            mydate = myFormatter.parse(endDate);
        }
        catch (Exception e)
        {
        }
        long day = (mydate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
        return (int) day;
    }
}
