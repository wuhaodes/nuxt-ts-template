import { _ } from 'coa-nuxt'

const members = {
  'mac.owner': {
    role: 'mac.owner',
    name: '创建者',
    title: '企业创建者，拥有企业端全部管理权限',
    disabled: true
  },
  'mac.master': {
    role: 'mac.master',
    name: '管理员',
    title: '拥有企业端全部管理权限'
  },
  'qa': {
    role: 'qa',
    name: 'QA专员',
    title: '登录平台的技术类员工账号，拥有质量监控管理等技术相关权限。并可管理和自定义人员角色，进行权限配置。'
  },
  'map.master': {
    role: 'map.master',
    name: '信息中心',
    title: '登录平台的技术类员工账号，拥有质量监控管理等技术相关权限。'
  },
  'map.owner': {
    role: 'map.owner',
    name: '总经办',
    title: '总经办人员可查看并操作平台各个功能。'
  },
  'map.hr': {
    role: 'map.hr',
    name: '人事',
    title: '企业人员设置，管理和自定义人员角色，进行权限配置。'
  },
  'map.market': {
    role: 'map.market',
    name: '市场主管',
    title: '市场主管可监管，查看，下载平台各项指标数据。'
  },
  'map.customer': {
    role: 'map.customer',
    name: '市场客户成功',
    title: '市场客户成功能够进行客户关系维护及管理权限，以及查看客户数据。'
  },
  'map.market.design': {
    role: 'map.market.design',
    name: '市场平面设计',
    title: '市场平面设计拥有iMark模版设计及管理等相关权限。'
  },
  'map.operator': {
    role: 'map.operator',
    name: '运营主管',
    title: '运营主管可监管，查看，下载平台各项运营数据。'
  },
  'map.operator.director': {
    role: 'map.operator.director',
    name: '运营专员',
    title: '运营者拥有平台及官网内容运营、代运营客户平台权限，以及下载平台各项运营数据。'
  },
  'map.business': {
    role: 'map.business',
    name: '招商人员',
    title: '招商人员能够进行客户关系管理权限。'
  },
  'map.finance': {
    role: 'map.finance',
    name: '财务',
    title: '财务能够进行平台的各项资金操作，以及下载查看平台的各项资金单据。'
  },
  'map.maker': {
    role: 'map.maker',
    name: '生产主管',
    title: '生产主管能够进行生产订单各项操作，处理日常生产中遇到的问题。'
  },
  'map.maker.worker': {
    role: 'map.maker.worker',
    name: '生产技术员',
    title: '生产技术员能够进行生产订单打印操作。'
  },
  'map.service': {
    role: 'map.service',
    name: '客服',
    title: '客服能够进行订单的查询，处理退款等日常经营中遇到的问题。'
  },
  'map.engineer': {
    role: 'map.engineer',
    name: '实施工程师',
    title: '添加、管理钦家所有智能设备。'
  },
  'none': {
    role: 'none',
    name: '暂无权限',
    title: '暂无权限'
  }
}

const managers = {
  'mac.owner': {
    role: 'mac.owner',
    name: '创建者',
    title: '企业创建者，拥有企业端全部管理权限',
    disabled: true
  },
  'mac.master': {
    role: 'mac.master',
    name: '管理员',
    title: '拥有企业端全部管理权限'
  }
}
export default {
  members,
  memberList: _.values(managers)
}
