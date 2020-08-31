/* eslint-disable max-len */
import type { Article } from "yaarxiv-api/article/models";
import type { MockApi } from ".";
import type { ArticleSearchResult } from "yaarxiv-api/article/search";
import type { articleApis } from "./article";

const pdfLink = "https://docs.microsoft.com/en-us/dotnet/opbuildpdf/core/toc.pdf?branch=live";

const mockResult = [
  {
    articleId: "29004382",
    title: "Understanding the interleaving-space overlap across inputs and software versions",
    commentCount: 2,
    authors: [
      { name: "Dongdong Deng", affiliation: "University of Wisconsin-Madison" },
      { name: "徐铮", affiliation: null },
    ],
    abstract: "The invention provides a software testing method based on a cloud testing system, the cloud testing system and a client side of the cloud testing system and aims to solve technical problems that manual operation of traditional software testing methods and testing devices is complicated, all controls of a software to be tested can not be traversed and test data can not be real-timely checked. The method includes the following steps that a software testing task is received, a thread which corresponds to the software testing task is established, and the software testing task is sent to a terminal device through the thread; screenshot information and log information which are fed back real-timely when the terminal device executes the software testing task are received, and the screenshot information and the log information are upload to a server side; the screenshot information is upload to a web side through the server side to be displayed. By means of the software testing method based on the cloud testing system, the cloud testing system and the client side of the cloud testing system, processes of mounting, operating, traversing all controls of the software to be tested, unloading and the like can be automatically performed by a real machine, test results can be real-timely output, manual testing time can be greatly saved, and meanwhile, a developer can conveniently debug programs.",
    keywords: ["Manual testing", "Upload", "Client-side", "Cloud testing", "Cloud computing", "Computer science", "Server-side", "Debugging", "Software", "Operating system"],
    category: "Computer science",
    createTime: "2020-08-06T01:16:41+00:00",
    lastUpdateTime: "2020-08-06T01:16:41+00:00",
  },
  {
    articleId: "290043825",
    title:"Testing Software Requirements via Task Analysis" ,
    commentCount: 2,
    authors:
      [
        { "name":"Hong Zhu-2","affiliation":"Oxford Brookes University" },
        { "name":"Dan Diaper","affiliation":"Bournemouth University" },
        { "name":"Ganghong Bai","affiliation":"Alcatel-Lucent" },
        { "name":"Lingzi Jin","affiliation":"Nanjing University" }]
    ,
    abstract: "As a baseline of software development, a correct and complete requirements definition is a foundation of software quality. Previously, a novel approach to static testing of software requirements was proposed in which requirements definitions are tested on a set of task scenarios by examining software behaviour in each scenario described by an activity list. Such descriptions of software behaviour can be generated automatically from requirements models. This paper investigates various testing methods for selecting test scenarios. Data flow testing, state transition testing and entity testing methods are studied. A variety of test adequacy criteria and their combinations are formally defined and the subsume relations between the criteria are proved. Empirical studies of the testing methods and the construction of a prototype testing tool are reported.",
    keywords: ["System testing", "Test Management Approach", "Software construction", "Non-regression testing", "Reliability engineering", "Non-functional testing", "Computer science", "Systems engineering", "System integration testing", "Keyword-driven testing", "Software reliability testing"],
    category: "Computer science",
    createTime: "2020-08-06T01:16:41+00:00",
    lastUpdateTime: "2020-08-06T01:16:41+00:00",
  },
] as ArticleSearchResult[];

const mockArticle = (id: string, revision: number | undefined): Article => ({
  id,
  revisionNumber: revision ?? 3,
  revisions: [
    { number: 1, time: "2011-10-05T14:48:00.000Z" },
    { number: 2, time: "2012-10-05T14:48:00.000Z" },
    { number: 3, time: "2013-10-05T14:48:00.000Z" },
  ],
  currentRevision: {
    title: "Understanding the interleaving-space overlap across inputs and software versions",
    authors: [
      { name: "Dongdong Deng", affiliation: "University of Wisconsin-Madison" },
      { name: "徐铮" },
    ],
    abstract: "The invention provides a software testing method based on a cloud testing system, the cloud testing system and a client side of the cloud testing system and aims to solve technical problems that manual operation of traditional software testing methods and testing devices is complicated, all controls of a software to be tested can not be traversed and test data can not be real-timely checked. The method includes the following steps that a software testing task is received, a thread which corresponds to the software testing task is established, and the software testing task is sent to a terminal device through the thread; screenshot information and log information which are fed back real-timely when the terminal device executes the software testing task are received, and the screenshot information and the log information are upload to a server side; the screenshot information is upload to a web side through the server side to be displayed. By means of the software testing method based on the cloud testing system, the cloud testing system and the client side of the cloud testing system, processes of mounting, operating, traversing all controls of the software to be tested, unloading and the like can be automatically performed by a real machine, test results can be real-timely output, manual testing time can be greatly saved, and meanwhile, a developer can conveniently debug programs.",
    keywords: ["Manual testing", "Upload", "Client-side", "Cloud testing", "Cloud computing", "Computer science", "Server-side", "Debugging", "Software", "Operating system"],
    category: "Computer Science",
    pdfLink,
  },
});

export const articleApisMock: MockApi<typeof articleApis> = ({ makeHttpError }) => ({
  search: async () => { return { results: mockResult, totalCount: mockResult.length };},
  get: async ({ path, query }) => ({ article: mockArticle(path.articleId, query.revision) }),
  uploadArticle: async () => ({ id: "1231243124" }),
  uploadPDF: async () => ({ token: "1231fn091mf02" }),
  deleteArticle: async () => { throw makeHttpError({}, 401);},
  updateArticle: async () => ({ revisionNumber: 3 }),
});

