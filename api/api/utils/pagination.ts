export interface PaginationQuerystring {
  /**
   * 第几页。默认第一页。
   * @default 1
   */
  page?: number;
  /**
   * 每页多少个。默认10个。
   * @default 10
  */
  pageSize?: number;
}

export interface PaginationResponse<TEntity> {
  /** 总数 */
  totalCount: number;
  /** 指定页数的项 */
  results: TEntity[];
}
