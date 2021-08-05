/* eslint-disable max-len */
import type { Article, ArticleId } from "yaarxiv-api/api/article/models";
import { realApi } from "../api";

const pdfLink = "https://docs.microsoft.com/en-us/dotnet/opbuildpdf/core/toc.pdf?branch=live";

const mockResult = [
  {
    articleId: 29004382,
    enTitle: "Understanding the interleaving-space overlap across inputs and software versions",
    enKeywords: ["Manual testing", "Upload", "Client-side", "Cloud testing", "Cloud computing", "Computer science", "Server-side", "Debugging", "Software", "Operating system"],
    commentCount: 2,
    authors: [
      { name: "Dongdong Deng", affiliation: "University of Wisconsin-Madison" },
      { name: "徐铮", affiliation: undefined },
    ],
    abstract: "The invention provides a software testing method based on a cloud testing system, the cloud testing system and a client side of the cloud testing system and aims to solve technical problems that manual operation of traditional software testing methods and testing devices is complicated, all controls of a software to be tested can not be traversed and test data can not be real-timely checked. The method includes the following steps that a software testing task is received, a thread which corresponds to the software testing task is established, and the software testing task is sent to a terminal device through the thread; screenshot information and log information which are fed back real-timely when the terminal device executes the software testing task are received, and the screenshot information and the log information are upload to a server side; the screenshot information is upload to a web side through the server side to be displayed. By means of the software testing method based on the cloud testing system, the cloud testing system and the client side of the cloud testing system, processes of mounting, operating, traversing all controls of the software to be tested, unloading and the like can be automatically performed by a real machine, test results can be real-timely output, manual testing time can be greatly saved, and meanwhile, a developer can conveniently debug programs.",
    category: "Computer science",
    createTime: "2020-08-06T01:16:41+00:00",
    lastUpdateTime: "2020-08-06T01:16:41+00:00",
    doi: "10.1109/5.771073",
  },
  {
    articleId: 290043825,
    cnTitle: "通过任务分析测试软件需求",
    cnKeywords: ["系统测试", "测试管理方法", "软件构造", "非回退测试", "可靠性工程"],
    enTitle:"Testing Software Requirements via Task Analysis" ,
    enKeywords: ["System testing", "Test Management Approach", "Software construction", "Non-regression testing", "Reliability engineering", "Non-functional testing", "Computer science", "Systems engineering", "System integration testing", "Keyword-driven testing", "Software reliability testing"],
    commentCount: 2,
    authors:
      [
        { "name":"Hong Zhu-2","affiliation":"Oxford Brookes University" },
        { "name":"Dan Diaper","affiliation":"Bournemouth University" },
        { "name":"Ganghong Bai","affiliation":"Alcatel-Lucent" },
        { "name":"Lingzi Jin","affiliation":"Nanjing University" }]
    ,
    abstract: "As a baseline of software development, a correct and complete requirements definition is a foundation of software quality. Previously, a novel approach to static testing of software requirements was proposed in which requirements definitions are tested on a set of task scenarios by examining software behaviour in each scenario described by an activity list. Such descriptions of software behaviour can be generated automatically from requirements models. This paper investigates various testing methods for selecting test scenarios. Data flow testing, state transition testing and entity testing methods are studied. A variety of test adequacy criteria and their combinations are formally defined and the subsume relations between the criteria are proved. Empirical studies of the testing methods and the construction of a prototype testing tool are reported.",
    category: "Computer science",
    createTime: "2020-08-06T01:16:41+00:00",
    lastUpdateTime: "2020-08-06T01:16:41+00:00",
  },
  {
    articleId: 3,
    cnTitle: "通过任务分析测试软件需求",
    cnKeywords: ["系统测试", "测试管理方法", "软件构造", "非回退测试", "可靠性工程"],
    enTitle:"Testing Software Requirements via Task Analysis" ,
    enKeywords: ["System testing", "Test Management Approach", "Software construction", "Non-regression testing", "Reliability engineering", "Non-functional testing", "Computer science", "Systems engineering", "System integration testing", "Keyword-driven testing", "Software reliability testing"],
    commentCount: 2,
    authors: [
      { "name":"樊春","affiliation":"Oxford Brookes University" },
      { "name":"安亦然","affiliation":"Bournemouth University" },
      { "name":"林官明","affiliation":"Alcatel-Lucent" },
    ],
    abstract: "大型建筑的设计必须考虑风载荷,计算机和计算技术的发展已使形状复杂的建筑外空气流动载荷由计算来求得。本文介绍应用商品软件计算一个新型建筑外部流动的方法和结果。所得与风洞试验相比的一致性表明,这类风工程所需的气动参数可单靠数值计算来得到。",
    category: "Computer science",
    createTime: "2020-08-06T01:16:41+00:00",
    lastUpdateTime: "2020-08-06T01:16:41+00:00",
    codeLink: "https://github.com/ddadaal/yaarxiv",
  },
];

const mockArticle = (id: ArticleId, revision: number | undefined): Article => ({
  id,
  revisionNumber: revision ?? 3,
  revisions: [
    { number: 1, time: "2011-10-05T14:48:00.000Z" },
    { number: 2, time: "2012-10-05T14:48:00.000Z" },
    { number: 3, time: "2013-10-05T14:48:00.000Z" },
  ],
  currentRevision: {
    cnTitle: "通过任务分析测试软件需求",
    cnKeywords: ["系统测试", "测试管理方法", "软件构造", "非回退测试", "可靠性工程"],
    enTitle:"Testing Software Requirements via Task Analysis" ,
    enKeywords: ["System testing", "Test Management Approach", "Software construction", "Non-regression testing", "Reliability engineering", "Non-functional testing", "Computer science", "Systems engineering", "System integration testing", "Keyword-driven testing", "Software reliability testing"],
    authors: [
      { name: "Dongdong Deng", affiliation: "University of Wisconsin-Madison" },
      { name: "徐铮" },
    ],
    abstract: "The invention provides a software testing method based on a cloud testing system, the cloud testing system and a client side of the cloud testing system and aims to solve technical problems that manual operation of traditional software testing methods and testing devices is complicated, all controls of a software to be tested can not be traversed and test data can not be real-timely checked. The method includes the following steps that a software testing task is received, a thread which corresponds to the software testing task is established, and the software testing task is sent to a terminal device through the thread; screenshot information and log information which are fed back real-timely when the terminal device executes the software testing task are received, and the screenshot information and the log information are upload to a server side; the screenshot information is upload to a web side through the server side to be displayed. By means of the software testing method based on the cloud testing system, the cloud testing system and the client side of the cloud testing system, processes of mounting, operating, traversing all controls of the software to be tested, unloading and the like can be automatically performed by a real machine, test results can be real-timely output, manual testing time can be greatly saved, and meanwhile, a developer can conveniently debug programs.",
    // category: "Computer Science",
    codeLink: Math.random() < 0.5 ? "https://github.com/ddadaal/yaarxiv" : undefined,
    doi: "10.1109/5.771073",
  },
  ownerId: 1,
  createTime:"2011-10-05T14:48:00.000Z",
});

export const articleApisMock: typeof realApi["article"] = ({
  searchArticle: async () => { return { results: mockResult, totalCount: mockResult.length };},
  getArticle: async ({ path, query }) => ({ article: mockArticle(path.articleId, query.revision) }),
  uploadArticle: async () => ({ id: 1231243124 }),
  uploadPDF: async () => ({ token: 123123 }),
  deleteArticle: async () => null,
  getArticleFile: async () => ({}),
  updateArticle: async () => ({ revisionNumber: 3 }),
});

