import ''

declare global {
  interface Dic<T> {
    [index: string]: T
  }


  type TUploaderData = {
    OSSAccessKeyId: string,
    policy: string,
    Signature: string,
    key: string,
    success_action_status?: number
  }
}
