import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Brain, 
  Mouse, 
  FlaskConical, 
  MessageSquare, 
  Network, 
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

interface NavItem {
  name: string
  path: string
  icon: any
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { name: '仪表板', path: '/', icon: LayoutDashboard },
  {
    name: '梦境实验室',
    path: '/dreamlab',
    icon: Brain,
    children: [
      { name: '梦境生成器', path: '/dreamlab/generator', icon: Brain },
      { name: '神经映射', path: '/dreamlab/mapping', icon: Network },
      { name: '梦境分析', path: '/dreamlab/analysis', icon: FlaskConical },
      { name: '可视化', path: '/dreamlab/visualization', icon: LayoutDashboard },
    ],
  },
  {
    name: '数字孪生',
    path: '/digital-twin',
    icon: Mouse,
    children: [
      { name: '小鼠仿真', path: '/digital-twin/simulation', icon: Mouse },
      { name: '神经活动', path: '/digital-twin/neural', icon: Brain },
      { name: '行为分析', path: '/digital-twin/behavior', icon: FlaskConical },
      { name: '模型训练', path: '/digital-twin/training', icon: Settings },
    ],
  },
  {
    name: '实验系统',
    path: '/experiments',
    icon: FlaskConical,
    children: [
      { name: '自动实验', path: '/experiments/automated', icon: FlaskConical },
      { name: '假设验证', path: '/experiments/hypothesis', icon: Brain },
      { name: '结果分析', path: '/experiments/results', icon: LayoutDashboard },
      { name: '实验设计', path: '/experiments/design', icon: Settings },
    ],
  },
  {
    name: 'AI沙龙',
    path: '/ai-salon',
    icon: MessageSquare,
    children: [
      { name: '多智能体对话', path: '/ai-salon/chat', icon: MessageSquare },
      { name: '知识提取', path: '/ai-salon/extraction', icon: Brain },
      { name: '质量评估', path: '/ai-salon/quality', icon: FlaskConical },
      { name: '报告生成', path: '/ai-salon/reports', icon: LayoutDashboard },
    ],
  },
  {
    name: '集成系统',
    path: '/integration',
    icon: Network,
    children: [
      { name: '数据管道', path: '/integration/pipeline', icon: Network },
      { name: '神经科学数据', path: '/integration/neuro-data', icon: Brain },
      { name: 'API连接', path: '/integration/api', icon: Settings },
      { name: '系统健康', path: '/integration/health', icon: LayoutDashboard },
    ],
  },
  {
    name: '管理系统',
    path: '/admin',
    icon: Settings,
    children: [
      { name: '用户管理', path: '/admin/users', icon: Settings },
      { name: '系统配置', path: '/admin/config', icon: Settings },
      { name: '日志管理', path: '/admin/logs', icon: LayoutDashboard },
      { name: '性能监控', path: '/admin/performance', icon: FlaskConical },
    ],
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>(['梦境实验室'])
  const location = useLocation()

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-gray-800 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold">神经梦境实验室</h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={20} />
                          <span>{item.name}</span>
                        </div>
                        {expandedItems.includes(item.name) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      {expandedItems.includes(item.name) && (
                        <ul className="ml-4 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <Link
                                to={child.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                  isActive(child.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-gray-800'
                                }`}
                              >
                                <child.icon size={18} />
                                <span className="text-sm">{child.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
