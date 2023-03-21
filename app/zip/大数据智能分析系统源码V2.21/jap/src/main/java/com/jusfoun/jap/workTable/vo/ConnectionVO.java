 
    /**   
     * 文件名：ConnectionVO.java   
     *   
     * 版本信息：   
     * 日期：2016年6月21日   
     * Copyright Corporation 2016    
     * 版权所有   
     *   
     */   
    
package com.jusfoun.jap.workTable.vo;

import java.util.List;

/**   
     * 此类描述的是：   
     * @author: 王存泉   
     * @version: 2016年6月21日 下午6:16:01    
     */

public class ConnectionVO {
    private String cubeId;
    
	/**   
	 * cubeId   
	 *   
	 * @return the cubeId   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public String getCubeId() {
		return cubeId;
	}
	
	/**   
	 * @param cubeId the cubeId to set   
	 */
	
	public void setCubeId(String cubeId) {
		this.cubeId = cubeId;
	}
	
	/**   
	 * tableNameList   
	 *   
	 * @return the tableNameList   
	 * @since   CodingExample Ver(编码范例查看) 1.0   
	*/
	
	public List<String> getTableNameList() {
		return tableNameList;
	}
	
	/**   
	 * @param tableNameList the tableNameList to set   
	 */
	
	public void setTableNameList(List<String> tableNameList) {
		this.tableNameList = tableNameList;
	}
	private List<String> tableNameList;

}
