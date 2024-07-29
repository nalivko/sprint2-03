import { ResultStatus } from "./resultCodes"

export type Result<T = null> = {
    status: ResultStatus
    errorMessage?: string,
    exttensions?: [{field: IdleDeadline, message: string}],
    data: T
} 