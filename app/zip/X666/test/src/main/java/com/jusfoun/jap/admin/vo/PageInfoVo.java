package com.jusfoun.jap.admin.vo;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.Page;

/**
 * 分页显示vo类，用于转换从数据库查询的对象集合为前台显示的vo对象集合
 * 封装了原始的分页数据信息
 * @author zhengshuguo
 * 2016年4月28日
 * @param <T> 用于转换前台显示的vo对象类型
 */
public class PageInfoVo<T> {
    public void setList(List<T> list) {
        this.list = list;
    }

    private final Boolean success = true;
    //当前页
    private int pageNum;
    //每页的数量
    private int pageSize;
    //当前页的数量
    private int size;
    //由于startRow和endRow不常用，这里说个具体的用法
    //可以在页面中"显示startRow到endRow 共size条数据"

    //当前页面第一个元素在数据库中的行号
    private int startRow;
    //当前页面最后一个元素在数据库中的行号
    private int endRow;
    //记录每页起始rowKey
    private List pageRowKey;
    //总记录数
    private long total;

    public void setTotal(long total) {
    	this.total = total;
        if (pageSize > 0) {
            pages = (int) (total / pageSize + ((total % pageSize == 0) ? 0 : 1));
        } else {
            pages = 0;
        }
        //判断页面边界
        this.judgePageBoudary();
    }
    

    //总页数
    private int pages;
    //结果集
    private List<T> list;

    //第一页
    private int firstPage;
    //前一页
    private int prePage;
    //下一页
    private int nextPage;
    //最后一页
    private int lastPage;

    //是否为第一页
    private boolean isFirstPage = false;
    //是否为最后一页
    private boolean isLastPage = false;
    //是否有前一页
    private boolean hasPreviousPage = false;
    //是否有下一页
    private boolean hasNextPage = false;
    //导航页码数
    private int navigatePages;
    //所有导航页号
    private int[] navigatepageNums;

    //phoenix分页需要
    private String nextRowKey;
    
    public PageInfoVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
     *
     * @param pageList Page类型的数据库查询的支持分页的对象集合
     * @param pageVoList   已经被转换的用于前台显示的vo对象集合
     */
    public PageInfoVo(List pageList, List<T> pageVoList) {
        this(pageList, 8);
        this.list = pageVoList;
    }

    /**
     * 包装Page对象
     *
     * @param list          page结果
     * @param navigatePages 页码数量
     */
    public PageInfoVo(List pageList, int navigatePages) {
        if (pageList instanceof Page) {
            Page page = (Page) pageList;
            this.pageNum = page.getPageNum();
            this.pageSize = page.getPageSize();

            this.total = page.getTotal();
            this.pages = page.getPages();
            //this.list = page;
            this.size = page.size();
            //由于结果是>startRow的，所以实际的需要+1
            if (this.size == 0) {
                this.startRow = 0;
                this.endRow = 0;
            } else {
                this.startRow = page.getStartRow() + 1;
                //计算实际的endRow（最后一页的时候特殊）
                this.endRow = (this.startRow - 1) + this.size;
            }
            this.navigatePages = navigatePages;
            //计算导航页
            this.calcNavigatepageNums();
            //计算前后页，第一页，最后一页
            this.calcPage();
            //判断页面边界
            this.judgePageBoudary();
        }
    }

    /**
     * 计算导航页
     */
    private void calcNavigatepageNums() {
        //当总页数小于或等于导航页码数时
        if (this.pages <= this.navigatePages) {
            this.navigatepageNums = new int[this.pages];
            for (int i = 0; i < this.pages; i++) {
                this.navigatepageNums[i] = i + 1;
            }
        } else { //当总页数大于导航页码数时
            this.navigatepageNums = new int[this.navigatePages];
            int startNum = this.pageNum - (this.navigatePages / 2);
            int endNum = this.pageNum + (this.navigatePages / 2);

            if (startNum < 1) {
                startNum = 1;
                //(最前navigatePages页
                for (int i = 0; i < this.navigatePages; i++) {
                    this.navigatepageNums[i] = startNum++;
                }
            } else if (endNum > this.pages) {
                endNum = this.pages;
                //最后navigatePages页
                for (int i = this.navigatePages - 1; i >= 0; i--) {
                    this.navigatepageNums[i] = endNum--;
                }
            } else {
                //所有中间页
                for (int i = 0; i < this.navigatePages; i++) {
                    this.navigatepageNums[i] = startNum++;
                }
            }
        }
    }

    /**
     * 计算前后页，第一页，最后一页
     */
    private void calcPage() {
        if ((this.navigatepageNums != null) && (this.navigatepageNums.length > 0)) {
            this.firstPage = this.navigatepageNums[0];
            this.lastPage = this.navigatepageNums[this.navigatepageNums.length - 1];
            if (this.pageNum > 1) {
                this.prePage = this.pageNum - 1;
            }
            if (this.pageNum < this.pages) {
                this.nextPage = this.pageNum + 1;
            }
        }
    }

    /**
     * 判定页面边界
     */
    private void judgePageBoudary() {
        this.isFirstPage = this.pageNum == 1;
        this.isLastPage = this.pageNum == this.pages;
        this.hasPreviousPage = this.pageNum > 1;
        this.hasNextPage = this.pageNum < this.pages;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getPageNum() {
        return this.pageNum;
    }

    public int getPageSize() {
        return this.pageSize;
    }

    public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getSize() {
        return this.size;
    }

    public int getStartRow() {
        return this.startRow;
    }

    public int getEndRow() {
        return this.endRow;
    }

    public long getTotal() {
        return this.total;
    }

    public int getPages() {
        return this.pages;
    }

    public List<T> getList() {
        return this.list;
    }

    public int getFirstPage() {
        return this.firstPage;
    }

    public int getPrePage() {
        return this.prePage;
    }

    public int getNextPage() {
        return this.nextPage;
    }

    public int getLastPage() {
        return this.lastPage;
    }

    public boolean isIsFirstPage() {
        return this.isFirstPage;
    }

    public boolean isIsLastPage() {
        return this.isLastPage;
    }

    public boolean isHasPreviousPage() {
        return this.hasPreviousPage;
    }

    public boolean isHasNextPage() {
        return this.hasNextPage;
    }

    public int getNavigatePages() {
        return this.navigatePages;
    }

    public int[] getNavigatepageNums() {
        return this.navigatepageNums;
    }

    public String getNextRowKey() {
		return nextRowKey;
	}

	public void setNextRowKey(String nextRowKey) {
		this.nextRowKey = nextRowKey;
	}


	public List getPageRowKey() {
		return pageRowKey;
	}

	public void setPageRowKey(List pageRowKey) {
		this.pageRowKey = pageRowKey;
	}

	@Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("PageInfo{");
        sb.append("pageNum=").append(this.pageNum);
        sb.append(", pageSize=").append(this.pageSize);
        sb.append(", size=").append(this.size);
        sb.append(", startRow=").append(this.startRow);
        sb.append(", endRow=").append(this.endRow);
        sb.append(", total=").append(this.total);
        sb.append(", pages=").append(this.pages);
        sb.append(", list=").append(this.list);
        sb.append(", firstPage=").append(this.firstPage);
        sb.append(", prePage=").append(this.prePage);
        sb.append(", nextPage=").append(this.nextPage);
        sb.append(", lastPage=").append(this.lastPage);
        sb.append(", isFirstPage=").append(this.isFirstPage);
        sb.append(", isLastPage=").append(this.isLastPage);
        sb.append(", hasPreviousPage=").append(this.hasPreviousPage);
        sb.append(", hasNextPage=").append(this.hasNextPage);
        sb.append(", navigatePages=").append(this.navigatePages);
        sb.append(", navigatepageNums=");
        if (this.navigatepageNums == null) {
            sb.append("null");
        } else {
            sb.append('[');
            for (int i = 0; i < this.navigatepageNums.length; ++i) {
                sb.append(i == 0 ? "" : ", ").append(this.navigatepageNums[i]);
            }
            sb.append(']');
        }
        sb.append('}');
        return sb.toString();
    }

    public Boolean getSuccess() {
        return this.success;
    }

}
