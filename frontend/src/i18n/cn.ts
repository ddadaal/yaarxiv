export default {
  id: "cn",
  langStrings: ["cn", "zh-CN", "zh"],
  detailedId: "zh-CN",
  name: "简体中文",
  definitions: {
    components: {
      fileUploader: { zoneLabel: "把文件拖拽到这里，或者点击这里选择文件。" },
      tagInput: { placeholder: "输入完成后按下回车以增加一项。" },
      requireAuth: {
        title: "无权限",
        description: "您没有权限访问本页面。请以要求的权限的登录再尝试",
      },
      httpHandler: {
        tokenInvalid: "您的登录已经过期。请重新登录后继续。",
        networkError: "抱歉，请求出错，请重试或者联系支持。",
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
    },
    login: {
      id: "Email",
      password: "密码",
      remember: "记住我",
      login: "登录",
      inProgress: "登录中",
      register: "注册",
    },
    register: {
      email: "Email",
      password: "密码",
      remember: "记住我",
      inProgress: "注册中",
      register: "注册并登录",
      title: "注册",
      login: "返回登录",
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
          title: "1. 上传PDF",
          description: "请先上传您的文章的PDF。我们的系统将会自动根据您的PDF填写部分文章信息。您将可以修改系统识别的详细信息。",
          existing: "点击 {} 下载当前版本的PDF文件。",
          here: "这里",
        },
        info: {
          title: "2. 填写文章信息",
          articleTitle: "标题",
          authors: "作者",
          keywords: "关键词",
          abstract: "摘要",
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
        download: "下载",
      },
      search: {
        year: "发表年份",
        keywords: "包含关键词",
        authors: "包含作者",
      },
      dashboard: {
        articles: {
          title: "我发表的文章",
          articleId: "文章ID",
          articleTitle: "文章标题",
          createTime: "发布时间",
          lastUpdatedTime: "最后更新时间",
          revisionCount: "更新次数",
          actions: "操作",
          update: "更新",
          delete: {
            button: "撤回",
            title: "撤回文章确认",
            content: "确定要从系统上撤回文章{}？所有版本将会被从系统上删除。",
            confirm: "确认",
            cancel: "取消",
          },
        },
      },
      updateArticle: {
        success: "更新文章成功。新版本编号：{}",
        loading: "正在加载文章{}的当前版本……",
      },
    },
  },
};
