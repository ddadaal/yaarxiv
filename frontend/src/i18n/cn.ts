/* eslint-disable max-len */
export default {
  components: {
    fileUploader: {
      zoneLabel: "把文件拖拽到这里，或者点击这里选择文件。",
      "file-too-large" : "文件过大。",
      "file-too-small": "文件过小",
      "too-many-files": "文件数量过多",
      "file-invalid-type": "文件类型不正确",
    },
    tagInput: {
      placeholder: "按下回车以增加一项。",
      commaToSplit: "项之间可用逗号分隔。",
    },
    httpHandler: {
      tokenInvalid: "您的登录已经过期。请重新登录后继续。",
      serverError: "抱歉，请求出错，请重试或者联系支持。",
      networkError: "网络连接出错，请检查本地网络是否已经连通，或服务器开了小差……",
    },
    errors: {
      notAuthorized: {
        title: "请登录",
        description: "访问此页面需要登录，请先登录后再重试。",
      },
      badRequest: {
        title: "请求无效",
        description: "您的请求无效，请检查URL是否正确",
      },
      forbidden: {
        title: "禁止操作",
        description: "您没有权限访问本页面。请以要求的权限的用户登录后再尝试。",
      },
      notFound: {
        title: "404",
        description: "您所查找的资源不存在。",
      },
      serverError: {
        title: "服务器出错",
        description: "非常抱歉，服务器出现错误，请等待我们将问题解决后再继续，或将问题报告至支持。",
      },
      localNetworkError: {
        title: "网络连接出错",
        description: "本地网络出错，请检查本地网络是否已经连通，或者服务器暂时开了小差……",
      },
    },
    form: {
      validationError: {
        email: "请输入有效的电子邮箱",
        invalid: "输入无效",
        required: "必填项",
        codeLink: "请输入有效的代码链接，或者不要输入",
      },
    },
    publicitySelect: {
      title: "公开",
      public: "公开",
      private: "不公开",
    },
  },
  header: {
    home: "主页",
    search: "搜索",
    login: "登录",
    about: "关于",
    welcome: "欢迎您，{}",
    logout: "登出",
    dashboard: "个人中心",
    upload: "论文上传",
    admin: {
      articles: "文章管理",
      users: "用户管理",
    },
  },
  login: {
    id: "Email",
    password: "密码",
    remember: "记住我",
    login: "登录",
    inProgress: "登录中",
    register: "注册",
    success: "登录成功！",
    forget: "忘记密码",
    error: {
      invalid: "您的用户名和密码无效，请检查用户名和密码后重试。",
      emailSent: "您的用户未验证。一封验证邮件已经发到您的邮箱。",
      emailNotSent: "您的用户未验证。请检查您的邮件以查看验证邮件。",
    },
  },
  forgetPassword: {
    title: "忘记密码",
    email: "账号电子邮箱",
    sendRecoveryMail: "发送重置密码邮件",
    accountNotExist: "账号不存在",
    sent: {
      title: "重置密码邮件已发送！",
      description: "请按照邮箱内的指示进行下一步操作。",
    },
    reset: {
      error: {
        title: "重置密码链接无效",
        description: "请重新请求密码重置。",
      },
      title: "重置密码",
      password: "新密码",
      confirm: "确认新密码",
      notMatch: "两个密码不匹配",
      submit: "提交",
      reset: "清空",
      complete: {
        title: "密码重置成功！",
        description: "点击{}去登录。",
        loginLink: "此处",
      },
    },
  },
  register: {
    email: "Email",
    password: "密码",
    remember: "记住我",
    inProgress: "注册中",
    register: "注册并登录",
    title: "注册",
    login: "返回登录",
    conflict: "这个email已经被占用了，请更换一个。",
    success: {
      title: "注册成功！",
      description: "一封邮件已经发到您注册用的邮箱中。请根据邮件内容验证您的账号。",
    },
    emailValidation: {
      success: {
        title: "认证成功！" ,
        description: "点击{}去登录您的账号",
        loginLink: "此处",
      },
      failure: {
        title: "认证失败！",
        description: "您的链接无效，请检查您的链接。",
      },
    },
  },
  footer: {
    main: {
      language: "选择语言",
      help: {
        title: "帮助",
        about: "关于",
        law: "法律信息",
      },
      contact: {
        title: "联系方式",
        qq: "QQ",
        email: "Email",
        projectGithub: "项目GitHub",
      },
    },
    copyright: "版权所有",

  },
  pages: {
    upload: {
      pdf: {
        title: "1. 上传手稿",
        description: "请先上传您的文章手稿。文件大小限制：{} MB；支持格式：{}",
        existing: "点击 {} 下载当前版本的手稿。",
        here: "这里",
        prompt: "请选择文件",
      },
      info: {
        title: "2. 填写文章信息",
        prompt: "至少填写一种语言的标题和关键词。一个语言的标题和关键词必须同时填写。",
        articleTitleCn: "中文标题",
        keywordsCn: "中文关键词",
        articleTitleEn: "英文标题",
        keywordsEn: "英文关键词",
        fillOrDelete: "请填写此字段，或删除{}",
        oneLanguageRequired: "至少填写一种语言的标题和关键词",
        authors:{
          field: "作者（带*的为通讯作者）",
          required: "请添加至少一个作者",
          duplicated: "已存在相同的作者",
          add: "添加作者",
          name: "姓名",
          affiliation: "单位",
          correspondingAuthor: "通讯作者",
          confirm: "添加",
          cancel: "取消",
        },
        abstract: "摘要（字符数上限：{}）",
        codeLink: "代码链接（可选，接受以下网站的仓库的链接：{}）",
        doi: "DOI（可选）",
        reset: "重置",
        upload: "上传",
      },
      complete: {
        title: "上传成功！",
        description: "您的文章的ID是{}。\n您的文章正等待我们审核。\n当审核通过后，您的文章将会在本平台可用。\n\n感谢您对平台的支持。",
      },
    },
    article: {
      revisions: "版本",
      retracted: "撤稿",
      download: "下载",
    },
    search: {
      year: "发表年份",
      keywords: "包含关键词",
      authors: "包含作者",
      item: {
        id: "文章ID",
        retracted: "已撤稿",
        createTime: "提交时间",
        lastUpdateTime: "最新一次更新时间",
        revisionCount: "更新次数",
        codeLink: "代码链接：{}",
        doi: "DOI",
      },
    },
    dashboard: {
      articles: {
        title: "我发表的文章",
        articleId: "文章ID",
        articleTitle: "文章标题",
        createTime: "发布时间",
        lastUpdatedTime: "最后更新时间",
        ownerSetPublicity: "拥有者是否公开",
        adminSetPublicity: "管理员是否公开",
        revisionCount: "更新次数",
        actions: "操作",
        update: "更新",
        retracted: "已撤回",
        retract: {
          button: "撤回",
          title: "撤回文章确认",
          content1: "确定要从系统上撤回文章{}？",
          content2: "文章将会被标记已撤回，文章的相关文件将会被删除",
          confirm: "确认",
          cancel: "取消",
          success: "撤回文章{}成功！",
        },
      },
      profile: {
        title: "个人信息",
        honor: "头衔",
        jobTitle: "职称",
        institution: "单位",
        academicKeywords: "学术关键词",
        researchLabels: "研究标签",
        public: "公开",
        confirm: "确认修改",
        confirming: "修改中……",
        reset: "撤销修改",
        success: "修改成功！",
      },
      accountInfo: {
        title: "账号信息",
        name: "名字",
        email: "电子邮箱",
        id: "用户ID",
        confirm: "确认修改",
        confirming: "修改中……",
        reset: "撤销修改",
        success: "修改成功！",
      },
      changePassword: {
        title: "更改密码",
        current: "当前密码",
        changed: "新密码",
        confirmChanged: "确认新密码",
        changedNotMatch: "两次新密码不相同",
        confirm: "更改密码",
        confirming: "密码更改中……",
        reset: "清空",
        wrongPassword: "当前密码不正确",
        complete: "修改密码成功！",
      },
    },
    updateArticle: {
      success: "更新文章成功。新版本编号：{}",
      loading: "正在加载文章{}的当前版本……",
      notAuthor: "您没有权限修改文章{}。",
      retracted: "文章{}已经被撤稿，不能继续修改。",
    },
    admin: {
      articles: {
        title: "系统上的所有文章",
        articleId: "文章ID",
        owner: "拥有者",
        articleTitle: "文章标题",
        createTime: "发布时间",
        lastUpdatedTime: "最后更新时间",
        revisionCount: "更新次数",
        ownerSetPublicity: "拥有者是否公开",
        adminSetPublicity: "管理员是否公开",
        actions: "操作",
        delete: {
          button: "撤回",
          title: "撤回文章确认",
          content: "确定要从系统上撤回文章{}？所有版本将会被从系统上删除。",
          confirm: "确认",
          cancel: "取消",
          success: "撤回文章{}成功！",
        },
      },
      users: {
        title: "系统上的所有用户",
        userId: "用户ID",
        name: "名字",
        email: "电子邮箱",
        role: {
          title: "角色",
          Admin: "管理员",
          User: "普通用户",
        },
        articleCount: "文章数",
        actions: "操作",
        delete: {
          button: "删除",
          title: "删除用户确认",
          content: "确定要从系统上删除用户 {}（ID：{}）？用户的所有文章将会被从系统上删除。",
          confirm: "确认",
          cancel: "取消",
          success: "删除用户 {}（ID: {}）成功！",
        },
      },
    },
  },
};
