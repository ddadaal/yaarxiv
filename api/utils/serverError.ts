export interface ServerError {
  500: {
    /** Slurm脚本执行错误 */
    slurm?: string;
  }
}

interface BaseTimeOutOfRangeError {
  reason: "TimeOutOfRange";
}

export interface TimeOutOfRangeError<T403Error = BaseTimeOutOfRangeError> {
  403: BaseTimeOutOfRangeError | T403Error;
}
