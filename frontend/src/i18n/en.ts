/* eslint-disable max-len */
export default {
  id: "en",
  langStrings: ["en", "en-US"],
  detailedId: "en-US",
  name: "English",
  definitions: {
    components: {
      fileUploader: { zoneLabel: "Drag and drop your file(s) here, or click to select the file(s)." },
      tagInput: { placeholder: "Press Enter when completing input to add one item." },
      requireAuth: {
        title: "Not Authorized",
        description: "You are not authorized to access this page. Please login as required user and try again.",
      },
      httpHandler: {
        tokenInvalid: "Your login session is expired or invalid. Please re-login.",
        networkError: "I am sorry that the previous request fails. Please retry or contact support.",
      },
    },
    header: {
      home: "Home",
      search: "Search",
      upload: "Upload",
      about: "About",
      login: "Login",
      welcome: "Welcome, {}",
      logout: "Logout",
      dashboard: "Dashboard",
    },
    login: {
      id: "Email",
      password: "Password",
      remember: "Remember",
      login: "Login",
      inProgress: "Logging In",
      register: "Register",
    },
    register: {
      email: "Email",
      password: "Password",
      remember: "Remember",
      inProgress: "Registering",
      register: "Register",
      title: "Register",
      login: "Back to Login",
    },
    footer: {
      main: {
        language: "Select language",
        help: {
          title: "Help",
          about: "About",
          law: "Law",
        },
        contact: {
          title: "Contacts",
          qq: "QQ",
          email: "Email",
          projectGithub: "Project GitHub Repo",
        },
      },
      copyright: "All rights are reserved.",
    },

    pages: {
      upload: {
        pdf: {
          title: "1. Upload PDF",
          description: "Please upload your PDF first. The system will automatically fill some of the information based on your PDF. You can always change the information manually.",
          existing: "Click {} to download current PDF file",
          here: "here",
        },
        info: {
          title: "2. Fill Article Information",
          articleTitle: "Title",
          authors: "Authors",
          keywords: "Keywords",
          abstract: "Abstract",
          reset: "Reset",
          upload: "Upload",
        },
        complete: {
          title: "Upload successful！",
          description: "The ID for your article is {}。\nYour article will be reviewed shortly. \nWhen the review is passed, your article will be available publicly in our platform.\n\nThanks for your support to the platform.",
        },
      },
      article: {
        revisions: "Revisions",
        download: "Download",
      },
      search: {
        year: "Submit Year",
        keywords: "Includes Keywords",
        authors: "Includes Authors",
      },
      dashboard: {
        articles: {
          title: "Articles I Published",
          articleId: "Article ID",
          articleTitle: "Article Title",
          createTime: "Create Time",
          lastUpdatedTime: "Last Updated Time",
          revisionCount: "Revision Count",
          actions: "Actions",
          update: "Update",
          delete: {
            button: "Withdraw",
            title: "Confirm to withdraw the article?",
            content: "Are you sure to withdraw the article {}? All your revisions will be removed from our platform.",
            confirm: "Confirm",
            cancel: "Cancel",
          },
        },
      },
      updateArticle: {
        success: "Article updated successfully. New revision number: {}.",
        loading: "Loading current revision of article {}...",
      },
    },
  },
};
