import React from 'react'
import { Network, Database, Plug, HeartPulse } from 'lucide-react'

export default function Integration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Network className="text-yellow-600" size={32} />
          系统集成
        </h1>
        <p className="text-gray-600 mt-2">
          数据管道、API连接和系统健康监控
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Database className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">数据源</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Plug className="text-green-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">API连接</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Network className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">数据管道</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <HeartPulse className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">系统健康</p>
              <p className="text-2xl font-bold text-green-600">98%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">数据管道状态</h2>
        <div className="space-y-3">
          {[
            { name: '梦境数据采集', source: 'DreamLab', target: 'Database', status: '运行中', throughput: '1.2k/s' },
            { name: '神经活动记录', source: 'DigitalTwin', target: 'Analytics', status: '运行中', throughput: '856/s' },
            { name: 'AI对话日志', source: 'AISalon', target: 'Storage', status: '运行中', throughput: '423/s' },
            { name: '实验结果同步', source: 'Experiments', target: 'Archive', status: '空闲', throughput: '0/s' },
          ].map((pipeline) => (
            <div key={pipeline.name} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pipeline.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {pipeline.source} → {pipeline.target}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{pipeline.throughput}</p>
                    <p className="text-xs text-gray-500">吞吐量</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    pipeline.status === '运行中' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pipeline.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">API连接状态</h2>
          <div className="space-y-3">
            {[
              { name: 'Neuroscience API', status: '正常', latency: '45ms' },
              { name: 'Dream Analysis API', status: '正常', latency: '32ms' },
              { name: 'ML Training API', status: '正常', latency: '67ms' },
              { name: 'Storage API', status: '正常', latency: '28ms' },
            ].map((api) => (
              <div key={api.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{api.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{api.latency}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">系统资源使用</h2>
          <div className="space-y-4">
            {[
              { name: 'CPU使用率', value: 45, color: 'bg-blue-600' },
              { name: '内存使用率', value: 62, color: 'bg-green-600' },
              { name: '磁盘使用率', value: 38, color: 'bg-yellow-600' },
              { name: '网络带宽', value: 71, color: 'bg-purple-600' },
            ].map((resource) => (
              <div key={resource.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{resource.name}</span>
                  <span className="text-sm font-medium">{resource.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${resource.color} h-2 rounded-full`}
                    style={{ width: `${resource.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
