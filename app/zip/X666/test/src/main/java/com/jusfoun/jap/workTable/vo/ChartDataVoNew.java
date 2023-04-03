
/**   
 * 文件名：ChartDataVoNew.java   
 *   
 * 版本信息：   
 * 日期：2016年6月24日   
 * Copyright Corporation 2016    
 * 版权所有   
 *   
 */

package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**
 * 此类描述的是：
 * 
 * @author: 王存泉
 * @version: 2016年6月24日 上午10:47:56
 */

public class ChartDataVoNew {
	private Boolean success;
	private String dataType;
	private List<String> name;
	private List<String> dataX;
	private List<List<String>> dataY;
	private List<Serie> series;

	
	
	public List<Serie> getSeries() {
		return series;
	}


	public void setSeries(List<Serie> series) {
		this.series = series;
	}


	/**   
	 * success   
	 *   
	 * @return the success   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public Boolean getSuccess() {
		return success;
	}

	
	/**   
	 * @param success the success to set   
	 */
	
	public void setSuccess(Boolean success) {
		this.success = success;
	}

	/**   
	 * dataType   
	 *   
	 * @return the dataType   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public String getDataType() {
		return dataType;
	}
	
	/**   
	 * @param dataType the dataType to set   
	 */
	
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	
	/**   
	 * name   
	 *   
	 * @return the name   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public List<String> getName() {
		return name;
	}
	
	/**   
	 * @param name the name to set   
	 */
	
	public void setName(List<String> name) {
		this.name = name;
	}
	
	/**   
	 * dataX   
	 *   
	 * @return the dataX   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public List<String> getDataX() {
		return dataX;
	}
	
	/**   
	 * @param dataX the dataX to set   
	 */
	
	public void setDataX(List<String> dataX) {
		this.dataX = dataX;
	}
	
	/**   
	 * dataY   
	 *   
	 * @return the dataY   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public List<List<String>> getDataY() {
		return dataY;
	}
	
	/**   
	 * @param dataY the dataY to set   
	 */
	
	public void setDataY(List<List<String>> dataY) {
		this.dataY = dataY;
	}

}
