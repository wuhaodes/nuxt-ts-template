import { Message } from 'element-ui'
import { CgiBin, dayjs } from 'coa-nuxt'
import { $context } from 'coa-nuxt/app'
import { Data, Headers, Params } from 'coa-nuxt/cgi-bin'
import uPassport from '~/app/@biz/uPassport'

const bin = new class extends CgiBin {
  // 错误弹框提示</el-container>
  protected toastError (message: string) {
    Message.warning(message)
  }

  // 用户授权信息过期时，需要重新登入
  protected handle401 () {
    const curRoute = '/login'
    $context.redirect(curRoute)
  }

  protected handleHeaders (header: Headers) {
    header.passport = uPassport.getPassport()
    if (process.env.NODE_ENV !== 'production')
      header.env = process.env.NODE_ENV as string
  }

}

export default new class {

  // Auth 授权模块
  AuthAccountMe = (params?: Params) => bin.get('cgi.auth.passport.me', params)
  AuthAccountData = (params?: Params) => bin.get('cgi.auth.passport.data', params)

  // 管理员通过手机号登陆
  AuthAccountLogin = (data?: Data) => bin.post(`cgi.auth.passport.login.password`, data, { checkAuth: false })

  // 管理员通过短信验证码登陆
  AuthAccountSmsLogin = (data?: Data) => bin.post(`cgi.auth.passport.sms.login`, data, { checkAuth: false })

  // 管理员请求验证码
  AuthAccountSmsCodeManagerSend = (params?: Params) => bin.get(`cgi.sms.code.manager.send`, params)

  // 已登录的管理员获取自己的账户权限列表/cgi.auth.passport.role.list.mine
  AuthPassportRoleListMine = (params?: Params) => bin.get(`cgi.auth.passport.role.list.mine`, params)

  AuthAccountSignInToastError = (data?: Data) => bin.put(`cgi.auth.passport.sign_in`, data, {toastError:false})

  // 管理员获取账户企业列表
  CoreAccountCompanyList = (params?: Params) => bin.get(`cgi.core.account.company.ma.list`, params)


  // 用户获取企业列表
  CompanyList = (params?: Params) => bin.get(`cgi.company.select`, params)
  CoreCompanyWaList = (params?: Params) => bin.get(`cgi.core.company.ma.list`, params)
  // Gather 聚合接口
  GatherHome = (params?: Params) => bin.get('cgi.gather.home', params)
  // 储存模块
  StoreOssToken = (params?: Params) => bin.get('cgi.about.oss.token', params)
  // 二维码模块
  CodeCreate = (data?: Data) => bin.post('cgi.code.create', data)
  CodeSelect = (params?: Params) => bin.get('cgi.code.select', params)
  CodeDetail = (params?: Params) => bin.get('cgi.code.detail', params)
  CodeRemove = (data?: Data) => bin.del('cgi.code.remove', data)

  // 类型模块
  RuleCreate = (data?: Data) => bin.post('cgi.rule.create', data)
  RuleRevise = (data?: Data) => bin.put('cgi.rule.revise', data)
  RuleDetail = (params?: Params) => bin.get('cgi.rule.detail', params)
  RuleRemove = (data?: Data) => bin.del('cgi.rule.remove', data)
  RuleSelect = (params?: Params) => bin.get('cgi.rule.select', params)



  // 学校
  SchoolSelect = (params?: Params) => bin.get('cgi.school.select', params)
  CoreAccountSchoolWaList = (params?: Params) => bin.get(`cgi.core.school.ma.list`, params)
  // 图片处理模块
  GraphToken = (data?: Data) => bin.post('cgi.graph.upload.token', data)
  GraphPrepare = (data?: Data) => bin.put('cgi.graph.prepare', data)
  GraphPreview = (data?: Data) => bin.put('cgi.graph.preview', data)
  GraphPrint = (data?: Data) => bin.post('cgi.graph.print', data)
  GraphRemove = (data?: Data) => bin.del('cgi.graph.remove', data)
  GraphDetail = (params?: Params) => bin.get('cgi.graph.detail', params)
  GraphSelect = (params?: Params) => bin.get('cgi.graph.select', params)

  GraphPrepareSimple = (data?: Data) => bin.put('cgi.graph.prepare.simple', data)

  // 校验二维码
  GraphCheck = (data?: Data) => bin.post('cgi.graph.check', data)
  // 打印列表
  GraphPrintSelect = (params?: Params) => bin.get('cgi.graph.print.select', params)

  // 下载版面接口
  GraphPackDownload = (data?: Data) => bin.post('cgi.graph.pack.download', data)

  // CP
  // 管理员获取纸张列表 /cgi.mark.draft.paper.spec.ma.get
  MarkDraftPaperMaList = (params?:Params) => bin.get(`cgi.mark.draft.paper.ma.list`,params)

  // 管理员获取设计草稿列表
  MarkDraftMaList = (params?:Params) => bin.get(`cgi.mark.draft.ma.list`,params)
  // 管理员获取某个设计草稿的详细信息
  MarkDraftMaGet = (params?:Params) => bin.get(`cgi.mark.draft.ma.get`,params)
  // 管理员修改设计草稿的二维码和版本
  MarkDraftAdvanceMaPut = (data?:Data) => bin.put(`cgi.mark.draft.advance.ma.put`,data)
  // 管理员获取预览图片
  MarkDraftMaPreview = (data?:Data) => bin.put(`cgi.mark.draft.ma.preview`,data)
  // 管理员修改设计草稿模块背景版图
  MarkDraftBackgroundMaPut = (data?:Data) => bin.put(`cgi.mark.draft.background.ma.put`,data)
  // 管理员修改设计草稿基本信息
  MarkDraftBasicMaPut = (data?:Data) => bin.put(`cgi.mark.draft.basic.ma.put`,data)
  // 管理员填写基本信息创建设计草稿
  MarkDraftBasicMaPost = (data?:Data) => bin.post(`cgi.mark.draft.basic.ma.post`,data)

  // 管理员获取上传token
  MarkUploadTokenMaGet = (params?: Params) => bin.get(`cgi.mark.upload_token.ma.get`,params)

  MarkRuleMaList = (params?: Params) => bin.get('cgi.mark.rule.ma.list', params)


  // 获取所有设备列表
  devicesList = (params?: Params) => bin.get('cgi.iot.device.ma.list', params)

  //  管理员打印预览图片
  MarkDraftMaPreviewPrint = (data?:Data) => bin.put(`cgi.mark.draft.ma.preview.print`,data)


  //   管理员可以设置的二维码的宽度，默认单位是毫米mm
  MarkDraftQrSizeOptionMaGet = (params?: Params) => bin.get('cgi.mark.draft.qr_size.option.ma.get', params)

  // / 管理员获取纸张字号

  MarkDraftTextSizeOptionMaGet = (params?: Params) => bin.get('cgi.mark.draft.text_size.option.ma.get', params)


}


