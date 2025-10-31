import React from 'react'
import { Settings, Users, FileText, Activity } from 'lucide-react'

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="text-gray-600" size={32} />
          系统管理
        </h1>
        <p className="text-gray-600 mt-2">
          用户管理、系统配置、日志和性能监控
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">注册用户</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Activity className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">在线用户</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">系统日志</p>
              <p className="text-2xl font-bold text-gray-900">12.5k</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="text-gray-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">系统任务</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">用户管理</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            添加用户
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">用户名</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">邮箱</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">角色</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">状态</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">注册时间</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '张三', email: 'zhangsan@example.com', role: '管理员', status: '活跃', date: '2024-01-15' },
                { name: '李四', email: 'lisi@example.com', role: '研究员', status: '活跃', date: '2024-03-20' },
                { name: '王五', email: 'wangwu@example.com', role: '观察员', status: '离线', date: '2024-05-10' },
              ].map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === '活跃' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">系统配置</h2>
          <div className="space-y-4">
            {[
              { name: '自动备份', value: '启用', color: 'text-green-600' },
              { name: '日志保留期', value: '30天', color: 'text-gray-900' },
              { name: '最大并发用户', value: '100', color: 'text-gray-900' },
              { name: '数据同步间隔', value: '5分钟', color: 'text-gray-900' },
            ].map((config) => (
              <div key={config.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{config.name}</span>
                <span className={`text-sm font-medium ${config.color}`}>{config.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">最近活动</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">系统更新</p>
              <p className="text-xs text-gray-600 mt-1">系统已更新到版本 v2.1.0</p>
              <p className="text-xs text-gray-500 mt-2">2小时前</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">数据备份</p>
              <p className="text-xs text-gray-600 mt-1">自动备份已完成</p>
              <p className="text-xs text-gray-500 mt-2">5小时前</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">用户注册</p>
              <p className="text-xs text-gray-600 mt-1">新用户注册：赵六</p>
              <p className="text-xs text-gray-500 mt-2">1天前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
