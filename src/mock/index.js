import Mock from 'mockjs'

// 设置延迟时间
Mock.setup({
  timeout: '200-600'
})

// DeepSeek AI 相关接口
Mock.mock(/\/api\/deepseek\/chat/, 'post', (options) => {
  const { message, apiKey } = JSON.parse(options.body)
  console.log('Mock DeepSeek AI 请求:', { message })
  
  // 验证API密钥
  if (!apiKey || apiKey === '') {
    return {
      code: 401,
      data: null,
      message: 'API密钥不能为空'
    }
  }
  
  // 模拟AI响应
  return {
    code: 200,
    data: {
      response: `这是来自DeepSeek AI的模拟响应：${message}`,
      model: 'deepseek-chat-mock',
      usage: {
        prompt_tokens: message.length,
        completion_tokens: 50,
        total_tokens: message.length + 50
      }
    },
    message: '请求成功'
  }
})

Mock.mock(/\/api\/deepseek\/validate/, 'post', (options) => {
  const { apiKey } = JSON.parse(options.body)
  
  // 简单验证API密钥格式
  if (!apiKey || apiKey === '') {
    return {
      code: 401,
      data: {
        valid: false
      },
      message: 'API密钥不能为空'
    }
  }
  
  // 模拟验证成功
  return {
    code: 200,
    data: {
      valid: true
    },
    message: 'API密钥有效'
  }
})

// 用户相关接口
Mock.mock(/\/api\/user\/login/, 'post', (options) => {
  const { user, password } = JSON.parse(options.body)
  console.log('Mock 登录请求:', { user, password })
  
  // 放宽验证条件，任何非空用户名和密码都可以登录
  if (user && password) {
    console.log('Mock 登录成功')
    return {
      code: 200,
      data: {
        token: 'mock-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: user,
          nickname: user === 'admin' ? '管理员' : '普通用户',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
      },
      message: '登录成功'
    }
  } else {
    console.log('Mock 登录失败')
    return {
      code: 401,
      data: null,
      message: '用户名或密码不能为空'
    }
  }
})

Mock.mock(/\/api\/user\/register/, 'post', (options) => {
  return {
    code: 200,
    data: null,
    message: '注册成功'
  }
})

Mock.mock(/\/api\/user\/info/, 'get', () => {
  return {
    code: 200,
    data: {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['admin'],
      permissions: ['*']
    },
    message: '获取用户信息成功'
  }
})

// 数据相关接口
Mock.mock(/\/api\/data\/list/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

  const totalItems = 50; // 假设总共有50条数据
  const list = Mock.mock({
    [`list|${pageSize}`]: [{
      'id|+1': (page - 1) * pageSize + 1,
      'name': '@ctitle(3, 5)', // 与表格列名一致
      'category': '@cword(2, 4)', // 与表格列名一致
      'date': '@date("yyyy-MM-dd")',
      'price|10-1000.1-2': 10.00, // 与表格列名一致
      'status|1': [true, false], // 与表格列名一致
      'description': '@cparagraph(1, 2)'
    }]
  }).list;

  return {
    code: 200,
    data: {
      list: list,
      total: totalItems
    },
    message: '获取数据列表成功'
  }
})

Mock.mock(/\/api\/data\/detail/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const id = url.searchParams.get('id');

  return {
    code: 200,
    data: {
      id: Number(id) || 1,
      name: Mock.Random.ctitle(3, 5),
      category: Mock.Random.cword(2, 4),
      date: Mock.Random.date('yyyy-MM-dd'),
      price: Mock.Random.float(10, 1000, 1, 2),
      status: Mock.Random.boolean(),
      description: Mock.Random.cparagraph(2, 5)
    },
    message: '获取数据详情成功'
  }
})

// 图表相关接口
Mock.mock(/\/api\/chart\/line/, 'get', () => {
  return {
    code: 200,
    data: {
      xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      series: [
        {
          name: '访问量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '销售额',
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    },
    message: '获取折线图数据成功'
  }
})

Mock.mock(/\/api\/chart\/pie/, 'get', () => {
  return {
    code: 200,
    data: [
      { value: 335, name: '直接访问' },
      { value: 310, name: '邮件营销' },
      { value: 234, name: '联盟广告' },
      { value: 135, name: '视频广告' },
      { value: 1548, name: '搜索引擎' }
    ],
    message: '获取饼图数据成功'
  }
})

export default Mock